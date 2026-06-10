// public/js/app.js
// 整合版 app.js（已增强：播放时灰化/禁用输入 + 支持实体键盘输入）
// 支持多条件（2f,2b,3f,3b,5f），practice/formal 分离，离线混音播放，结果汇总（SRT/RT 与差值）
// 重要：不要在此文件覆盖 setUILanguage（i18n.js 提供翻译功能）

/* ========== CONFIG ========== */
const APP_VERSION = 'iDIN-2026-06-calibration-confirmation-1';
const STEP_DB = 2;
const START_SNR = 0;
const SNR_MIN = -30;
const SNR_MAX = 30;
const N_FORMAL = 24;
const N_PRACTICE = 3;
const PRE_PAD = 0.5; // seconds
const POST_PAD = 0.5;
const GAP = 0.2; // seconds between digits

window.APP_VERSION = APP_VERSION;

/* ========== CONDITION DEFINITIONS ========== */
const COND_DEFS = {
  '2f': { id: '2f', label: '2-digit forward', nDigits: 2, dir: 'forward' },
  '2b': { id: '2b', label: '2-digit backward', nDigits: 2, dir: 'backward' },
  '3f': { id: '3f', label: '3-digit forward', nDigits: 3, dir: 'forward' },
  '3b': { id: '3b', label: '3-digit backward', nDigits: 3, dir: 'backward' },
  '5f': { id: '5f', label: '5-digit forward', nDigits: 5, dir: 'forward' }
};

/* ========== AUDIO CONTEXT & STORAGE ========== */
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let langBuffers = {}; // { lang: { digitBuffers: [], noiseBuffer, corrections: [] } }
let langLoadPromises = {};
let noiseLoopSource = null;
let noiseLoopGain = null;
window.getDinAudioContextState = () => audioContext.state;

function createSessionId() {
  const rand = Math.random().toString(36).slice(2, 8);
  return `din_${Date.now()}_${rand}`;
}

function readStoredNoiseGain() {
  const value = Number.parseFloat(localStorage.getItem('fixedNoiseGain') || '1.0');
  return Number.isFinite(value) && value > 0 ? value : 1.0;
}

let fixedNoiseGain = readStoredNoiseGain();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function resumeAudioContextForPlayback(timeoutMs = 2000) {
  if (!audioContext || audioContext.state === 'running') return;
  let timeoutId;
  try {
    await Promise.race([
      audioContext.resume(),
      new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('AudioContext resume timed out')), timeoutMs);
      })
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

function setStatusMessage(message, tone = '') {
  const status = document.getElementById('statusMsg');
  if (!status) return;
  status.textContent = message;
  if (tone) status.dataset.tone = tone;
  else delete status.dataset.tone;
}

async function startAfterMessage(message, delayMs = 1200, tone = 'success') {
  setStatusMessage(message, tone);
  setInputLock(true);
  setPlayButtonEnabled(false);
  await sleep(delayMs);
  try {
    await startTrialPlay();
  } catch (e) {
    console.error('Auto-start failed', e);
    setStatusMessage('Playback failed. Click Play to retry.', 'warning');
    setInputLock(false);
    setPlayButtonEnabled(true);
  }
}

/* ========== SESSION ========== */
function initEmptySession() {
  return {
    sessionId: createSessionId(),
    userInfo: null,
    conditionOrder: [],
    currentCondIdx: 0,
    trialIdx: 0, // legacy
    currentPresentedSNR: START_SNR,
    presentedSNRs: {},    // per condition arrays
    effectiveSNRs: {},
    trials: [],
    formalSequences: {},
    currentDigits: null,
    _lastEffectiveSNR: null,
    playbackEndedAt: null,
    phase: {},            // per-condition: 'practice'|'formal'
    practiceIdx: {},      // per-condition practice index
    formalIdx: {}         // per-condition formal index
  };
}

let session = initEmptySession();
(function restoreSession(){
  try {
    const s = JSON.parse(localStorage.getItem('din_session') || 'null');
    if (s) {
      session = Object.assign(initEmptySession(), s);
      session.presentedSNRs = session.presentedSNRs || {};
      session.effectiveSNRs = session.effectiveSNRs || {};
      session.formalSequences = session.formalSequences || {};
      session.phase = session.phase || {};
      session.practiceIdx = session.practiceIdx || {};
      session.formalIdx = session.formalIdx || {};
      session.sessionId = session.sessionId || createSessionId();
    }
  } catch (e) {
    console.warn('restoreSession failed', e);
    session = initEmptySession();
  }
})();

/* ========== UTILITIES ========== */
function mixToMonoArray(buf) {
  const ch = buf.numberOfChannels;
  const len = buf.length;
  const out = new Float32Array(len);
  for (let c = 0; c < ch; c++) {
    const d = buf.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += d[i];
  }
  if (ch > 1) for (let i = 0; i < len; i++) out[i] /= ch;
  return out;
}

function rms(arr) {
  if (!arr || arr.length === 0) return 0;
  let s = 0;
  for (let i=0;i<arr.length;i++) s += arr[i]*arr[i];
  return Math.sqrt(s / arr.length || 1e-12);
}

async function resampleAudioBuffer(buffer, targetSampleRate) {
  if (buffer.sampleRate === targetSampleRate) return buffer;
  const duration = buffer.length / buffer.sampleRate;
  const targetLength = Math.ceil(duration * targetSampleRate);
  const offline = new OfflineAudioContext(buffer.numberOfChannels, targetLength, targetSampleRate);
  const src = offline.createBufferSource();
  src.buffer = buffer;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();
  return rendered;
}

function normalizeAudioBuffer(buffer, targetRms = 0.05) {
  const ch = buffer.numberOfChannels;
  const len = buffer.length;
  const mono = mixToMonoArray(buffer);
  let sum = 0;
  for (let i=0;i<mono.length;i++) sum += mono[i]*mono[i];
  const curr = Math.sqrt(sum / (mono.length || 1) || 1e-12);
  const gain = targetRms / curr;
  const out = audioContext.createBuffer(ch, len, buffer.sampleRate);
  for (let c=0;c<ch;c++){
    const src = buffer.getChannelData(c);
    const dst = out.getChannelData(c);
    for (let i=0;i<len;i++) dst[i] = src[i] * gain;
  }
  return out;
}

/* ========== LOAD AUDIO & CORRECTIONS ========== */
async function loadLanguageAudio(lang, options = {}) {
  if (langBuffers[lang]) {
    if (typeof options.onProgress === 'function') {
      options.onProgress({ loaded: 11, total: 11, phase: 'cached' });
    }
    return langBuffers[lang];
  }
  if (langLoadPromises[lang]) return langLoadPromises[lang];

  const base = `audio/${lang}`;
  const digitUrls = [];
  for (let i=0;i<=9;i++) digitUrls.push(`${base}/${i}.wav`);
  const noiseUrl = `${base}/noise.wav`;
  const totalFiles = digitUrls.length + 1;
  let loadedFiles = 0;
  const notifyProgress = (phase, file) => {
    if (typeof options.onProgress === 'function') {
      options.onProgress({ loaded: loadedFiles, total: totalFiles, phase, file });
    }
  };

  langLoadPromises[lang] = (async () => {
    notifyProgress('start', null);

    let corrections = new Array(10).fill(0);
    try {
      const rc = await fetch(`${base}/corrections.json`);
      if (rc.ok) corrections = await rc.json();
    } catch (e) {
      console.warn('No corrections.json for', lang);
    }

    const digitBuffers = [];
    for (let i=0;i<digitUrls.length;i++){
      const r = await fetch(digitUrls[i]);
      if (!r.ok) throw new Error(`Failed fetch ${digitUrls[i]} status ${r.status}`);
      const ab = await r.arrayBuffer();
      const dbuf = await audioContext.decodeAudioData(ab.slice(0));
      const norm = normalizeAudioBuffer(dbuf, 0.05);
      digitBuffers.push(norm);
      loadedFiles += 1;
      notifyProgress('digit', `${i}.wav`);
    }
    const rn = await fetch(noiseUrl);
    if (!rn.ok) throw new Error(`Failed fetch ${noiseUrl}`);
    const nab = await rn.arrayBuffer();
    const nbuf = await audioContext.decodeAudioData(nab.slice(0));
    const noiseNorm = normalizeAudioBuffer(nbuf, 0.05);
    loadedFiles += 1;
    notifyProgress('noise', 'noise.wav');

    langBuffers[lang] = { digitBuffers, noiseBuffer: noiseNorm, corrections };
    console.log('Loaded audio for', lang);
    return langBuffers[lang];
  })();

  try {
    return await langLoadPromises[lang];
  } finally {
    delete langLoadPromises[lang];
  }
}

/* ========== NOISE LOOP (calibration) ========== */
async function startNoiseLoop() {
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (!userInfo || !userInfo.stimLang) { alert('Missing user info'); return; }
  await resumeAudioContextForPlayback();
  if (!langBuffers[userInfo.stimLang]) {
    try { await loadLanguageAudio(userInfo.stimLang); } catch (e) { alert('Failed to load audio'); throw e; }
  }
  stopNoiseLoop();
  const nb = langBuffers[userInfo.stimLang].noiseBuffer;
  const src = audioContext.createBufferSource();
  src.buffer = nb;
  src.loop = true;
  const g = audioContext.createGain();
  g.gain.value = fixedNoiseGain;
  src.connect(g).connect(audioContext.destination);
  src.start();
  noiseLoopSource = src;
  noiseLoopGain = g;
}
function stopNoiseLoop() {
  if (noiseLoopSource) {
    try { noiseLoopSource.stop(); } catch(e){}
    try { noiseLoopSource.disconnect(); } catch(e){}
    noiseLoopSource = null; noiseLoopGain = null;
  }
}
function setFixedNoiseGain(v) {
  const next = Number.parseFloat(v);
  fixedNoiseGain = Number.isFinite(next) && next > 0 ? next : 1.0;
  localStorage.setItem('fixedNoiseGain', fixedNoiseGain.toString());
  if (noiseLoopGain) noiseLoopGain.gain.value = fixedNoiseGain;
}

/* ========== UI INPUT LOCK (播放时锁定输入) ========== */
window.dinUI = window.dinUI || {};
window.dinUI.inputLocked = false;
window.dinUI.playbackActive = false;
window.dinUI.awaitingResponse = false;

function setPlayButtonEnabled(enabled) {
  const playBtn = document.getElementById('playTrial');
  if (!playBtn) return;
  playBtn.disabled = !enabled;
  if (enabled) playBtn.classList.remove('disabled');
  else playBtn.classList.add('disabled');
}

function setInputLock(locked) {
  window.dinUI.inputLocked = !!locked;
  // 虚拟键盘禁用/灰化
  disableKeypad(locked);
  // 播放按钮也禁用，避免重复点击
  setPlayButtonEnabled(!locked);
}

function disableKeypad(disabled) {
  // 记录锁态
  window.dinUI.inputLocked = !!disabled;

  // 禁用按钮
  document.querySelectorAll('.keypad-button, #clear, #ok').forEach(btn => { if (btn) btn.disabled = !!disabled; });

  // 额外加容器类（如果你的 CSS 对 .keypad.disabled 有灰化样式，将会生效）
  const keypad = document.getElementById('keypad');
  if (keypad) {
    if (disabled) keypad.classList.add('disabled'); else keypad.classList.remove('disabled');
  }
}

/* ========== RENDER & PLAY ========== */
async function renderMixedBufferAndPlay(digits, targetSNR, lang, options = {}) {
  const prePad = options.prePad ?? PRE_PAD;
  const postPad = options.postPad ?? POST_PAD;
  const gap = options.gap ?? GAP;
  const noiseEnabled = options.noiseEnabled ?? true;

  const cfg = langBuffers[lang];
  if (!cfg) throw new Error('Language audio not loaded');
  let digitBuffers = cfg.digitBuffers;
  let noiseBuffer = cfg.noiseBuffer;
  const corrections = cfg.corrections || new Array(10).fill(0);

  const sr = digitBuffers[0].sampleRate;
  for (let i=0;i<digitBuffers.length;i++) {
    if (digitBuffers[i].sampleRate !== sr) digitBuffers[i] = await resampleAudioBuffer(digitBuffers[i], sr);
  }
  if (noiseEnabled && noiseBuffer.sampleRate !== sr) noiseBuffer = await resampleAudioBuffer(noiseBuffer, sr);

  const digitMonos = [];
  for (const d of digits) {
    const b = digitBuffers[d];
    const mono = mixToMonoArray(b);
    const corrDb = corrections[d] || 0;
    const corrGain = Math.pow(10, corrDb / 20);
    for (let i=0;i<mono.length;i++) mono[i] *= corrGain;
    digitMonos.push(mono);
  }

  // SNR definition: digit files are RMS-normalized, digit-specific correction
  // levels are applied, and then the corrected digits are treated as one speech
  // sequence for SNR matching. We intentionally do not force each digit to have
  // the same realized single-digit SNR inside every possible sequence.
  let signalConcLen = 0;
  for (const m of digitMonos) signalConcLen += m.length;
  const signalConc = new Float32Array(signalConcLen);
  let off = 0;
  for (const m of digitMonos) { signalConc.set(m, off); off += m.length; }

  let noiseSlice;
  if (noiseEnabled) {
    const noiseMono = mixToMonoArray(noiseBuffer);
    if (noiseMono.length >= signalConc.length) {
      const start = Math.floor(Math.random() * (noiseMono.length - signalConc.length + 1));
      noiseSlice = noiseMono.slice(start, start + signalConc.length);
    } else {
      noiseSlice = new Float32Array(signalConc.length);
      for (let i=0;i<signalConc.length;i++) noiseSlice[i] = noiseMono[i % noiseMono.length];
    }
  } else {
    noiseSlice = new Float32Array(signalConc.length);
  }

  const rmsSignal = rms(signalConc) || 1e-9;
  const rmsNoise = rms(noiseSlice) || 1e-9;
  let desiredSignalScale = 1.0;
  // The global scale below targets the corrected sequence-level SNR. Because it
  // is a sequence-level adjustment, the same digit can have a slightly different
  // realized single-digit SNR when it appears in different digit sequences.
  if (noiseEnabled) {
    const currentSNR = 20 * Math.log10(rmsSignal / rmsNoise);
    const delta = targetSNR - currentSNR;
    desiredSignalScale = Math.pow(10, delta / 20);
  } else {
    desiredSignalScale = 1.0;
  }

  let effectiveSNR = null;
  if (noiseEnabled) {
    const rmsSignalScaled = rmsSignal * desiredSignalScale;
    effectiveSNR = 20 * Math.log10(rmsSignalScaled / rmsNoise);
    effectiveSNR = Math.round(effectiveSNR * 100) / 100;
  }

  const preSamples = Math.round(prePad * sr);
  const gapSamples = Math.round(gap * sr);
  const postSamples = Math.round(postPad * sr);
  let totalSamples = preSamples + postSamples + (digitMonos.length - 1) * gapSamples;
  for (const m of digitMonos) totalSamples += m.length;

  let noiseFull;
  if (noiseEnabled) {
    const noiseMonoAll = mixToMonoArray(noiseBuffer);
    if (noiseMonoAll.length >= totalSamples) {
      const start2 = Math.floor(Math.random() * (noiseMonoAll.length - totalSamples + 1));
      noiseFull = noiseMonoAll.slice(start2, start2 + totalSamples);
    } else {
      noiseFull = new Float32Array(totalSamples);
      for (let i=0;i<totalSamples;i++) noiseFull[i] = noiseMonoAll[i % noiseMonoAll.length];
    }
  } else {
    noiseFull = new Float32Array(totalSamples);
  }

  const mixedData = new Float32Array(totalSamples);

  // === 写入信号
  let cur = preSamples;
  for (let idx=0; idx<digitMonos.length; idx++) {
    const mono = digitMonos[idx];
    for (let j=0;j<mono.length;j++) mixedData[cur + j] += mono[j] * desiredSignalScale * fixedNoiseGain;
    cur += mono.length;
    if (idx < digitMonos.length - 1) cur += gapSamples;
  }

  // === 写入噪声：应用 fixedNoiseGain（校准页设置的噪声增益） ===
  for (let i=0;i<totalSamples;i++) mixedData[i] += noiseFull[i] * fixedNoiseGain;

  // 防削顶
  let maxAbs = 0;
  for (let i=0;i<totalSamples;i++) if (Math.abs(mixedData[i]) > maxAbs) maxAbs = Math.abs(mixedData[i]);
  if (maxAbs > 0.99) {
    const down = 0.99 / maxAbs;
    for (let i=0;i<totalSamples;i++) mixedData[i] *= down;
  }

  const offline = new OfflineAudioContext(1, totalSamples, sr);
  const buf = offline.createBuffer(1, totalSamples, sr);
  buf.copyToChannel(mixedData, 0, 0);
  const src = offline.createBufferSource();
  src.buffer = buf;
  src.connect(offline.destination);
  src.start(0);
  const rendered = await offline.startRendering();

  return new Promise((resolve, reject) => {
    try {
      const playSrc = audioContext.createBufferSource();
      playSrc.buffer = rendered;
      playSrc.connect(audioContext.destination);
      playSrc.onended = () => {
        session.playbackEndedAt = Date.now();
        resolve({ effectiveSNR });
      };
      playSrc.start();
    } catch (e) {
      reject(e);
    }
  });
}

/* ========== SEQUENCE GENERATION ========== */
// General: generate N sequences of length k, no repeated digits within a sequence,
// and try to evenly distribute digits across positions.
function generateBalancedSequencesForK(N = N_FORMAL, k = 3) {
  const counts = Array.from({length: k}, () => Array(10).fill(0));
  const sequences = [];
  function chooseDigitForPos(pos, excluded) {
    let minCount = Infinity;
    const candidates = [];
    for (let d=0; d<10; d++) {
      if (excluded.has(d)) continue;
      const c = counts[pos][d];
      if (c < minCount) { minCount = c; candidates.length = 0; candidates.push(d); }
      else if (c === minCount) candidates.push(d);
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  }
  for (let i=0;i<N;i++){
    const chosen = new Set();
    const seq = [];
    for (let pos=0; pos<k; pos++) {
      const d = chooseDigitForPos(pos, chosen);
      seq.push(d);
      chosen.add(d);
      counts[pos][d] += 1;
    }
    sequences.push(seq);
  }
  // shuffle a bit
  for (let kx = sequences.length - 1; kx > 0; kx--) {
    const j = Math.floor(Math.random() * (kx + 1));
    [sequences[kx], sequences[j]] = [sequences[j], sequences[kx]];
  }
  return sequences;
}

/* ========== PROGRESS UI ========== */
function updateProgressUI() {
  const currCond = session.conditionOrder && session.conditionOrder[session.currentCondIdx];
  if (!currCond) return;
  const def = COND_DEFS[currCond] || { label: currCond, nDigits: 3 };
  const isFormal = session.phase && session.phase[currCond] === 'formal';
  const progressEl = document.getElementById('progress');
  const phaseBadge = document.getElementById('phaseBadge');
  if (!progressEl) return;
  if (!isFormal) {
    const pidx = session.practiceIdx[currCond] != null ? session.practiceIdx[currCond] : 0;
    progressEl.textContent = `${def.label} — Practice ${pidx + 1}/${N_PRACTICE}`;
    if (phaseBadge) {
      phaseBadge.textContent = 'Practice';
      phaseBadge.classList.remove('is-formal');
    }
  } else {
    const fidx = session.formalIdx[currCond] != null ? session.formalIdx[currCond] : 0;
    progressEl.textContent = `${def.label} — Trial ${fidx + 1}/${N_FORMAL}`;
    if (phaseBadge) {
      phaseBadge.textContent = 'Formal';
      phaseBadge.classList.add('is-formal');
    }
  }
}

/* ========== CONDITION INTRO / LANDING ON TEST PAGE ========== */
function showConditionIntro() {
  // 1) 基础检查与会话初始化（不生成序列，不触发播放）
  const status = document.getElementById('statusMsg');

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (!userInfo || !userInfo.stimLang || !Array.isArray(userInfo.testConditions) || userInfo.testConditions.length === 0) {
    if (status) status.textContent = 'Missing required info. Redirecting to Info page...';
    location.href = 'info.html';
    return;
  }

  // 如果 session 还没绑定 userInfo 或 conditionOrder，则按当前 userInfo 初始化
  if (!session || !Array.isArray(session.conditionOrder) || session.conditionOrder.length === 0) {
    session = initEmptySession();
    session.userInfo = userInfo;
    session.conditionOrder = userInfo.testConditions.slice();
  } else {
    // 若已有会话，但还没 userInfo，则补上（不强行重置，保持兼容继续测试）
    if (!session.userInfo) session.userInfo = userInfo;
    if (!session.conditionOrder || session.conditionOrder.length === 0) {
      session.conditionOrder = userInfo.testConditions.slice();
    }
  }

  // 确保每个条件的状态字段存在
  if (!session.formalSequences) session.formalSequences = {};
  if (!session.phase) session.phase = {};
  if (!session.practiceIdx) session.practiceIdx = {};
  if (!session.formalIdx) session.formalIdx = {};
  if (!session.presentedSNRs) session.presentedSNRs = {};
  if (!session.effectiveSNRs) session.effectiveSNRs = {};
  if (session.currentCondIdx == null) session.currentCondIdx = 0;

  for (const cond of session.conditionOrder) {
    if (!session.phase[cond]) session.phase[cond] = 'practice';
    if (session.practiceIdx[cond] == null) session.practiceIdx[cond] = 0;
    if (session.formalIdx[cond] == null) session.formalIdx[cond] = 0;
    if (!session.presentedSNRs[cond]) session.presentedSNRs[cond] = [];
    if (!session.effectiveSNRs[cond]) session.effectiveSNRs[cond] = [];
  }

  // 2) 渲染当前条件的输入框，并将键盘置为禁用（等待播放结束才解锁）
  const currCond = session.conditionOrder[session.currentCondIdx];
  const def = COND_DEFS[currCond] || { label: currCond, nDigits: 3 };
  setInputBoxes(def.nDigits);
  updateBoxesFromString(''); // 清空方框显示
  window.dinUI.playbackActive = false;
  window.dinUI.awaitingResponse = false;
  setInputLock(false);       // Intro 阶段允许点击 Play，但不允许提前输入（由初始键盘状态决定）
  disableKeypad(true);       // 初始：不让输入，等点击 Play 开始
  setPlayButtonEnabled(true);

  // 3) 进度显示（顶端进度条文本）
  updateProgressUI();

  // 4) Intro 提示文案 + 按钮状态
  const inPractice = (session.phase[currCond] !== 'formal') && ((session.practiceIdx[currCond] || 0) < N_PRACTICE);
  let intro;
  if (inPractice) {
    const pidx = session.practiceIdx[currCond] || 0;
    intro = `${def.label} — Practice ${pidx + 1}/${N_PRACTICE}. Click Play to start.`;
  } else {
    const fidx = session.formalIdx[currCond] || 0;
    intro = `${def.label} — Trial ${fidx + 1}/${N_FORMAL}. Click Play to start.`;
  }
  setStatusMessage(intro);

  // Play 按钮显示，Next Condition 隐藏（只有某些阶段在 submit 中才显示/跳转）
  setPlayButtonEnabled(true);

  const nextBtn = document.getElementById('nextConditionBtn');
  if (nextBtn) nextBtn.style.display = 'none';

  // 持久化当前 session（以便刷新后仍能回到该状态）
  localStorage.setItem('din_session', JSON.stringify(session));
}

/* ========== KEYPAD HELPERS ========== */
function appendInput(v) {
  const k = getCurrentNDigits();
  const cur = getCurrentInput();
  if (cur.length >= k) return;           // 超出位数直接忽略
  updateBoxesFromString(cur + String(v));
}

function clearInput() {
  const cur = getCurrentInput();
  if (!cur) { updateBoxesFromString(''); return; }
  updateBoxesFromString(cur.slice(0, -1)); // 单字符退格
}

/* ========== TRIAL FLOW ========== */
async function startTrialPlay() {
  if (window.dinUI?.playbackActive) return;
  if (window.dinUI?.awaitingResponse) {
    setStatusMessage('Please enter the digits you heard and press OK.');
    return;
  }

  window.dinUI.playbackActive = true;
  setInputLock(true);
  setStatusMessage('Preparing audio...');

  try {
    await resumeAudioContextForPlayback();
  } catch(e) {
    console.warn('AudioContext resume failed', e);
    setStatusMessage('Audio device is not ready. Click Play again and check browser sound permissions.', 'warning');
    window.dinUI.playbackActive = false;
    window.dinUI.awaitingResponse = false;
    setInputLock(false);
    setPlayButtonEnabled(true);
    return;
  }
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  if (!userInfo || !userInfo.stimLang) {
    window.dinUI.playbackActive = false;
    window.dinUI.awaitingResponse = false;
    setInputLock(false);
    setStatusMessage('Missing user info. Returning to the start...', 'warning');
    location.href = 'index.html';
    return;
  }

  // if user changed participant or language, reset session
  if (session.userInfo) {
    const old = session.userInfo;
    if (old.stimLang !== userInfo.stimLang || old.pid !== userInfo.pid || JSON.stringify(old.testConditions) !== JSON.stringify(userInfo.testConditions)) {
      console.log('UserInfo changed — resetting session.');
      session = initEmptySession();
      session.userInfo = userInfo;
    }
  } else {
    session.userInfo = userInfo;
  }

  if (!langBuffers[userInfo.stimLang]) {
    try {
      await loadLanguageAudio(userInfo.stimLang);
    } catch(e) {
      setStatusMessage('Failed to load stimuli. Check the audio files and reload the page.', 'warning');
      console.error(e);
      window.dinUI.playbackActive = false;
      window.dinUI.awaitingResponse = false;
      setInputLock(false);
      return;
    }
  }

  // init per-condition structures
  if (!session.formalSequences) session.formalSequences = {};
  if (!session.phase) session.phase = {};
  if (!session.practiceIdx) session.practiceIdx = {};
  if (!session.formalIdx) session.formalIdx = {};
  if (!session.presentedSNRs) session.presentedSNRs = {};
  if (!session.effectiveSNRs) session.effectiveSNRs = {};

  // determine conditionOrder from userInfo.testConditions
  let selectedConds = (userInfo && Array.isArray(userInfo.testConditions) && userInfo.testConditions.length) ? userInfo.testConditions.slice() : null;
  if (!selectedConds) {
    selectedConds = (userInfo && userInfo.testMode === 'forward_only') ? ['3f'] : ['3f','3b'];
  }
  session.conditionOrder = selectedConds;

  for (const cond of session.conditionOrder) {
    if (!session.formalSequences[cond]) session.formalSequences[cond] = generateBalancedSequencesForK(N_FORMAL, (COND_DEFS[cond]||{nDigits:3}).nDigits);
    if (!session.phase[cond]) session.phase[cond] = 'practice';
    if (session.practiceIdx[cond] == null) session.practiceIdx[cond] = 0;
    if (session.formalIdx[cond] == null) session.formalIdx[cond] = 0;
    if (!session.presentedSNRs[cond]) session.presentedSNRs[cond] = [];
    if (!session.effectiveSNRs[cond]) session.effectiveSNRs[cond] = [];
  }
  localStorage.setItem('din_session', JSON.stringify(session));

  const currCond = session.conditionOrder[session.currentCondIdx];
  const condDef = COND_DEFS[currCond];
  if (!condDef) {
    setStatusMessage('Unknown condition: ' + currCond, 'warning');
    window.dinUI.playbackActive = false;
    window.dinUI.awaitingResponse = false;
    setInputLock(false);
    return;
  }

  const kDigits = condDef.nDigits;
  setInputBoxes(kDigits);
  const inPractice = (session.phase && session.phase[currCond] !== 'formal') && (session.practiceIdx[currCond] < N_PRACTICE);

  let digits = null;
  let noiseEnabled = true;
  let targetSNR = START_SNR;

  function getPracticeForK(k) {
    const p1 = { digits: Array.from({length:k}, (_,i) => (i+1) % 10 || 0), mustCorrect: true, noiseDb: null };
    const sample2 = [6,8,5,3,2].slice(0,k);
    const p2 = { digits: sample2, mustCorrect: true, noiseDb: null };
    const sample3 = [5,9,2,7,1].slice(0,k);
    const p3 = { digits: sample3, mustCorrect: false, noiseDb: 5 };
    return [p1,p2,p3];
  }

  if (inPractice) {
    const pIdx = session.practiceIdx[currCond] || 0;
    const p = getPracticeForK(kDigits)[pIdx];
    digits = p.digits.slice();
    if (p.noiseDb === null) { noiseEnabled = false; targetSNR = 0; } else { noiseEnabled = true; targetSNR = p.noiseDb; }
  } else {
    if (!session.formalSequences[currCond]) {
      session.formalSequences[currCond] = generateBalancedSequencesForK(N_FORMAL, kDigits);
      localStorage.setItem('din_session', JSON.stringify(session));
    }
    const fIdx = session.formalIdx[currCond] || 0;
    digits = session.formalSequences[currCond][fIdx].slice();
    noiseEnabled = true;
    targetSNR = session.currentPresentedSNR != null ? session.currentPresentedSNR : START_SNR;
  }

  updateProgressUI();
  session.currentDigits = digits;
  session.currentPresentedSNR = targetSNR;
  localStorage.setItem('din_session', JSON.stringify(session));

  // === 播放前：锁定输入（虚拟键盘禁用 + 实体键盘屏蔽），禁用 Play 避免重复点击
  setInputLock(true);
  setStatusMessage('Playing...');

  try {
    const r = await renderMixedBufferAndPlay(digits, targetSNR, session.userInfo.stimLang, { noiseEnabled });
    session._lastEffectiveSNR = r.effectiveSNR;
    setStatusMessage('Playback finished. Please type digits and press OK.');
    // === 播放结束：解除锁定，允许输入与提交
    window.dinUI.playbackActive = false;
    window.dinUI.awaitingResponse = true;
    setInputLock(false);
    setPlayButtonEnabled(false);
  } catch (e) {
    console.error('Playback error', e);
    setStatusMessage('Playback error. Click Play to retry.', 'warning');
    window.dinUI.playbackActive = false;
    window.dinUI.awaitingResponse = false;
    setInputLock(false);
    setPlayButtonEnabled(true);
  }
}

/* ========== SUBMIT / ADAPTIVE ========== */
async function submitInput() {
  // 若仍在播放锁定中，直接忽略（防止实体键盘 ENTER 误触）
  if (window.dinUI?.inputLocked) return;

  const inputEl = document.getElementById('input');
  const input = getCurrentInput();
  if (input.length === 0) { setStatusMessage('Please enter the digits before pressing OK.', 'warning'); return; }
  if (!window.dinUI?.awaitingResponse) {
    setStatusMessage('Click Play first, then enter the digits you heard.', 'warning');
    return;
  }

  const expectedLen = getCurrentNDigits();
  if (input.length !== expectedLen) {
    setStatusMessage(`Please enter ${expectedLen} digit${expectedLen > 1 ? 's' : ''}.`, 'warning');
    return;
  }

  window.dinUI.awaitingResponse = false;
  setInputLock(true);

  const rtMs = session.playbackEndedAt ? (Date.now() - session.playbackEndedAt) : null;
  const currCond = session.conditionOrder[session.currentCondIdx];
  const condDef = COND_DEFS[currCond];
  const inPractice = (session.phase && session.phase[currCond] !== 'formal') && (session.practiceIdx[currCond] < N_PRACTICE);
  const expectedDigits = session.currentDigits ? session.currentDigits.slice() : [];
  const recallMode = condDef.dir === 'forward' ? 'forward' : 'backward';
  const expectedResponse = recallMode === 'forward' ? expectedDigits.join('') : expectedDigits.slice().reverse().join('');
  const correct = (input === expectedResponse);

  const trialRec = {
    participantId: (session.userInfo && session.userInfo.pid) || '',
    language: (session.userInfo && session.userInfo.stimLang) || '',
    condition: currCond,
    conditionLabel: condDef.label,
    nDigits: condDef.nDigits,
    practice: inPractice,
    trialIndexInCond: inPractice ? (session.practiceIdx[currCond] || 0) : (session.formalIdx[currCond] || 0),
    digitsPresented: expectedDigits.join(''),
    presentedSNR: session.currentPresentedSNR,
    effectiveSNR: session._lastEffectiveSNR ?? null,
    response: input,
    correct: !!correct,
    rt_ms: rtMs,
    timestamp: new Date().toISOString()
  };

  session.trials.push(trialRec);
  if (inputEl) updateBoxesFromString('');
  localStorage.setItem('din_session', JSON.stringify(session));

  if (!inPractice && trialRec.effectiveSNR != null) {
    session.presentedSNRs[currCond] = session.presentedSNRs[currCond] || [];
    session.effectiveSNRs[currCond] = session.effectiveSNRs[currCond] || [];
    session.presentedSNRs[currCond].push(trialRec.presentedSNR);
    session.effectiveSNRs[currCond].push(trialRec.effectiveSNR);
  }

  // practice handling
  if (inPractice) {
    const pIdx = session.practiceIdx[currCond] || 0;
    const pSpec = (function(k){ const p1 = { digits: Array.from({length:k}, (_,i) => (i+1)%10 || 0), mustCorrect: true, noiseDb: null }; const sample2=[6,8,5,3,2].slice(0,k); const p2={digits:sample2,mustCorrect:true,noiseDb:null}; const sample3=[5,9,2,7,1].slice(0,k); const p3={digits:sample3,mustCorrect:false,noiseDb:5}; return [p1,p2,p3]; })(condDef.nDigits)[pIdx];

    if (pSpec && pSpec.mustCorrect && !correct) {
      await startAfterMessage(`Incorrect. The correct answer is ${expectedResponse}. Replaying in 2 seconds.`, 2000, 'warning');
      return;
    }

    session.practiceIdx[currCond] = (session.practiceIdx[currCond] || 0) + 1;
    updateProgressUI();
    localStorage.setItem('din_session', JSON.stringify(session));

    if (session.practiceIdx[currCond] >= N_PRACTICE) {
      session.phase[currCond] = 'formal';
      session.formalIdx[currCond] = 0;
      session.currentPresentedSNR = START_SNR;
      session._lastEffectiveSNR = null;
      updateProgressUI();
      localStorage.setItem('din_session', JSON.stringify(session));
      await startAfterMessage('Practice completed. Formal trials will begin in 2 seconds.', 2000, 'success');
      return;
    } else {
      await startAfterMessage('Next practice trial will begin in 1 second.', 1000, 'success');
      return;
    }
  }

  // formal adaptive
  if (session.currentPresentedSNR == null) session.currentPresentedSNR = START_SNR;
  if (correct) session.currentPresentedSNR = Math.max(SNR_MIN, session.currentPresentedSNR - STEP_DB);
  else session.currentPresentedSNR = Math.min(SNR_MAX, session.currentPresentedSNR + STEP_DB);

  session.formalIdx[currCond] = (session.formalIdx[currCond] || 0) + 1;
  updateProgressUI();
  localStorage.setItem('din_session', JSON.stringify(session));

  if (session.formalIdx[currCond] >= N_FORMAL) {
    session.currentCondIdx++;
    if (session.currentCondIdx >= session.conditionOrder.length) {
      localStorage.setItem('din_session', JSON.stringify(session));
      setStatusMessage('All conditions completed. Redirecting to results...', 'success');
      await sleep(1200);
      location.href = 'results.html';
      return;
    } else {
      const nextCond = session.conditionOrder[session.currentCondIdx];
      const nextDef = COND_DEFS[nextCond] || { label: nextCond };
      session.phase[nextCond] = 'practice';
      session.practiceIdx[nextCond] = session.practiceIdx[nextCond] || 0;
      session.formalIdx[nextCond] = session.formalIdx[nextCond] || 0;
      localStorage.setItem('din_session', JSON.stringify(session));
      updateProgressUI();
      await startAfterMessage(`Next condition: ${nextDef.label}. Practice will start in 2 seconds.`, 2000, 'success');
      return;
    }
  } else {
    await startAfterMessage('Next trial will begin in 1 second.', 1000, 'success');
    return;
  }
}

/* ========== NAV / RESULTS ========== */
function proceedToNextCondition() {
  session.currentCondIdx++;
  if (session.currentCondIdx >= session.conditionOrder.length) location.href = 'results.html';
  else startTrialPlay();
}

function mean(arr) { if (!arr || arr.length === 0) return null; return arr.reduce((a,b)=>a+b,0)/arr.length; }

function finalizeAndGetResults() {
  const s = JSON.parse(localStorage.getItem('din_session') || JSON.stringify(session));
  const summary = {};
  const condResults = {};
  const conds = s.conditionOrder || Object.keys(COND_DEFS);

  for (const c of conds) {
    const effs = s.effectiveSNRs[c] || [];
    const last20 = effs.slice(-20);
    const SRT = last20.length ? Math.round(mean(last20)*100)/100 : null;
    const trials = (s.trials || []).filter(t => t.condition === c);
    const formalTrials = trials.filter(t => !t.practice);
    const rtsAll = formalTrials.map(t => t.rt_ms).filter(x=>x!=null);
    const rtsCorrect = formalTrials.filter(t=>t.correct).map(t=>t.rt_ms).filter(x=>x!=null);
    condResults[c] = {
      SRT,
      RT_all_mean_ms: rtsAll.length ? Math.round(mean(rtsAll)*100)/100 : null,
      RT_correct_mean_ms: rtsCorrect.length ? Math.round(mean(rtsCorrect)*100)/100 : null,
      nPracticeTrials: trials.length - formalTrials.length,
      nFormalTrials: formalTrials.length,
      trials,
      formalTrials
    };
  }

  summary.conditions = condResults;

  function diffSRT(a,b) {
    if (condResults[a] && condResults[b] && condResults[a].SRT != null && condResults[b].SRT != null) {
      return Math.round((condResults[a].SRT - condResults[b].SRT)*100)/100;
    }
    return null;
  }
  function diffRT(a,b) {
    if (condResults[a] && condResults[b] && condResults[a].RT_correct_mean_ms != null && condResults[b].RT_correct_mean_ms != null) {
      return Math.round((condResults[a].RT_correct_mean_ms - condResults[b].RT_correct_mean_ms)*100)/100;
    }
    return null;
  }

  summary.SRT3b_3 = diffSRT('3b','3f');
  summary.SRT2b_2 = diffSRT('2b','2f');
  summary.SRT5_3 = diffSRT('5f','3f');
  summary.SRT5_2 = diffSRT('5f','2f');

  summary.RT3b_3 = diffRT('3b','3f');
  summary.RT2b_2 = diffRT('2b','2f');
  summary.RT5_3 = diffRT('5f','3f');
  summary.RT5_2 = diffRT('5f','2f');

  return { summary, condResults, trials: s.trials || [] };
}

function downloadJSON(obj, filename) {
  const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}
function downloadCSV(rows, filename) {
  if (!rows || rows.length === 0) { alert('No rows to export'); return; }
  const keys = Object.keys(rows[0]);
  const lines = [keys.join(',')].concat(rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(',')));
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
}

/* ========== EXPOSE API ========== */
window.loadLanguageAudio = loadLanguageAudio;
window.startNoiseLoop = startNoiseLoop;
window.stopNoiseLoop = stopNoiseLoop;
window.setFixedNoiseGain = setFixedNoiseGain;
window.startTrialPlay = startTrialPlay;
window.submitInput = submitInput;
window.proceedToNextCondition = proceedToNextCondition;
window.finalizeAndGetResults = finalizeAndGetResults;
window.downloadJSON = downloadJSON;
window.downloadCSV = downloadCSV;
// 暴露条件定义给 results.html 使用（可选）
window.COND_DEFS = COND_DEFS;

// NOTE: do NOT overwrite setUILanguage here — keep the implementation from i18n.js

/** 当前 condition 的位数（2/3/5） */
function getCurrentNDigits() {
  if (!session || !session.conditionOrder) return 3;
  const currCond = session.conditionOrder[session.currentCondIdx || 0];
  const def = COND_DEFS[currCond] || { nDigits: 3 };
  return def.nDigits || 3;
}

/** 渲染方框输入（n 个空框），并确保容器有 display-box 类 */
function setInputBoxes(n) {
  const inputEl = document.getElementById('input');
  if (!inputEl) return;
  inputEl.classList.add('display-box');
  inputEl.innerHTML = Array.from({ length: n }, () => `<div class="digit-box"></div>`).join('');
}

/** 读取/写回当前输入 */
function getCurrentInput() {
  const boxes = document.querySelectorAll('#input .digit-box');
  let s = '';
  boxes.forEach(b => { const t = (b.textContent || '').trim(); if (t) s += t; });
  return s;
}
function updateBoxesFromString(s) {
  const boxes = document.querySelectorAll('#input .digit-box');
  boxes.forEach((b, i) => {
    b.textContent = s[i] ? s[i] : '';
  });
}

/* ========== 实体键盘输入支持（test 页面自动启用） ========== */
document.addEventListener('DOMContentLoaded', () => {
  // 只在有 keypad 的页面启用
  if (!document.getElementById('keypad')) return;

  document.addEventListener('keydown', (e) => {
    // 播放锁定中：屏蔽输入
    if (window.dinUI?.inputLocked) {
      if (/^\d$/.test(e.key) || e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Enter') {
        e.preventDefault();
      }
      return;
    }

    // 避免在输入框/文本域/可编辑元素上触发
    const el = e.target;
    const tag = (el.tagName || '').toLowerCase();
    const isTyping = (tag === 'input' || tag === 'textarea' || el.isContentEditable);
    if (isTyping) return;

    // 数字键 0-9
    if (/^\d$/.test(e.key)) {
      e.preventDefault();
      appendInput(e.key);
      return;
    }

    // 退格/删除
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      clearInput();
      return;
    }

    // 回车=提交
    if (e.key === 'Enter') {
      e.preventDefault();
      submitInput();
      return;
    }
  }, { capture: true });
});

/* ========== END ========== */
