const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const DIGITS = [...Array(10).keys()];
const CHANCE_LEVEL = 1 / DIGITS.length;
const DEFAULT_TARGET = 0.5;
const VERSIONED_STIMULI = {
  spanish_male: {
    label: 'Spanish (male)', version: 'fir-20261005-v1',
    manifestSha256: 'c4f95b4e62b8c2100ce56184b0cc72bde46a9a811e7750233d563ec15830d4b1',
  },
  spanish_female: {
    label: 'Spanish (female)', version: 'fir-20261005-v1',
    manifestSha256: 'eb55bbb58b4a64153a2b7c8b8733f399fe7480e93b8b878f20a542874d3982c8',
  },
};
const audioCache = new Map();
const audioLoads = new Map();

const setupCard = document.getElementById('setupCard');
const calibrationCard = document.getElementById('calibrationCard');
const taskCard = document.getElementById('taskCard');
const resultsCard = document.getElementById('resultsCard');

const stimLangEl = document.getElementById('stimLang');
const presetEl = document.getElementById('designPreset');
const snrListEl = document.getElementById('snrList');
const earEl = document.getElementById('testEar');
const roundNumberEl = document.getElementById('roundNumber');
const orderEl = document.getElementById('trialOrder');
const targetPctEl = document.getElementById('targetPct');
const noiseGainEl = document.getElementById('noiseGain');
const participantIdEl = document.getElementById('participantId');
const showSnrEl = document.getElementById('showSnr');
const autoPlayEl = document.getElementById('autoPlay');
const autoPlayDelayEl = document.getElementById('autoPlayDelay');
const setupMsg = document.getElementById('setupMsg');
const trialCountEl = document.getElementById('trialCount');
const groupJsonFilesEl = document.getElementById('groupJsonFiles');
const analyzeGroupBtn = document.getElementById('analyzeGroupBtn');
const groupMsg = document.getElementById('groupMsg');
const groupEarScopeEl = document.getElementById('groupEarScope');

const preloadBtn = document.getElementById('preloadBtn');
const startBtn = document.getElementById('startBtn');
const calibrationLang = document.getElementById('calibrationLang');
const calibrationPlayBtn = document.getElementById('calibrationPlayBtn');
const calibrationStopBtn = document.getElementById('calibrationStopBtn');
const calibrationBackBtn = document.getElementById('calibrationBackBtn');
const calibrationConfirmBtn = document.getElementById('calibrationConfirmBtn');
const calibrationGainEl = document.getElementById('calibrationGain');
const calibrationGainValue = document.getElementById('calibrationGainValue');
const calibrationMsg = document.getElementById('calibrationMsg');
const channelConfirmedEl = document.getElementById('channelConfirmed');
const playBtn = document.getElementById('playBtn');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const keypad = document.getElementById('keypad');

const inputDisplay = document.getElementById('inputDisplay');
const progressEl = document.getElementById('progress');
const currentSNREl = document.getElementById('currentSNR');
const statusEl = document.getElementById('status');

const downloadCsvBtn = document.getElementById('downloadCsv');
const downloadJsonBtn = document.getElementById('downloadJson');
const downloadCorrectionsBtn = document.getElementById('downloadCorrections');
const copyCorrectionsBtn = document.getElementById('copyCorrections');
const restartBtn = document.getElementById('restartBtn');
const nextRoundBtn = document.getElementById('nextRoundBtn');
const saveStatus = document.getElementById('saveStatus');

const resultsTitle = document.getElementById('resultsTitle');
const resultsSubtitle = document.getElementById('resultsSubtitle');
const correctionsOutput = document.getElementById('correctionsOutput');
const correctionTable = document.getElementById('correctionTable');
const fitTable = document.getElementById('fitTable');
const snrDigitTable = document.getElementById('snrDigitTable');
const digitPiTable = document.getElementById('digitPiTable');
const piPlot = document.getElementById('piPlot');

let currentInput = '';
let buffers = null;
let trialList = [];
let trialIndex = 0;
let responses = [];
let playedAt = null;
let playedEndedAt = null;
let hasPlayedThisTrial = false;
let isPlaying = false;
let settingsSnapshot = null;
let latestAnalysis = null;
let applyingPreset = false;
let autoPlayTimer = null;
let pendingSettings = null;
let calibrationNoiseSource = null;
let calibrationNoiseGainNode = null;
let calibrationPlayed = false;
let paused = false;
let submitting = false;
let phase = 'formal';
let practiceTrials = [];
let practiceResponses = [];
let practiceIndex = 0;
let resumeRecord = null;
let lockedProfile = null;
let profileInvalid = false;
let archiveQueue = Promise.resolve();
let archiveError = false;
const pauseBtn = document.getElementById('pauseBtn');
const formalStartBtn = document.getElementById('formalStartBtn');
const checkpointStatus = document.getElementById('checkpointStatus');

const presets = {
  quick: {
    snrs: '-4,-8,-12,-16,-20',
    order: 'random',
  },
  potgieter2016: {
    snrs: '-2,-4,-6,-8,-10,-12,-14,-16,-18,-20',
    order: 'blocked',
  },
  wang2023: {
    snrs: '-2,-4,-6,-8,-10,-12,-14,-16,-18,-20,-22',
    order: 'blocked',
  },
};

function parseSNRList(raw) {
  return OptimizationProtocol.parseSnrs(raw);
}

function activeTrials() { return phase === 'practice' ? practiceTrials : trialList; }
function activeIndex() { return phase === 'practice' ? practiceIndex : trialIndex; }
function planAudio(settings) {
  const plan = OptimizationProtocol.audioPlan(buffers.digitBuffers.map(mixToMono), mixToMono(buffers.noiseBuffer),
    Math.max(...settings.snrs, ...(settings.practiceEnabled ? [0] : [])));
  if (settings.audioPlan) {
    if (!(settings.audioPlan.scale > 0 && settings.audioPlan.scale <= 1) || settings.audioPlan.engine !== plan.engine || settings.audioPlan.scale * plan.peakBoundAtUnitGain * 3 > .99 ||
        settings.audioFingerprint !== buffers.fingerprint || settings.audioContextSampleRateHz !== audioCtx.sampleRate) {
      throw new Error('Audio or output configuration changed. Download the interrupted round; do not resume it on this configuration.');
    }
    return settings.audioPlan;
  }
  return plan;
}

function round(value, places = 2) {
  if (!Number.isFinite(value)) return null;
  const m = 10 ** places;
  return Math.round(value * m) / m;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function shuffle(array) {
  const out = array.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function mixToMono(buffer) {
  const len = buffer.length;
  const ch = buffer.numberOfChannels;
  const out = new Float32Array(len);
  for (let c = 0; c < ch; c++) {
    const data = buffer.getChannelData(c);
    for (let i = 0; i < len; i++) out[i] += data[i];
  }
  if (ch > 1) for (let i = 0; i < len; i++) out[i] /= ch;
  return out;
}

function rms(arr) {
  let s = 0;
  for (let i = 0; i < arr.length; i++) s += arr[i] * arr[i];
  return Math.sqrt(s / Math.max(arr.length, 1));
}

const EAR_LABELS = { left: 'Left ear', right: 'Right ear', both: 'Both ears' };

function prepareStereoOutput() {
  if (audioCtx.destination.maxChannelCount < 2) {
    throw new Error('Stereo output is required. Connect stereo headphones before testing.');
  }
  audioCtx.destination.channelCount = 2;
}

function createEarBuffer(samples, sampleRate, ear) {
  if (!Object.hasOwn(EAR_LABELS, ear)) throw new Error('Select left, right, or both ears.');
  // Keep the active-channel waveform unchanged; the other channel stays silent.
  const output = audioCtx.createBuffer(2, samples.length, sampleRate);
  if (ear !== 'right') output.copyToChannel(samples, 0);
  if (ear !== 'left') output.copyToChannel(samples, 1);
  return output;
}

function setSetupMessage(msg, isError = false) {
  setupMsg.textContent = msg;
  setupMsg.style.color = isError ? '#b91c1c' : '#5f666d';
}

function setCalibrationMessage(msg, isError = false) {
  calibrationMsg.textContent = msg;
  calibrationMsg.style.color = isError ? '#b91c1c' : '#5f666d';
}

function setButtonBusy(button, busy, busyText) {
  if (!button) return;
  if (busy) {
    if (!button.dataset.idleText) button.dataset.idleText = button.textContent;
    button.textContent = busyText;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    return;
  }

  button.textContent = button.dataset.idleText || button.textContent;
  button.disabled = false;
  button.removeAttribute('aria-busy');
}

function clampNoiseGain(value) {
  if (!Number.isFinite(value)) return 1;
  return Math.max(0.05, Math.min(3, value));
}

function calibrationStorageKey(lang, ear = null) {
  const version = VERSIONED_STIMULI[lang]?.version;
  return `digitOptimizationNoiseGain:${OptimizationProtocol.ENGINE}:${lang}${version ? `:${version}` : ''}${ear ? `:ear-${ear}` : ''}`;
}

function stimulusLabel(lang) {
  return VERSIONED_STIMULI[lang]?.label || lang.replaceAll('_', ' ');
}

function updateStimulusInfo() {
  const material = VERSIONED_STIMULI[stimLangEl.value];
  document.getElementById('stimulusInfo').textContent = material
    ? `${material.label} | FIR ${material.version} | 44.1 kHz | 10 s masker | RMS 0.05 | No digit corrections applied`
    : '';
  participantIdEl.required = true;
}

async function verifyAudioHash(bytes, expected, name) {
  if (!window.crypto?.subtle) throw new Error('Verified audio requires HTTPS or localhost.');
  const hash = await window.crypto.subtle.digest('SHA-256', bytes);
  const actual = Array.from(new Uint8Array(hash), n => n.toString(16).padStart(2, '0')).join('');
  if (expected && actual !== expected) throw new Error(`${name}: stimulus checksum mismatch. Reload before testing.`);
  return actual;
}

function getStoredCalibrationGain(lang, ear) {
  try {
    const stored = Number(localStorage.getItem(calibrationStorageKey(lang, ear)));
    return Number.isFinite(stored) && stored > 0 ? clampNoiseGain(stored) : null;
  } catch {
    return null;
  }
}

function rememberCalibrationGain(lang, ear, gain) {
  try {
    localStorage.setItem(calibrationStorageKey(lang, ear), String(gain));
  } catch {
    // Some privacy modes disable localStorage; the current calibrated test can still proceed.
  }
}

function updateCalibrationGain(value) {
  const gain = clampNoiseGain(Number(value));
  calibrationGainEl.value = String(gain);
  calibrationGainValue.textContent = gain.toFixed(2);
  if (calibrationNoiseGainNode) {
    calibrationNoiseGainNode.gain.value = gain * pendingSettings.audioPlan.scale;
  }
  return gain;
}

function updateTrialCount() {
  const snrs = parseSNRList(snrListEl.value) || [];
  const total = snrs.length * DIGITS.length;
  trialCountEl.textContent = `${total} trials / round`;
}

function updateTaskUI() {
  const total = activeTrials().length;
  const shownTrial = Math.min(activeIndex() + 1, total);
  progressEl.textContent = `${phase === 'practice' ? 'Practice' : 'Trial'} ${shownTrial} / ${total}`;
  document.getElementById('roundContext').textContent = `${settingsSnapshot.participantId} | Round ${settingsSnapshot.roundNumber} | ${EAR_LABELS[settingsSnapshot.ear]}`;

  const trial = activeTrials()[activeIndex()];
  currentSNREl.textContent = trial && settingsSnapshot.showSnr ? `SNR: ${trial.snr} dB` : 'SNR hidden';
  inputDisplay.textContent = currentInput;
}

function getAutoPlayDelayMs() {
  const value = Number(autoPlayDelayEl.value);
  if (!Number.isFinite(value)) return 800;
  return Math.max(200, Math.min(5000, Math.round(value)));
}

function clearAutoPlayTimer() {
  if (autoPlayTimer != null) {
    clearTimeout(autoPlayTimer);
    autoPlayTimer = null;
  }
}

function scheduleAutoPlay(label = 'Auto-playing') {
  clearAutoPlayTimer();
  if (paused || phase === 'ready' || !settingsSnapshot?.autoPlay || !activeTrials()[activeIndex()]) return;

  const delay = settingsSnapshot.autoPlayDelayMs;
  statusEl.textContent = `${label} in ${delay} ms...`;
  autoPlayTimer = setTimeout(() => {
    autoPlayTimer = null;
    playCurrentTrial(true);
  }, delay);
}

async function loadAudio(lang) {
  if (audioCache.has(lang)) {
    buffers = audioCache.get(lang);
    return buffers;
  }
  if (audioLoads.has(lang)) {
    buffers = await audioLoads.get(lang);
    return buffers;
  }
  const loading = loadAudioFiles(lang);
  audioLoads.set(lang, loading);
  try {
    const loaded = await loading;
    audioCache.set(lang, loaded);
    buffers = loaded;
    return loaded;
  } finally {
    audioLoads.delete(lang);
  }
}

async function loadAudioFiles(lang) {
  const label = stimulusLabel(lang);
  setSetupMessage(`Loading audio for ${label} ...`);
  const material = VERSIONED_STIMULI[lang];
  const base = material ? `audio/${lang}/${material.version}` : `../digit-in-noise-test/audio/${lang}`;
  let stimulus = null;
  const fingerprints = [];
  if (material) {
    const response = await fetch(`${base}/manifest.json`);
    if (!response.ok) throw new Error(`Cannot load stimulus manifest for ${label}`);
    const bytes = await response.arrayBuffer();
    await verifyAudioHash(bytes, material.manifestSha256, 'Manifest');
    const manifest = JSON.parse(new TextDecoder().decode(bytes));
    if (manifest.id !== lang || manifest.version !== material.version) throw new Error('Wrong stimulus version');
    stimulus = { ...manifest, manifestSha256: material.manifestSha256 };
  }

  async function decodeFile(name) {
    const response = await fetch(`${base}/${name}`);
    if (!response.ok) throw new Error(`Cannot load ${name} for ${label}`);
    const bytes = await response.arrayBuffer();
    if (stimulus) {
      const expected = stimulus.files.find(file => file.name === name);
      if (!expected || bytes.byteLength !== expected.bytes) throw new Error(`${name}: incorrect audio size`);
      fingerprints.push({ name, sha256: await verifyAudioHash(bytes, expected.sha256, name) });
    } else {
      fingerprints.push({ name, sha256: await verifyAudioHash(bytes, null, name) });
    }
    return audioCtx.decodeAudioData(bytes.slice(0));
  }

  const digitBuffers = [];
  for (let digit = 0; digit <= 9; digit++) {
    setSetupMessage(`Loading ${label}: ${digit + 1} / 11 files ...`);
    digitBuffers.push(await decodeFile(`${digit}.wav`));
  }

  setSetupMessage(`Loading ${label}: 11 / 11 files (masker noise) ...`);
  const noiseBuffer = await decodeFile('noise.wav');
  setSetupMessage(`Audio ready for ${label}${material ? ' (checksums verified)' : ''}.`);
  const fingerprint = await verifyAudioHash(new TextEncoder().encode(JSON.stringify(fingerprints)), null, 'Audio fingerprint');
  return { lang, digitBuffers, noiseBuffer, stimulus, fingerprint };
}

function stopCalibrationNoise() {
  if (calibrationNoiseSource) {
    try { calibrationNoiseSource.stop(); } catch {}
    try { calibrationNoiseSource.disconnect(); } catch {}
    try { calibrationNoiseGainNode?.disconnect(); } catch {}
    calibrationNoiseSource = null;
    calibrationNoiseGainNode = null;
  }
}

async function startCalibrationNoise() {
  const settings = pendingSettings || readSetupSettings();
  if (!settings) return;

  setButtonBusy(calibrationPlayBtn, true, 'Preparing noise...');
  try {
    if (audioCtx.state !== 'running') {
      await audioCtx.resume();
    }
    if (!buffers || buffers.lang !== settings.lang) {
      setCalibrationMessage(`Loading noise for ${settings.lang}...`);
      await loadAudio(settings.lang);
    }

    stopCalibrationNoise();
    prepareStereoOutput();
    const src = audioCtx.createBufferSource();
    const gain = audioCtx.createGain();
    src.buffer = createEarBuffer(mixToMono(buffers.noiseBuffer), buffers.noiseBuffer.sampleRate, settings.ear);
    src.loop = true;
    gain.gain.value = updateCalibrationGain(calibrationGainEl.value) * settings.audioPlan.scale;
    src.connect(gain).connect(audioCtx.destination);
    src.start();
    calibrationNoiseSource = src;
    calibrationNoiseGainNode = gain;
    calibrationPlayed = true;
    channelConfirmedEl.disabled = false;
    calibrationConfirmBtn.disabled = !channelConfirmedEl.checked;
    setCalibrationMessage('Noise is playing. Adjust the slider until it is comfortable and clearly audible.');
  } finally {
    setButtonBusy(calibrationPlayBtn, false);
  }
}

function buildTrials(snrs, repsPerDigit, orderMode) {
  const list = [];
  const easyToHardSnrs = snrs.slice().sort((a, b) => b - a);

  if (orderMode === 'blocked') {
    for (let rep = 0; rep < repsPerDigit; rep++) {
      for (const snr of easyToHardSnrs) {
        for (const digit of shuffle(DIGITS)) {
          list.push({ snr, digit, rep: rep + 1 });
        }
      }
    }
    return list;
  }

  for (const snr of snrs) {
    for (let rep = 0; rep < repsPerDigit; rep++) {
      for (const digit of DIGITS) {
        list.push({ snr, digit, rep: rep + 1 });
      }
    }
  }
  return shuffle(list);
}

async function renderAndPlaySingleDigit({ digit, snr, noiseGain, ear, audioPlan }) {
  if (!audioPlan || audioPlan.engine !== OptimizationProtocol.ENGINE || !(audioPlan.scale > 0 && audioPlan.scale <= 1) || snr > audioPlan.maxSnr || !Number.isFinite(noiseGain) || noiseGain < .05 || noiseGain > 3) throw new Error('Recalibration is required for this playback configuration.');
  prepareStereoOutput();
  const sr = buffers.digitBuffers[0].sampleRate;
  const prePad = Math.round(0.5 * sr);
  const postPad = Math.round(0.5 * sr);

  const signal = mixToMono(buffers.digitBuffers[digit]);
  const noiseFull = mixToMono(buffers.noiseBuffer);

  const totalLen = prePad + signal.length + postPad;
  const noise = new Float32Array(totalLen);

  if (noiseFull.length >= totalLen) {
    const start = Math.floor(Math.random() * (noiseFull.length - totalLen + 1));
    noise.set(noiseFull.slice(start, start + totalLen), 0);
  } else {
    for (let i = 0; i < totalLen; i++) noise[i] = noiseFull[i % noiseFull.length];
  }

  const signalRms = rms(signal) || 1e-9;
  const noiseCenter = noise.slice(prePad, prePad + signal.length);
  const noiseRms = (rms(noiseCenter) || 1e-9) * noiseGain;

  const currentSNR = 20 * Math.log10(signalRms / noiseRms);
  const targetGain = Math.pow(10, (snr - currentSNR) / 20);
  const effectiveSNR = 20 * Math.log10((signalRms * targetGain) / noiseRms);

  const mixed = new Float32Array(totalLen);
  for (let i = 0; i < totalLen; i++) {
    mixed[i] += noise[i] * noiseGain;
  }
  for (let i = 0; i < signal.length; i++) {
    mixed[prePad + i] += signal[i] * targetGain;
  }

  let maxAbs = 0;
  for (let i = 0; i < mixed.length; i++) {
    mixed[i] *= audioPlan.scale;
    const a = Math.abs(mixed[i]);
    if (a > maxAbs) maxAbs = a;
  }

  if (!Number.isFinite(maxAbs) || maxAbs > .99) throw new Error('Output headroom exceeded. Playback stopped; recalibration is required.');

  const out = createEarBuffer(mixed, sr, ear);

  await new Promise((resolve) => {
    const src = audioCtx.createBufferSource();
    src.buffer = out;
    src.connect(audioCtx.destination);
    src.onended = () => { src.disconnect(); resolve(); };
    src.start();
  });

  return {
    effectiveSNR: round(effectiveSNR, 2),
    limiterGain: 1,
    outputScale: audioPlan.scale,
    effectiveNoiseGain: noiseGain * audioPlan.scale,
  };
}

function appendInput(v) {
  if (currentInput.length >= 1) return;
  currentInput += v;
  inputDisplay.textContent = currentInput;
}

function clearInput() {
  currentInput = '';
  inputDisplay.textContent = '';
}

function setResponseDisabled(disabled) {
  submitBtn.disabled = disabled;
  clearBtn.disabled = disabled;
  keypad.querySelectorAll('button[data-val]').forEach(btn => {
    btn.disabled = disabled;
  });
}

function prepareForNextTrial() {
  clearInput();
  hasPlayedThisTrial = false;
  playedAt = null;
  playedEndedAt = null;
  setButtonBusy(playBtn, false);
  playBtn.disabled = false;
  setResponseDisabled(true);
  updateTaskUI();
}

async function handlePlay() {
  if (isPlaying || paused || submitting || phase === 'ready') return;
  if (!activeTrials()[activeIndex()]) return;

  if (!buffers || buffers.lang !== settingsSnapshot.lang) {
    statusEl.textContent = `Loading audio for ${settingsSnapshot.lang}...`;
    setButtonBusy(playBtn, true, 'Loading audio...');
    await loadAudio(settingsSnapshot.lang);
  }

  isPlaying = true;
  hasPlayedThisTrial = false;
  setButtonBusy(playBtn, true, 'Playing...');
  setResponseDisabled(true);
  statusEl.textContent = 'Playing...';

  if (audioCtx.state !== 'running') {
    try { await audioCtx.resume(); } catch {}
  }

  const trial = activeTrials()[activeIndex()];
  trial.presentations = (trial.presentations || 0) + 1;
  await checkpointRound();
  if (paused || document.hidden) {
    isPlaying = false;
    setButtonBusy(playBtn, false);
    playBtn.disabled = true;
    return;
  }
  playedAt = performance.now();
  const playback = await renderAndPlaySingleDigit({
    digit: trial.digit,
    snr: trial.snr,
    noiseGain: settingsSnapshot.noiseGain,
    ear: settingsSnapshot.ear,
    audioPlan: settingsSnapshot.audioPlan,
  });
  playedEndedAt = performance.now();

  trial.effectiveSNR = playback.effectiveSNR;
  trial.limiterGain = playback.limiterGain;
  trial.outputScale = playback.outputScale;
  trial.effectiveNoiseGain = playback.effectiveNoiseGain;
  hasPlayedThisTrial = true;
  statusEl.textContent = paused ? 'Paused. Resume when ready.' : 'Enter the digit you heard.';
  setResponseDisabled(paused);
  isPlaying = false;
  setButtonBusy(playBtn, false);
  playBtn.disabled = true;
}

async function playCurrentTrial(isAuto = false) {
  clearAutoPlayTimer();
  try {
    await handlePlay();
  } catch (err) {
    console.error(err);
    statusEl.textContent = `${isAuto ? 'Auto-play' : 'Playback'} error: ${err.message || err}`;
    setButtonBusy(playBtn, false);
    playBtn.disabled = false;
    setResponseDisabled(true);
    isPlaying = false;
    paused = true;
    pauseBtn.textContent = 'Resume';
    playBtn.disabled = true;
  }
}

function summarize(responsesArr, snrsInOrder) {
  const snrDigitStats = {};
  const digitSnrStats = {};

  for (const snr of snrsInOrder) {
    snrDigitStats[snr] = {};
    for (const d of DIGITS) snrDigitStats[snr][d] = { n: 0, c: 0 };
  }

  for (const d of DIGITS) {
    digitSnrStats[d] = {};
    for (const snr of snrsInOrder) digitSnrStats[d][snr] = { n: 0, c: 0 };
  }

  for (const r of responsesArr) {
    if (!snrDigitStats[r.snr]) continue;
    snrDigitStats[r.snr][r.target].n += 1;
    snrDigitStats[r.snr][r.target].c += r.correct ? 1 : 0;

    digitSnrStats[r.target][r.snr].n += 1;
    digitSnrStats[r.target][r.snr].c += r.correct ? 1 : 0;
  }

  return { snrDigitStats, digitSnrStats };
}

function logisticProbability(snr, x0, slopeAtInflection, gamma = CHANCE_LEVEL) {
  const k = (4 * slopeAtInflection) / (1 - gamma);
  return gamma + (1 - gamma) / (1 + Math.exp(-k * (snr - x0)));
}

function thresholdAtProbability(target, x0, slopeAtInflection, gamma = CHANCE_LEVEL) {
  const boundedTarget = Math.max(gamma + 1e-6, Math.min(0.999999, target));
  const t = (boundedTarget - gamma) / (1 - gamma);
  const k = (4 * slopeAtInflection) / (1 - gamma);
  return x0 + Math.log(t / (1 - t)) / k;
}

function fitDigitPsychometric(statsBySnr, snrsInOrder, target) {
  const points = snrsInOrder
    .map(snr => ({ snr, ...statsBySnr[snr] }))
    .filter(p => p.n > 0);

  const totalN = points.reduce((sum, p) => sum + p.n, 0);
  if (points.length < 3 || totalN < 8) {
    return { ok: false, reason: 'too_few_points', n: totalN, points };
  }

  const minSnr = Math.min(...snrsInOrder);
  const maxSnr = Math.max(...snrsInOrder);
  const observed = points.map(p => p.c / p.n);
  const minObserved = Math.min(...observed);
  const maxObserved = Math.max(...observed);

  function nll(x0, slope) {
    let value = 0;
    for (const p of points) {
      const prob = Math.max(1e-6, Math.min(1 - 1e-6, logisticProbability(p.snr, x0, slope)));
      value -= p.c * Math.log(prob) + (p.n - p.c) * Math.log(1 - prob);
    }
    return value;
  }

  let best = { x0: 0, slope: 0.18, loss: Infinity };
  for (let x0 = minSnr - 8; x0 <= maxSnr + 8; x0 += 0.25) {
    for (let slope = 0.02; slope <= 0.42; slope += 0.005) {
      const loss = nll(x0, slope);
      if (loss < best.loss) best = { x0, slope, loss };
    }
  }

  const coarse = best;
  for (let x0 = coarse.x0 - 0.6; x0 <= coarse.x0 + 0.6; x0 += 0.05) {
    for (let slope = Math.max(0.005, coarse.slope - 0.04); slope <= coarse.slope + 0.04; slope += 0.001) {
      const loss = nll(x0, slope);
      if (loss < best.loss) best = { x0, slope, loss };
    }
  }

  const threshold = thresholdAtProbability(target, best.x0, best.slope);
  const inRange = threshold >= minSnr && threshold <= maxSnr;
  const bracketsTarget = minObserved <= target && maxObserved >= target;

  return {
    ok: true,
    n: totalN,
    x0: best.x0,
    slopeAtInflection: best.slope,
    slopePctPerDb: best.slope * 100,
    threshold,
    thresholdTarget: target,
    loss: best.loss,
    minObserved,
    maxObserved,
    inRange,
    bracketsTarget,
    boundaryHit: best.x0 <= minSnr - 8 || best.x0 >= maxSnr + 8 || best.slope <= .0051 || best.slope >= .454,
    points,
  };
}

function analyzeOptimization(summary, snrsInOrder, target) {
  const fits = {};
  for (const digit of DIGITS) {
    fits[digit] = fitDigitPsychometric(summary.digitSnrStats[digit], snrsInOrder, target);
  }

  const valid = DIGITS.map(d => fits[d]).filter(f => f.ok && Number.isFinite(f.threshold));
  const meanThreshold = valid.length
    ? valid.reduce((sum, f) => sum + f.threshold, 0) / valid.length
    : null;

  const corrections = {};
  const correctionsArray = [];
  for (const digit of DIGITS) {
    const fit = fits[digit];
    const correction = fit.ok && Number.isFinite(fit.threshold) && meanThreshold != null
      ? fit.threshold - meanThreshold
      : null;
    corrections[digit] = correction;
    correctionsArray[digit] = correction == null ? null : round(correction, 2);
  }

  return {
    target,
    chanceLevel: CHANCE_LEVEL,
    meanThreshold,
    fits,
    corrections,
    correctionsArray,
    warnings: DIGITS
      .filter(d => fits[d].ok && (!fits[d].inRange || !fits[d].bracketsTarget || fits[d].boundaryHit))
      .map(d => ({
        digit: d,
        reason: !fits[d].bracketsTarget ? 'target_not_bracketed' : !fits[d].inRange ? 'threshold_extrapolated' : 'fit_boundary',
      })),
  };
}

function pct(c, n) {
  if (!n) return '-';
  return `${((c / n) * 100).toFixed(1)}%`;
}

function buildSnrDigitTable(summary, snrsInOrder) {
  let html = '<table><thead><tr><th>SNR (dB)</th>';
  for (const d of DIGITS) html += `<th>${d}</th>`;
  html += '<th>Overall</th></tr></thead><tbody>';

  for (const snr of snrsInOrder) {
    html += `<tr><td>${snr}</td>`;
    let nAll = 0;
    let cAll = 0;

    for (const d of DIGITS) {
      const st = summary.snrDigitStats[snr][d];
      html += `<td>${pct(st.c, st.n)}<br><small>(${st.c}/${st.n})</small></td>`;
      nAll += st.n;
      cAll += st.c;
    }

    html += `<td><strong>${pct(cAll, nAll)}</strong><br><small>(${cAll}/${nAll})</small></td>`;
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

function buildDigitPiTable(summary, snrsInOrder) {
  let html = '<table><thead><tr><th>Digit</th>';
  for (const snr of snrsInOrder) html += `<th>${snr} dB</th>`;
  html += '</tr></thead><tbody>';

  for (const d of DIGITS) {
    html += `<tr><td>${d}</td>`;
    for (const snr of snrsInOrder) {
      const st = summary.digitSnrStats[d][snr];
      html += `<td>${pct(st.c, st.n)}<br><small>(${st.c}/${st.n})</small></td>`;
    }
    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

function buildCorrectionTable(analysis) {
  let html = '<table><thead><tr><th>Digit</th><th>Threshold dB SNR</th><th>Correction dB</th><th>Meaning</th></tr></thead><tbody>';
  for (const d of DIGITS) {
    const fit = analysis.fits[d];
    const correction = analysis.corrections[d];
    const meaning = correction == null
      ? 'Not estimated'
      : correction > 0
        ? 'increase digit level'
        : correction < 0
          ? 'decrease digit level'
          : 'no level change';
    html += `<tr>
      <td>${d}</td>
      <td>${fit.ok ? round(fit.threshold, 2) : '-'}</td>
      <td><strong>${correction == null ? '-' : round(correction, 2)}</strong></td>
      <td>${meaning}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function buildFitTable(analysis) {
  let html = '<table><thead><tr><th>Digit</th><th>N</th><th>Slope (%/dB)</th><th>Observed range</th><th>Fit flag</th></tr></thead><tbody>';
  for (const d of DIGITS) {
    const fit = analysis.fits[d];
    const flag = !fit.ok
      ? fit.reason
      : fit.boundaryHit
        ? 'fit boundary'
      : fit.bracketsTarget && fit.inRange
        ? 'ok'
        : fit.bracketsTarget
          ? 'threshold extrapolated'
          : 'target not bracketed';
    html += `<tr>
      <td>${d}</td>
      <td>${fit.n || 0}</td>
      <td>${fit.ok ? round(fit.slopePctPerDb, 1) : '-'}</td>
      <td>${fit.ok ? `${round(fit.minObserved * 100, 1)}-${round(fit.maxObserved * 100, 1)}%` : '-'}</td>
      <td>${escapeHtml(flag)}</td>
    </tr>`;
  }
  html += '</tbody></table>';
  return html;
}

function buildPiPlot(analysis, snrsInOrder) {
  const minSnr = Math.min(...snrsInOrder) - 1;
  const maxSnr = Math.max(...snrsInOrder) + 1;
  const width = 860;
  const height = 420;
  const pad = { left: 54, right: 18, top: 20, bottom: 46 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const colors = ['#0f766e', '#d97706', '#2563eb', '#9333ea', '#dc2626', '#0891b2', '#65a30d', '#7c3aed', '#be123c', '#475569'];
  const xScale = x => pad.left + ((x - minSnr) / (maxSnr - minSnr)) * plotW;
  const yScale = y => pad.top + (1 - y) * plotH;
  let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Digit PI function plot">`;
  svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="#ffffff"/>`;
  svg += `<line x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}" stroke="#a8a29e"/>`;
  svg += `<line x1="${pad.left}" y1="${pad.top + plotH}" x2="${pad.left + plotW}" y2="${pad.top + plotH}" stroke="#a8a29e"/>`;

  for (let p = 0; p <= 1; p += 0.25) {
    const y = yScale(p);
    svg += `<line x1="${pad.left}" y1="${y}" x2="${pad.left + plotW}" y2="${y}" stroke="#e7e5e4"/>`;
    svg += `<text x="${pad.left - 10}" y="${y + 4}" text-anchor="end" font-size="12" fill="#57534e">${Math.round(p * 100)}</text>`;
  }

  for (const snr of snrsInOrder) {
    const x = xScale(snr);
    svg += `<line x1="${x}" y1="${pad.top}" x2="${x}" y2="${pad.top + plotH}" stroke="#f5f5f4"/>`;
    svg += `<text x="${x}" y="${height - 18}" text-anchor="middle" font-size="12" fill="#57534e">${snr}</text>`;
  }

  for (const d of DIGITS) {
    const fit = analysis.fits[d];
    if (!fit.ok) continue;
    const pts = [];
    for (let i = 0; i <= 120; i++) {
      const snr = minSnr + ((maxSnr - minSnr) * i) / 120;
      const prob = logisticProbability(snr, fit.x0, fit.slopeAtInflection);
      pts.push(`${round(xScale(snr), 1)},${round(yScale(prob), 1)}`);
    }
    svg += `<polyline points="${pts.join(' ')}" fill="none" stroke="${colors[d]}" stroke-width="2" opacity="0.9"/>`;
    for (const p of fit.points) {
      svg += `<circle cx="${xScale(p.snr)}" cy="${yScale(p.c / p.n)}" r="3.5" fill="${colors[d]}" opacity="0.9"/>`;
    }
  }

  svg += `<text x="${pad.left + plotW / 2}" y="${height - 2}" text-anchor="middle" font-size="12" fill="#57534e">SNR (dB)</text>`;
  svg += `<text x="14" y="${pad.top + plotH / 2}" text-anchor="middle" font-size="12" fill="#57534e" transform="rotate(-90 14 ${pad.top + plotH / 2})">Correct (%)</text>`;
  svg += '</svg>';
  return svg;
}

function toCsv(rows) {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]);
  const esc = (v) => {
    const s = String(v ?? '');
    if (/[",\n]/.test(s)) return '"' + s.replaceAll('"', '""') + '"';
    return s;
  };
  const lines = [keys.join(',')];
  for (const row of rows) {
    lines.push(keys.map(k => esc(row[k])).join(','));
  }
  return lines.join('\n');
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

function correctionPayload() {
  return {
    language: settingsSnapshot.lang,
    stimulus: settingsSnapshot.stimulus || null,
    ear: settingsSnapshot.ear || null,
    earScope: settingsSnapshot.earScope || null,
    targetProbability: latestAnalysis.target,
    chanceLevel: latestAnalysis.chanceLevel,
    meanThresholdDbSnr: round(latestAnalysis.meanThreshold, 3),
    correctionLevelsDbByDigit: latestAnalysis.correctionsArray,
    interpretation: 'Use as digit-level gain in dB. Positive values make a digit louder; negative values make it softer.',
    generatedAt: new Date().toISOString(),
  };
}

function renderAnalysisResults({ summary, analysis, settings, title, subtitle }) {
  clearAutoPlayTimer();
  latestAnalysis = analysis;
  settingsSnapshot = settings;
  resultsTitle.textContent = title;
  resultsSubtitle.textContent = subtitle;
  const isRound = settings.analysisLevel === 'round';
  nextRoundBtn.classList[isRound ? 'remove' : 'add']('hidden');
  restartBtn.textContent = isRound ? 'New participant' : 'Back to setup';
  saveStatus.textContent = '';
  const correctionIssues = OptimizationProtocol.correctionIssues(settings, analysis);
  correctionsOutput.textContent = !correctionIssues.length
    ? JSON.stringify(latestAnalysis.correctionsArray, null, 2)
    : correctionIssues.join('\n');
  downloadCorrectionsBtn.disabled = Boolean(correctionIssues.length);
  copyCorrectionsBtn.disabled = Boolean(correctionIssues.length);
  correctionTable.innerHTML = buildCorrectionTable(latestAnalysis);
  fitTable.innerHTML = buildFitTable(latestAnalysis);
  snrDigitTable.innerHTML = buildSnrDigitTable(summary, settings.snrs);
  digitPiTable.innerHTML = buildDigitPiTable(summary, settings.snrs);
  piPlot.innerHTML = buildPiPlot(latestAnalysis, settings.snrs);

  taskCard.classList.add('hidden');
  calibrationCard.classList.add('hidden');
  setupCard.classList.add('hidden');
  resultsCard.classList.remove('hidden');
}

function showResults() {
  const summary = summarize(responses, settingsSnapshot.snrs);
  const analysis = analyzeOptimization(summary, settingsSnapshot.snrs, settingsSnapshot.targetProbability);
  renderAnalysisResults({
    summary,
    analysis,
    settings: settingsSnapshot,
    title: `Round ${settingsSnapshot.roundNumber} complete`,
    subtitle: `${settingsSnapshot.participantId} | ${EAR_LABELS[settingsSnapshot.ear]} | ${stimulusLabel(settingsSnapshot.lang)}${settingsSnapshot.stimulus ? ` | ${settingsSnapshot.stimulus.version}` : ''}. Round-level results are for QA; final correction levels should come from pooled group data.`,
  });
}

async function handleSubmit() {
  if (!activeTrials()[activeIndex()] || isPlaying || paused || submitting || phase === 'ready' || phase === 'complete' || settingsSnapshot?.analysisLevel !== 'round') return;
  if (!hasPlayedThisTrial) {
    statusEl.textContent = 'Please play the stimulus first.';
    return;
  }
  if (currentInput.length !== 1) {
    statusEl.textContent = 'Enter exactly one digit (0-9).';
    return;
  }
  clearAutoPlayTimer();
  hasPlayedThisTrial = false;
  submitting = true;
  setResponseDisabled(true);

  const trial = activeTrials()[activeIndex()];
  const guess = Number(currentInput);
  const correct = guess === trial.digit;
  const rtMs = playedEndedAt != null ? Math.max(0, performance.now() - playedEndedAt) : null;

  const responseRow = {
    trial: activeIndex() + 1,
    participantId: settingsSnapshot.participantId,
    roundId: settingsSnapshot.roundId,
    roundNumber: settingsSnapshot.roundNumber,
    ear: settingsSnapshot.ear,
    snr: trial.snr,
    effectiveSNR: trial.effectiveSNR ?? null,
    noiseGain: settingsSnapshot.noiseGain,
    target: trial.digit,
    response: guess,
    correct,
    rep: trial.rep,
    limiterGain: trial.limiterGain ?? null,
    outputScale: settingsSnapshot.audioPlan.scale,
    effectiveNoiseGain: settingsSnapshot.noiseGain * settingsSnapshot.audioPlan.scale,
    playbackAttempts: trial.presentations || 1,
    interrupted: Boolean(trial.interrupted),
    phase,
    rtMs: rtMs != null ? Math.round(rtMs) : null,
    playedAtMs: playedAt != null ? Math.round(playedAt) : null,
  };
  if (phase === 'practice') {
    practiceResponses.push(responseRow);
    practiceIndex++;
    if (practiceIndex === practiceTrials.length) phase = 'ready';
  } else {
    responses.push(responseRow);
    trialIndex++;
    if (trialIndex === trialList.length) {
      phase = 'complete';
      settingsSnapshot.completedAt = new Date().toISOString();
    }
  }
  try {
    await checkpointRound();
    if (phase === 'complete') {
      showResults();
      await checkpointRound();
      downloadResultsJson();
    } else if (paused) {
      statusEl.textContent = 'Paused. Resume when ready.';
    } else if (phase === 'ready') {
      showPracticeComplete();
    } else {
      prepareForNextTrial();
      if (settingsSnapshot.autoPlay) scheduleAutoPlay('Next trial');
      else statusEl.textContent = 'Ready for the next trial.';
    }
  } catch {
    if (phase === 'complete') { showResults(); downloadResultsJson(); }
  } finally {
    submitting = false;
  }
}

function readSetupSettings() {
  const snrs = parseSNRList(snrListEl.value);
  const roundNumber = Number(roundNumberEl.value);
  const ear = earEl.value;
  const noiseGain = Number(noiseGainEl.value);
  const targetPct = Number(targetPctEl.value);
  const autoPlayDelayMs = getAutoPlayDelayMs();
  const lang = stimLangEl.value;
  if (profileInvalid) { setSetupMessage('Invalid study link. Return to researcher setup before testing.', true); return null; }
  const minimumParticipants = Number(document.getElementById('minimumParticipants').value);
  if (!Number.isInteger(minimumParticipants) || minimumParticipants < 2 || minimumParticipants > 200) {
    setSetupMessage('Planned participants must be an integer from 2 to 200.', true); return null;
  }

  if (!participantIdEl.value.trim()) {
    setSetupMessage('Enter a participant ID.', true);
    participantIdEl.focus();
    return null;
  }
  if (!Object.hasOwn(EAR_LABELS, ear)) {
    setSetupMessage('Select the ear for this round.', true);
    earEl.focus();
    return null;
  }

  if (!snrs) {
    setSetupMessage('Invalid SNR list. Use unique comma-separated numbers from -40 to +10 dB, with no empty entries.', true);
    return;
  }
  if (!Number.isInteger(roundNumber) || roundNumber < 1 || roundNumber > 9999) {
    setSetupMessage('Round number must be an integer from 1 to 9999.', true);
    return null;
  }
  if (!Number.isFinite(noiseGain) || noiseGain <= 0) {
    setSetupMessage('Masker gain must be > 0.', true);
    return;
  }
  if (!Number.isFinite(targetPct) || targetPct <= CHANCE_LEVEL * 100 || targetPct >= 100) {
    setSetupMessage(`Target must be greater than chance (${Math.round(CHANCE_LEVEL * 100)}%) and less than 100%.`, true);
    return null;
  }

  const sortedSnrs = snrs.slice().sort((a, b) => b - a);
  return {
    analysisLevel: 'round',
    protocolVersion: 'single-round-v3',
    audioEngine: OptimizationProtocol.ENGINE,
    studyId: document.getElementById('studyId').value.trim() || null,
    studyProfile: lockedProfile,
    minimumParticipants,
    practiceEnabled: document.getElementById('practiceEnabled').checked,
    participantId: participantIdEl.value.trim(),
    ear,
    roundNumber,
    lang,
    preset: presetEl.value,
    snrs: sortedSnrs,
    reps: 1,
    trialOrder: orderEl.value,
    targetProbability: targetPct / 100,
    noiseGain,
    showSnr: showSnrEl.checked,
    autoPlay: autoPlayEl.checked,
    autoPlayDelayMs,
  };
}

async function openCalibration() {
  stopCalibrationNoise();
  clearAutoPlayTimer();
  setSetupMessage('');
  pendingSettings = resumeRecord ? structuredClone(resumeRecord.payload.settings) : readSetupSettings();
  if (!pendingSettings) return;
  const openingSettings = pendingSettings;

  calibrationPlayed = false;
  channelConfirmedEl.checked = false;
  channelConfirmedEl.disabled = true;
  const earLabel = EAR_LABELS[pendingSettings.ear];
  calibrationLang.textContent = `${stimulusLabel(pendingSettings.lang)} | ${earLabel} | Round ${pendingSettings.roundNumber}`;
  document.getElementById('channelConfirmationLabel').textContent = pendingSettings.ear === 'both'
    ? 'I hear the noise in both ears.'
    : `I hear the noise only in my ${pendingSettings.ear} ear; the other ear is silent.`;
  calibrationGainEl.disabled = Boolean(resumeRecord);
  updateCalibrationGain(resumeRecord ? pendingSettings.noiseGain : (getStoredCalibrationGain(pendingSettings.lang, pendingSettings.ear) ?? pendingSettings.noiseGain));

  setupCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  taskCard.classList.add('hidden');
  calibrationCard.classList.remove('hidden');
  setCalibrationMessage('Loading calibration audio...');

  try {
    setButtonBusy(calibrationConfirmBtn, true, 'Loading audio...');
    setButtonBusy(calibrationPlayBtn, true, 'Loading audio...');
    if (audioCtx.state !== 'running') await audioCtx.resume();
    prepareStereoOutput();
    if (!buffers || buffers.lang !== pendingSettings.lang) {
      await loadAudio(pendingSettings.lang);
    }
    if (pendingSettings !== openingSettings) return;
    pendingSettings.audioPlan = planAudio(pendingSettings);
    pendingSettings.audioFingerprint = buffers.fingerprint;
    await OptimizationArchive.list();
    setCalibrationMessage(resumeRecord
      ? 'Resuming with the saved masker gain. Keep the same headphones and device volume, and confirm the selected ear again.'
      : 'Play the noise and adjust the masker level. This value will be fixed for the test.');
    setButtonBusy(calibrationConfirmBtn, false);
    calibrationConfirmBtn.disabled = true;
    setButtonBusy(calibrationPlayBtn, false);
  } catch (err) {
    console.error(err);
    setCalibrationMessage(`Audio load failed: ${err.message || err}`, true);
    setButtonBusy(calibrationConfirmBtn, false);
    calibrationConfirmBtn.disabled = true;
    setButtonBusy(calibrationPlayBtn, false);
  }
}

async function beginExperiment(settings) {
  if (!buffers || buffers.lang !== settings.lang) throw new Error('The selected stimulus is not loaded. Return to calibration.');
  if (VERSIONED_STIMULI[settings.lang] && !buffers.stimulus) throw new Error('Verified stimulus information is missing.');
  if (!Object.hasOwn(EAR_LABELS, settings.ear)) throw new Error('Select the ear for this round.');
  stopCalibrationNoise();
  settingsSnapshot = {
    ...settings,
    reps: 1,
    roundId: crypto.randomUUID(),
    audioFingerprint: buffers.fingerprint,
    stimulus: buffers.stimulus || null,
    audioContextSampleRateHz: audioCtx.sampleRate,
    startedAt: new Date().toISOString(),
  };

  trialList = buildTrials(settingsSnapshot.snrs, 1, settingsSnapshot.trialOrder);
  trialIndex = 0;
  responses = [];
  currentInput = '';
  hasPlayedThisTrial = false;
  isPlaying = false;
  playedAt = null;
  playedEndedAt = null;
  latestAnalysis = null;
  paused = false;
  practiceIndex = 0;
  practiceResponses = [];
  practiceTrials = settings.practiceEnabled ? shuffle(DIGITS).slice(0, 3).map(digit => ({ digit, snr: 0, rep: 0 })) : [];
  phase = practiceTrials.length ? 'practice' : 'formal';
  pauseBtn.textContent = 'Pause';
  formalStartBtn.classList.add('hidden');
  formalStartBtn.disabled = false;
  await checkpointRound();

  setupCard.classList.add('hidden');
  calibrationCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  taskCard.classList.remove('hidden');

  prepareForNextTrial();
  if (settingsSnapshot.autoPlay) {
    if (audioCtx.state !== 'running') {
      audioCtx.resume().catch(() => {});
    }
    scheduleAutoPlay('First trial');
  } else {
    statusEl.textContent = 'Press Play to hear one digit.';
  }
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(reader.error || new Error(`Cannot read ${file.name}`));
    reader.readAsText(file);
  });
}

function normalizeImportedResponses(payload, sourceName) {
  const settings = payload && typeof payload === 'object' && !Array.isArray(payload) ? (payload.settings || {}) : {};
  const rawRows = Array.isArray(payload) ? payload : payload.responses;
  if (!Array.isArray(rawRows)) {
    throw new Error(`${sourceName}: no responses array found`);
  }

  const participantKey = settings.participantId || sourceName;
  if (settings.analysisLevel === 'round' && (!settings.roundId || !settings.participantId ||
      !Object.hasOwn(EAR_LABELS, settings.ear) || !Number.isInteger(settings.roundNumber) || settings.roundNumber < 1)) {
    throw new Error(`${sourceName}: incomplete round identity`);
  }
  if (payload.schemaVersion >= 3 && settings.analysisLevel === 'round' &&
      (!settings.completedAt || payload.nCompleted !== payload.nTrials || rawRows.length !== payload.nTrials)) {
    throw new Error(`${sourceName}: incomplete round. Resume the local backup before group analysis.`);
  }
  return rawRows.map((row, index) => {
    if (row.phase && row.phase !== 'formal') throw new Error(`${sourceName}: practice data cannot enter formal analysis.`);
    const snr = Number(row.snr);
    const target = Number(row.target ?? row.digit);
    const response = Number(row.response);
    if (!Number.isFinite(snr) || !DIGITS.includes(target)) {
      throw new Error(`${sourceName}: invalid response row ${index + 1}`);
    }
    for (const field of ['roundId', 'roundNumber', 'ear', 'participantId']) {
      if (settings.analysisLevel === 'round' && row[field] != null && row[field] !== settings[field]) {
        throw new Error(`${sourceName}: inconsistent ${field} in response row ${index + 1}`);
      }
    }
    const ear = row.ear ?? settings.ear ?? 'unknown';
    if (ear !== 'unknown' && !Object.hasOwn(EAR_LABELS, ear)) {
      throw new Error(`${sourceName}: invalid ear in response row ${index + 1}`);
    }
    const correct = typeof row.correct === 'boolean'
      ? row.correct
      : Number.isFinite(response) && response === target;
    return {
      trial: row.trial ?? index + 1,
      snr,
      effectiveSNR: row.effectiveSNR ?? null,
      noiseGain: row.noiseGain ?? settings.noiseGain ?? null,
      limiterGain: row.limiterGain ?? null,
      outputScale: row.outputScale ?? settings.audioPlan?.scale ?? null,
      effectiveNoiseGain: row.effectiveNoiseGain ?? null,
      interrupted: Boolean(row.interrupted),
      playbackAttempts: row.playbackAttempts ?? null,
      phase: row.phase || 'formal',
      target,
      response: Number.isFinite(response) ? response : null,
      correct,
      rep: row.rep ?? null,
      rtMs: row.rtMs ?? null,
      participantId: row.participantId || participantKey,
      ear,
      roundId: row.roundId ?? settings.roundId ?? null,
      roundNumber: row.roundNumber ?? settings.roundNumber ?? null,
      sourceFile: sourceName,
    };
  });
}

function selectGroupResponses(rows, scope) {
  const mode = ear => ear === 'left' || ear === 'right' ? 'monaural' : ear;
  if (scope === 'auto') {
    const modes = new Set(rows.map(row => mode(row.ear)));
    if (modes.size > 1) {
      throw new Error('Single-ear, both-ear, and legacy recordings cannot be pooled together. Choose an ear selection.');
    }
    scope = [...modes][0] || 'unknown';
  }
  if (!['monaural', 'left', 'right', 'both', 'unknown'].includes(scope)) throw new Error('Invalid ear selection.');
  const selected = rows.filter(row => scope === 'monaural' ? mode(row.ear) === scope : row.ear === scope);
  if (!selected.length) throw new Error('No responses match the selected ear.');
  return { rows: selected, scope, excluded: rows.length - selected.length };
}

function importGroupPayloads(entries, earScope) {
  const imported = [];
  const importedSettings = [];
  const seenExports = new Set();
  const seenRoundIds = new Set();
  for (const { payload, name } of entries) {
    // Export time and fit results may change; recording identity must not.
    const canonical = JSON.stringify({ settings: payload.settings || {}, responses: payload.responses || payload });
    if (seenExports.has(canonical)) throw new Error('The same recording was selected more than once.');
    seenExports.add(canonical);
    const rows = normalizeImportedResponses(payload, name);
    const roundIds = new Set(rows.map(row => row.roundId).filter(Boolean));
    if (payload.settings?.roundId) roundIds.add(payload.settings.roundId);
    for (const id of roundIds) {
      if (seenRoundIds.has(id)) throw new Error(`Duplicate round ID in ${name}. Select each round only once.`);
      seenRoundIds.add(id);
    }
    const seenTrials = new Set();
    for (const row of rows) {
      if (!row.roundId) continue;
      const key = `${row.roundId}:${row.trial}`;
      if (seenTrials.has(key)) throw new Error(`Duplicate trial in ${name}.`);
      seenTrials.add(key);
    }
    importedSettings.push(payload.settings || {});
    imported.push(...rows);
  }
  const material = validateGroupMaterials(importedSettings);
  const selected = selectGroupResponses(imported, earScope);
  return { ...selected, material };
}

function validateGroupMaterials(settingsList) {
  const identities = settingsList.map(settings => {
    const lang = settings.lang || 'unknown';
    const stimulus = settings.stimulus;
    if (VERSIONED_STIMULI[lang] || stimulus) {
      if (!stimulus || stimulus.id !== lang || !stimulus.version ||
          !/^[a-f0-9]{64}$/.test(stimulus.manifestSha256 || '')) {
        throw new Error('Missing or inconsistent stimulus provenance. Use full JSON exports from the same material version.');
      }
      if (VERSIONED_STIMULI[lang] && !settings.participantId) {
        throw new Error('Spanish optimization exports must have a participant ID.');
      }
      return `${lang}:${stimulus.version}:${stimulus.manifestSha256}`;
    }
    if (lang === 'mixed') throw new Error('Previously pooled mixed-language data cannot produce language-specific corrections.');
    return `${lang}:legacy`;
  });
  if (new Set(identities).size !== 1) {
    throw new Error('Different languages, voices, or stimulus versions cannot be pooled. Analyze Spanish male and female separately.');
  }
  const protocolKey = settings => settings.collectionProtocolKey || (settings.audioEngine
    ? JSON.stringify([settings.audioEngine, settings.audioFingerprint, settings.studyId || null, settings.snrs, settings.trialOrder, Boolean(settings.practiceEnabled)])
    : 'legacy');
  const protocols = settingsList.map(protocolKey);
  if (new Set(protocols).size !== 1) throw new Error('Different playback protocols, study IDs, audio fingerprints, or collection settings cannot be pooled. Analyze these datasets separately.');
  return { lang: settingsList[0].lang || 'unknown', stimulus: settingsList[0].stimulus || null,
    audioEngine: settingsList[0].audioEngine || null, audioFingerprint: settingsList[0].audioFingerprint || null,
    studyId: settingsList[0].studyId || null, collectionProtocolKey: protocols[0] };
}

async function analyzeGroupJsonFiles() {
  const files = Array.from(groupJsonFilesEl.files || []);
  if (!files.length) {
    groupMsg.textContent = 'Choose one or more full JSON exports first.';
    groupMsg.style.color = '#b91c1c';
    return;
  }

  const targetPct = Number(targetPctEl.value);
  const minimumParticipants = Number(document.getElementById('minimumParticipants').value);
  if (!Number.isInteger(minimumParticipants) || minimumParticipants < 2 || minimumParticipants > 200) {
    groupMsg.textContent = 'Planned participant count must be an integer from 2 to 200.'; return;
  }
  if (!Number.isFinite(targetPct) || targetPct <= CHANCE_LEVEL * 100 || targetPct >= 100) {
    groupMsg.textContent = `Target must be greater than chance (${Math.round(CHANCE_LEVEL * 100)}%) and less than 100%.`;
    groupMsg.style.color = '#b91c1c';
    return;
  }

  try {
    const entries = [];
    for (const file of files) {
      const text = await readFileAsText(file);
      const payload = JSON.parse(text);
      entries.push({ payload, name: file.name });
    }
    const { rows: imported, material: groupMaterial, scope, excluded } = importGroupPayloads(entries, groupEarScopeEl.value);

    const snrs = Array.from(new Set(imported.map(r => r.snr))).sort((a, b) => b - a);
    const participants = Array.from(new Set(imported.map(r => r.participantId || r.sourceFile)));
    const groupSettings = {
      analysisLevel: 'group',
      participantId: 'group-analysis',
      lang: groupMaterial.lang,
      stimulus: groupMaterial.stimulus,
      audioEngine: groupMaterial.audioEngine,
      audioFingerprint: groupMaterial.audioFingerprint,
      studyId: groupMaterial.studyId,
      collectionProtocolKey: groupMaterial.collectionProtocolKey,
      minimumParticipants,
      preset: 'group-import',
      snrs,
      reps: null,
      trialOrder: 'imported',
      targetProbability: targetPct / 100,
      noiseGain: null,
      showSnr: true,
      groupNFiles: files.length,
      groupNParticipants: participants.length,
      groupNRounds: new Set(imported.map(r => r.roundId).filter(Boolean)).size,
      earScope: scope,
      earCounts: Object.fromEntries(['left', 'right', 'both', 'unknown'].map(ear => [ear, imported.filter(r => r.ear === ear).length])),
      excludedTrials: excluded,
      startedAt: new Date().toISOString(),
    };

    responses = imported;
    trialList = [];
    practiceResponses = [];
    const summary = summarize(responses, snrs);
    const analysis = analyzeOptimization(summary, snrs, groupSettings.targetProbability);
    renderAnalysisResults({
      summary,
      analysis,
      settings: groupSettings,
      title: 'Group Optimization Results',
      subtitle: `${stimulusLabel(groupSettings.lang)}${groupSettings.stimulus ? ` | ${groupSettings.stimulus.version}` : ''} | ${scope}. ${imported.length} trials from ${participants.length} participant IDs; ${groupSettings.groupNRounds} identified rounds. ${excluded} trials excluded by ear selection. Legacy recordings may not have round IDs.`,
    });

    const participantNote = participants.length < minimumParticipants
      ? ` Loaded ${participants.length}; this analysis plan requires ${minimumParticipants} participant IDs.`
      : '';
    groupMsg.textContent = `Loaded ${files.length} JSON file(s), ${imported.length} responses; ${excluded} excluded by ear selection.${participantNote}`;
    groupMsg.style.color = '#5f666d';
  } catch (err) {
    console.error(err);
    groupMsg.textContent = `Group analysis failed: ${err.message || err}`;
    groupMsg.style.color = '#b91c1c';
  }
}

function markPresetCustom() {
  if (!applyingPreset && presetEl.value !== 'custom') {
    presetEl.value = 'custom';
  }
  updateTrialCount();
}

presetEl.addEventListener('change', () => {
  const preset = presets[presetEl.value];
  if (!preset) return;
  applyingPreset = true;
  snrListEl.value = preset.snrs;
  orderEl.value = preset.order;
  applyingPreset = false;
  updateTrialCount();
});

[snrListEl, targetPctEl].forEach(el => el.addEventListener('input', markPresetCustom));
[orderEl, showSnrEl].forEach(el => el.addEventListener('change', markPresetCustom));

analyzeGroupBtn.addEventListener('click', analyzeGroupJsonFiles);
groupJsonFilesEl.addEventListener('change', () => {
  groupMsg.textContent = '';
});
groupEarScopeEl.addEventListener('change', () => { groupMsg.textContent = ''; });

preloadBtn.addEventListener('click', async () => {
  setButtonBusy(preloadBtn, true, 'Loading audio...');
  startBtn.disabled = true;
  stimLangEl.disabled = true;
  try {
    if (audioCtx.state !== 'running') await audioCtx.resume();
    await loadAudio(stimLangEl.value);
  } catch (err) {
    console.error(err);
    setSetupMessage(`Audio preload failed: ${err.message || err}`, true);
  } finally {
    setButtonBusy(preloadBtn, false);
    startBtn.disabled = false;
    stimLangEl.disabled = false;
    if (lockedProfile) setProfileLock(lockedProfile);
  }
});

startBtn.addEventListener('click', async () => {
  setButtonBusy(startBtn, true, 'Preparing...');
  try {
    await openCalibration();
  } catch (err) {
    console.error(err);
    setSetupMessage(`Calibration setup failed: ${err.message || err}`, true);
  } finally {
    setButtonBusy(startBtn, false);
  }
});
calibrationPlayBtn.addEventListener('click', () => {
  startCalibrationNoise().catch((err) => {
    console.error(err);
    setCalibrationMessage(`Noise playback failed: ${err.message || err}`, true);
  });
});
calibrationStopBtn.addEventListener('click', () => {
  stopCalibrationNoise();
  setCalibrationMessage('Noise stopped. Adjust or confirm the fixed masker level.');
});
calibrationBackBtn.addEventListener('click', () => {
  stopCalibrationNoise();
  calibrationCard.classList.add('hidden');
  setupCard.classList.remove('hidden');
  pendingSettings = null;
  resumeRecord = null;
  setSetupMessage('Calibration cancelled. Adjust setup if needed.');
});
calibrationGainEl.addEventListener('input', (e) => {
  const gain = updateCalibrationGain(e.target.value);
  setCalibrationMessage(`Masker level set to ${gain.toFixed(2)}. Confirm this level when ready.`);
});
channelConfirmedEl.addEventListener('change', () => {
  calibrationConfirmBtn.disabled = !calibrationPlayed || !channelConfirmedEl.checked;
});
calibrationConfirmBtn.addEventListener('click', async () => {
  if (!calibrationPlayed || !channelConfirmedEl.checked) {
    setCalibrationMessage('Play the noise and confirm the selected ear(s) before starting.', true);
    return;
  }
  setButtonBusy(calibrationConfirmBtn, true, 'Starting test...');
  const gain = updateCalibrationGain(calibrationGainEl.value);
  if (!pendingSettings) {
    setCalibrationMessage('Setup information is missing. Return to setup and try again.', true);
    setButtonBusy(calibrationConfirmBtn, false);
    return;
  }

  try {
    stopCalibrationNoise();
    if (!buffers || buffers.lang !== pendingSettings.lang) await loadAudio(pendingSettings.lang);
    rememberCalibrationGain(pendingSettings.lang, pendingSettings.ear, gain);
    noiseGainEl.value = gain.toFixed(2);
    const calibratedAt = new Date().toISOString();
    const calibratedSettings = {
      ...pendingSettings,
      noiseGain: gain,
      calibration: {
        type: 'user_adjusted_noise_loop',
        maskerGain: gain,
        language: pendingSettings.lang,
        ear: pendingSettings.ear,
        channelConfirmed: true,
        outputChannels: 2,
        outputScale: pendingSettings.audioPlan.scale,
        effectiveNoiseGain: gain * pendingSettings.audioPlan.scale,
        audioEngine: OptimizationProtocol.ENGINE,
        calibratedAt,
        note: 'User-adjusted level for this ear and round; not a measured dBA calibration.',
      },
    };

    if (audioCtx.state !== 'running') {
      try { await audioCtx.resume(); } catch {}
    }
    if (resumeRecord) await restoreExperiment(calibratedSettings);
    else await beginExperiment(calibratedSettings);
  } catch (err) {
    console.error(err);
    setCalibrationMessage(`Could not start the test: ${err.message || err}`, true);
    setButtonBusy(calibrationConfirmBtn, false);
  }
});
playBtn.addEventListener('click', () => playCurrentTrial(false));
submitBtn.addEventListener('click', handleSubmit);
clearBtn.addEventListener('click', clearInput);

keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-val]');
  if (!btn || btn.disabled) return;
  appendInput(btn.dataset.val);
});

document.addEventListener('keydown', (e) => {
  if (taskCard.classList.contains('hidden') || paused || submitting || phase === 'ready') return;
  if (e.key >= '0' && e.key <= '9' && !submitBtn.disabled) {
    appendInput(e.key);
  } else if (e.key === 'Backspace' && !clearBtn.disabled) {
    clearInput();
  } else if (e.key === 'Enter' && !submitBtn.disabled) {
    handleSubmit();
  }
});

function exportFilename(kind, extension) {
  const id = String(settingsSnapshot.participantId || 'anonymous').replace(/[^a-zA-Z0-9_-]/g, '_');
  const date = String(settingsSnapshot.startedAt || new Date().toISOString()).replace(/[^0-9TZ]/g, '');
  const round = settingsSnapshot.roundId
    ? `-${settingsSnapshot.ear}-round${settingsSnapshot.roundNumber}-${settingsSnapshot.roundId.slice(0, 8)}`
    : `-${settingsSnapshot.earScope || 'legacy'}`;
  return `digit-optimization-${settingsSnapshot.lang}-${id}${round}-${date}-${kind}.${extension}`;
}

downloadCsvBtn.addEventListener('click', () => {
  const rows = responses.map(r => ({
    ...r,
    participantId: r.participantId ?? settingsSnapshot.participantId,
    lang: settingsSnapshot.lang,
    reps: settingsSnapshot.reps,
    snrList: settingsSnapshot.snrs.join('|'),
    targetProbability: settingsSnapshot.targetProbability,
    calibratedNoiseGain: settingsSnapshot.noiseGain ?? r.noiseGain ?? null,
    stimulusVersion: settingsSnapshot.stimulus?.version || null,
    stimulusManifestSha256: settingsSnapshot.stimulus?.manifestSha256 || null,
    stimulusVoice: settingsSnapshot.stimulus?.voice || null,
    roundId: r.roundId ?? settingsSnapshot.roundId ?? null,
    roundNumber: r.roundNumber ?? settingsSnapshot.roundNumber ?? null,
    ear: r.ear ?? settingsSnapshot.ear ?? 'unknown',
  }));
  downloadFile(exportFilename('raw', 'csv'), toCsv(rows), 'text/csv;charset=utf-8');
});

function resultsPayload() {
  return {
    schemaVersion: 3,
    settings: settingsSnapshot,
    nTrials: trialList.length || responses.length,
    nCompleted: responses.length,
    responses,
    practiceResponses,
    analysis: latestAnalysis,
    correctionExport: latestAnalysis ? (() => {
      const issues = OptimizationProtocol.correctionIssues(settingsSnapshot, latestAnalysis);
      return { eligible: issues.length === 0, issues };
    })() : null,
    exportedAt: new Date().toISOString(),
  };
}

async function checkpointRound() {
  const record = structuredClone({ id: settingsSnapshot.roundId, updatedAt: new Date().toISOString(),
    completed: Boolean(settingsSnapshot.completedAt), payload: resultsPayload(),
    trialList, trialIndex, practiceTrials, practiceIndex, phase });
  archiveQueue = archiveQueue.catch(() => {}).then(() => OptimizationArchive.put(record));
  try {
    await archiveQueue;
    archiveError = false;
    checkpointStatus.textContent = `Local backup: ${responses.length} / ${trialList.length} formal responses.`;
  } catch (error) {
    archiveError = true;
    paused = true;
    clearAutoPlayTimer();
    setResponseDisabled(true);
    playBtn.disabled = true;
    pauseBtn.textContent = 'Retry backup and resume';
    checkpointStatus.textContent = 'Local backup failed. Keep this page open. Free browser storage, then retry.';
    throw error;
  }
}

function showPracticeComplete() {
  clearAutoPlayTimer();
  statusEl.textContent = `Practice complete: ${practiceResponses.filter(row => row.correct).length} / ${practiceResponses.length} correct. Take a break before the formal round.`;
  setResponseDisabled(true);
  playBtn.disabled = true;
  formalStartBtn.classList.remove('hidden');
}

formalStartBtn.addEventListener('click', async () => {
  if (phase !== 'ready' || paused || submitting) return;
  phase = 'formal';
  formalStartBtn.classList.add('hidden');
  try {
    await checkpointRound();
    prepareForNextTrial();
    if (settingsSnapshot.autoPlay) scheduleAutoPlay('First formal trial');
  } catch { /* checkpointRound keeps the round paused until storage recovers. */ }
});

function pauseRound(interrupted = false) {
  if (!settingsSnapshot || phase === 'complete') return;
  paused = true;
  clearAutoPlayTimer();
  if (interrupted && isPlaying) {
    const trial = activeTrials()[activeIndex()];
    trial.interrupted = true;
    trial.needsReplay = true;
  }
  setResponseDisabled(true);
  playBtn.disabled = true;
  formalStartBtn.disabled = true;
  pauseBtn.textContent = 'Resume';
  statusEl.textContent = isPlaying ? 'Audio will finish; the round is paused.' : 'Paused. Resume when ready.';
}

pauseBtn.addEventListener('click', async () => {
  if (!paused) { pauseRound(); return; }
  if (isPlaying || submitting) return;
  try {
    await checkpointRound();
    paused = false;
    pauseBtn.textContent = 'Pause';
    formalStartBtn.disabled = false;
    if (phase === 'complete') { showResults(); return; }
    if (phase === 'ready') { showPracticeComplete(); return; }
    const trial = activeTrials()[activeIndex()];
    if (trial.needsReplay) {
      trial.needsReplay = false;
      prepareForNextTrial();
      statusEl.textContent = 'Interrupted audio. Play this trial again; the interruption is recorded.';
    } else if (hasPlayedThisTrial) {
      setResponseDisabled(false);
      statusEl.textContent = 'Enter the digit you heard.';
    } else {
      prepareForNextTrial();
      if (settingsSnapshot.autoPlay) scheduleAutoPlay('Resuming');
    }
  } catch { /* Keep the recovery controls available. */ }
});

async function refreshArchive() {
  const status = document.getElementById('archiveStatus');
  try {
    const records = (await OptimizationArchive.list()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    document.getElementById('archiveList').innerHTML = records.length
      ? '<table><thead><tr><th>Participant</th><th>Voice / ear</th><th>Round</th><th>Progress</th><th>Actions</th></tr></thead><tbody>' + records.map(record => {
        const settings = record.payload.settings;
        return `<tr><td>${escapeHtml(settings.participantId)}</td><td>${escapeHtml(stimulusLabel(settings.lang))} / ${escapeHtml(EAR_LABELS[settings.ear])}</td><td>${escapeHtml(settings.roundNumber)}</td><td>${record.completed ? 'Complete' : 'Interrupted'}: ${record.payload.nCompleted} / ${record.trialList.length}</td><td><button data-archive="download" data-id="${escapeHtml(record.id)}">Download JSON</button> ${record.completed ? '' : `<button data-archive="resume" data-id="${escapeHtml(record.id)}">Resume</button>`} <button data-archive="delete" data-id="${escapeHtml(record.id)}">Delete local copy</button></td></tr>`;
      }).join('') + '</tbody></table>' : '';
    status.textContent = `${records.length} locally backed-up round(s).`;
  } catch {
    status.textContent = 'Local archive unavailable. Browser storage is required before starting a round.';
  }
}

function fillSetup(settings) {
  participantIdEl.value = settings.participantId || '';
  stimLangEl.value = settings.lang;
  earEl.value = settings.ear || '';
  roundNumberEl.value = String(settings.roundNumber || 1);
  snrListEl.value = settings.snrs.join(',');
  orderEl.value = settings.trialOrder;
  targetPctEl.value = String(settings.targetProbability * 100);
  document.getElementById('studyId').value = settings.studyId || '';
  document.getElementById('minimumParticipants').value = String(settings.minimumParticipants || 20);
  document.getElementById('practiceEnabled').checked = Boolean(settings.practiceEnabled);
  autoPlayEl.checked = Boolean(settings.autoPlay);
  autoPlayDelayEl.value = String(settings.autoPlayDelayMs || 800);
  presetEl.value = 'custom';
  updateStimulusInfo();
  updateTrialCount();
}

document.getElementById('refreshArchive').addEventListener('click', refreshArchive);
document.getElementById('archiveList').addEventListener('click', async event => {
  const button = event.target.closest('button[data-archive]');
  if (!button) return;
  try {
    const record = await OptimizationArchive.get(button.dataset.id);
    if (!record) throw new Error('This local round is no longer available.');
    if (button.dataset.archive === 'download') {
      downloadFile(`digit-optimization-${record.id}.json`, JSON.stringify(record.payload, null, 2), 'application/json;charset=utf-8');
    } else if (button.dataset.archive === 'delete') {
      if (window.confirm('Delete this browser copy? Downloaded files will not be removed.')) await OptimizationArchive.remove(record.id);
      await refreshArchive();
    } else {
      if (record.completed || record.payload.schemaVersion !== 3 || record.payload.settings.audioEngine !== OptimizationProtocol.ENGINE || record.trialIndex !== record.payload.responses.length) throw new Error('This recording cannot be resumed. Download its JSON instead.');
      if (lockedProfile && !OptimizationProtocol.matchesProfile(lockedProfile, record.payload.settings)) throw new Error('This round uses a different study configuration. Return to researcher setup first.');
      resumeRecord = record;
      fillSetup(record.payload.settings);
      await openCalibration();
    }
  } catch (error) { setSetupMessage(error.message, true); }
});

async function restoreExperiment(calibratedSettings) {
  const saved = structuredClone(resumeRecord);
  settingsSnapshot = structuredClone(saved.payload.settings);
  settingsSnapshot.resumeEvents = [...(settingsSnapshot.resumeEvents || []), { at: new Date().toISOString(), completedTrials: saved.trialIndex, earConfirmed: calibratedSettings.calibration.channelConfirmed }];
  trialList = saved.trialList;
  trialIndex = saved.trialIndex;
  responses = saved.payload.responses;
  practiceTrials = saved.practiceTrials;
  practiceIndex = saved.practiceIndex;
  practiceResponses = saved.payload.practiceResponses || [];
  phase = saved.phase;
  const trial = activeTrials()[activeIndex()];
  if (trial?.presentations) trial.interrupted = true;
  isPlaying = false;
  paused = false;
  hasPlayedThisTrial = false;
  latestAnalysis = null;
  formalStartBtn.classList.add('hidden');
  formalStartBtn.disabled = false;
  pauseBtn.textContent = 'Pause';
  await checkpointRound();
  resumeRecord = null;
  setupCard.classList.add('hidden');
  calibrationCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  taskCard.classList.remove('hidden');
  if (phase === 'ready') showPracticeComplete();
  else {
    prepareForNextTrial();
    statusEl.textContent = trial?.interrupted ? 'Recovered round. Replay the interrupted trial; it will be flagged.' : 'Recovered round. Press Play when ready.';
  }
}

const profileControls = ['studyId', 'stimLang', 'designPreset', 'snrList', 'trialOrder', 'targetPct', 'minimumParticipants', 'practiceEnabled', 'autoPlay', 'autoPlayDelay', 'showSnr'];
function setProfileLock(profile) {
  lockedProfile = profile;
  profileControls.forEach(id => { document.getElementById(id).disabled = Boolean(profile); });
  document.getElementById('unlockStudy').classList[profile ? 'remove' : 'add']('hidden');
  document.getElementById('studyStatus').textContent = profile ? `Study ${profile.studyId}: configuration locked.` : 'Researcher setup';
}
document.getElementById('createStudyLink').addEventListener('click', () => {
  try {
    const profile = OptimizationProtocol.validateProfile({ version: 1, studyId: document.getElementById('studyId').value.trim(), lang: stimLangEl.value,
      snrs: parseSNRList(snrListEl.value), trialOrder: orderEl.value, targetProbability: Number(targetPctEl.value) / 100,
      minimumParticipants: Number(document.getElementById('minimumParticipants').value), practiceEnabled: document.getElementById('practiceEnabled').checked,
      autoPlay: autoPlayEl.checked, autoPlayDelayMs: getAutoPlayDelayMs() });
    const url = new URL(window.location.href);
    url.search = '';
    url.hash = '';
    url.searchParams.set('study', btoa(JSON.stringify(profile)));
    document.getElementById('studyLink').value = url.href;
    document.getElementById('studyLinkLabel').classList.remove('hidden');
    document.getElementById('studyStatus').textContent = 'Study link ready. Participant ID, round and ear remain selectable.';
  } catch (error) { document.getElementById('studyStatus').textContent = `${error.message} Set a study ID and at least three SNR levels.`; }
});
document.getElementById('unlockStudy').addEventListener('click', () => {
  profileInvalid = false;
  setProfileLock(null);
  const url = new URL(window.location.href);
  url.searchParams.delete('study');
  history.replaceState(null, '', url);
});
function loadStudyLink() {
  const encoded = new URL(window.location.href).searchParams.get('study');
  if (!encoded) return;
  try {
    const profile = OptimizationProtocol.validateProfile(JSON.parse(atob(encoded)));
    fillSetup(profile);
    showSnrEl.checked = false;
    setProfileLock(profile);
  } catch {
    profileInvalid = true;
    document.getElementById('unlockStudy').classList.remove('hidden');
    document.getElementById('studyStatus').textContent = 'Invalid study link. No study settings were applied.';
  }
}

function downloadResultsJson() {
  try {
    downloadFile(exportFilename('results', 'json'), JSON.stringify(resultsPayload(), null, 2), 'application/json;charset=utf-8');
    const backupNote = settingsSnapshot.analysisLevel === 'round' ? (archiveError ? 'Local backup failed. ' : 'Local browser backup available. ') : '';
    saveStatus.textContent = `${backupNote}JSON download requested. Confirm it in Downloads. Results are not uploaded to a server.`;
    saveStatus.style.color = '#5f666d';
  } catch {
    saveStatus.textContent = 'Download could not start. Keep this page open and retry Download full JSON.';
    saveStatus.style.color = '#b91c1c';
  }
}
downloadJsonBtn.addEventListener('click', downloadResultsJson);

downloadCorrectionsBtn.addEventListener('click', () => {
  if (OptimizationProtocol.correctionIssues(settingsSnapshot, latestAnalysis).length) return;
  downloadFile(`${settingsSnapshot.lang}-corrections.json`, JSON.stringify(latestAnalysis.correctionsArray, null, 2), 'application/json;charset=utf-8');
});

copyCorrectionsBtn.addEventListener('click', async () => {
  if (OptimizationProtocol.correctionIssues(settingsSnapshot, latestAnalysis).length) return;
  const text = JSON.stringify(latestAnalysis.correctionsArray);
  try {
    await navigator.clipboard.writeText(text);
    copyCorrectionsBtn.textContent = 'Copied';
    setTimeout(() => { copyCorrectionsBtn.textContent = 'Copy corrections array'; }, 1200);
  } catch {
    correctionsOutput.focus();
  }
});

function returnToSetup() {
  clearAutoPlayTimer();
  stopCalibrationNoise();
  taskCard.classList.add('hidden');
  calibrationCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  setupCard.classList.remove('hidden');
  setSetupMessage('');
  updateTrialCount();
  refreshArchive();
}

nextRoundBtn.addEventListener('click', () => {
  if (settingsSnapshot?.analysisLevel !== 'round') return;
  roundNumberEl.value = String(settingsSnapshot.roundNumber + 1);
  earEl.value = '';
  returnToSetup();
  setSetupMessage(`Ready for round ${roundNumberEl.value}. Previous round: ${EAR_LABELS[settingsSnapshot.ear]}.`);
  earEl.focus();
});

restartBtn.addEventListener('click', () => {
  if (settingsSnapshot?.analysisLevel === 'round') {
    participantIdEl.value = '';
    roundNumberEl.value = '1';
    earEl.value = '';
  }
  returnToSetup();
});

window.addEventListener('pagehide', () => {
  clearAutoPlayTimer();
  stopCalibrationNoise();
});
document.addEventListener('visibilitychange', () => {
  if (document.hidden && !taskCard.classList.contains('hidden')) pauseRound(true);
});
window.addEventListener('beforeunload', event => {
  if (settingsSnapshot?.analysisLevel === 'round' && responses.length && !settingsSnapshot.completedAt) {
    event.preventDefault();
    event.returnValue = '';
  }
});

stimLangEl.addEventListener('change', () => {
  updateStimulusInfo();
  setSetupMessage(audioCache.has(stimLangEl.value) ? `Audio ready for ${stimulusLabel(stimLangEl.value)}.` : '');
});
updateStimulusInfo();
updateTrialCount();
loadStudyLink();
refreshArchive();
