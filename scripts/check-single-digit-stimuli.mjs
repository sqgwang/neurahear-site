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
for (const [id, value] of Object.entries({ stimLang: 'taiwanese', snrList: '-4,-8', reps: '1',
  noiseGain: '1', targetPct: '50', autoPlayDelay: '800', participantId: '', trialOrder: 'random' })) element(id).value = value;
let corrupt = false;
const requests = [];
const context = vm.createContext({
  console, TextDecoder, Uint8Array, ArrayBuffer, Float32Array, performance, setTimeout, clearTimeout,
  crypto: webcrypto,
  addEventListener() {},
  AudioContext: class {
    sampleRate = 48000;
    state = 'running';
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
run('beginExperiment(readSetupSettings())');
assert.equal(run('settingsSnapshot.stimulus.voice'), 'female');
assert.equal(run('settingsSnapshot.audioContextSampleRateHz'), 48000);
assert.equal(run('trialList.length'), 20);
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
console.log('PASS Taiwanese/Spanish-only choices, Spanish assets, PCM/RMS, hash verification, corruption rejection, versioned exports, separate pooling, legacy compatibility, trial count');
