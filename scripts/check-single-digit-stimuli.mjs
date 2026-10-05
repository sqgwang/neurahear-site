import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createHash, webcrypto } from 'node:crypto';

const root = 'public/tools/single-digit-in-noise-test';
const html = fs.readFileSync(`${root}/index.html`, 'utf8');
const languageSelect = html.match(/<select id="stimLang">([\s\S]*?)<\/select>/)[1];
assert.deepEqual([...languageSelect.matchAll(/<option value="([^"]+)"/g)].map(match => match[1]),
  ['taiwanese', 'spanish_male', 'spanish_female']);
assert.match(languageSelect, /<option value="taiwanese" selected>/);
const elements = new Map();
function element(id) {
  if (!elements.has(id)) elements.set(id, {
    value: '', checked: false, textContent: '', innerHTML: '', style: {}, dataset: {},
    disabled: false, files: [], listeners: {},
    classList: { add() {}, remove() {}, contains() { return false; } },
    addEventListener(name, fn) { this.listeners[name] = fn; },
    setAttribute() {}, removeAttribute() {}, focus() {}, querySelectorAll() { return []; },
  });
  return elements.get(id);
}
for (const [id, value] of Object.entries({ stimLang: 'taiwanese', snrList: '-4,-8', roundNumber: '1', testEar: 'right', groupEarScope: 'auto',
  noiseGain: '1', targetPct: '50', autoPlayDelay: '800', participantId: '', trialOrder: 'random' })) element(id).value = value;
let corrupt = false;
const requests = [];
const playedBuffers = [];
function audioBuffer(channels, length, sampleRate) {
  const data = Array.from({ length: channels }, () => new Float32Array(length));
  return { length, sampleRate, numberOfChannels: channels,
    getChannelData(channel) { return data[channel]; },
    copyToChannel(source, channel) { data[channel].set(source); },
  };
}
const context = vm.createContext({
  console, TextDecoder, Uint8Array, ArrayBuffer, Float32Array, performance, setTimeout, clearTimeout,
  crypto: webcrypto,
  addEventListener() {},
  AudioContext: class {
    sampleRate = 48000;
    state = 'running';
    destination = { maxChannelCount: 2, channelCount: 2 };
    createBuffer = audioBuffer;
    createBufferSource() {
      return { connect() { return this; }, disconnect() {}, stop() {},
        start() { playedBuffers.push(this.buffer); this.onended?.(); } };
    }
    createGain() { return { gain: { value: 1 }, connect() { return this; }, disconnect() {} }; }
    async decodeAudioData(bytes) { return { bytes: bytes.byteLength, sampleRate: 48000 }; }
  },
  document: { getElementById: element, addEventListener() {} },
  localStorage: { getItem() { return null; }, setItem() {} },
  async fetch(url) {
    requests.push(url);
    const file = path.join(root, url);
    const bytes = fs.readFileSync(file);
    if (corrupt && url.endsWith('/0.wav')) bytes[bytes.length - 1] ^= 1;
    return { ok: true, arrayBuffer: async () => Uint8Array.from(bytes).buffer };
  },
});
context.window = context;
vm.runInContext(fs.readFileSync(`${root}/app.js`, 'utf8'), context);
const run = code => vm.runInContext(code, context);

for (const voice of ['male', 'female']) {
  const folder = `${root}/audio/spanish_${voice}/fir-20261005-v1`;
  const manifest = JSON.parse(fs.readFileSync(`${folder}/manifest.json`));
  assert.equal(manifest.files.length, 11);
  assert.equal(manifest.correctionsApplied, false);
  const declared = run(`VERSIONED_STIMULI.spanish_${voice}.manifestSha256`);
  assert.equal(createHash('sha256').update(fs.readFileSync(`${folder}/manifest.json`)).digest('hex'), declared);
  for (const file of manifest.files) {
    const bytes = fs.readFileSync(`${folder}/${file.name}`);
    assert.equal(bytes.length, file.bytes);
    assert.equal(createHash('sha256').update(bytes).digest('hex'), file.sha256);
    let offset = 12, data;
    while (offset + 8 <= bytes.length) {
      const tag = bytes.toString('ascii', offset, offset + 4);
      const size = bytes.readUInt32LE(offset + 4);
      if (tag === 'fmt ') {
        assert.equal(bytes.readUInt16LE(offset + 8), 1);
        assert.equal(bytes.readUInt16LE(offset + 10), 1);
        assert.equal(bytes.readUInt32LE(offset + 12), 44100);
        assert.equal(bytes.readUInt16LE(offset + 22), 32);
      }
      if (tag === 'data') data = bytes.subarray(offset + 8, offset + 8 + size);
      offset += 8 + size + size % 2;
    }
    assert.equal(data.length / 4, file.frames);
    let energy = 0, peak = 0;
    for (let i = 0; i < data.length; i += 4) {
      const sample = data.readInt32LE(i) / 2 ** 31;
      energy += sample * sample;
      peak = Math.max(peak, Math.abs(sample));
    }
    assert.ok(Math.abs(Math.sqrt(energy / file.frames) - .05) < 1e-8);
    assert.ok(peak < .95);
    if (file.name === 'noise.wav') assert.equal(file.durationSeconds, 10);
  }
}
await run(`loadAudio('spanish_male')`);
assert.equal(run('buffers.stimulus.voice'), 'male');
assert.equal(requests.length, 12);
await run(`loadAudio('spanish_male')`);
assert.equal(requests.length, 12, 'Cached audio should not be downloaded again');
corrupt = true;
await assert.rejects(run(`loadAudio('spanish_female')`), /checksum mismatch/);
assert.equal(run('buffers.lang'), 'spanish_male', 'Failed load must not replace verified buffers');
corrupt = false;
await run(`loadAudio('spanish_female')`);
assert.equal(run('buffers.stimulus.voice'), 'female');
assert.ok(requests.every(url => url.startsWith('audio/spanish_')));

element('stimLang').value = 'spanish_female';
assert.equal(run('readSetupSettings()'), null);
element('participantId').value = 'P001';
element('testEar').value = '';
assert.equal(run('readSetupSettings()'), null);
element('testEar').value = 'right';
element('roundNumber').value = '0';
assert.equal(run('readSetupSettings()'), null);
element('roundNumber').value = '1';
run('beginExperiment(readSetupSettings())');
assert.equal(run('settingsSnapshot.stimulus.voice'), 'female');
assert.equal(run('settingsSnapshot.audioContextSampleRateHz'), 48000);
assert.equal(run('trialList.length'), 20);
assert.equal(run('settingsSnapshot.reps'), 1);
assert.equal(run('settingsSnapshot.ear'), 'right');
assert.equal(run('settingsSnapshot.analysisLevel'), 'round');
assert.match(run('settingsSnapshot.roundId'), /^[a-f0-9-]{36}$/);
const settings = JSON.parse(run('JSON.stringify(settingsSnapshot)'));
const male = { ...settings, lang: 'spanish_male', stimulus: JSON.parse(fs.readFileSync(`${root}/audio/spanish_male/fir-20261005-v1/manifest.json`)) };
male.stimulus.manifestSha256 = run('VERSIONED_STIMULI.spanish_male.manifestSha256');
context.testSettings = [settings, { ...settings, participantId: 'P002' }];
assert.equal(run('validateGroupMaterials(testSettings).stimulus.voice'), 'female');
context.testSettings = [settings, male];
assert.throws(() => run('validateGroupMaterials(testSettings)'), /cannot be pooled/);
context.testSettings = [settings, { ...settings, stimulus: { ...settings.stimulus, version: 'other-noise' } }];
assert.throws(() => run('validateGroupMaterials(testSettings)'), /cannot be pooled/);
context.testSettings = [{ lang: 'spanish_male' }];
assert.throws(() => run('validateGroupMaterials(testSettings)'), /provenance/);
context.testSettings = [{ lang: 'mandarin' }, { lang: 'mandarin' }];
assert.equal(run('validateGroupMaterials(testSettings).lang'), 'mandarin');
context.testSettings = [{ lang: 'mandarin' }, { lang: 'cantonese' }];
assert.throws(() => run('validateGroupMaterials(testSettings)'), /cannot be pooled/);

run(`downloadFile = (name, content) => { window.lastDownload = { name, content }; }`);
await element('downloadJson').listeners.click();
assert.ok(context.lastDownload.name.includes('spanish_female-P001-'));
assert.equal(JSON.parse(context.lastDownload.content).settings.stimulus.manifestSha256, settings.stimulus.manifestSha256);
assert.notEqual(run(`calibrationStorageKey('spanish_male')`), run(`calibrationStorageKey('spanish_female')`));
assert.equal(run(`calibrationStorageKey('mandarin')`), 'digitOptimizationNoiseGain:mandarin');
assert.equal(run(`normalizeImportedResponses({settings:{participantId:'group-analysis'},responses:[{snr:-10,target:1,response:1,participantId:'P003'}]},'group.json')[0].participantId`), 'P003');
assert.equal(run('buildTrials([-2,-4], 2, "random").length'), 40);
assert.notEqual(run(`calibrationStorageKey('spanish_male', 'left')`), run(`calibrationStorageKey('spanish_male', 'right')`));

element('designPreset').value = 'wang2023';
element('designPreset').listeners.change();
assert.equal(element('trialCount').textContent, '110 trials / round');
assert.equal(run('readSetupSettings().reps'), 1);
assert.equal(run('readSetupSettings().targetProbability'), .5);
for (const mode of ['random', 'blocked']) {
  const trials = JSON.parse(run(`JSON.stringify(buildTrials(parseSNRList(presets.wang2023.snrs), 1, '${mode}'))`));
  assert.equal(trials.length, 110);
  assert.equal(new Set(trials.map(trial => `${trial.snr}:${trial.digit}`)).size, 110);
  if (mode === 'blocked') assert.deepEqual(trials.map(trial => trial.snr), trials.map(trial => trial.snr).sort((a, b) => b - a));
}

context.testSamples = new Float32Array([0, .1, -.2, .3]);
for (const ear of ['left', 'right', 'both']) {
  const out = run(`createEarBuffer(testSamples, 44100, '${ear}')`);
  assert.equal(out.numberOfChannels, 2);
  for (const channel of [0, 1]) {
    const active = ear === 'both' || channel === (ear === 'left' ? 0 : 1);
    assert.deepEqual(out.getChannelData(channel), active ? context.testSamples : new Float32Array(4));
  }
}
assert.throws(() => run(`createEarBuffer(testSamples, 44100, 'invalid')`), /Select/);
run('audioCtx.destination.maxChannelCount = 1');
assert.throws(() => run('prepareStereoOutput()'), /Stereo output/);
run('audioCtx.destination.maxChannelCount = 2');

const signal = audioBuffer(1, 400, 1000);
signal.getChannelData(0).fill(.05);
const noise = audioBuffer(1, 2000, 1000);
noise.getChannelData(0).fill(.025);
context.testBuffers = { lang: 'taiwanese', stimulus: null, digitBuffers: Array(10).fill(signal), noiseBuffer: noise };
run('buffers = testBuffers');
for (const ear of ['left', 'right', 'both']) {
  const result = await run(`renderAndPlaySingleDigit({digit: 0, snr: -8, noiseGain: 1, ear: '${ear}'})`);
  assert.equal(result.effectiveSNR, -8);
  assert.equal(result.limiterGain, 1);
  const out = playedBuffers.at(-1);
  assert.equal(out.length, 1400);
  const activeChannel = ear === 'right' ? 1 : 0;
  const active = out.getChannelData(activeChannel);
  assert.ok(Math.abs(active[0] - .025) < 1e-8);
  assert.ok(Math.abs(active[500] - (.025 + .025 * 10 ** (-8 / 20))) < 1e-8);
  if (ear === 'both') assert.deepEqual(active, out.getChannelData(1));
  else assert.ok(out.getChannelData(1 - activeChannel).every(value => value === 0));

  context.calibrationSettings = { lang: 'taiwanese', ear };
  run('pendingSettings = calibrationSettings');
  element('calibrationGain').value = '1';
  await run('startCalibrationNoise()');
  const calibration = playedBuffers.at(-1);
  assert.deepEqual(calibration.getChannelData(activeChannel), noise.getChannelData(0));
  if (ear !== 'both') assert.ok(calibration.getChannelData(1 - activeChannel).every(value => value === 0));
}
run('calibrationPlayed = false');
element('channelConfirmed').checked = true;
element('channelConfirmed').listeners.change();
assert.equal(element('calibrationConfirmBtn').disabled, true);
run('calibrationPlayed = true');
element('channelConfirmed').listeners.change();
assert.equal(element('calibrationConfirmBtn').disabled, false);

element('stimLang').value = 'taiwanese';
element('snrList').value = '-8';
run('beginExperiment(readSetupSettings())');
const firstRoundId = run('settingsSnapshot.roundId');
for (let i = 0; i < 10; i++) {
  run('hasPlayedThisTrial = true; currentInput = String(trialList[trialIndex].digit); handleSubmit()');
}
const completed = JSON.parse(context.lastDownload.content);
assert.equal(completed.nCompleted, 10);
assert.equal(completed.schemaVersion, 2);
assert.ok(completed.settings.completedAt);
assert.ok(completed.responses.every(row => row.roundId === firstRoundId && row.ear === 'right' && row.participantId === 'P001'));
assert.match(context.lastDownload.name, /right-round1/);
assert.equal(element('downloadCorrections').disabled, true, 'Insufficient data must not offer placeholder zero corrections');
element('nextRoundBtn').listeners.click();
assert.equal(element('participantId').value, 'P001');
assert.equal(element('roundNumber').value, '2');
assert.equal(element('testEar').value, '');
element('testEar').value = 'left';
run('beginExperiment(readSetupSettings())');
assert.notEqual(run('settingsSnapshot.roundId'), firstRoundId);
element('restartBtn').listeners.click();
assert.equal(element('participantId').value, '');
assert.equal(element('roundNumber').value, '1');

const secondRound = structuredClone(completed);
secondRound.settings.roundId = 'second-round';
secondRound.settings.roundNumber = 2;
secondRound.settings.ear = 'left';
secondRound.responses = secondRound.responses.map(row => ({ ...row, roundId: 'second-round', roundNumber: 2, ear: 'left' }));
context.entries = [{ payload: completed, name: 'right.json' }, { payload: secondRound, name: 'left.json' }];
let imported = run(`importGroupPayloads(entries, 'auto')`);
assert.equal(imported.scope, 'monaural');
assert.equal(imported.rows.length, 20);
assert.equal(new Set(imported.rows.map(row => row.participantId)).size, 1);
assert.equal(run(`importGroupPayloads(entries, 'left').rows.length`), 10);
assert.equal(run(`importGroupPayloads(entries, 'left').excluded`), 10);

const reexport = structuredClone(completed);
reexport.exportedAt = 'different';
context.entries = [{ payload: completed, name: 'original.json' }, { payload: reexport, name: 'copy.json' }];
assert.throws(() => run(`importGroupPayloads(entries, 'auto')`), /more than once|Duplicate round/);
const regrouped = { settings: { lang: 'taiwanese', analysisLevel: 'group' }, responses: imported.rows };
context.entries = [{ payload: completed, name: 'original.json' }, { payload: regrouped, name: 'group.json' }];
assert.throws(() => run(`importGroupPayloads(entries, 'auto')`), /Duplicate round/);
context.entries = [{ payload: regrouped, name: 'group.json' }];
assert.equal(run(`importGroupPayloads(entries, 'auto').rows.length`), 20);

const bothRound = structuredClone(secondRound);
bothRound.settings.roundId = 'both-round';
bothRound.settings.ear = 'both';
bothRound.responses = bothRound.responses.map(row => ({ ...row, roundId: 'both-round', ear: 'both' }));
context.entries = [{ payload: completed, name: 'right.json' }, { payload: bothRound, name: 'both.json' }];
assert.throws(() => run(`importGroupPayloads(entries, 'auto')`), /cannot be pooled together/);
assert.equal(run(`importGroupPayloads(entries, 'both').rows.length`), 10);
const legacy = { settings: { lang: 'taiwanese', participantId: 'P001' }, responses: [{ snr: -8, target: 1, response: 1 }] };
context.entries = [{ payload: legacy, name: 'legacy.json' }];
assert.equal(run(`importGroupPayloads(entries, 'auto').scope`), 'unknown');
context.entries.push({ payload: completed, name: 'new.json' });
assert.throws(() => run(`importGroupPayloads(entries, 'auto')`), /cannot be pooled together/);

console.log('PASS language choices, Spanish hashes/RMS, one-round protocol, ear routing/calibration/SNR, automatic exports, continuation, duplicate protection, ear-filtered pooling and legacy compatibility');
