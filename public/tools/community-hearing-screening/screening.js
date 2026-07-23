(function () {
  "use strict";

  const CONFIG = Object.freeze({
    appVersion: "community-screening-2026.07.23-1",
    schemaVersion: "community-hearing-screening-result-v1",
    protocolId: "cantonese-3f-community-screening-v1",
    protocolLabel: "Cantonese 3-digit forward community hearing screening",
    stimulusLanguage: "cantonese",
    audioBase: "/tools/digit-in-noise-test/audio/cantonese",
    nDigits: 3,
    practiceCount: 5,
    formalCount: 24,
    srtWindow: 20,
    startSnrDb: 0,
    stepDb: 2,
    minSnrDb: -30,
    maxSnrDb: 30,
    referralCutoffDbSnr: -7.7,
    referralCriterion: "Better-ear PTA greater than 35 dB HL",
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
    "zh-HK": {
      brandSubtitle: "社區聽力篩查",
      languageLabel: "介面語言",
      staffDashboard: "工作人員後台",
      stepWelcome: "準備",
      stepCalibration: "校準",
      stepScreening: "篩查",
      stepResult: "結果",
      welcomeEyebrow: "約 5 分鐘 · 粵語",
      welcomeTitle: "在背景噪聲中聆聽數字，快速了解你的聽力",
      welcomeIntro: "你會聽到三個被噪聲包圍的數字。每次播放後，按順序輸入聽到的數字；系統會自動調節難度。",
      featureHeadphones: "使用雙耳耳機",
      featureDuration: "約 5 分鐘",
      featureOutcome: "即時篩查結果",
      participantHeading: "基本資料",
      participantHelp: "請勿輸入姓名、電話或身份證號碼。",
      participantCode: "參與者編號",
      participantPlaceholder: "例如：C001",
      age: "年齡",
      gender: "性別（選填）",
      preferNotSay: "不填寫",
      female: "女性",
      male: "男性",
      other: "其他",
      stimulusLanguage: "測試語言",
      cantonese: "粵語",
      beforeStart: "開始前請確認",
      checkHeadphones: "我已戴好可同時覆蓋雙耳的耳機或耳塞。",
      checkQuiet: "我身處安靜環境，並已關閉其他會播放聲音的程式。",
      checkUnderstand: "我明白這是聽力篩查而非醫療診斷；如有聽力疑慮，仍應尋求專業評估。",
      continueCalibration: "繼續校準",
      setupRequired: "請填寫參與者編號及有效年齡，並確認所有開始前事項。",
      calibrationEyebrow: "步驟 2 / 4",
      calibrationTitle: "把噪聲調到清楚而舒適的音量",
      calibrationIntro: "按播放後調整音量。正式篩查會固定使用你確認的音量，請不要再改動裝置音量。",
      audioLoading: "正在準備測試聲音",
      audioLoadingDetail: "首次載入可能需要一些時間。",
      audioReady: "測試聲音已準備好",
      audioReadyDetail: "現在可以播放噪聲並進行音量校準。",
      audioFailed: "測試聲音載入失敗",
      audioFailedDetail: "請檢查網絡連線，然後按下方按鈕重試。",
      playNoise: "播放噪聲",
      stopNoise: "停止噪聲",
      retryAudio: "重新載入聲音",
      noiseInstruction: "聲音準備完成後即可播放。",
      noisePlayingInstruction: "請調至清楚可聞、舒適且不刺耳的音量。",
      noiseStoppedInstruction: "可再次播放確認，或勾選下方確認項目。",
      noiseLevel: "噪聲音量",
      calibrationConfirmed: "我能清楚、舒適地聽到噪聲，並會保持目前的裝置音量。",
      calibrationRequirement: "請至少播放一次噪聲，並確認目前音量舒適。",
      calibrationChanged: "音量已改變，請重新確認目前音量。",
      startPractice: "開始練習",
      back: "返回",
      practice: "練習",
      formalScreening: "正式篩查",
      ready: "準備就緒",
      preparing: "正在準備",
      listening: "請聆聽",
      enterDigits: "輸入數字",
      savingAnswer: "記錄答案",
      playbackError: "播放出錯",
      play: "播放",
      testReady: "按下播放，聆聽三個數字。",
      testPreparing: "正在準備聲音，請稍候。",
      testPlaying: "正在播放，請仔細聆聽。",
      testRespond: "按順序輸入你聽到的三個數字。",
      testNeedThree: "請輸入完整的三個數字。",
      testPlaybackFailed: "聲音未能播放，請按播放重試並檢查瀏覽器聲音權限。",
      practiceCorrect: "正確。下一個練習即將開始。",
      practiceContinue: "下一個練習即將開始。",
      practiceRetry: "答案是 {answer}。聲音將再次播放。",
      formalStarting: "練習完成，正式篩查即將開始。",
      nextTrial: "答案已記錄，下一題即將播放。",
      confirmAnswer: "確認",
      backspace: "刪除",
      screeningComplete: "篩查完成",
      passTitle: "本次篩查結果在預期範圍內",
      passMessage: "你在背景噪聲中辨認粵語數字的表現未達到本篩查的轉介界值。",
      referTitle: "建議安排進一步聽力評估",
      referMessage: "你在背景噪聲中辨認粵語數字的結果達到本篩查的轉介界值。",
      srtLabel: "言語接收閾值（SRT）",
      nextSteps: "下一步",
      passNextStep: "如你仍覺得聽聲或理解說話有困難、出現耳鳴或兩耳差異，仍建議諮詢聽力專業人員。即使沒有疑慮，也可定期重做篩查。",
      referNextStep: "請考慮預約註冊聽力學家或合適的醫療專業人員，接受耳科檢查及標準純音聽力測試。本結果本身不能診斷聽力損失。",
      resultLimit: "此雙耳篩查主要反映較好耳的表現，不能排除單側、不對稱或其他類型的聽力問題。",
      saveStatus: "記錄儲存狀態",
      savePending: "正在安全儲存本次篩查記錄。",
      saveUploading: "正在上傳記錄（第 {attempts} 次嘗試）。",
      saveSaved: "記錄已安全儲存。編號：{serverId}",
      saveFailed: "記錄尚未儲存，請保持此頁開啟並重試。",
      retry: "重試",
      backToTools: "返回工具列表",
      newScreening: "開始新的篩查",
      leaveWarning: "本次篩查記錄尚未安全儲存。確定離開嗎？",
      protocolFooter: "粵語三位數字社區聽力篩查協議"
    },
    en: {
      brandSubtitle: "Community Hearing Screening",
      languageLabel: "Interface language",
      staffDashboard: "Staff dashboard",
      stepWelcome: "Prepare",
      stepCalibration: "Calibrate",
      stepScreening: "Screen",
      stepResult: "Result",
      welcomeEyebrow: "About 5 minutes · Cantonese",
      welcomeTitle: "Listen for digits in background noise and check your hearing",
      welcomeIntro: "You will hear three digits in noise. Enter the digits in the same order after each presentation; the test adjusts the difficulty automatically.",
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
      cantonese: "Cantonese",
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
      testReady: "Press Play and listen for three digits.",
      testPreparing: "Preparing the sound. Please wait.",
      testPlaying: "Audio is playing. Listen carefully.",
      testRespond: "Enter the three digits in the order you heard them.",
      testNeedThree: "Enter all three digits before confirming.",
      testPlaybackFailed: "Audio did not play. Press Play to retry and check browser sound permission.",
      practiceCorrect: "Correct. The next practice item will begin shortly.",
      practiceContinue: "The next practice item will begin shortly.",
      practiceRetry: "The answer was {answer}. The sound will play again.",
      formalStarting: "Practice is complete. The screening will begin shortly.",
      nextTrial: "Answer recorded. The next item will play shortly.",
      confirmAnswer: "Confirm",
      backspace: "Backspace",
      screeningComplete: "Screening complete",
      passTitle: "Your result is within the expected screening range",
      passMessage: "Your recognition of Cantonese digits in background noise did not reach this screen's referral cutoff.",
      referTitle: "A further hearing assessment is recommended",
      referMessage: "Your recognition of Cantonese digits in background noise reached this screen's referral cutoff.",
      srtLabel: "Speech reception threshold (SRT)",
      nextSteps: "Next step",
      passNextStep: "If you still notice difficulty hearing or understanding speech, tinnitus, or a difference between ears, speak with a hearing professional. Otherwise, consider repeating a hearing screen regularly.",
      referNextStep: "Consider booking a registered audiologist or an appropriate healthcare professional for an ear examination and standard pure-tone hearing test. This result alone cannot diagnose hearing loss.",
      resultLimit: "This binaural screen mainly reflects the better ear and cannot rule out unilateral, asymmetric, or other hearing problems.",
      saveStatus: "Record save status",
      savePending: "Securely saving this screening record.",
      saveUploading: "Uploading the record (attempt {attempts}).",
      saveSaved: "Record saved securely. ID: {serverId}",
      saveFailed: "The record is not yet saved. Keep this page open and retry.",
      retry: "Retry",
      backToTools: "Back to tools",
      newScreening: "Start a new screening",
      leaveWarning: "This screening record has not been saved securely. Leave anyway?",
      protocolFooter: "Cantonese 3-digit community hearing screening protocol"
    }
  };

  const PRACTICE_ITEMS = [
    { digits: [1, 2, 3], noiseEnabled: false, snrDb: 0, mustCorrect: true },
    { digits: [6, 8, 5], noiseEnabled: false, snrDb: 0, mustCorrect: true },
    { digits: [5, 9, 2], noiseEnabled: true, snrDb: 6, mustCorrect: false },
    { digits: [7, 1, 4], noiseEnabled: true, snrDb: 4, mustCorrect: false },
    { digits: [9, 0, 6], noiseEnabled: true, snrDb: 2, mustCorrect: false }
  ];

  const state = {
    uiLanguage: localStorage.getItem(STORAGE.uiLanguage) || "zh-HK",
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
    const table = TRANSLATIONS[state.uiLanguage] || TRANSLATIONS["zh-HK"];
    const fallback = TRANSLATIONS["zh-HK"][key] || key;
    return String(table[key] || fallback).replace(/\{(\w+)\}/g, (_, name) => String(vars[name] ?? ""));
  }

  function applyLanguage() {
    document.documentElement.lang = state.uiLanguage;
    document.title = state.uiLanguage === "en"
      ? "Community Hearing Screening | NeuraHear"
      : "社區聽力篩查 | NeuraHear";
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
      $("testInstruction").textContent = t("testNeedThree");
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
        condition: "3f",
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
