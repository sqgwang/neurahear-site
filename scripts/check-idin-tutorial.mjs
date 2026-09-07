import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

// A small DOM adapter runs the actual tutorial without audio or server access.
function harness(id) {
  const nodes = new Map();
  const make = () => ({
    textContent: '', dataset: {}, hidden: false, open: false, children: [],
    style: { setProperty() {} }, classList: { toggle() {}, add() {}, remove() {} },
    handlers: {}, attributes: {},
    addEventListener(type, fn) { this.handlers[type] = fn; },
    setAttribute(key, value) { this.attributes[key] = value; },
    replaceChildren() { this.children = []; },
    appendChild(child) { this.children.push(child); },
    focus() {}, showModal() { this.open = true; }, close() { this.open = false; }
  });
  const node = key => { if (!nodes.has(key)) nodes.set(key, make()); return nodes.get(key); };
  const ctx = { id, nDigits: Number(id[0]), dir: id[1] === 'b' ? 'backward' : 'forward', firstCondition: true, seen: false, started: false };
  const records = [];
  let plays = 0;
  const environment = {
    document: { getElementById: node, createElement: make, addEventListener() {} },
    t: (key, vars = {}) => key + JSON.stringify(vars),
    dinUI: { stage: 'ready' },
    getDinGuidanceContext: () => ctx,
    recordDinGuidance: action => { records.push(action); ctx.seen = true; },
    startTrialPlay: () => { plays++; }
  };
  environment.window = environment;
  vm.runInNewContext(fs.readFileSync('public/tools/digit-in-noise-test/js/tutorial.js', 'utf8'), environment);
  const click = key => node(key).handlers.click();
  const digit = value => node('guideKeypad').handlers.click({ target: { closest: () => ({ dataset: { digit: value } }) } });
  return { node, ctx, records, click, digit, environment, plays: () => plays };
}

for (const condition of ['2f', '2b', '3f', '3b', '5f']) {
  const h = harness(condition);
  const { environment: e, node, click, digit } = h;
  e.dinTutorial.offer();
  assert.equal(e.dinTutorial.isOpen(), true);
  assert.equal(node('guideHeard').children.length, h.ctx.nDigits);
  click('guideNext');
  node('guideKeypad').handlers.click({ target: { closest: () => ({ id: 'guideCheck', dataset: {} }) } });
  assert.match(node('guideFeedback').textContent, /guideIncomplete/);
  digit('0');
  node('dinTutorial').handlers.keydown({ key: 'Backspace', target: {}, preventDefault() {} });
  assert.ok(node('guideAnswer').children.every(child => child.textContent === ''));
  const values = [2, 7, 4, 1, 9].slice(0, h.ctx.nDigits);
  if (h.ctx.dir === 'backward') values.reverse();
  for (const value of values) digit(String(value));
  assert.equal(h.plays(), 0);
  assert.equal(h.records.length, 0);
  node('dinTutorial').handlers.keydown({ key: 'Enter', target: { tagName: 'H2' }, preventDefault() {} });
  assert.match(node('guideTitle').textContent, /guideReadyTitle/);
  click('guideNext');
  click('guideNext');
  assert.equal(h.plays(), 1, 'double click must not start two trials');
  assert.deepEqual(h.records, ['completed']);
  e.dinTutorial.offer();
  assert.equal(e.dinTutorial.isOpen(), false, 'must remember this session');
  e.dinUI.stage = 'responding';
  click('reviewTutorial');
  assert.equal(e.dinTutorial.isOpen(), false, 'must not interrupt timed response');
  e.dinUI.stage = 'ready';
  click('reviewTutorial');
  click('guideSkip');
  assert.equal(h.plays(), 1, 'skip must not auto-play');
  h.ctx.seen = false;
  h.ctx.firstCondition = false;
  e.dinTutorial.offer();
  assert.match(node('guideTitle').textContent, new RegExp('cond_' + condition));
  click('guideNext');
  assert.equal(h.plays(), 2);
  assert.equal(h.records.at(-1), 'acknowledged');
  h.ctx.seen = false;
  h.ctx.started = true;
  e.dinTutorial.offer();
  assert.equal(e.dinTutorial.isOpen(), false, 'existing sessions must resume without forced tutorial');
  console.log('PASS tutorial', condition, 'input, reverse order, skip, replay, transitions, isolation');
}
