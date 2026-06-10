// js/i18n.js
const translations = {
  english: {
    introTitle: "Welcome to the integrated digit-in-noise test!",
    introText: "This test measures your ability to hear numbers in background noise. You will hear sequences of three digits and then repeat them.",
    introNote: "Please use wired headphones and be in a quiet room.",
    infoTitle: "Participant information",
    gender: "Gender (required)",
    age: "Age",
    education: "Education years",
    pid: "Participant ID (required)",
    stimLang: "Stimulus language (audio)",
    whichTest: "Which test?",
    calibTitle: "Calibration",
    calibText: "Please connect wired headphones. Use the slider to adjust the background noise until the noise is comfortably audible.",
    noiseGainLabel: "Noise level",
    resultsTitle: "Results"    
  },
  mandarin: {
    introTitle: "欢迎尝试噪声下数字整合测试！",
    introText: "该测试用于测量您在背景噪声下听取数字的能力。您将听到三位数字序列并重复它们。",
    introNote: "请使用有线耳机并在安静环境下进行测试。",
    infoTitle: "参与者信息",
    gender: "性别（必填）",
    age: "年龄",
    education: "受教育年数",
    pid: "测试编号（必填）",
    stimLang: "刺激语言（音频）",
    whichTest: "选择测试",
    calibTitle: "校准",
    calibText: "请连接有线耳机。用滑块调整背景噪声到一个舒适的音量。",
    noiseGainLabel: "噪声音量",
    resultsTitle: "测试结果"    
  }
};

function setUILanguage(lang) {
  localStorage.setItem('uiLang', lang);
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    const text = (translations[lang] && translations[lang][key]) || (translations['english'][key]) || key;
    el.textContent = text;
  });
}

// === i18n additions ===
// 1) 扩展翻译表（只增不改原 keys）
Object.assign(translations.english, {
  languageLabel: "Language",
  start: "Start test",
  researcherDashboard: "Researcher dashboard",
  proceed: "Proceed to calibration",
  setupRequired: "Please complete required fields and keep values in range.",
  readinessTitle: "Before continuing",
  readinessIntro: "Please confirm the testing setup. These checks help keep the online test data reliable.",
  readinessHeadphones: "I am using headphones or earphones.",
  readinessQuiet: "I am in a quiet environment.",
  readinessAudio: "My device volume is on and browser audio is allowed.",
  readinessRequired: "Please confirm the testing setup before continuing.",
  chooseConditions: "Select test conditions (check any)",
  condHelp: "You may select one or more conditions.",
  randomizeConditions: "Randomize selected condition order",
    randomizeConditionsHelp: "If enabled, the selected conditions will be completed once in a randomized order.",
    calibConfirm: "Confirm and Start Test",
    playNoise: "Play noise",
    stop: "Stop",
    calibAudioLoading: "Loading calibration audio. Please wait...",
    calibAudioLoadingProgress: "Loading calibration audio ({loaded}/{total})...",
    calibAudioReady: "Audio ready. Click Play noise to begin calibration.",
    calibAudioFailed: "Audio failed to load. Check the audio files or connection, then click Play noise to retry.",
    calibStartingNoise: "Starting noise playback...",
    calibNoisePlaying: "Noise is playing. Adjust the level until it is comfortably audible.",
    calibNoiseStopped: "Noise stopped. Click Play noise to listen again.",
    calibNoiseStartFailed: "Could not start playback. Click Play noise to try again.",
    calibAudioNotReady: "Please wait until audio is ready before continuing.",
    noiseDown: "-1 dB",
    noiseUp: "+1 dB",
    resetNoise: "Reset",
    noiseDbInput: "Noise adjustment (dB)",
    calibNumericHelp: "The value is saved for the rest of this test and applied equally to speech and noise.",
    calibAudibleConfirm: "I can hear the noise clearly and comfortably at this level.",
    calibRequirementLoading: "Wait until the calibration audio is ready.",
    calibRequirementPlay: "Play the noise once before confirming calibration.",
    calibRequirementConfirm: "Confirm that this level is clearly and comfortably audible.",
    calibRequirementComplete: "Calibration is confirmed. You can start the test.",
    calibRequirementMissing: "Please play the noise and confirm the calibrated level before continuing.",
    calibReconfirmAfterAdjustment: "Noise level changed. Please confirm the new level before continuing.",

    // test page
  condTitle: "Condition",
  play: "Play",
  ok: "OK",
  nextCond: "Next Condition",
  playHint: "After playback, type the digits and press OK.",
  backspace: "Backspace",
  progressTrial: "Trial {i}/{N}",
  introPractice: "{label} — Practice {p}/3. Click Play to start.",
  introFormal: "{label} — Trial {i}/{N}. Click Play to start.",
  testStateReady: "Ready",
  testStatePreparing: "Preparing",
  testStatePlaying: "Listening",
  testStateResponding: "Enter response",
  testStateSaving: "Saving",
  testStateError: "Check playback",

  // condition labels (for UI 展示)
  cond_2f: "2-digit forward",
  cond_2b: "2-digit backward",
  cond_3f: "3-digit forward",
  cond_3b: "3-digit backward",
  cond_5f: "5-digit forward",

  // results
  resultsTitle2: "Results",
  perCondMetrics: "Per-condition metrics",
  diffsTitle: "Differences",
  noCond: "No condition results to show.",
  noDiff: "No differences to show.",
  thCondition: "Condition",
  thSRT: "SRT (dB)",
  thRTAll: "RT (all) ms",
  thRTCorrect: "RT (correct) ms",
  dlJson: "Download JSON",
  dlCsv: "Download CSV (trials)",
  returnHome: "Return Home",
  uploadStatusTitle: "Server save status",
  retryUpload: "Retry upload",
  uploadPending: "Result is safely stored in this browser and waiting to upload.",
  uploadSaving: "Saving to server... Attempt {attempts}.",
  uploadSaved: "Saved to server. Record ID: {serverId}",
  uploadFailed: "Upload failed. The complete result is still stored in this browser.",
  uploadLeaveWarning: "The result has not been saved to the server yet. It is stored locally in this browser, but leaving now may make retry harder. Leave anyway?"
});
Object.assign(translations.mandarin, {
  languageLabel: "语言",
  start: "开始测试",
  researcherDashboard: "研究者后台",
  proceed: "进入校准",
  setupRequired: "请先完成所有必填项，并确保数值在允许范围内。",
  readinessTitle: "继续前请确认",
  readinessIntro: "请确认当前测试设置。这些检查有助于保证线上测试数据质量。",
  readinessHeadphones: "我正在使用耳机或入耳式耳机。",
  readinessQuiet: "我处在安静的测试环境中。",
  readinessAudio: "设备音量已开启，浏览器音频播放已允许。",
  readinessRequired: "继续前请先确认测试设置。",
  chooseConditions: "选择测试条件（可多选）",
  condHelp: "可以选择一个或多个条件。",
  randomizeConditions: "随机化已选择测试条件的顺序",
    randomizeConditionsHelp: "勾选后，已选择的测试条件会按一次性随机顺序完成。",
    calibConfirm: "确认并开始测试",
    playNoise: "播放噪声",
    stop: "停止",
    calibAudioLoading: "正在加载校准音频，请稍等...",
    calibAudioLoadingProgress: "正在加载校准音频（{loaded}/{total}）...",
    calibAudioReady: "音频已准备好。请点击“播放噪声”开始校准。",
    calibAudioFailed: "音频加载失败。请检查音频文件或网络连接，然后点击“播放噪声”重试。",
    calibStartingNoise: "正在启动噪声播放...",
    calibNoisePlaying: "噪声正在播放。请调整到舒适可听的音量。",
    calibNoiseStopped: "噪声已停止。点击“播放噪声”可再次试听。",
    calibNoiseStartFailed: "无法开始播放。请再次点击“播放噪声”重试。",
    calibAudioNotReady: "请等待音频准备好后再继续。",
    noiseDown: "-1 dB",
    noiseUp: "+1 dB",
    resetNoise: "重置",
    noiseDbInput: "噪声调整（dB）",
    calibNumericHelp: "该数值会用于本次测试后续所有试次，并同时作用于语音和噪声。",
    calibAudibleConfirm: "我能清楚且舒适地听到当前噪声音量。",
    calibRequirementLoading: "请等待校准音频准备好。",
    calibRequirementPlay: "请先播放一次噪声，再确认校准。",
    calibRequirementConfirm: "请确认当前音量清楚且舒适可听。",
    calibRequirementComplete: "校准已确认，可以开始测试。",
    calibRequirementMissing: "请先播放噪声并确认校准音量，然后再继续。",
    calibReconfirmAfterAdjustment: "噪声音量已改变。继续前请重新确认当前音量。",

  // test page
  condTitle: "测试条件",
  play: "播放",
  ok: "确定",
  nextCond: "进入下一个条件",
  playHint: "播放结束后，请输入数字并点击“确定”。",
  backspace: "退格",
  progressTrial: "第 {i}/{N} 条",
  introPractice: "{label} — 练习 {p}/3。点击“播放”开始。",
  introFormal: "{label} — 第 {i}/{N} 条。点击“播放”开始。",
  testStateReady: "准备",
  testStatePreparing: "准备音频",
  testStatePlaying: "聆听",
  testStateResponding: "输入答案",
  testStateSaving: "保存",
  testStateError: "检查播放",

  // condition labels
  cond_2f: "2位顺背",
  cond_2b: "2位倒背",
  cond_3f: "3位顺背",
  cond_3b: "3位倒背",
  cond_5f: "5位顺背",

  // results
  resultsTitle2: "测试结果",
  perCondMetrics: "各条件指标",
  diffsTitle: "差值",
  noCond: "暂无可显示的条件结果。",
  noDiff: "暂无可显示的差值。",
  thCondition: "条件",
  thSRT: "SRT（dB）",
  thRTAll: "平均反应时（全部）ms",
  thRTCorrect: "平均反应时（正确）ms",
  dlJson: "下载 JSON",
  dlCsv: "下载 CSV（试次）",
  returnHome: "返回首页",
  uploadStatusTitle: "服务器保存状态",
  retryUpload: "重新上传",
  uploadPending: "结果已安全保存在本浏览器中，等待上传。",
  uploadSaving: "正在保存到服务器... 第 {attempts} 次尝试。",
  uploadSaved: "已保存到服务器。记录 ID：{serverId}",
  uploadFailed: "上传失败。完整结果仍保存在本浏览器中。",
  uploadLeaveWarning: "结果还没有保存到服务器。目前它保存在本浏览器中，但现在离开会增加之后重试的难度。仍然离开吗？"
});

// 2) 简单取词 + 占位符替换
function t(key, vars) {
  const lang = localStorage.getItem('uiLang') || 'english';
  const fall = (translations['english'] && translations['english'][key]) || key;
  let s = (translations[lang] && translations[lang][key]) || fall;
  if (vars && typeof s === 'string') {
    s = s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : `{${k}}`));
  }
  return s;
}
window.t = t;

// 3) 让 setUILanguage 支持属性翻译（不改函数名/签名）
const _origSetUILanguage = setUILanguage;
setUILanguage = function(lang) {
  _origSetUILanguage(lang);
  // 处理带 data-i18n-attr 的元素，如 title/placeholder 等
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const attr = el.getAttribute('data-i18n-attr');
    if (key && attr) {
      const val = (translations[lang] && translations[lang][key]) || (translations['english'][key]) || key;
      el.setAttribute(attr, val);
    }
  });
  // 触发一个事件，便于页面脚本在语言切换后刷新动态文案
  document.dispatchEvent(new CustomEvent('uiLanguageChanged', { detail: { lang }}));
};

// === Segmented language init (通用) ===
function initSegmentedLanguage() {
  const seg = document.getElementById('uiLangSeg');
  const select = document.getElementById('uiLang');
  if (!seg || !select) return;

  const radios = seg.querySelectorAll('input[name="segLang"]');
  const apply = (lang) => {
    if (select) select.value = lang;
    localStorage.setItem('uiLang', lang);
    setUILanguage(lang);
    radios.forEach(r => r.checked = (r.value === lang));
  };

  // 初始化：读取本地语言或当前下拉
  const saved = localStorage.getItem('uiLang') || select.value || 'english';
  apply(saved);

  // 分段切换 -> 应用语言
  seg.addEventListener('change', (e) => {
    if (e.target && e.target.name === 'segLang') apply(e.target.value);
  });

  // 下拉切换（兜底）-> 同步分段
  select.addEventListener('change', () => apply(select.value));
}
document.addEventListener('DOMContentLoaded', initSegmentedLanguage);

translations.english.infoHeading = translations.english.infoHeading || "Participant Information";
translations.mandarin.infoHeading = translations.mandarin.infoHeading || "参与者信息";

// Ensure info page strings exist
translations.english.infoTitle   = translations.english.infoTitle   || "Participant Information";
translations.mandarin.infoTitle  = translations.mandarin.infoTitle  || "参与者信息";
translations.english.infoHeading = translations.english.infoHeading || "Participant Information";
translations.mandarin.infoHeading= translations.mandarin.infoHeading|| "参与者信息";

// --- info page extra keys (ensure i18n works on options and labels) ---
translations.english.male = translations.english.male || "Male";
translations.mandarin.male = translations.mandarin.male || "男";

translations.english.female = translations.english.female || "Female";
translations.mandarin.female = translations.mandarin.female || "女";

translations.english.other = translations.english.other || "Other";
translations.mandarin.other = translations.mandarin.other || "其他";

translations.english.participantId = translations.english.participantId || "Participant ID";
translations.mandarin.participantId = translations.mandarin.participantId || "参与者编号";

translations.english.mandarin = translations.english.mandarin || "Mandarin";
translations.mandarin.mandarin = translations.mandarin.mandarin || "普通话";
translations.english.cantonese = translations.english.cantonese || "Cantonese";
translations.mandarin.cantonese = translations.mandarin.cantonese || "粤语";
translations.english.british_english = translations.english.british_english || "British_English";
translations.mandarin.british_english = translations.mandarin.british_english || "英国英语";
translations.english.american_english = translations.english.american_english || "American English";
translations.mandarin.american_english = translations.mandarin.american_english || "美国英语";
translations.english.taiwanese = translations.english.taiwanese || "Taiwanese";
translations.mandarin.taiwanese = translations.mandarin.taiwanese || "台语";
translations.english.ningboese = translations.english.ningboese || "Ningboese";
translations.mandarin.ningboese = translations.mandarin.ningboese || "宁波话";
translations.english.hangzhouese = translations.english.hangzhouese || "Hangzhouese";
translations.mandarin.hangzhouese = translations.mandarin.hangzhouese || "杭州话";
translations.english.min = translations.english.min || "Min";
translations.mandarin.min = translations.mandarin.min || "闽南语";
translations.english.fuzhouese = translations.english.fuzhouese || "Fuzhouese";
translations.mandarin.fuzhouese = translations.mandarin.fuzhouese || "福州话";

// 只翻译 title 的轻量扩展：不会改元素的 innerHTML
(function () {
  if (typeof window.setUILanguage !== 'function') return;
  const _orig = window.setUILanguage;
  window.setUILanguage = function (lang) {
    _orig(lang);
    const dict = (window.translations && (window.translations[lang] || window.translations.english)) || {};
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const val = (dict && dict[key]) || key;
      el.setAttribute('title', val);
    });
  };
})();

