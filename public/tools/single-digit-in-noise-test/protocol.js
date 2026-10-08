/* Shared by the browser and protocol regression tests. */
const OptimizationProtocol = (() => {
  const ENGINE = 'fixed-noise-headroom-v1';
  const MIN_SNR = -40;
  const MAX_SNR = 10;
  const MAX_GAIN = 3;
  function parseSnrs(raw) {
    const parts = String(raw).split(',').map(value => value.trim());
    if (!parts.length || parts.length > 51 || parts.some(value => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value))) return null;
    const values = parts.map(Number);
    if (values.some(value => !Number.isFinite(value) || value < MIN_SNR || value > MAX_SNR) || new Set(values).size !== values.length) return null;
    return values;
  }
  const peak = values => values.reduce((max, value) => Math.max(max, Math.abs(value)), 0);
  const rms = values => Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
  function maxWindowRms(values, length) {
    let energy = 0;
    for (let i = 0; i < length; i++) energy += values[i % values.length] ** 2;
    let max = energy;
    for (let start = 1; start < values.length; start++) {
      energy += values[(start + length - 1) % values.length] ** 2 - values[start - 1] ** 2;
      max = Math.max(max, energy);
    }
    return Math.sqrt(Math.max(0, max) / length);
  }
  function audioPlan(digits, noise, maxSnr) {
    if (!noise.length || !digits.length || !Number.isFinite(maxSnr) || maxSnr < MIN_SNR || maxSnr > MAX_SNR) throw new Error('Invalid audio planning inputs.');
    const noisePeak = peak(noise);
    if (!(noisePeak > 0)) throw new Error('The masker is silent.');
    let bound = noisePeak;
    const windows = new Map();
    for (const digit of digits) {
      const digitRms = rms(digit);
      if (!(digitRms > 0)) throw new Error('A digit recording is silent.');
      if (!windows.has(digit.length)) windows.set(digit.length, maxWindowRms(noise, digit.length));
      bound = Math.max(bound, noisePeak + windows.get(digit.length) * 10 ** (maxSnr / 20) * peak(digit) / digitRms);
    }
    if (!Number.isFinite(bound)) throw new Error('Invalid audio samples.');
    // Triangle-inequality bound covers every digit and every possible noise offset.
    return { engine: ENGINE, scale: Math.min(1, .9 / (MAX_GAIN * bound)), peakBoundAtUnitGain: bound, noisePeak, maxSnr, maxGain: MAX_GAIN };
  }
  function correctionIssues(settings, analysis) {
    const issues = [];
    if (settings.analysisLevel !== 'group') issues.push('Final corrections require group-level analysis.');
    if (settings.analysisLevel === 'group' && settings.groupNParticipants < (settings.minimumParticipants || 20)) issues.push(`At least ${settings.minimumParticipants || 20} participant IDs are required by this analysis plan.`);
    for (let digit = 0; digit < 10; digit++) {
      const fit = analysis.fits[digit];
      if (!fit?.ok || !Number.isFinite(fit.threshold) || !fit.inRange || !fit.bracketsTarget || fit.boundaryHit) issues.push(`Digit ${digit}: insufficient or unreliable threshold estimate.`);
    }
    return issues;
  }
  function validateProfile(profile) {
    if (!profile || profile.version !== 1 || !/^[A-Za-z0-9_-]{1,60}$/.test(profile.studyId || '') ||
        !['taiwanese', 'spanish_male', 'spanish_female'].includes(profile.lang) ||
        !Array.isArray(profile.snrs) || !parseSnrs(profile.snrs.join(',')) || profile.snrs.length < 3 ||
        !['random', 'blocked'].includes(profile.trialOrder) || ![.5, .55].includes(profile.targetProbability) ||
        !Number.isInteger(profile.minimumParticipants) || profile.minimumParticipants < 2 || profile.minimumParticipants > 200 ||
        typeof profile.practiceEnabled !== 'boolean' || typeof profile.autoPlay !== 'boolean' ||
        !Number.isInteger(profile.autoPlayDelayMs) || profile.autoPlayDelayMs < 200 || profile.autoPlayDelayMs > 5000) throw new Error('Invalid study configuration.');
    return Object.fromEntries(['version', 'studyId', 'lang', 'snrs', 'trialOrder', 'targetProbability', 'minimumParticipants', 'practiceEnabled', 'autoPlay', 'autoPlayDelayMs'].map(key => [key, profile[key]]));
  }
  function matchesProfile(profile, settings) {
    return Object.entries(validateProfile(profile)).every(([key, value]) => {
      if (key === 'version') return true;
      if (key === 'snrs') return JSON.stringify(value.slice().sort((a, b) => b - a)) === JSON.stringify(settings.snrs);
      return value === settings[key];
    });
  }
  return { ENGINE, parseSnrs, audioPlan, correctionIssues, validateProfile, matchesProfile };
})();
