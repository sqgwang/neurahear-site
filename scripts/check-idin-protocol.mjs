import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// Exercise the real state machine with a silent audio adapter and in-memory storage.
// Nothing is sent to a server, and the stimulus renderer itself is not altered.
async function runCondition(condition) {
  const storage = new Map();
  const elements = new Map();
  const getElement = id => {
    if (!elements.has(id)) elements.set(id, {
      textContent: '', style: {}, dataset: {}, disabled: false,
      classList: { add() {}, remove() {} }
    });
    return elements.get(id);
  };
  const context = vm.createContext({
    console, Date, Math, Promise, setTimeout, clearTimeout,
    localStorage: {
      getItem: key => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, String(value))
    },
    location: { href: '' },
    document: {
      getElementById: getElement,
      querySelectorAll: () => [],
      addEventListener() {}
    },
    t: key => key,
    AudioContext: class {},
    testCondition: condition
  });
  context.window = context;
  vm.runInContext(fs.readFileSync('public/tools/digit-in-noise-test/js/app.js', 'utf8'), context);
  return vm.runInContext(`(async () => {
    let answer = '';
    let playbackCount = 0;
    sleep = async () => {};
    resumeAudioContextForPlayback = async () => {};
    loadLanguageAudio = async () => { langBuffers.mandarin = {}; };
    renderMixedBufferAndPlay = async (_digits, snr) => {
      playbackCount++;
      session.playbackEndedAt = Date.now();
      return { effectiveSNR: snr };
    };
    getCurrentInput = () => answer;
    updateBoxesFromString = value => { answer = value; };
    setInputBoxes = () => {};
    localStorage.setItem('userInfo', JSON.stringify({
      pid: 'LOCAL-PROTOCOL-CHECK', stimLang: 'mandarin',
      testConditions: Array.isArray(testCondition) ? testCondition : [testCondition]
    }));
    let guidanceOpen = false;
    const offered = [];
    window.dinTutorial = {
      isOpen: () => guidanceOpen,
      offer: () => { guidanceOpen = true; offered.push(window.getDinGuidanceContext().id); }
    };
    showConditionIntro();
    for (const condition of session.conditionOrder) {
    const beforeGuide = JSON.stringify(session.trials);
    const beforePlayback = playbackCount;
    await startTrialPlay();
    if (playbackCount !== beforePlayback) throw new Error('Trial played under tutorial');
    if (canAcceptResponseInput()) throw new Error('Research input accepted under tutorial');
    window.recordDinGuidance('skipped');
    if (JSON.stringify(session.trials) !== beforeGuide) throw new Error('Tutorial changed research data');
    if (!window.getDinGuidanceContext().seen) throw new Error('Skip not remembered in this session');
    guidanceOpen = false;
    await startTrialPlay();
    answer = '';
    const beforeEmpty = session.trials.length;
    await submitInput();
    if (session.trials.length !== beforeEmpty) throw new Error('Empty response was recorded');
    const expected = () => COND_DEFS[condition].dir === 'backward'
      ? session.currentDigits.slice().reverse().join('') : session.currentDigits.join('');
    answer = '0'.repeat(COND_DEFS[condition].nDigits);
    await submitInput();
    if (session.practiceIdx[condition] !== 0) throw new Error('Incorrect practice advanced');
    for (let i = 0; i < N_PRACTICE; i++) {
      answer = expected();
      await submitInput();
    }
    if (session.phase[condition] !== 'formal') throw new Error('Formal phase not reached');
    for (let i = 0; i < N_FORMAL; i++) {
      answer = i % 2 === 0 ? expected() : '0'.repeat(COND_DEFS[condition].nDigits);
      await submitInput();
    }
    }
    return JSON.parse(JSON.stringify({
      trials: session.trials, offered,
      playbackCount, destination: location.href, result: finalizeAndGetResults()
    }));
  })()`, context);
}

(async () => {
  for (const condition of ['2f', '2b', '3f', '3b', '5f']) {
    const result = await runCondition(condition);
    assert.equal(result.destination, 'results.html');
    const formal = result.trials.filter(trial => !trial.practice);
    assert.equal(formal.length, 24);
    assert.equal(result.trials.filter(trial => trial.practice).length, 4);
    assert.equal(result.playbackCount, 28);
    assert.deepEqual(Array.from(formal, trial => trial.presentedSNR), Array.from({ length: 24 }, (_, i) => i % 2 ? -2 : 0));
    assert.equal(result.result.condResults[condition].SRT, -1);
    assert.ok(formal.every(trial => trial.uiVersion === 'idin-20260907-guide-1'));
    assert.equal(formal.filter(trial => trial.correct).length, 12);
    console.log('PASS', condition, 'practice retry, response validation, 24 trials, SNR steps, SRT, UI version');
  }
  const order = ['3b', '5f', '2b', '3f', '2f'];
  const multiple = await runCondition(order);
  assert.deepEqual(Array.from(multiple.offered), order);
  assert.equal(multiple.destination, 'results.html');
  assert.equal(multiple.playbackCount, 28 * order.length);
  for (const condition of order) {
    assert.equal(multiple.result.condResults[condition].SRT, -1);
    assert.equal(multiple.result.condResults[condition].nFormalTrials, 24);
  }
  console.log('PASS mixed condition order, guidance gate, no tutorial trial records, unchanged per-condition SRT');
})().catch(error => { console.error(error); process.exitCode = 1; });
