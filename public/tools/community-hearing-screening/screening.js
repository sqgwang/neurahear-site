(function () {
  "use strict";

  const CONFIG = Object.freeze({
    appVersion: "community-screening-2026.07.23-2",
    schemaVersion: "community-hearing-screening-result-v1",
    protocolId: "mandarin-2f-community-screening-v1",
    protocolLabel: "Mandarin 2-digit forward community hearing screening",
    stimulusLanguage: "mandarin",
    audioBase: "/tools/digit-in-noise-test/audio/mandarin",
    nDigits: 2,
    practiceCount: 5,
    formalCount: 24,
    srtWindow: 20,
    startSnrDb: 0,
    stepDb: 2,
    minSnrDb: -30,
    maxSnrDb: 30,
    referralCutoffDbSnr: -8.0,
    referralCriterion: "Provisional Mandarin 2-digit reference boundary; prospective community validation required",
    prePadSeconds: 0.5,
    postPadSeconds: 0.5,
    interDigitGapSeconds: 0.2,
    normalizationRms: 0.05,
    nextTrialDelayMs: 900
  });

  const STORAGE = Object.freeze({
    uiLanguage: "nh.communityScreening.uiLanguage",
    activeSession: "nh.communityScreening.activeSession",
    fixedGain: "nh.communityScreening.fixedGain",
    uploadPrefix: "nh.communityScreening.upload.v1:"
  });

  const TRANSLATIONS = {
    "zh-CN": {
      brandSubtitle: "社区听力筛查",
      languageLabel: "界面语言",
      staffDashboard: "工作人员后台",
      stepWelcome: "准备",
      stepCalibration: "校准",
      stepScreening: "筛查",
      stepResult: "结果",
      welcomeEyebrow: "约 5 分钟 · 普通话",
      welcomeTitle: "在背景噪声中聆听数字，快速了解你的听力",
      welcomeIntro: "你会听到两个被噪声包围的普通话数字。每次播放后，按顺序输入听到的数字；系统会自动调节难度。",
      featureHeadphones: "使用双耳耳机",
      featureDuration: "约 5 分钟",
      featureOutcome: "即时筛查结果",
      participantHeading: "基本资料",
      participantHelp: "请勿输入姓名、电话或身份证号码。",
      participantCode: "参与者编号",
      participantPlaceholder: "例如：C001",
      age: "年龄",
      gender: "性别（选填）",
      preferNotSay: "不填写",
      female: "女性",
      male: "男性",
      other: "其他",
      stimulusLanguage: "测试语言",
      mandarin: "普通话",
      beforeStart: "开始前请确认",
      checkHeadphones: "我已戴好可同时覆盖双耳的耳机或耳塞。",
      checkQuiet: "我身处安静环境，并已关闭其他会播放声音的程序。",
      checkUnderstand: "我明白这是听力筛查而非医疗诊断；如有听力疑虑，仍应寻求专业评估。",
      continueCalibration: "继续校准",
      setupRequired: "请填写参与者编号及有效年龄，并确认所有开始前事项。",
      calibrationEyebrow: "步骤 2 / 4",
      calibrationTitle: "把噪声调到清楚而舒适的音量",
      calibrationIntro: "按播放后调整音量。正式筛查会固定使用你确认的音量，请不要再改动设备音量。",
      audioLoading: "正在准备测试声音",
      audioLoadingDetail: "首次加载可能需要一些时间。",
      audioReady: "测试声音已准备好",
      audioReadyDetail: "现在可以播放噪声并进行音量校准。",
      audioFailed: "测试声音加载失败",
      audioFailedDetail: "请检查网络连接，然后按下方按钮重试。",
      playNoise: "播放噪声",
      stopNoise: "停止噪声",
      retryAudio: "重新加载声音",
      noiseInstruction: "声音准备完成后即可播放。",
      noisePlayingInstruction: "请调至清楚可闻、舒适且不刺耳的音量。",
      noiseStoppedInstruction: "可再次播放确认，或勾选下方确认项目。",
      noiseLevel: "噪声音量",
      calibrationConfirmed: "我能清楚、舒适地听到噪声，并会保持目前的设备音量。",
      calibrationRequirement: "请至少播放一次噪声，并确认目前音量舒适。",
      calibrationChanged: "音量已改变，请重新确认目前音量。",
      startPractice: "开始练习",
      back: "返回",
      practice: "练习",
      formalScreening: "正式筛查",
      ready: "准备就绪",
      preparing: "正在准备",
      listening: "请聆听",
      enterDigits: "输入数字",
      savingAnswer: "记录答案",
      playbackError: "播放出错",
      play: "播放",
      testReady: "按下播放，聆听两个数字。",
      testPreparing: "正在准备声音，请稍候。",
      testPlaying: "正在播放，请仔细聆听。",
      testRespond: "按顺序输入你听到的两个数字。",
      testNeedDigits: "请输入完整的两个数字。",
      testPlaybackFailed: "声音未能播放，请按播放重试并检查浏览器声音权限。",
      practiceCorrect: "正确。下一个练习即将开始。",
      practiceContinue: "下一个练习即将开始。",
      practiceRetry: "答案是 {answer}。声音将再次播放。",
      formalStarting: "练习完成，正式筛查即将开始。",
      nextTrial: "答案已记录，下一题即将播放。",
      confirmAnswer: "确认",
      backspace: "删除",
      screeningComplete: "筛查完成",
      passTitle: "本次筛查结果在暂定参考范围内",
      passMessage: "你在背景噪声中辨认普通话数字的表现未达到本筛查的暂定转介界值。",
      referTitle: "建议安排进一步听力评估",
      referMessage: "你在背景噪声中辨认普通话数字的结果达到本筛查的暂定转介界值。",
      srtLabel: "言语接收阈值（SRT）",
      nextSteps: "下一步",
      passNextStep: "如你仍觉得听声或理解说话有困难、出现耳鸣或两耳差异，仍建议咨询听力专业人员。即使没有疑虑，也可定期重做筛查。",
      referNextStep: "请考虑预约听力学家或合适的医疗专业人员，接受耳科检查及标准纯音听力测试。本结果本身不能诊断听力损失。",
      resultLimit: "此双耳筛查主要反映较好耳的表现，不能排除单侧、不对称或其他类型的听力问题。普通话两位数字的自动转介界值仍处于社区验证阶段。",
      saveStatus: "记录保存状态",
      savePending: "正在安全保存本次筛查记录。",
      saveUploading: "正在上传记录（第 {attempts} 次尝试）。",
      saveSaved: "记录已安全保存。编号：{serverId}",
      saveFailed: "记录尚未保存，请保持此页面开启并重试。",
      retry: "重试",
      backToTools: "返回工具列表",
      newScreening: "开始新的筛查",
      leaveWarning: "本次筛查记录尚未安全保存。确定离开吗？",
      protocolFooter: "普通话两位数字社区听力筛查协议 · 转介界值待验证"
    },
    en: {
      brandSubtitle: "Community Hearing Screening",
      languageLabel: "Interface language",
      staffDashboard: "Staff dashboard",
      stepWelcome: "Prepare",
      stepCalibration: "Calibrate",
      stepScreening: "Screen",
      stepResult: "Result",
      welcomeEyebrow: "About 5 minutes · Mandarin",
      welcomeTitle: "Listen for digits in background noise and check your hearing",
      welcomeIntro: "You will hear two Mandarin digits in noise. Enter the digits in the same order after each presentation; the test adjusts the difficulty automatically.",
      featureHeadphones: "Use headphones on both ears",
      featureDuration: "About 5 minutes",
      featureOutcome: "Immediate screening result",
      participantHeading: "Basic information",
      participantHelp: "Do not enter a name, phone number, or identity document number.",
      participantCode: "Participant code",
      participantPlaceholder: "For example: C001",
      age: "Age",
      gender: "Gender (optional)",
      preferNotSay: "Prefer not to say",
      female: "Female",
      male: "Male",
      other: "Other",
      stimulusLanguage: "Test language",
      mandarin: "Mandarin",
      beforeStart: "Before you begin",
      checkHeadphones: "I am wearing headphones or earphones on both ears.",
      checkQuiet: "I am in a quiet place and have closed other apps that may play sound.",
      checkUnderstand: "I understand this is a hearing screen, not a medical diagnosis, and that hearing concerns still require professional assessment.",
      continueCalibration: "Continue to calibration",
      setupRequired: "Enter a participant code and valid age, then confirm every item before continuing.",
      calibrationEyebrow: "Step 2 of 4",
      calibrationTitle: "Set the noise to a clear, comfortable level",
      calibrationIntro: "Play the noise and adjust the level. The screening will keep this level fixed, so do not change your device volume afterwards.",
      audioLoading: "Preparing the test audio",
      audioLoadingDetail: "The first load may take a little time.",
      audioReady: "Test audio is ready",
      audioReadyDetail: "You can now play the noise and calibrate the level.",
      audioFailed: "Test audio could not be loaded",
      audioFailedDetail: "Check the connection, then use the button below to retry.",
      playNoise: "Play noise",
      stopNoise: "Stop noise",
      retryAudio: "Reload audio",
      noiseInstruction: "Playback will be available when the audio is ready.",
      noisePlayingInstruction: "Adjust to a clear, comfortable level that is not uncomfortably loud.",
      noiseStoppedInstruction: "Play it again to check, or confirm the level below.",
      noiseLevel: "Noise level",
      calibrationConfirmed: "I can hear the noise clearly and comfortably and will keep the current device volume.",
      calibrationRequirement: "Play the noise at least once and confirm the comfortable level.",
      calibrationChanged: "The level changed. Please confirm the current level again.",
      startPractice: "Start practice",
      back: "Back",
      practice: "Practice",
      formalScreening: "Screening",
      ready: "Ready",
      preparing: "Preparing",
      listening: "Listening",
      enterDigits: "Enter digits",
      savingAnswer: "Saving answer",
      playbackError: "Playback error",
      play: "Play",
      testReady: "Press Play and listen for two digits.",
      testPreparing: "Preparing the sound. Please wait.",
      testPlaying: "Audio is playing. Listen carefully.",
      testRespond: "Enter the two digits in the order you heard them.",
      testNeedDigits: "Enter both digits before confirming.",
      testPlaybackFailed: "Audio did not play. Press Play to retry and check browser sound permission.",
      practiceCorrect: "Correct. The next practice item will begin shortly.",
      practiceContinue: "The next practice item will begin shortly.",
      practiceRetry: "The answer was {answer}. The sound will play again.",
      formalStarting: "Practice is complete. The screening will begin shortly.",
      nextTrial: "Answer recorded. The next item will play shortly.",
      confirmAnswer: "Confirm",
      backspace: "Backspace",
      screeningComplete: "Screening complete",
      passTitle: "Your result is within the provisional reference range",
      passMessage: "Your recognition of Mandarin digits in background noise did not reach this screen's provisional referral cutoff.",
      referTitle: "A further hearing assessment is recommended",
      referMessage: "Your recognition of Mandarin digits in background noise reached this screen's provisional referral cutoff.",
      srtLabel: "Speech reception threshold (SRT)",
      nextSteps: "Next step",
      passNextStep: "If you still notice difficulty hearing or understanding speech, tinnitus, or a difference between ears, speak with a hearing professional. Otherwise, consider repeating a hearing screen regularly.",
      referNextStep: "Consider booking a registered audiologist or an appropriate healthcare professional for an ear examination and standard pure-tone hearing test. This result alone cannot diagnose hearing loss.",
      resultLimit: "This binaural screen mainly reflects the better ear and cannot rule out unilateral, asymmetric, or other hearing problems. The automated referral cutoff for the Mandarin two-digit protocol is still undergoing community validation.",
      saveStatus: "Record save status",
      savePending: "Securely saving this screening record.",
      saveUploading: "Uploading the record (attempt {attempts}).",
      saveSaved: "Record saved securely. ID: {serverId}",
      saveFailed: "The record is not yet saved. Keep this page open and retry.",
      retry: "Retry",
      backToTools: "Back to tools",
      newScreening: "Start a new screening",
      leaveWarning: "This screening record has not been saved securely. Leave anyway?",
      protocolFooter: "Mandarin 2-digit community hearing screening protocol · cutoff under validation"
    }
  };

  const PRACTICE_ITEMS = [
    { digits: [1, 2], noiseEnabled: false, snrDb: 0, mustCorrect: true },
    { digits: [6, 8], noiseEnabled: false, snrDb: 0, mustCorrect: true },
    { digits: [5, 9], noiseEnabled: true, snrDb: 6, mustCorrect: false },
    { digits: [7, 1], noiseEnabled: true, snrDb: 4, mustCorrect: false },
    { digits: [9, 0], noiseEnabled: true, snrDb: 2, mustCorrect: false }
  ];

  const storedUiLanguage = localStorage.getItem(STORAGE.uiLanguage);
  const state = {
    uiLanguage: storedUiLanguage === "en" ? "en" : "zh-CN",
    currentScreen: "welcome",
    audioContext: null,
    audioData: null,
    audioLoadPromise: null,
    noiseSource: null,
    noiseGainNode: null,
    fixedGainDb: readNumber(localStorage.getItem(STORAGE.fixedGain), 0),
    noisePlaying: false,
    noisePlayed: false,
    calibrationConfirmed: false,
    calibrationStartedAt: null,
    calibrationPlayCount: 0,
    calibrationPlaybackStartedAt: null,
    calibrationPlaybackMs: 0,
    calibrationAdjustmentCount: 0,
    session: null,
    phase: "practice",
    practiceIndex: 0,
    formalIndex: 0,
    currentSnrDb: CONFIG.startSnrDb,
    currentDigits: null,
    currentTrialMeta: null,
    enteredDigits: "",
    awaitingResponse: false,
    playbackActive: false,
    playbackEndedAt: null,
    autoPlayToken: 0,
    uploadRecord: null
  };

  function $(id) {
    return document.getElementById(id);
  }

  function readNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function round(value, places = 2) {
    const scale = 10 ** places;
    return Math.round(value * scale) / scale;
  }

  function average(values) {
    if (!Array.isArray(values) || values.length === 0) return null;
    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function t(key, vars = {}) {
    const table = TRANSLATIONS[state.uiLanguage] || TRANSLATIONS["zh-CN"];
    const fallback = TRANSLATIONS["zh-CN"][key] || key;
    return String(table[key] || fallback).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  function applyLanguage() {
    document.documentElement.lang = state.uiLanguage;
    document.title = state.uiLanguage === "en"
      ? "Community Hearing Screening | NeuraHear"
      : "普通话社区听力筛查 | NeuraHear";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.textContent = t(element.dataset.i18n);
    });
    document.querySelectorAll("[data-i18n-title]").forEach((element) => {
      const value = t(element.dataset.i18nTitle);
      element.title = value;
      element.setAttribute("aria-label", value);
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
      element.placeholder = t(element.dataset.i18nPlaceholder);
    });
    renderDynamicText();
  }

  function renderDynamicText() {
    renderCalibrationControls();
    renderTestHeader();
    if (state.currentScreen === "result" && state.session?.result) {
      renderOutcome(state.session.result);
      renderUploadState();
    }
  }

  function createSessionId() {
    const random = Math.random().toString(36).slice(2, 9);
    return `community_${Date.now()}_${random}`;
  }

  function saveActiveSession() {
    if (!state.session) return;
    state.session.runtime = {
      phase: state.phase,
      practiceIndex: state.practiceIndex,
      formalIndex: state.formalIndex,
      currentSnrDb: state.currentSnrDb
    };
    localStorage.setItem(STORAGE.activeSession, JSON.stringify(state.session));
  }

  function showScreen(name) {
    stopNoise();
    state.currentScreen = name;
    const order = ["welcome", "calibration", "screening", "result"];
    document.querySelectorAll("[data-screen]").forEach((section) => {
      const active = section.dataset.screen === name;
      section.hidden = !active;
      section.classList.toggle("is-active", active);
    });
    document.querySelectorAll("[data-step-nav]").forEach((item) => {
      const itemIndex = order.indexOf(item.dataset.stepNav);
      const currentIndex = order.indexOf(name);
      item.classList.toggle("is-active", itemIndex === currentIndex);
      item.classList.toggle("is-complete", itemIndex < currentIndex);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    renderDynamicText();
  }

  function setInlineMessage(element, message, tone = "warning") {
    if (!element) return;
    element.textContent = message || "";
    if (message) element.dataset.tone = tone;
    else delete element.dataset.tone;
  }

  function createAudioContext() {
    if (!state.audioContext) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error("Web Audio API is unavailable");
      state.audioContext = new AudioContextClass();
    }
    return state.audioContext;
  }

  async function resumeAudioContext() {
    const context = createAudioContext();
    if (context.state !== "running") await context.resume();
  }

  function mixToMono(buffer) {
    const output = new Float32Array(buffer.length);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const data = buffer.getChannelData(channel);
      for (let index = 0; index < data.length; index += 1) {
        output[index] += data[index] / buffer.numberOfChannels;
      }
    }
    return output;
  }

  function calculateRms(samples) {
    if (!samples?.length) return 0;
    let sum = 0;
    for (let index = 0; index < samples.length; index += 1) {
      sum += samples[index] * samples[index];
    }
    return Math.sqrt(sum / samples.length);
  }

  function normalizeBuffer(buffer, targetRms) {
    const context = createAudioContext();
    const currentRms = calculateRms(mixToMono(buffer)) || 1e-12;
    const gain = targetRms / currentRms;
    const output = context.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel += 1) {
      const source = buffer.getChannelData(channel);
      const destination = output.getChannelData(channel);
      for (let index = 0; index < source.length; index += 1) {
        destination[index] = source[index] * gain;
      }
    }
    return output;
  }

  async function resampleBuffer(buffer, targetSampleRate) {
    if (buffer.sampleRate === targetSampleRate) return buffer;
    const targetLength = Math.ceil((buffer.length / buffer.sampleRate) * targetSampleRate);
    const offline = new OfflineAudioContext(buffer.numberOfChannels, targetLength, targetSampleRate);
    const source = offline.createBufferSource();
    source.buffer = buffer;
    source.connect(offline.destination);
    source.start();
    return offline.startRendering();
  }

  async function fetchAndDecode(url) {
    const response = await fetch(url, { cache: "force-cache" });
    if (!response.ok) throw new Error(`Audio request failed (${response.status}): ${url}`);
    const data = await response.arrayBuffer();
    return createAudioContext().decodeAudioData(data.slice(0));
  }

  function updateAudioLoadUi(loaded, total, status = "loading") {
    const panel = $("audioLoadPanel");
    if (!panel) return;
    panel.dataset.state = status;
    $("audioLoadCount").textContent = `${loaded} / ${total}`;
    $("audioLoadProgress").style.width = `${total ? (loaded / total) * 100 : 0}%`;
  }

  async function ensureAudioLoaded() {
    if (state.audioData) return state.audioData;
    if (state.audioLoadPromise) return state.audioLoadPromise;

    const total = 11;
    let loaded = 0;
    $("audioLoadTitle").textContent = t("audioLoading");
    $("audioLoadDetail").textContent = t("audioLoadingDetail");
    updateAudioLoadUi(0, total, "loading");
    $("toggleNoiseButton").disabled = true;

    state.audioLoadPromise = (async () => {
      const correctionsResponse = await fetch(`${CONFIG.audioBase}/corrections.json`, { cache: "force-cache" });
      if (!correctionsResponse.ok) throw new Error("Correction levels could not be loaded");
      const corrections = await correctionsResponse.json();
      if (!Array.isArray(corrections) || corrections.length !== 10) {
        throw new Error("Correction levels are invalid");
      }

      const digitTasks = Array.from({ length: 10 }, (_, digit) => (
        fetchAndDecode(`${CONFIG.audioBase}/${digit}.wav`).then((buffer) => {
          loaded += 1;
          updateAudioLoadUi(loaded, total, "loading");
          return normalizeBuffer(buffer, CONFIG.normalizationRms);
        })
      ));
      const noiseTask = fetchAndDecode(`${CONFIG.audioBase}/noise.wav`).then((buffer) => {
        loaded += 1;
        updateAudioLoadUi(loaded, total, "loading");
        return normalizeBuffer(buffer, CONFIG.normalizationRms);
      });

      const [digitBuffers, noiseBuffer] = await Promise.all([
        Promise.all(digitTasks),
        noiseTask
      ]);
      const targetSampleRate = digitBuffers[0].sampleRate;
      const alignedDigits = await Promise.all(digitBuffers.map((buffer) => resampleBuffer(buffer, targetSampleRate)));
      const alignedNoise = await resampleBuffer(noiseBuffer, targetSampleRate);

      state.audioData = {
        digitBuffers: alignedDigits,
        noiseBuffer: alignedNoise,
        corrections: corrections.map((value) => readNumber(value, 0)),
        sampleRate: targetSampleRate
      };
      updateAudioLoadUi(total, total, "ready");
      $("audioLoadTitle").textContent = t("audioReady");
      $("audioLoadDetail").textContent = t("audioReadyDetail");
      $("toggleNoiseButton").disabled = false;
      renderCalibrationControls();
      return state.audioData;
    })();

    try {
      return await state.audioLoadPromise;
    } catch (error) {
      console.error("Community screening audio load failed", error);
      state.audioLoadPromise = null;
      updateAudioLoadUi(loaded, total, "error");
      $("audioLoadTitle").textContent = t("audioFailed");
      $("audioLoadDetail").textContent = t("audioFailedDetail");
      $("toggleNoiseButton").disabled = false;
      renderCalibrationControls();
      throw error;
    }
  }

  function gainFromDb(db) {
    return 10 ** (db / 20);
  }

  function fixedGainLinear() {
    return gainFromDb(state.fixedGainDb);
  }

  async function startNoise() {
    await resumeAudioContext();
    await ensureAudioLoaded();
    stopNoise();
    const context = createAudioContext();
    const source = context.createBufferSource();
    const gainNode = context.createGain();
    source.buffer = state.audioData.noiseBuffer;
    source.loop = true;
    gainNode.gain.value = fixedGainLinear();
    source.connect(gainNode).connect(context.destination);
    source.start();
    state.noiseSource = source;
    state.noiseGainNode = gainNode;
    state.noisePlaying = true;
    state.noisePlayed = true;
    state.calibrationPlayCount += 1;
    state.calibrationPlaybackStartedAt = Date.now();
    $("calibrationConfirmed").disabled = false;
    renderCalibrationControls();
  }

  function stopNoise() {
    if (state.calibrationPlaybackStartedAt) {
      state.calibrationPlaybackMs += Math.max(0, Date.now() - state.calibrationPlaybackStartedAt);
      state.calibrationPlaybackStartedAt = null;
    }
    if (state.noiseSource) {
      try { state.noiseSource.stop(); } catch {}
      try { state.noiseSource.disconnect(); } catch {}
    }
    if (state.noiseGainNode) {
      try { state.noiseGainNode.disconnect(); } catch {}
    }
    state.noiseSource = null;
    state.noiseGainNode = null;
    state.noisePlaying = false;
    renderCalibrationControls();
  }

  function renderCalibrationControls() {
    const button = $("toggleNoiseButton");
    if (!button) return;
    button.classList.toggle("is-playing", state.noisePlaying);
    const label = button.querySelector("span");
    if (label) {
      label.textContent = state.noisePlaying
        ? t("stopNoise")
        : (state.audioData || state.audioLoadPromise ? t("playNoise") : t("retryAudio"));
    }
    $("noiseInstruction").textContent = state.noisePlaying
      ? t("noisePlayingInstruction")
      : state.noisePlayed
        ? t("noiseStoppedInstruction")
        : t("noiseInstruction");
    $("noiseLevelOutput").textContent = `${state.fixedGainDb.toFixed(1)} dB`;
    $("startScreeningButton").disabled = !(state.audioData && state.noisePlayed && state.calibrationConfirmed);
  }

  function randomIndex(maxExclusive) {
    return Math.floor(Math.random() * maxExclusive);
  }

  function generateBalancedSequences(count, digitsPerSequence) {
    const positionCounts = Array.from({ length: digitsPerSequence }, () => Array(10).fill(0));
    const sequences = [];
    for (let trial = 0; trial < count; trial += 1) {
      const used = new Set();
      const sequence = [];
      for (let position = 0; position < digitsPerSequence; position += 1) {
        const available = [];
        let minimum = Infinity;
        for (let digit = 0; digit <= 9; digit += 1) {
          if (used.has(digit)) continue;
          const seen = positionCounts[position][digit];
          if (seen < minimum) {
            minimum = seen;
            available.length = 0;
            available.push(digit);
          } else if (seen === minimum) {
            available.push(digit);
          }
        }
        const digit = available[randomIndex(available.length)];
        sequence.push(digit);
        used.add(digit);
        positionCounts[position][digit] += 1;
      }
      sequences.push(sequence);
    }
    for (let index = sequences.length - 1; index > 0; index -= 1) {
      const target = randomIndex(index + 1);
      [sequences[index], sequences[target]] = [sequences[target], sequences[index]];
    }
    return sequences;
  }

  function randomNoiseSamples(noise, length) {
    if (noise.length >= length) {
      const start = randomIndex(noise.length - length + 1);
      return noise.slice(start, start + length);
    }
    const output = new Float32Array(length);
    for (let index = 0; index < length; index += 1) output[index] = noise[index % noise.length];
    return output;
  }

  async function renderAndPlaySequence(digits, targetSnrDb, noiseEnabled) {
    await resumeAudioContext();
    await ensureAudioLoaded();
    const { digitBuffers, noiseBuffer, corrections, sampleRate } = state.audioData;
    const digitSamples = digits.map((digit) => {
      const samples = mixToMono(digitBuffers[digit]);
      const correctionGain = gainFromDb(corrections[digit] || 0);
      for (let index = 0; index < samples.length; index += 1) samples[index] *= correctionGain;
      return samples;
    });

    const concatenatedLength = digitSamples.reduce((total, samples) => total + samples.length, 0);
    const concatenated = new Float32Array(concatenatedLength);
    let concatenatedOffset = 0;
    digitSamples.forEach((samples) => {
      concatenated.set(samples, concatenatedOffset);
      concatenatedOffset += samples.length;
    });

    const noiseMono = mixToMono(noiseBuffer);
    const snrNoise = noiseEnabled
      ? randomNoiseSamples(noiseMono, concatenated.length)
      : new Float32Array(concatenated.length);
    const signalRms = calculateRms(concatenated) || 1e-9;
    const noiseRms = noiseEnabled ? (calculateRms(snrNoise) || 1e-9) : null;
    const signalScale = noiseEnabled
      ? (noiseRms * gainFromDb(targetSnrDb)) / signalRms
      : 1;
    const effectiveSnrDb = noiseEnabled
      ? round(20 * Math.log10((signalRms * signalScale) / noiseRms), 2)
      : null;

    const preSamples = Math.round(CONFIG.prePadSeconds * sampleRate);
    const postSamples = Math.round(CONFIG.postPadSeconds * sampleRate);
    const gapSamples = Math.round(CONFIG.interDigitGapSeconds * sampleRate);
    const totalSamples = preSamples
      + postSamples
      + gapSamples * (digits.length - 1)
      + digitSamples.reduce((total, samples) => total + samples.length, 0);
    const fullNoise = noiseEnabled
      ? randomNoiseSamples(noiseMono, totalSamples)
      : new Float32Array(totalSamples);
    const mixed = new Float32Array(totalSamples);
    const calibrationGain = fixedGainLinear();

    let cursor = preSamples;
    digitSamples.forEach((samples, digitIndex) => {
      for (let index = 0; index < samples.length; index += 1) {
        mixed[cursor + index] += samples[index] * signalScale * calibrationGain;
      }
      cursor += samples.length;
      if (digitIndex < digitSamples.length - 1) cursor += gapSamples;
    });
    for (let index = 0; index < mixed.length; index += 1) {
      mixed[index] += fullNoise[index] * calibrationGain;
    }

    let peakBeforeProtection = 0;
    for (let index = 0; index < mixed.length; index += 1) {
      peakBeforeProtection = Math.max(peakBeforeProtection, Math.abs(mixed[index]));
    }
    const protectionScale = peakBeforeProtection > 0.99 ? 0.99 / peakBeforeProtection : 1;
    if (protectionScale < 1) {
      for (let index = 0; index < mixed.length; index += 1) mixed[index] *= protectionScale;
    }

    const context = createAudioContext();
    const playbackBuffer = context.createBuffer(1, mixed.length, sampleRate);
    playbackBuffer.copyToChannel(mixed, 0);
    const source = context.createBufferSource();
    source.buffer = playbackBuffer;
    source.connect(context.destination);

    await new Promise((resolve, reject) => {
      source.onended = resolve;
      try {
        source.start();
      } catch (error) {
        reject(error);
      }
    });

    return {
      targetSnrDb,
      effectiveSnrDb,
      noiseEnabled,
      signalScale: round(signalScale, 6),
      calibrationGainDb: state.fixedGainDb,
      peakBeforeProtection: round(peakBeforeProtection, 6),
      protectionScale: round(protectionScale, 6),
      sampleRate,
      durationSeconds: round(mixed.length / sampleRate, 3)
    };
  }

  function setTestStatus(status, instructionKey) {
    const labelKeys = {
      ready: "ready",
      preparing: "preparing",
      playing: "listening",
      response: "enterDigits",
      saving: "savingAnswer",
      error: "playbackError"
    };
    $("testStatus").dataset.state = status;
    $("testStatusLabel").textContent = t(labelKeys[status] || "ready");
    if (instructionKey) $("testInstruction").textContent = t(instructionKey);
  }

  function renderTestHeader() {
    if (!$("phaseLabel")) return;
    const isPractice = state.phase === "practice";
    $("phaseLabel").textContent = isPractice ? t("practice") : t("formalScreening");
    const current = isPractice ? state.practiceIndex + 1 : state.formalIndex + 1;
    const total = isPractice ? CONFIG.practiceCount : CONFIG.formalCount;
    $("trialProgress").textContent = `${Math.min(current, total)} / ${total}`;
    $("trialProgressBar").style.width = `${clamp(((current - 1) / total) * 100, 0, 100)}%`;
  }

  function setKeypadEnabled(enabled) {
    $("keypad").classList.toggle("is-disabled", !enabled);
    $("keypad").querySelectorAll("button").forEach((button) => {
      button.disabled = !enabled;
    });
  }

  function renderEnteredDigits() {
    $("digitDisplay").querySelectorAll("span").forEach((box, index) => {
      box.textContent = state.enteredDigits[index] || "";
      box.classList.toggle("is-filled", Boolean(state.enteredDigits[index]));
    });
  }

  function clearEnteredDigits() {
    state.enteredDigits = "";
    renderEnteredDigits();
  }

  function appendDigit(digit) {
    if (!state.awaitingResponse || state.playbackActive || state.enteredDigits.length >= CONFIG.nDigits) return;
    state.enteredDigits += String(digit);
    renderEnteredDigits();
  }

  function backspaceDigit() {
    if (!state.awaitingResponse || state.playbackActive) return;
    state.enteredDigits = state.enteredDigits.slice(0, -1);
    renderEnteredDigits();
  }

  function currentTrialSpec() {
    if (state.phase === "practice") {
      const spec = PRACTICE_ITEMS[state.practiceIndex];
      return {
        phase: "practice",
        index: state.practiceIndex,
        digits: spec.digits.slice(),
        noiseEnabled: spec.noiseEnabled,
        targetSnrDb: spec.snrDb,
        mustCorrect: spec.mustCorrect
      };
    }
    return {
      phase: "formal",
      index: state.formalIndex,
      digits: state.session.formalSequences[state.formalIndex].slice(),
      noiseEnabled: true,
      targetSnrDb: state.currentSnrDb,
      mustCorrect: false
    };
  }

  async function playCurrentTrial() {
    if (state.playbackActive || state.awaitingResponse || !state.session) return;
    state.autoPlayToken += 1;
    const spec = currentTrialSpec();
    state.currentDigits = spec.digits;
    state.currentTrialMeta = spec;
    state.playbackActive = true;
    setKeypadEnabled(false);
    $("playTrialButton").disabled = true;
    clearEnteredDigits();
    setTestStatus("preparing", "testPreparing");

    try {
      setTestStatus("playing", "testPlaying");
      const audioMeta = await renderAndPlaySequence(spec.digits, spec.targetSnrDb, spec.noiseEnabled);
      state.currentTrialMeta.audio = audioMeta;
      state.playbackEndedAt = Date.now();
      state.playbackActive = false;
      state.awaitingResponse = true;
      setKeypadEnabled(true);
      setTestStatus("response", "testRespond");
    } catch (error) {
      console.error("Community screening playback failed", error);
      state.playbackActive = false;
      state.awaitingResponse = false;
      setKeypadEnabled(false);
      $("playTrialButton").disabled = false;
      setTestStatus("error", "testPlaybackFailed");
    }
  }

  function recordTrial(input, correct) {
    const meta = state.currentTrialMeta;
    const trial = {
      phase: meta.phase,
      trialIndex: meta.index,
      attemptInPracticeItem: meta.phase === "practice"
        ? state.session.trials.filter((item) => item.phase === "practice" && item.trialIndex === meta.index).length + 1
        : 1,
      digitsPresented: meta.digits.join(""),
      response: input,
      correct,
      noiseEnabled: meta.noiseEnabled,
      presentedSnrDb: meta.targetSnrDb,
      effectiveSnrDb: meta.audio?.effectiveSnrDb ?? null,
      responseTimeMs: state.playbackEndedAt ? Date.now() - state.playbackEndedAt : null,
      audio: meta.audio || null,
      timestamp: new Date().toISOString()
    };
    state.session.trials.push(trial);
    return trial;
  }

  async function scheduleNextTrial(messageKey, delayMs, vars = {}) {
    const token = ++state.autoPlayToken;
    setTestStatus("saving");
    $("testInstruction").textContent = t(messageKey, vars);
    setKeypadEnabled(false);
    $("playTrialButton").disabled = true;
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    if (token !== state.autoPlayToken || state.currentScreen !== "screening") return;
    state.awaitingResponse = false;
    clearEnteredDigits();
    renderTestHeader();
    setTestStatus("ready", "testReady");
    await playCurrentTrial();
  }

  async function submitAnswer() {
    if (!state.awaitingResponse || state.playbackActive) return;
    if (state.enteredDigits.length !== CONFIG.nDigits) {
      $("testInstruction").textContent = t("testNeedDigits");
      return;
    }

    state.awaitingResponse = false;
    setKeypadEnabled(false);
    const input = state.enteredDigits;
    const expected = state.currentDigits.join("");
    const correct = input === expected;
    recordTrial(input, correct);

    if (state.phase === "practice") {
      const spec = PRACTICE_ITEMS[state.practiceIndex];
      if (spec.mustCorrect && !correct) {
        saveActiveSession();
        await scheduleNextTrial("practiceRetry", 1800, { answer: expected });
        return;
      }
      state.practiceIndex += 1;
      if (state.practiceIndex >= CONFIG.practiceCount) {
        state.phase = "formal";
        state.formalIndex = 0;
        state.currentSnrDb = CONFIG.startSnrDb;
        saveActiveSession();
        await scheduleNextTrial("formalStarting", 1800);
        return;
      }
      saveActiveSession();
      await scheduleNextTrial(correct ? "practiceCorrect" : "practiceContinue", 1100);
      return;
    }

    state.currentSnrDb = correct
      ? Math.max(CONFIG.minSnrDb, state.currentSnrDb - CONFIG.stepDb)
      : Math.min(CONFIG.maxSnrDb, state.currentSnrDb + CONFIG.stepDb);
    state.formalIndex += 1;
    saveActiveSession();

    if (state.formalIndex >= CONFIG.formalCount) {
      await finalizeScreening();
      return;
    }
    await scheduleNextTrial("nextTrial", CONFIG.nextTrialDelayMs);
  }

  function makeUploadClientId(sessionId) {
    return `community_upload_${String(sessionId).replace(/[^a-zA-Z0-9_-]/g, "_")}`;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function uploadStorageKey(sessionId) {
    return `${STORAGE.uploadPrefix}${sessionId}`;
  }

  function writeUploadRecord(record) {
    record.updatedAt = new Date().toISOString();
    localStorage.setItem(record.storageKey, JSON.stringify(record));
    state.uploadRecord = record;
    return record;
  }

  function decorateUploadPayload(record, status) {
    const payload = clone(record.payload);
    payload.meta = payload.meta || {};
    payload.meta.upload = {
      uploadClientId: record.uploadClientId,
      recordVersion: 1,
      status,
      queuedAt: record.queuedAt,
      attemptCount: record.attemptCount,
      lastAttemptAt: record.lastAttemptAt || null,
      savedAt: record.savedAt || null,
      serverId: record.serverId || null,
      lastError: record.lastError || null
    };
    return payload;
  }

  function createUploadRecord(payload) {
    const storageKey = uploadStorageKey(payload.sessionId);
    let existing = null;
    try {
      existing = JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {}
    if (existing?.status === "saved") return writeUploadRecord(existing);

    const now = new Date().toISOString();
    const record = {
      version: 1,
      storageKey,
      sessionId: payload.sessionId,
      participantId: payload.participantId,
      uploadClientId: existing?.uploadClientId || makeUploadClientId(payload.sessionId),
      status: existing?.status || "pending",
      attemptCount: existing?.attemptCount || 0,
      queuedAt: existing?.queuedAt || now,
      lastAttemptAt: existing?.lastAttemptAt || null,
      savedAt: existing?.savedAt || null,
      serverId: existing?.serverId || null,
      lastError: existing?.lastError || null,
      payload
    };
    record.payload = decorateUploadPayload(record, record.status);
    return writeUploadRecord(record);
  }

  function renderUploadState() {
    const record = state.uploadRecord;
    if (!record || !$("uploadPanel")) return;
    $("uploadPanel").dataset.state = record.status;
    $("retryUploadButton").hidden = !["failed", "pending"].includes(record.status);
    $("retryUploadButton").disabled = record.status === "uploading";
    const vars = {
      attempts: record.attemptCount || 0,
      serverId: record.serverId || ""
    };
    const key = {
      pending: "savePending",
      uploading: "saveUploading",
      saved: "saveSaved",
      failed: "saveFailed"
    }[record.status] || "savePending";
    $("uploadStatusText").textContent = t(key, vars);
  }

  async function uploadResultRecord() {
    const record = state.uploadRecord;
    if (!record || record.status === "saved" || record.status === "uploading") {
      renderUploadState();
      return;
    }
    record.status = "uploading";
    record.attemptCount += 1;
    record.lastAttemptAt = new Date().toISOString();
    record.lastError = null;
    record.payload = decorateUploadPayload(record, "uploading");
    writeUploadRecord(record);
    renderUploadState();

    try {
      const response = await fetch("/api/community-screening/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(record.payload)
      });
      const body = await response.text();
      if (!response.ok) throw new Error(body || `${response.status} ${response.statusText}`);
      let data = {};
      try { data = JSON.parse(body); } catch {}
      record.status = "saved";
      record.serverId = data.id || data.existingId || record.serverId || null;
      record.savedAt = new Date().toISOString();
      record.lastError = null;
      record.payload = decorateUploadPayload(record, data.duplicate ? "duplicate_acknowledged" : "saved");
    } catch (error) {
      console.error("Community screening upload failed", error);
      record.status = "failed";
      record.lastError = error?.message || "Upload failed";
      record.payload = decorateUploadPayload(record, "failed");
    }
    writeUploadRecord(record);
    renderUploadState();
  }

  function buildResultPayload(result) {
    const calibration = state.session.calibration || {};
    const formalTrials = state.session.trials.filter((trial) => trial.phase === "formal");
    return {
      schemaVersion: CONFIG.schemaVersion,
      sessionId: state.session.sessionId,
      participantId: state.session.userInfo.participantCode,
      userInfo: clone(state.session.userInfo),
      screening: {
        protocolId: CONFIG.protocolId,
        protocolLabel: CONFIG.protocolLabel,
        stimulusLanguage: CONFIG.stimulusLanguage,
        condition: "2f",
        nDigits: CONFIG.nDigits,
        formalTrialCount: CONFIG.formalCount,
        completedFormalTrials: formalTrials.length,
        adaptiveRule: "one-up one-down",
        stepDb: CONFIG.stepDb,
        startSnrDb: CONFIG.startSnrDb,
        srtWindow: CONFIG.srtWindow,
        srtDbSnr: result.srtDbSnr,
        outcome: result.outcome,
        referralCutoffDbSnr: CONFIG.referralCutoffDbSnr,
        referralRule: "refer when SRT is greater than or equal to cutoff",
        referralCriterion: CONFIG.referralCriterion
      },
      calibration: clone(calibration),
      trials: clone(state.session.trials),
      quality: {
        complete: formalTrials.length === CONFIG.formalCount,
        headphoneConfirmed: Boolean(state.session.userInfo.readiness.headphones),
        quietConfirmed: Boolean(state.session.userInfo.readiness.quiet),
        disclaimerConfirmed: Boolean(state.session.userInfo.readiness.understood),
        calibrationConfirmed: Boolean(calibration.confirmed),
        clippingProtectionTrialCount: formalTrials.filter((trial) => (trial.audio?.protectionScale ?? 1) < 1).length
      },
      meta: {
        appVersion: CONFIG.appVersion,
        uiLanguage: state.uiLanguage,
        source: "community-hearing-screening",
        independentDataNamespace: true,
        startedAt: state.session.startedAt,
        completedAt: result.completedAt,
        userAgent: navigator.userAgent
      },
      createdAt: result.completedAt
    };
  }

  async function finalizeScreening() {
    state.autoPlayToken += 1;
    setKeypadEnabled(false);
    setTestStatus("saving");
    const formalTrials = state.session.trials.filter((trial) => trial.phase === "formal");
    const effectiveSnrs = formalTrials
      .map((trial) => trial.effectiveSnrDb)
      .filter((value) => Number.isFinite(value));
    const scoringWindow = effectiveSnrs.slice(-CONFIG.srtWindow);
    const srtDbSnr = round(average(scoringWindow), 2);
    const outcome = srtDbSnr >= CONFIG.referralCutoffDbSnr ? "refer" : "pass";
    const result = {
      srtDbSnr,
      outcome,
      completedAt: new Date().toISOString()
    };
    state.session.result = result;
    saveActiveSession();
    const payload = buildResultPayload(result);
    state.uploadRecord = createUploadRecord(payload);
    showScreen("result");
    renderOutcome(result);
    renderUploadState();
    await uploadResultRecord();
  }

  function renderOutcome(result) {
    $("outcomePanel").dataset.outcome = result.outcome;
    $("outcomeTitle").textContent = t(result.outcome === "pass" ? "passTitle" : "referTitle");
    $("outcomeMessage").textContent = t(result.outcome === "pass" ? "passMessage" : "referMessage");
    $("nextStepMessage").textContent = t(result.outcome === "pass" ? "passNextStep" : "referNextStep");
    $("srtValue").textContent = Number.isFinite(result.srtDbSnr) ? result.srtDbSnr.toFixed(1) : "—";
  }

  function startNewSession() {
    if (state.uploadRecord && state.uploadRecord.status !== "saved") {
      if (!window.confirm(t("leaveWarning"))) return;
    }
    localStorage.removeItem(STORAGE.activeSession);
    localStorage.removeItem(STORAGE.fixedGain);
    window.location.reload();
  }

  function beginScreening() {
    stopNoise();
    state.session.calibration = {
      type: "participant-set-comfortable-noise-level",
      workflowVersion: "community-calibration-v1",
      stimulusLanguage: CONFIG.stimulusLanguage,
      fixedGain: round(fixedGainLinear(), 6),
      fixedGainDb: state.fixedGainDb,
      confirmed: state.calibrationConfirmed,
      startedAt: state.calibrationStartedAt,
      confirmedAt: new Date().toISOString(),
      playCount: state.calibrationPlayCount,
      cumulativePlaybackMs: state.calibrationPlaybackMs,
      adjustmentCount: state.calibrationAdjustmentCount,
      appliesEquallyToSpeechAndNoise: true
    };
    state.phase = "practice";
    state.practiceIndex = 0;
    state.formalIndex = 0;
    state.currentSnrDb = CONFIG.startSnrDb;
    state.session.formalSequences = generateBalancedSequences(CONFIG.formalCount, CONFIG.nDigits);
    saveActiveSession();
    showScreen("screening");
    renderTestHeader();
    clearEnteredDigits();
    state.awaitingResponse = false;
    state.playbackActive = false;
    setKeypadEnabled(false);
    $("playTrialButton").disabled = false;
    setTestStatus("ready", "testReady");
  }

  function handleSetupSubmit(event) {
    event.preventDefault();
    const participantCode = $("participantCode").value.trim();
    const age = Number.parseInt($("participantAge").value, 10);
    const validAge = Number.isFinite(age) && age >= 18 && age <= 120;
    const readiness = {
      headphones: $("checkHeadphones").checked,
      quiet: $("checkQuiet").checked,
      understood: $("checkUnderstand").checked
    };
    if (!participantCode || !validAge || !Object.values(readiness).every(Boolean)) {
      setInlineMessage($("setupMessage"), t("setupRequired"), "warning");
      if (!participantCode) $("participantCode").focus();
      else if (!validAge) $("participantAge").focus();
      else document.querySelector('#setupForm input[type="checkbox"]:not(:checked)')?.focus();
      return;
    }

    setInlineMessage($("setupMessage"), "");
    state.session = {
      sessionId: createSessionId(),
      protocolId: CONFIG.protocolId,
      startedAt: new Date().toISOString(),
      userInfo: {
        participantCode,
        age,
        gender: $("participantGender").value || "",
        stimulusLanguage: CONFIG.stimulusLanguage,
        uiLanguageAtStart: state.uiLanguage,
        readiness,
        readinessConfirmedAt: new Date().toISOString()
      },
      calibration: null,
      formalSequences: [],
      trials: [],
      result: null
    };
    state.fixedGainDb = 0;
    state.noisePlayed = false;
    state.calibrationConfirmed = false;
    state.calibrationStartedAt = new Date().toISOString();
    state.calibrationPlayCount = 0;
    state.calibrationPlaybackMs = 0;
    state.calibrationAdjustmentCount = 0;
    $("noiseLevel").value = "0";
    $("calibrationConfirmed").checked = false;
    $("calibrationConfirmed").disabled = true;
    localStorage.setItem(STORAGE.fixedGain, "0");
    saveActiveSession();
    showScreen("calibration");
    ensureAudioLoaded().catch(() => {});
  }

  function wireEvents() {
    $("uiLanguage").value = state.uiLanguage;
    $("uiLanguage").addEventListener("change", () => {
      state.uiLanguage = $("uiLanguage").value;
      localStorage.setItem(STORAGE.uiLanguage, state.uiLanguage);
      applyLanguage();
    });

    $("setupForm").addEventListener("submit", handleSetupSubmit);
    $("backToSetup").addEventListener("click", () => showScreen("welcome"));

    $("toggleNoiseButton").addEventListener("click", async () => {
      setInlineMessage($("calibrationMessage"), "");
      if (state.noisePlaying) {
        stopNoise();
        return;
      }
      try {
        await startNoise();
      } catch {
        setInlineMessage($("calibrationMessage"), t("audioFailedDetail"), "warning");
      }
    });

    $("noiseLevel").value = String(state.fixedGainDb);
    $("noiseLevel").addEventListener("input", () => {
      state.fixedGainDb = clamp(readNumber($("noiseLevel").value, 0), -20, 6);
      localStorage.setItem(STORAGE.fixedGain, String(state.fixedGainDb));
      if (state.noiseGainNode) state.noiseGainNode.gain.value = fixedGainLinear();
      if (state.calibrationConfirmed) {
        state.calibrationConfirmed = false;
        $("calibrationConfirmed").checked = false;
        setInlineMessage($("calibrationMessage"), t("calibrationChanged"), "warning");
      }
      renderCalibrationControls();
    });
    $("noiseLevel").addEventListener("change", () => {
      state.calibrationAdjustmentCount += 1;
    });

    $("calibrationConfirmed").addEventListener("change", () => {
      state.calibrationConfirmed = $("calibrationConfirmed").checked;
      if (state.calibrationConfirmed) setInlineMessage($("calibrationMessage"), "", "success");
      renderCalibrationControls();
    });

    $("startScreeningButton").addEventListener("click", () => {
      if (!(state.audioData && state.noisePlayed && state.calibrationConfirmed)) {
        setInlineMessage($("calibrationMessage"), t("calibrationRequirement"), "warning");
        return;
      }
      beginScreening();
    });

    $("playTrialButton").addEventListener("click", playCurrentTrial);
    $("keypad").addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled) return;
      if (button.dataset.digit != null) appendDigit(button.dataset.digit);
    });
    $("backspaceButton").addEventListener("click", backspaceDigit);
    $("submitAnswerButton").addEventListener("click", submitAnswer);
    $("retryUploadButton").addEventListener("click", uploadResultRecord);
    $("newScreeningButton").addEventListener("click", startNewSession);

    document.addEventListener("keydown", (event) => {
      if (state.currentScreen !== "screening") return;
      if (/^\d$/.test(event.key)) {
        event.preventDefault();
        appendDigit(event.key);
      } else if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        backspaceDigit();
      } else if (event.key === "Enter") {
        event.preventDefault();
        submitAnswer();
      }
    });

    window.addEventListener("beforeunload", (event) => {
      const testInProgress = state.currentScreen === "screening" && state.formalIndex < CONFIG.formalCount;
      const uploadPending = state.uploadRecord && state.uploadRecord.status !== "saved";
      if (!testInProgress && !uploadPending) return;
      event.preventDefault();
      event.returnValue = "";
    });
  }

  function bootstrap() {
    wireEvents();
    applyLanguage();
    renderEnteredDigits();
    renderCalibrationControls();
    setKeypadEnabled(false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
