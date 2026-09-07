/* A silent, independent demonstration: never call the stimulus renderer or submitInput. */
(() => {
  const dialog = document.getElementById('dinTutorial');
  if (!dialog) return;
  const el = id => document.getElementById(id);
  let context;
  let step = 0;
  let answer = '';
  let feedback = '';
  let review = false;
  let recap = false;
  const digits = () => [2, 7, 4, 1, 9].slice(0, context.nDigits);
  const expected = () => (context.dir === 'backward' ? digits().reverse() : digits()).join('');
  const drawDigits = (target, values, count) => {
    target.replaceChildren();
    for (let i = 0; i < count; i++) {
      const box = document.createElement('span');
      box.textContent = values[i] ?? '';
      box.style.setProperty('--digit-index', i);
      target.appendChild(box);
    }
  };
  const renderAnswer = () => {
    drawDigits(el('guideAnswer'), answer, context.nDigits);
    el('guideAnswer').setAttribute('aria-label', t('guideYourAnswer', { answer: answer.split('').join(' ') || t('guideEmpty') }));
    el('guideFeedback').textContent = t(feedback || 'guideTryHint', { answer: expected().split('').join(' '), count: context.nDigits });
    el('guideFeedback').dataset.tone = feedback ? 'warning' : '';
  };
  const render = (focus = true) => {
    dialog.dataset.step = String(step);
    el('guideStep').textContent = recap ? t('guideNewCondition') : t('guideStep', { step: step + 1 });
    el('guideTitle').textContent = t(recap ? 'cond_' + context.id : ['guideListenTitle', 'guideTryTitle', 'guideReadyTitle'][step]);
    el('guideText').textContent = step === 0
      ? t('guideListenText', { count: context.nDigits })
      : t(context.dir === 'backward' ? 'guideBackward' : 'guideForward');
    el('guideExampleLabel').textContent = t('guideExampleLabel');
    drawDigits(el('guideHeard'), digits(), context.nDigits);
    el('guideHeard').setAttribute('aria-label', t('guideHeard', { digits: digits().join(' ') }));
    el('guideHeard').classList.toggle('guide-animate', step === 0);
    el('guideReplay').hidden = step !== 0;
    el('guideTry').hidden = step !== 1;
    el('guideResult').hidden = step !== 2;
    if (step === 2) {
      drawDigits(el('guideExpected'), expected(), context.nDigits);
      el('guideExpected').setAttribute('aria-label', t('guideYourAnswer', { answer: expected().split('').join(' ') }));
    }
    el('guideNote').textContent = step === 0 ? t('guideSilent') : step === 1 ? t('guideNotScored')
      : t('guideReadyText', { answer: expected().split('').join(' ') });
    el('guideBack').hidden = step === 0 || recap;
    el('guideNext').hidden = step === 1;
    el('guideNext').textContent = t(step === 2 ? (review && context.started ? 'guideReturn' : 'guideStart') : 'guideNext');
    if (step === 1) renderAnswer();
    if (focus) {
      dialog.scrollTop = 0;
      el('guideTitle').focus({ preventScroll: true });
    }
  };
  const open = (isReview = false) => {
    if (dialog.open || !['ready', 'error'].includes(window.dinUI?.stage)) return;
    context = window.getDinGuidanceContext();
    if (!context) return;
    review = isReview;
    recap = !review && !context.firstCondition;
    step = recap ? 2 : 0;
    answer = '';
    feedback = '';
    dialog.showModal();
    render();
  };
  const close = (action, start = false) => {
    if (!dialog.open) return;
    window.recordDinGuidance(action);
    dialog.close();
    el('guideHeard').classList.remove('guide-animate');
    el('playTrial').focus({ preventScroll: true });
    if (start) window.startTrialPlay();
  };
  const check = () => {
    if (answer === expected()) {
      step = 2;
      render();
    } else {
      feedback = answer.length !== context.nDigits ? 'guideIncomplete' : 'guideTryAgain';
      renderAnswer();
    }
  };
  const input = value => {
    if (answer.length < context.nDigits) answer += value;
    feedback = '';
    renderAnswer();
  };
  const remove = () => { answer = answer.slice(0, -1); feedback = ''; renderAnswer(); };
  el('guideSkip').addEventListener('click', () => close('skipped'));
  dialog.addEventListener('cancel', event => { event.preventDefault(); close('skipped'); });
  el('guideNext').addEventListener('click', () => {
    if (step === 2) close(recap ? 'acknowledged' : 'completed', !(review && context.started));
    else { step++; render(); }
  });
  el('guideBack').addEventListener('click', () => { step--; render(); });
  el('guideReplay').addEventListener('click', () => {
    el('guideHeard').classList.remove('guide-animate');
    void el('guideHeard').offsetWidth;
    el('guideHeard').classList.add('guide-animate');
  });
  el('guideKeypad').addEventListener('click', event => {
    const button = event.target.closest('button');
    if (button?.dataset.digit != null) input(button.dataset.digit);
    else if (button?.id === 'guideDelete') remove();
    else if (button?.id === 'guideCheck') check();
  });
  dialog.addEventListener('keydown', event => {
    if (step !== 1 || event.altKey || event.ctrlKey || event.metaKey) return;
    if (/^\d$/.test(event.key)) { event.preventDefault(); input(event.key); }
    else if (['Backspace', 'Delete'].includes(event.key)) { event.preventDefault(); remove(); }
    // Preserve native Enter/Space activation on navigation and keypad buttons.
    else if (event.key === 'Enter' && event.target.tagName !== 'BUTTON') { event.preventDefault(); check(); }
  });
  el('reviewTutorial').addEventListener('click', () => open(true));
  document.addEventListener('uiLanguageChanged', () => { if (dialog.open) render(false); });
  window.dinTutorial = {
    isOpen: () => dialog.open,
    offer: () => {
      const current = window.getDinGuidanceContext();
      if (current && !current.seen && !current.started) open();
    }
  };
})();
