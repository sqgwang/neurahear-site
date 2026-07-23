(function () {
  "use strict";

  const state = {
    user: null,
    records: [],
    filteredRecords: [],
    backendTotal: 0
  };

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character]));
  }

  function formatDate(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function formatNumber(value, places = 1) {
    const number = Number(value);
    return Number.isFinite(number) ? number.toFixed(places) : "—";
  }

  function csvCell(value) {
    return JSON.stringify(value ?? "");
  }

  function downloadBlob(filename, content, type) {
    const url = URL.createObjectURL(new Blob([content], { type }));
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function apiUrl(path) {
    const clean = String(path || "").replace(/^\/+/, "").replace(/^api\/+/, "");
    return `/api/${clean}`;
  }

  async function api(path, options = {}) {
    const response = await fetch(apiUrl(path), {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...(options.headers || {}) },
      ...options
    });
    const body = await response.text();
    if (!response.ok) throw new Error(body || `${response.status} ${response.statusText}`);
    if (!body) return null;
    try { return JSON.parse(body); } catch { return body; }
  }

  function userInfo(record) {
    return record.userInfo || {};
  }

  function screening(record) {
    return record.screening || {};
  }

  function participantCode(record) {
    return record.participantId || userInfo(record).participantCode || "—";
  }

  function outcome(record) {
    return screening(record).outcome || "unknown";
  }

  function isComplete(record) {
    if (record.quality?.complete != null) return Boolean(record.quality.complete);
    return Number(screening(record).completedFormalTrials) === Number(screening(record).formalTrialCount);
  }

  function srt(record) {
    const value = Number(screening(record).srtDbSnr);
    return Number.isFinite(value) ? value : null;
  }

  function showLogin(message = "") {
    $("loginPanel").hidden = false;
    $("dashboardPanel").hidden = true;
    $("loginMessage").textContent = message;
  }

  function showDashboard() {
    $("loginPanel").hidden = true;
    $("dashboardPanel").hidden = false;
    $("signedInUser").textContent = `Signed in as ${state.user.username} (${state.user.role})`;
  }

  async function checkSession() {
    try {
      const response = await api("me");
      return response.user || null;
    } catch {
      return null;
    }
  }

  async function login(username, password) {
    await api("auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password })
    });
    return checkSession();
  }

  async function loadRecords() {
    $("recordCount").textContent = "Loading records…";
    const query = $("searchInput").value.trim();
    const response = await api(`community-screening/results?limit=500&search=${encodeURIComponent(query)}`);
    state.records = Array.isArray(response.items) ? response.items : [];
    state.backendTotal = Number(response.total) || 0;
    applyFilters();
  }

  function applyFilters() {
    const outcomeValue = $("outcomeFilter").value;
    const completion = $("completionFilter").value;
    state.filteredRecords = state.records.filter((record) => {
      if (outcomeValue && outcome(record) !== outcomeValue) return false;
      if (completion === "complete" && !isComplete(record)) return false;
      if (completion === "incomplete" && isComplete(record)) return false;
      return true;
    });
    renderMetrics();
    renderTable();
  }

  function renderMetrics() {
    const records = state.filteredRecords;
    $("metricTotal").textContent = String(records.length);
    $("metricComplete").textContent = String(records.filter(isComplete).length);
    $("metricPass").textContent = String(records.filter((record) => outcome(record) === "pass").length);
    $("metricRefer").textContent = String(records.filter((record) => outcome(record) === "refer").length);
  }

  function renderTable() {
    const records = state.filteredRecords;
    $("recordCount").textContent = `${records.length} shown · ${state.backendTotal} matched on the server`;
    $("emptyMessage").hidden = records.length > 0;
    $("recordTableWrap").hidden = records.length === 0;
    if (!records.length) {
      $("recordRows").innerHTML = "";
      return;
    }

    $("recordRows").innerHTML = records.map((record) => {
      const recordOutcome = outcome(record);
      const outcomeText = recordOutcome === "pass" ? "Within range" : recordOutcome === "refer" ? "Further assessment" : "Unknown";
      const complete = isComplete(record);
      const deleteButton = state.user?.role === "admin"
        ? `<button type="button" data-action="delete" data-id="${escapeHtml(record._id)}">Delete</button>`
        : "";
      return `
        <tr>
          <td>${escapeHtml(formatDate(record.createdAt))}</td>
          <td><strong>${escapeHtml(participantCode(record))}</strong></td>
          <td>${escapeHtml(userInfo(record).age ?? "—")}</td>
          <td>${escapeHtml(formatNumber(srt(record)))} dB</td>
          <td><span class="outcome-badge ${escapeHtml(recordOutcome)}">${escapeHtml(outcomeText)}</span></td>
          <td><span class="qc-badge ${complete ? "complete" : "flag"}">${complete ? "Complete" : "Check"}</span></td>
          <td>
            <button type="button" data-action="detail" data-id="${escapeHtml(record._id)}">Detail</button>
            <button type="button" data-action="json" data-id="${escapeHtml(record._id)}">JSON</button>
            ${deleteButton}
          </td>
        </tr>
      `;
    }).join("");
  }

  function recordById(id) {
    return state.records.find((record) => record._id === id) || null;
  }

  function trialsCsv(record) {
    const headers = [
      "phase", "trialIndex", "attemptInPracticeItem", "digitsPresented", "response", "correct",
      "noiseEnabled", "presentedSnrDb", "effectiveSnrDb", "responseTimeMs", "timestamp"
    ];
    const rows = (record.trials || []).map((trial) => headers.map((header) => csvCell(trial?.[header])));
    return [headers.map(csvCell), ...rows].map((row) => row.join(",")).join("\n");
  }

  function summaryCsv(records) {
    const headers = [
      "id", "createdAt", "participantCode", "age", "gender", "stimulusLanguage", "protocolId",
      "srtDbSnr", "outcome", "referralCutoffDbSnr", "complete", "completedFormalTrials",
      "fixedGainDb", "calibrationPlayCount", "calibrationPlaybackSeconds", "uploadClientId", "uploadAttempts"
    ];
    const rows = records.map((record) => {
      const info = userInfo(record);
      const screen = screening(record);
      const upload = record.meta?.upload || {};
      return [
        record._id || "",
        record.createdAt || "",
        participantCode(record),
        info.age ?? "",
        info.gender || "",
        screen.stimulusLanguage || "",
        screen.protocolId || "",
        screen.srtDbSnr ?? "",
        screen.outcome || "",
        screen.referralCutoffDbSnr ?? "",
        isComplete(record) ? "yes" : "no",
        screen.completedFormalTrials ?? "",
        record.calibration?.fixedGainDb ?? "",
        record.calibration?.playCount ?? "",
        record.calibration?.cumulativePlaybackMs != null
          ? Math.round((Number(record.calibration.cumulativePlaybackMs) / 1000) * 10) / 10
          : "",
        upload.uploadClientId || "",
        upload.attemptCount ?? ""
      ];
    });
    return [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  }

  function openDetail(record) {
    const screen = screening(record);
    const info = userInfo(record);
    const calibration = record.calibration || {};
    const upload = record.meta?.upload || {};
    const formalTrials = (record.trials || []).filter((trial) => trial.phase === "formal");
    $("detailTitle").textContent = participantCode(record);

    const trialRows = formalTrials.map((trial) => `
      <tr>
        <td>${escapeHtml(Number(trial.trialIndex) + 1)}</td>
        <td>${escapeHtml(trial.digitsPresented)}</td>
        <td>${escapeHtml(trial.response)}</td>
        <td>${trial.correct ? "Yes" : "No"}</td>
        <td>${escapeHtml(formatNumber(trial.presentedSnrDb))}</td>
        <td>${escapeHtml(formatNumber(trial.effectiveSnrDb))}</td>
        <td>${escapeHtml(trial.responseTimeMs ?? "—")}</td>
      </tr>
    `).join("");

    $("detailContent").innerHTML = `
      <div class="detail-grid">
        <div><span>Participant code</span><strong>${escapeHtml(participantCode(record))}</strong></div>
        <div><span>Age</span><strong>${escapeHtml(info.age ?? "—")}</strong></div>
        <div><span>Gender</span><strong>${escapeHtml(info.gender || "—")}</strong></div>
        <div><span>SRT</span><strong>${escapeHtml(formatNumber(screen.srtDbSnr))} dB SNR</strong></div>
        <div><span>Outcome</span><strong>${escapeHtml(screen.outcome || "—")}</strong></div>
        <div><span>Cutoff</span><strong>${escapeHtml(formatNumber(screen.referralCutoffDbSnr))} dB SNR</strong></div>
        <div><span>Formal trials</span><strong>${escapeHtml(screen.completedFormalTrials ?? formalTrials.length)} / ${escapeHtml(screen.formalTrialCount ?? 24)}</strong></div>
        <div><span>Calibration</span><strong>${escapeHtml(formatNumber(calibration.fixedGainDb))} dB</strong></div>
        <div><span>Upload attempts</span><strong>${escapeHtml(upload.attemptCount ?? "—")}</strong></div>
        <div><span>Session ID</span><strong>${escapeHtml(record.sessionId || "—")}</strong></div>
        <div><span>Server ID</span><strong>${escapeHtml(record._id || "—")}</strong></div>
        <div><span>Completed</span><strong>${escapeHtml(formatDate(record.createdAt))}</strong></div>
      </div>
      <div class="detail-section">
        <h3>Formal trial trace</h3>
        <div class="table-wrap">
          <table class="trial-table">
            <thead><tr><th>#</th><th>Presented</th><th>Response</th><th>Correct</th><th>Target SNR</th><th>Effective SNR</th><th>RT (ms)</th></tr></thead>
            <tbody>${trialRows}</tbody>
          </table>
        </div>
      </div>
      <div class="detail-actions">
        <button type="button" id="downloadDetailJson">Download JSON</button>
        <button type="button" id="downloadTrialsCsv">Download trial CSV</button>
      </div>
    `;

    $("downloadDetailJson").addEventListener("click", () => {
      downloadBlob(`community_screening_${record._id}.json`, JSON.stringify(record, null, 2), "application/json");
    });
    $("downloadTrialsCsv").addEventListener("click", () => {
      downloadBlob(`community_screening_trials_${record._id}.csv`, trialsCsv(record), "text/csv;charset=utf-8");
    });
    $("detailDialog").showModal();
  }

  async function loadDetail(id) {
    const cached = recordById(id);
    const record = cached?.trials?.length
      ? cached
      : await api(`community-screening/results/${encodeURIComponent(id)}`);
    openDetail(record);
  }

  async function deleteRecord(id) {
    const record = recordById(id);
    if (!window.confirm(`Delete community screening record ${participantCode(record || {})}? This cannot be undone.`)) return;
    await api(`community-screening/results/${encodeURIComponent(id)}`, { method: "DELETE" });
    await loadRecords();
  }

  function wireEvents() {
    $("loginForm").addEventListener("submit", async (event) => {
      event.preventDefault();
      const username = $("loginUsername").value.trim();
      const password = $("loginPassword").value;
      if (!username || !password) {
        $("loginMessage").textContent = "Enter a username and password.";
        return;
      }
      $("loginButton").disabled = true;
      $("loginMessage").textContent = "Signing in…";
      try {
        state.user = await login(username, password);
        if (!state.user) throw new Error("The session could not be verified.");
        showDashboard();
        await loadRecords();
      } catch (error) {
        $("loginMessage").textContent = `Sign in failed: ${error.message}`;
      } finally {
        $("loginButton").disabled = false;
      }
    });

    $("logoutButton").addEventListener("click", async () => {
      try { await api("auth/logout", { method: "POST" }); } catch {}
      window.location.reload();
    });
    $("reloadButton").addEventListener("click", loadRecords);
    $("outcomeFilter").addEventListener("change", applyFilters);
    $("completionFilter").addEventListener("change", applyFilters);
    $("searchInput").addEventListener("keydown", (event) => {
      if (event.key === "Enter") loadRecords();
    });
    $("exportButton").addEventListener("click", () => {
      if (!state.filteredRecords.length) {
        window.alert("No records to export.");
        return;
      }
      const date = new Date().toISOString().slice(0, 10);
      downloadBlob(`community_screening_summary_${date}.csv`, summaryCsv(state.filteredRecords), "text/csv;charset=utf-8");
    });

    $("recordRows").addEventListener("click", async (event) => {
      const button = event.target.closest("button[data-action]");
      if (!button) return;
      button.disabled = true;
      try {
        if (button.dataset.action === "detail") await loadDetail(button.dataset.id);
        if (button.dataset.action === "json") {
          const record = await api(`community-screening/results/${encodeURIComponent(button.dataset.id)}`);
          downloadBlob(`community_screening_${button.dataset.id}.json`, JSON.stringify(record, null, 2), "application/json");
        }
        if (button.dataset.action === "delete") await deleteRecord(button.dataset.id);
      } catch (error) {
        window.alert(`Action failed: ${error.message}`);
      } finally {
        button.disabled = false;
      }
    });

    $("closeDialogButton").addEventListener("click", () => $("detailDialog").close());
    $("detailDialog").addEventListener("click", (event) => {
      if (event.target === $("detailDialog")) $("detailDialog").close();
    });
  }

  async function bootstrap() {
    wireEvents();
    state.user = await checkSession();
    if (!state.user) {
      showLogin();
      return;
    }
    showDashboard();
    try {
      await loadRecords();
    } catch (error) {
      $("recordCount").textContent = `Could not load records: ${error.message}`;
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }
})();
