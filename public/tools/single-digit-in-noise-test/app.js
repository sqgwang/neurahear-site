const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const DIGITS = [...Array(10).keys()];
const CHANCE_LEVEL = 1 / DIGITS.length;
const DEFAULT_TARGET = 0.5;

const setupCard = document.getElementById('setupCard');
const taskCard = document.getElementById('taskCard');
const resultsCard = document.getElementById('resultsCard');

const stimLangEl = document.getElementById('stimLang');
const presetEl = document.getElementById('designPreset');
const snrListEl = document.getElementById('snrList');
const repsEl = document.getElementById('reps');
const orderEl = document.getElementById('trialOrder');
const targetPctEl = document.getElementById('targetPct');
const noiseGainEl = document.getElementById('noiseGain');
const participantIdEl = document.getElementById('participantId');
const showSnrEl = document.getElementById('showSnr');
const setupMsg = document.getElementById('setupMsg');
const trialCountEl = document.getElementById('trialCount');

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
const downloadCorrectionsBtn = document.getElementById('downloadCorrections');
const copyCorrectionsBtn = document.getElementById('copyCorrections');
const restartBtn = document.getElementById('restartBtn');

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

const presets = {
  quick: {
    snrs: '-4,-8,-12,-16,-20',
    reps: 2,
    order: 'random',
  },
  potgieter2016: {
    snrs: '-2,-4,-6,-8,-10,-12,-14,-16,-18,-20',
    reps: 4,
    order: 'blocked',
  },
  wang2023: {
    snrs: '-2,-4,-6,-8,-10,-12,-14,-16,-18,-20,-22',
    reps: 4,
    order: 'blocked',
  },
};

function parseSNRList(raw) {
  const arr = String(raw)
    .split(',')
    .map(s => Number(s.trim()))
    .filter(v => Number.isFinite(v));
  if (!arr.length) return null;
  return [...new Set(arr)];
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

function setSetupMessage(msg, isError = false) {
  setupMsg.textContent = msg;
  setupMsg.style.color = isError ? '#b91c1c' : '#5f666d';
}

function updateTrialCount() {
  const snrs = parseSNRList(snrListEl.value) || [];
  const reps = Number(repsEl.value);
  const total = snrs.length * DIGITS.length * (Number.isFinite(reps) ? reps : 0);
  trialCountEl.textContent = `${total} trials`;
}

function updateTaskUI() {
  const total = trialList.length;
  const shownTrial = Math.min(trialIndex + 1, total);
  progressEl.textContent = `Trial ${shownTrial} / ${total}`;

  const trial = trialList[trialIndex];
  currentSNREl.textContent = trial && settingsSnapshot.showSnr ? `SNR: ${trial.snr} dB` : 'SNR hidden';
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

async function renderAndPlaySingleDigit({ digit, snr, noiseGain }) {
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
    const a = Math.abs(mixed[i]);
    if (a > maxAbs) maxAbs = a;
  }

  let limiterGain = 1;
  if (maxAbs > 0.99) {
    limiterGain = 0.99 / maxAbs;
    for (let i = 0; i < mixed.length; i++) mixed[i] *= limiterGain;
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

  return {
    effectiveSNR: round(effectiveSNR, 2),
    limiterGain: round(limiterGain, 4),
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
  playBtn.disabled = false;
  setResponseDisabled(true);
  updateTaskUI();
}

async function handlePlay() {
  if (isPlaying) return;
  if (!trialList[trialIndex]) return;

  if (!buffers || buffers.lang !== settingsSnapshot.lang) {
    await loadAudio(settingsSnapshot.lang);
  }

  isPlaying = true;
  hasPlayedThisTrial = false;
  playBtn.disabled = true;
  setResponseDisabled(true);
  statusEl.textContent = 'Playing...';

  if (audioCtx.state !== 'running') {
    try { await audioCtx.resume(); } catch {}
  }

  const trial = trialList[trialIndex];
  playedAt = performance.now();
  const playback = await renderAndPlaySingleDigit({
    digit: trial.digit,
    snr: trial.snr,
    noiseGain: settingsSnapshot.noiseGain,
  });
  playedEndedAt = performance.now();

  trial.effectiveSNR = playback.effectiveSNR;
  trial.limiterGain = playback.limiterGain;
  hasPlayedThisTrial = true;
  statusEl.textContent = 'Enter the digit you heard.';
  setResponseDisabled(false);
  isPlaying = false;
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
    correctionsArray[digit] = correction == null ? 0 : round(correction, 2);
  }

  return {
    target,
    chanceLevel: CHANCE_LEVEL,
    meanThreshold,
    fits,
    corrections,
    correctionsArray,
    warnings: DIGITS
      .filter(d => fits[d].ok && (!fits[d].inRange || !fits[d].bracketsTarget))
      .map(d => ({
        digit: d,
        reason: !fits[d].bracketsTarget ? 'target_not_bracketed' : 'threshold_extrapolated',
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
  a.click();
  URL.revokeObjectURL(url);
}

function correctionPayload() {
  return {
    language: settingsSnapshot.lang,
    targetProbability: latestAnalysis.target,
    chanceLevel: latestAnalysis.chanceLevel,
    meanThresholdDbSnr: round(latestAnalysis.meanThreshold, 3),
    correctionLevelsDbByDigit: latestAnalysis.correctionsArray,
    interpretation: 'Use as digit-level gain in dB. Positive values make a digit louder; negative values make it softer.',
    generatedAt: new Date().toISOString(),
  };
}

function showResults() {
  const summary = summarize(responses, settingsSnapshot.snrs);
  latestAnalysis = analyzeOptimization(summary, settingsSnapshot.snrs, settingsSnapshot.targetProbability);

  correctionsOutput.textContent = JSON.stringify(latestAnalysis.correctionsArray, null, 2);
  correctionTable.innerHTML = buildCorrectionTable(latestAnalysis);
  fitTable.innerHTML = buildFitTable(latestAnalysis);
  snrDigitTable.innerHTML = buildSnrDigitTable(summary, settingsSnapshot.snrs);
  digitPiTable.innerHTML = buildDigitPiTable(summary, settingsSnapshot.snrs);
  piPlot.innerHTML = buildPiPlot(latestAnalysis, settingsSnapshot.snrs);

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
    effectiveSNR: trial.effectiveSNR ?? null,
    target: trial.digit,
    response: guess,
    correct,
    rep: trial.rep,
    limiterGain: trial.limiterGain ?? null,
    rtMs: rtMs != null ? Math.round(rtMs) : null,
    playedAtMs: playedAt != null ? Math.round(playedAt) : null,
  });

  trialIndex += 1;

  if (trialIndex >= trialList.length) {
    showResults();
    return;
  }

  prepareForNextTrial();
  statusEl.textContent = 'Ready for the next trial.';
}

function beginExperiment() {
  const snrs = parseSNRList(snrListEl.value);
  const reps = Number(repsEl.value);
  const noiseGain = Number(noiseGainEl.value);
  const targetPct = Number(targetPctEl.value);
  const lang = stimLangEl.value;

  if (!snrs) {
    setSetupMessage('Invalid SNR list. Example: -2,-4,-6,-8,-10,-12,-14,-16,-18,-20', true);
    return;
  }
  if (!Number.isInteger(reps) || reps < 1) {
    setSetupMessage('Repetitions must be an integer >= 1.', true);
    return;
  }
  if (!Number.isFinite(noiseGain) || noiseGain <= 0) {
    setSetupMessage('Masker gain must be > 0.', true);
    return;
  }
  if (!Number.isFinite(targetPct) || targetPct <= CHANCE_LEVEL * 100 || targetPct >= 100) {
    setSetupMessage(`Target must be greater than chance (${Math.round(CHANCE_LEVEL * 100)}%) and less than 100%.`, true);
    return;
  }

  const sortedSnrs = snrs.slice().sort((a, b) => b - a);
  settingsSnapshot = {
    participantId: participantIdEl.value.trim() || null,
    lang,
    preset: presetEl.value,
    snrs: sortedSnrs,
    reps,
    trialOrder: orderEl.value,
    targetProbability: targetPct / 100,
    noiseGain,
    showSnr: showSnrEl.checked,
    startedAt: new Date().toISOString(),
  };

  trialList = buildTrials(sortedSnrs, reps, settingsSnapshot.trialOrder);
  trialIndex = 0;
  responses = [];
  currentInput = '';
  hasPlayedThisTrial = false;
  isPlaying = false;
  playedAt = null;
  playedEndedAt = null;
  latestAnalysis = null;

  setupCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  taskCard.classList.remove('hidden');

  prepareForNextTrial();
  statusEl.textContent = 'Press Play to hear one digit.';
}

presetEl.addEventListener('change', () => {
  const preset = presets[presetEl.value];
  if (!preset) return;
  snrListEl.value = preset.snrs;
  repsEl.value = preset.reps;
  orderEl.value = preset.order;
  updateTrialCount();
});

[snrListEl, repsEl].forEach(el => el.addEventListener('input', updateTrialCount));

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
    playBtn.disabled = false;
    setResponseDisabled(true);
    isPlaying = false;
  }
});
submitBtn.addEventListener('click', handleSubmit);
clearBtn.addEventListener('click', clearInput);

keypad.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-val]');
  if (!btn || btn.disabled) return;
  appendInput(btn.dataset.val);
});

document.addEventListener('keydown', (e) => {
  if (taskCard.classList.contains('hidden')) return;
  if (e.key >= '0' && e.key <= '9' && !submitBtn.disabled) {
    appendInput(e.key);
  } else if (e.key === 'Backspace' && !clearBtn.disabled) {
    clearInput();
  } else if (e.key === 'Enter' && !submitBtn.disabled) {
    handleSubmit();
  }
});

downloadCsvBtn.addEventListener('click', () => {
  const rows = responses.map(r => ({
    ...r,
    participantId: settingsSnapshot.participantId,
    lang: settingsSnapshot.lang,
    reps: settingsSnapshot.reps,
    snrList: settingsSnapshot.snrs.join('|'),
    targetProbability: settingsSnapshot.targetProbability,
  }));
  downloadFile('digit-optimization-raw.csv', toCsv(rows), 'text/csv;charset=utf-8');
});

downloadJsonBtn.addEventListener('click', () => {
  const payload = {
    settings: settingsSnapshot,
    nTrials: trialList.length,
    nCompleted: responses.length,
    responses,
    analysis: latestAnalysis,
    exportedAt: new Date().toISOString(),
  };
  downloadFile('digit-optimization-results.json', JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
});

downloadCorrectionsBtn.addEventListener('click', () => {
  downloadFile(`${settingsSnapshot.lang}-corrections.json`, JSON.stringify(latestAnalysis.correctionsArray, null, 2), 'application/json;charset=utf-8');
});

copyCorrectionsBtn.addEventListener('click', async () => {
  const text = JSON.stringify(latestAnalysis.correctionsArray);
  try {
    await navigator.clipboard.writeText(text);
    copyCorrectionsBtn.textContent = 'Copied';
    setTimeout(() => { copyCorrectionsBtn.textContent = 'Copy corrections array'; }, 1200);
  } catch {
    correctionsOutput.focus();
  }
});

restartBtn.addEventListener('click', () => {
  taskCard.classList.add('hidden');
  resultsCard.classList.add('hidden');
  setupCard.classList.remove('hidden');
  setSetupMessage('');
  updateTrialCount();
});

updateTrialCount();
