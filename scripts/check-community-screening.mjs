import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = 'public/tools/community-hearing-screening/';
const languages = ['mandarin', 'cantonese', 'ningboese', 'hangzhouese', 'min', 'fuzhouese'];
const source = fs.readFileSync(`${root}screening.js`, 'utf8');
const html = fs.readFileSync(`${root}index.html`, 'utf8');
const backend = fs.readFileSync('server/din-backend/server.js', 'utf8');
const validatorSource = backend.slice(backend.indexOf('function validateCommunityResult('), backend.indexOf('// ----------- Middleware'));
const validate = vm.runInNewContext(`${validatorSource}\nvalidateCommunityResult`);

function harness() {
  const elements = new Map();
  const storage = new Map();
  const element = id => {
    if (!elements.has(id)) elements.set(id, {
      value: '', checked: false, textContent: '', dataset: {}, style: {}, hidden: false,
      classList: { add() {}, remove() {}, toggle() {} },
      listeners: {}, addEventListener(name, fn) { this.listeners[name] = fn; },
      setAttribute() {}, querySelectorAll: () => [],
      querySelector: () => element(`${id}-child`), focus() {}
    });
    return elements.get(id);
  };
  const context = vm.createContext({
    console, Date, Math, Promise, Float32Array, setTimeout: fn => { fn(); return 0; },
    navigator: { userAgent: 'Local community regression check' },
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key)
    },
    document: {
      readyState: 'loading', documentElement: {},
      getElementById: element, querySelectorAll: () => [], addEventListener() {}
    },
    fetch: () => { throw new Error('Network is prohibited in this check'); }
  });
  context.window = context;
  context.scrollTo = () => {};
  context.addEventListener = () => {};
  const expose = `globalThis.test = {
    state, LANGUAGES, currentProtocol, ensureAudioLoaded, wireEvents, handleSetupSubmit,
    beginScreening, submitAnswer, buildResultPayload, renderOutcome, applyLanguage,
    useSilentTrials() {
      resumeAudioContext = async () => {};
      renderAndPlaySequence = async (_digits, snr) => ({ effectiveSnrDb: snr });
      uploadResultRecord = async () => {};
    }
  };`;
  vm.runInContext(source.replace('  if (document.readyState === "loading")', `${expose}\n  if (document.readyState === "loading")`), context);
  return { context, test: context.test, element };
}

function buffer(channels, length, sampleRate) {
  const samples = Array.from({ length: channels }, () => new Float32Array(length).fill(0.1));
  return { numberOfChannels: channels, length, sampleRate, getChannelData: channel => samples[channel] };
}

function installAudio(h, delayed = null) {
  const urls = [];
  h.test.state.audioContext = {
    createBuffer: buffer,
    decodeAudioData: async () => buffer(1, 32, 44100)
  };
  h.context.fetch = async url => {
    urls.push(url);
    if (delayed && url === delayed.url) await delayed.promise;
    if (url.endsWith('corrections.json')) return { ok: true, json: async () => JSON.parse(fs.readFileSync(`public${url}`, 'utf8')) };
    assert.ok(fs.existsSync(`public${url}`));
    return { ok: true, arrayBuffer: async () => new ArrayBuffer(4) };
  };
  return urls;
}

function setup(h, language) {
  h.test.state.stimulusLanguage = language;
  h.element('participantCode').value = 'LOCAL-CHECK-NOT-UPLOADED';
  h.element('participantAge').value = '65';
  for (const id of ['checkHeadphones', 'checkQuiet', 'checkUnderstand']) h.element(id).checked = true;
  h.test.handleSetupSubmit({ preventDefault() {} });
}

let mandarinPayload;
for (const language of languages) {
  const h = harness();
  assert.deepEqual(Object.keys(h.test.LANGUAGES), languages);
  h.test.wireEvents();
  const urls = installAudio(h);
  setup(h, language);
  const audio = await h.test.ensureAudioLoaded();
  assert.equal(audio.stimulusLanguage, language);
  assert.equal(urls.length, 12);
  assert.ok(urls.every(url => url.startsWith(`/tools/digit-in-noise-test/audio/${language}/`)));
  assert.deepEqual(Array.from(audio.corrections), JSON.parse(fs.readFileSync(`public/tools/digit-in-noise-test/audio/${language}/corrections.json`, 'utf8')));
  h.test.state.noisePlayed = true;
  h.test.state.calibrationConfirmed = true;
  h.test.useSilentTrials();
  await h.test.beginScreening();
  h.test.state.enteredDigits = '';
  await h.test.submitAnswer();
  assert.equal(h.test.state.session.trials.length, 0);
  h.test.state.enteredDigits = '00';
  await h.test.submitAnswer();
  assert.equal(h.test.state.practiceIndex, 0);
  for (let i = 0; i < 3; i++) {
    h.test.state.enteredDigits = h.test.state.currentDigits.join('');
    await h.test.submitAnswer();
  }
  assert.equal(h.test.state.phase, 'formal');
  for (let i = 0; i < 24; i++) {
    h.test.state.enteredDigits = i % 2 ? '00' : h.test.state.currentDigits.join('');
    await h.test.submitAnswer();
  }
  const session = h.test.state.session;
  const formal = session.trials.filter(trial => trial.phase === 'formal');
  assert.equal(formal.length, 24);
  assert.equal(session.trials.length, 28);
  assert.deepEqual(Array.from(formal, trial => trial.presentedSnrDb), Array.from({ length: 24 }, (_, i) => i % 2 ? -2 : 0));
  assert.equal(session.result.srtDbSnr, -1);
  assert.equal(session.result.outcome, language === 'mandarin' ? 'refer' : 'unclassified');
  const payload = JSON.parse(JSON.stringify(h.test.buildResultPayload(session.result)));
  assert.equal(payload.screening.stimulusLanguage, language);
  assert.equal(payload.userInfo.stimulusLanguage, language);
  assert.equal(payload.calibration.stimulusLanguage, language);
  assert.equal(payload.screening.referralCutoffDbSnr, language === 'mandarin' ? -8 : null);
  assert.equal(validate(payload), '');
  h.test.state.uiLanguage = 'en';
  h.test.applyLanguage();
  assert.equal(h.test.currentProtocol().stimulusLanguage, language);
  assert.equal(h.element('audioLoadTitle').textContent, 'Test audio is ready');
  if (language === 'mandarin') mandarinPayload = payload;
  else assert.match(h.element('outcomeTitle').textContent, /professional interpretation/);
  console.log('PASS', language, 'assets, corrections, practice retry, 24 trials, SRT, classification, upload validation');
}

// Old Mandarin clients remain accepted, including queued uploads.
assert.equal(validate(mandarinPayload), '');
assert.equal(validate({ ...mandarinPayload, screening: { ...mandarinPayload.screening, outcome: 'pass', srtDbSnr: -12 } }), '');
for (const language of ['taiwanese', 'american_english', 'british_english', 'spanish', '__proto__']) {
  assert.equal(validate({ ...mandarinPayload, screening: { ...mandarinPayload.screening, stimulusLanguage: language, protocolId: `${language}-2f-community-screening-v1` } }), 'invalid screening protocol');
}
assert.equal(validate({ ...mandarinPayload, screening: { ...mandarinPayload.screening, stimulusLanguage: 'cantonese' } }), 'invalid screening protocol');
const cantonese = { ...mandarinPayload, screening: { ...mandarinPayload.screening, stimulusLanguage: 'cantonese', protocolId: 'cantonese-2f-community-screening-v1', outcome: 'unclassified', referralCutoffDbSnr: null } };
assert.equal(validate(cantonese), 'inconsistent stimulus language');
assert.equal(validate({ ...cantonese, screening: { ...cantonese.screening, outcome: 'pass' } }), 'invalid outcome');
assert.equal(validate({ ...cantonese, screening: { ...cantonese.screening, referralCutoffDbSnr: -8 } }), 'no referral cutoff configured for this language');

// A late Mandarin load must not replace a newly selected language or its load UI.
const h = harness();
h.test.wireEvents();
let release;
const delayed = { url: '/tools/digit-in-noise-test/audio/mandarin/corrections.json', promise: new Promise(resolve => { release = resolve; }) };
installAudio(h, delayed);
setup(h, 'mandarin');
const oldLoad = h.test.ensureAudioLoaded().catch(error => error.message);
h.element('backToSetup').listeners.click();
assert.equal(h.test.state.noisePlayed, false);
assert.equal(h.test.state.calibrationConfirmed, false);
h.element('stimulusLanguage').value = 'cantonese';
h.element('stimulusLanguage').listeners.change();
setup(h, 'cantonese');
await h.test.ensureAudioLoaded();
release();
assert.equal(await oldLoad, 'Audio selection changed');
assert.equal(h.test.state.audioData.stimulusLanguage, 'cantonese');
assert.equal(h.element('audioLoadPanel').dataset.state, 'ready');
assert.equal(h.element('startScreeningButton').disabled, true);
assert.equal(h.test.state.session.calibration, null);
console.log('PASS stale audio rejection, language change and calibration reset, legacy records, language allowlist');

assert.doesNotMatch(html, /partner-lockup|china-hearing-language-rehabilitation-center-logo|中国听力语言康复研究中心/);
const select = html.match(/<select id="stimulusLanguage"[^>]*>([\s\S]*?)<\/select>/)[1];
assert.deepEqual(Array.from(select.matchAll(/value="([^"]+)"/g), match => match[1]), languages);
const adminSource = fs.readFileSync(`${root}admin.js`, 'utf8');
vm.runInContext(adminSource.replace('  if (document.readyState === "loading")', 'globalThis.adminTest = { state, applyFilters, summaryCsv, formatNumber };\n  if (document.readyState === "loading")'), h.context);
const admin = h.context.adminTest;
const dialectRecord = structuredClone(cantonese);
dialectRecord.userInfo.stimulusLanguage = 'cantonese';
dialectRecord.calibration.stimulusLanguage = 'cantonese';
admin.state.records = [mandarinPayload, dialectRecord];
h.element('languageFilter').value = 'cantonese';
admin.applyFilters();
assert.equal(admin.state.filteredRecords.length, 1);
assert.match(h.element('recordRows').innerHTML, /Cantonese/);
assert.match(h.element('recordRows').innerHTML, /Not classified/);
assert.match(admin.summaryCsv(admin.state.filteredRecords), /cantonese.*unclassified/);
assert.equal(admin.formatNumber(null), '—');
console.log('PASS six-language selector, partner logo removal, dashboard language filter and unclassified export');
