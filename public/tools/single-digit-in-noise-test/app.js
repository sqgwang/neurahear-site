const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const setupCard = document.getElementById('setupCard');
const taskCard = document.getElementById('taskCard');
const resultsCard = document.getElementById('resultsCard');

const stimLangEl = document.getElementById('stimLang');
const snrListEl = document.getElementById('snrList');
const repsEl = document.getElementById('reps');
const noiseGainEl = document.getElementById('noiseGain');
const setupMsg = document.getElementById('setupMsg');

const preloadBtn = document.getElementById('preloadBtn');
const startBtn = document.getElementById('startBtn');
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
const restartBtn = document.getElementById('restartBtn');

const snrDigitTable = document.getElementById('snrDigitTable');
const digitPiTable = document.getElementById('digitPiTable');

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

function parseSNRList(raw) {
  const arr = String(raw)
    .split(',')
    .map(s => Number(s.trim()))
    .filter(v => Number.isFinite(v));
  if (!arr.length) return null;
  return arr;
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

function setSetupMessage(msg, isError = false) {
  setupMsg.textContent = msg;
  setupMsg.style.color = isError ? '#b91c1c' : '#475569';
}

function updateTaskUI() {
  const total = trialList.length;
  progressEl.textContent = `Trial ${Math.min(trialIndex + 1, total)} / ${total}`;

  const trial = trialList[trialIndex];
  currentSNREl.textContent = trial ? `SNR: ${trial.snr} dB` : 'SNR: --';
  inputDisplay.textContent = currentInput;
}

async function loadAudio(lang) {
  setSetupMessage(`Loading audio for ${lang} ...`);
  const base = `../digit-in-noise-test/audio/${lang}`;

  const digitBuffers = [];
  for (let digit = 0; digit <= 9; digit++) {
    const r = await fetch(`${base}/${digit}.wav`);
    if (!r.ok) throw new Error(`Cannot load ${digit}.wav for ${lang}`);
    const ab = await r.arrayBuffer();
    digitBuffers.push(await audioCtx.decodeAudioData(ab.slice(0)));
  }

  const noiseResp = await fetch(`${base}/noise.wav`);
  if (!noiseResp.ok) throw new Error(`Cannot load noise.wav for ${lang}`);
  const noiseAb = await noiseResp.arrayBuffer();
  const noiseBuffer = await audioCtx.decodeAudioData(noiseAb.slice(0));

  buffers = { lang, digitBuffers, noiseBuffer };
  setSetupMessage(`Audio ready for ${lang}.`);
}

function buildTrials(snrs, repsPerDigit) {
  const list = [];
  for (const snr of snrs) {
    for (let rep = 0; rep < repsPerDigit; rep++) {
      for (let digit = 0; digit <= 9; digit++) {
        list.push({ snr, digit });
      }
    }
  }
  return shuffle(list);
}

async function renderAndPlaySingleDigit({ digit, snr, noiseGain }) {
  const sr = buffers.digitBuffers[0].sampleRate;
  const prePad = Math.round(0.25 * sr);
  const postPad = Math.round(0.25 * sr);

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
  const noiseRms = rms(noiseCenter) || 1e-9;

  const currentSNR = 20 * Math.log10(signalRms / noiseRms);
  const targetGain = Math.pow(10, (snr - currentSNR) / 20);

  const mixed = new Float32Array(totalLen);
  for (let i = 0; i < totalLen; i++) {
    mixed[i] += noise[i] * noiseGain;
  }
  for (let i = 0; i < signal.length; i++) {
    mixed[prePad + i] += signal[i] * targetGain;
  }

  let maxAbs = 0;
  for (let i = 0; i < mixed.length; i++) {
    const a = Math.abs(mixed[i]);
    if (a > maxAbs) maxAbs = a;
  }
  if (maxAbs > 0.99) {
    const down = 0.99 / maxAbs;
    for (let i = 0; i < mixed.length; i++) mixed[i] *= down;
  }

  const out = audioCtx.createBuffer(1, totalLen, sr);
  out.copyToChannel(mixed, 0, 0);

  await new Promise((resolve) => {
    const src = audioCtx.createBufferSource();
    src.buffer = out;
    src.connect(audioCtx.destination);
    src.onended = resolve;
    src.start();
  });
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

function setTaskButtonsDisabled(disabled) {
  playBtn.disabled = disabled;
  submitBtn.disabled = disabled;
  clearBtn.disabled = disabled;
  keypad.querySelectorAll('button[data-val]').forEach(btn => {
    btn.disabled = disabled;
  });
}

async function handlePlay() {
  if (isPlaying) return;
  if (!trialList[trialIndex]) return;

  if (!buffers || buffers.lang !== settingsSnapshot.lang) {
    await loadAudio(settingsSnapshot.lang);
  }

  isPlaying = true;
  hasPlayedThisTrial = false;
  setTaskButtonsDisabled(true);
  statusEl.textContent = 'Playing...';

  if (audioCtx.state !== 'running') {
    try { await audioCtx.resume(); } catch {}
  }

  const trial = trialList[trialIndex];
  playedAt = performance.now();
  await renderAndPlaySingleDigit({
    digit: trial.digit,
    snr: trial.snr,
    noiseGain: settingsSnapshot.noiseGain,
  });
  playedEndedAt = performance.now();

  hasPlayedThisTrial = true;
  statusEl.textContent = 'Playback finished. Enter one digit and submit.';
  setTaskButtonsDisabled(false);
  isPlaying = false;
}

function summarize(responsesArr, snrsInOrder) {
  const digitList = [...Array(10).keys()];

  const snrDigitStats = {};
  const digitSnrStats = {};

  for (const snr of snrsInOrder) {
    snrDigitStats[snr] = {};
    for (const d of digitList) snrDigitStats[snr][d] = { n: 0, c: 0 };
  }

  for (const d of digitList) {
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

function pct(c, n) {
  if (!n) return '—';
  return `${((c / n) * 100).toFixed(1)}%`;
}

function buildSnrDigitTable(summary, snrsInOrder) {
  const digits = [...Array(10).keys()];
  let html = '<table><thead><tr><th>SNR (dB)</th>';
  for (const d of digits) html += `<th>${d}</th>`;
  html += '<th>Overall</th></tr></thead><tbody>';

  for (const snr of snrsInOrder) {
    html += `<tr><td>${snr}</td>`;
    let nAll = 0;
    let cAll = 0;

    for (const d of digits) {
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
  const digits = [...Array(10).keys()];
  let html = '<table><thead><tr><th>Digit</th>';
  for (const snr of snrsInOrder) html += `<th>${snr} dB</th>`;
  html += '</tr></thead><tbody>';

  for (const d of digits) {
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
  a.click();
  URL.revokeObjectURL(url);
}

function showResults() {
  const summary = summarize(responses, settingsSnapshot.snrs);
  snrDigitTable.innerHTML = buildSnrDigitTable(summary, settingsSnapshot.snrs);
  digitPiTable.innerHTML = buildDigitPiTable(summary, settingsSnapshot.snrs);

  taskCard.classList.add('hidden');
  resultsCard.classList.remove('hidden');
}

function handleSubmit() {
  if (!trialList[trialIndex]) return;
  if (!hasPlayedThisTrial) {
    statusEl.textContent = 'Please play the stimulus first.';
    return;
  }
  if (currentInput.length !== 1) {
    statusEl.textContent = 'Enter exactly one digit (0-9).';
    return;
  }

  const trial = trialList[trialIndex];
  const guess = Number(currentInput);
  const correct = guess === trial.digit;
  const rtMs = playedEndedAt != null ? Math.max(0, performance.now() - playedEndedAt) : null;

  responses.push({
    trial: trialIndex + 1,
    snr: trial.snr,
    target: trial.digit,
    response: guess,
    correct,
    rtMs: rtMs != null ? Math.round(rtMs) : null,
    playedAtMs: playedAt != null ? Math.round(playedAt) : null,
  });

  trialIndex += 1;
  currentInput = '';
  hasPlayedThisTrial = false;

  if (trialIndex >= trialList.length) {
    showResults();
    return;
  }

  updateTaskUI();
  statusEl.textContent = correct ? 'Correct. Next trial: press Play.' : `Incorrect (target was ${trial.digit}). Next trial: press Play.`;
  inputDisplay.textContent = '';
}

function beginExperiment() {
  const snrs = parseSNRList(snrListEl.value);
  const reps = Number(repsEl.value);
  const noiseGain = Number(noiseGainEl.value);
  const lang = stimLangEl.value;

  if (!snrs) {
    setSetupMessage('Invalid SNR list. Example: -4,-8,-12,-16,-20', true);
    return;
  }
  if (!Number.isInteger(reps) || reps < 1) {
    setSetupMessage('Repetitions must be an integer >= 1.', true);
    return;
  }
  if (!Number.isFinite(noiseGain) || noiseGain <= 0) {
    setSetupMessage('Noise gain must be > 0.', true);
    return;
  }

  settingsSnapshot = {
    lang,
    snrs,
    reps,
    noiseGain,
    startedAt: new Date().toISOString(),
  };

  trialList = buildTrials(snrs, reps);
  trialIndex = 0;
  responses = [];
  currentInput = '';
  hasPlayedThisTrial = false;
  isPlaying = false;
  playedAt = null;
  playedEndedAt = null;

  setupCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  taskCard.classList.remove('hidden');

  updateTaskUI();
  statusEl.textContent = 'Press Play to hear one digit.';
}

preloadBtn.addEventListener('click', async () => {
  try {
    if (audioCtx.state !== 'running') await audioCtx.resume();
    await loadAudio(stimLangEl.value);
  } catch (err) {
    console.error(err);
    setSetupMessage(`Audio preload failed: ${err.message || err}`, true);
  }
});

startBtn.addEventListener('click', beginExperiment);
playBtn.addEventListener('click', async () => {
  try {
    await handlePlay();
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Playback error: ${err.message || err}`;
    setTaskButtonsDisabled(false);
    isPlaying = false;
  }
});
submitBtn.addEventListener('click', handleSubmit);
clearBtn.addEventListener('click', clearInput);

keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-val]');
  if (!btn) return;
  appendInput(btn.dataset.val);
});

document.addEventListener('keydown', (e) => {
  if (taskCard.classList.contains('hidden')) return;
  if (e.key >= '0' && e.key <= '9') {
    appendInput(e.key);
  } else if (e.key === 'Backspace') {
    clearInput();
  } else if (e.key === 'Enter') {
    handleSubmit();
  }
});

downloadCsvBtn.addEventListener('click', () => {
  const rows = responses.map(r => ({
    ...r,
    lang: settingsSnapshot.lang,
    reps: settingsSnapshot.reps,
    snrList: settingsSnapshot.snrs.join('|'),
  }));
  downloadFile('single-din-raw.csv', toCsv(rows), 'text/csv;charset=utf-8');
});

downloadJsonBtn.addEventListener('click', () => {
  const payload = {
    settings: settingsSnapshot,
    nTrials: trialList.length,
    nCompleted: responses.length,
    responses,
    exportedAt: new Date().toISOString(),
  };
  downloadFile('single-din-results.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
});

restartBtn.addEventListener('click', () => {
  taskCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  setupCard.classList.remove('hidden');
  setSetupMessage('');
});
