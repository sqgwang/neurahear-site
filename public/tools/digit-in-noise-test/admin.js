// admin.js — DIN Admin (extended fields + per-record CSV/JSON download + detail modal)
// Same-origin '/api/...'; includes credentials; lists PID, demographics, language, and SRT summary; supports CSV download.

(function(){
  const N_FORMAL_PER_CONDITION = 24;
  let currentItems = [];

  // ===== Helpers =====
  const $ = sel => document.querySelector(sel);
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
  function ts(x){ try{ return new Date(x).toLocaleString(); }catch{ return ''; } }

  // Force every path into the "/api/..." namespace.
  function buildUrl(path){
    let p = String(path||'').trim().replace(/^\/+/, '').replace(/^api\/+/, '');
    const url = '/api/' + p;
    console.log('[API URL]', path, '->', url);
    return url;
  }

  async function api(path, opts = {}){
    const url = buildUrl(path);
    const res = await fetch(url, Object.assign({
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    }, opts));
    if (!res.ok){
      let msg = `${res.status} ${res.statusText}`;
      try { msg = await res.text(); } catch {}
      throw new Error(msg);
    }
    const ct = res.headers.get('content-type') || '';
    return ct.includes('application/json') ? res.json() : res.text();
  }

  function showLogin(show){
    $('#loginPane').style.display = show ? '' : 'none';
    $('#dashPane').style.display  = show ? 'none' : '';
  }

  // CSV generation aligned with the results page.
  function trialsToCSV(trials){
    const headers = [
      'participantId','language','condition','nDigits','practice','trialIndexInCond','digitsPresented',
      'presentedSNR','effectiveSNR','response','correct','rt_ms','timestamp'
    ];
    const rows = [headers.join(',')].concat(
      (trials||[]).map(t => headers.map(h => JSON.stringify((t||{})[h] ?? '')).join(','))
    );
    return rows.join('\n');
  }

  function srtSummary(perCondition){
    if (!Array.isArray(perCondition)) return '—';
    const parts = perCondition
      .filter(x => x && x.condition && x.SRT != null)
      .map(x => `${x.condition}:${x.SRT}`);
    return parts.length ? parts.join(' ') : '—';
  }

  function getUserInfo(rec) {
    return rec.userInfo || {};
  }

  function getStimLang(rec) {
    const ui = getUserInfo(rec);
    return rec.meta?.stimLang || ui.stimLang || rec.language || '';
  }

  function getConditionOrder(rec) {
    const ui = getUserInfo(rec);
    const order = rec.meta?.conditionOrder || ui.testConditions || [];
    return Array.isArray(order) ? order : [];
  }

  function getFormalCount(rec) {
    if (rec.meta?.nFormalTrials != null) return Number(rec.meta.nFormalTrials) || 0;
    if (Array.isArray(rec.trials)) return rec.trials.filter(t => t && !t.practice).length;
    const perC = Array.isArray(rec.perCondition) ? rec.perCondition : [];
    return perC.reduce((sum, row) => sum + (Number(row.nFormalTrials) || 0), 0);
  }

  function getExpectedFormalCount(rec) {
    const nConds = getConditionOrder(rec).length || (Array.isArray(rec.perCondition) ? rec.perCondition.length : 0);
    return nConds ? nConds * N_FORMAL_PER_CONDITION : 0;
  }

  function isCompleteRecord(rec) {
    const expected = getExpectedFormalCount(rec);
    return expected > 0 && getFormalCount(rec) >= expected;
  }

  function isRandomizedRecord(rec) {
    const ui = getUserInfo(rec);
    return !!(rec.meta?.randomizeConditions || ui.randomizeConditions);
  }

  function getCalibrationGain(rec) {
    const v = rec.meta?.fixedNoiseGain ?? rec.meta?.calibration?.noiseGain;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }

  function getCalibrationDb(rec) {
    const direct = rec.meta?.calibration?.noiseGainDb;
    const directN = Number(direct);
    if (Number.isFinite(directN)) return directN;
    const gain = getCalibrationGain(rec);
    return gain && gain > 0 ? Math.round(20 * Math.log10(gain) * 10) / 10 : null;
  }

  function getCalibration(rec) {
    return rec.meta?.calibration || {};
  }

  function getCalibrationConfirmed(rec) {
    const calibration = getCalibration(rec);
    return calibration.audibleConfirmed == null ? '' : (calibration.audibleConfirmed ? 'yes' : 'no');
  }

  function getCalibrationPlayCount(rec) {
    const count = Number(getCalibration(rec).playCount);
    return Number.isFinite(count) ? count : '';
  }

  function getCalibrationListenSeconds(rec) {
    const ms = Number(getCalibration(rec).cumulativeNoisePlaybackMs);
    return Number.isFinite(ms) ? Math.round((ms / 1000) * 10) / 10 : '';
  }

  function getCalibrationAdjustmentCount(rec) {
    const count = Number(getCalibration(rec).adjustmentCount);
    return Number.isFinite(count) ? count : '';
  }

  function getUploadMeta(rec) {
    return rec.meta?.upload || {};
  }

  function getUploadClientId(rec) {
    return getUploadMeta(rec).uploadClientId || '';
  }

  function getUploadAttemptCount(rec) {
    const count = Number(getUploadMeta(rec).attemptCount);
    return Number.isFinite(count) ? count : '';
  }

  function applyDashboardFilters(items) {
    const lang = $('#filterLang')?.value || '';
    const completion = $('#filterCompletion')?.value || '';
    const randomized = $('#filterRandomized')?.value || '';
    const minFormalRaw = $('#filterMinFormal')?.value || '';
    const minFormal = minFormalRaw === '' ? null : Number(minFormalRaw);

    return (items || []).filter(rec => {
      if (lang && getStimLang(rec) !== lang) return false;
      if (completion === 'complete' && !isCompleteRecord(rec)) return false;
      if (completion === 'incomplete' && isCompleteRecord(rec)) return false;
      if (randomized === 'yes' && !isRandomizedRecord(rec)) return false;
      if (randomized === 'no' && isRandomizedRecord(rec)) return false;
      if (Number.isFinite(minFormal) && getFormalCount(rec) < minFormal) return false;
      return true;
    });
  }

  function renderQcSummary(items, backendTotal) {
    const total = items.length;
    const complete = items.filter(isCompleteRecord).length;
    const randomized = items.filter(isRandomizedRecord).length;
    const gains = items.map(getCalibrationGain).filter(v => v != null);
    const avgGain = gains.length ? gains.reduce((a,b)=>a+b,0) / gains.length : null;
    const langs = Array.from(new Set(items.map(getStimLang).filter(Boolean)));
    $('#qcSummary').innerHTML = [
      ['Shown records', `${total}`, `${backendTotal} matched search`],
      ['Complete', `${complete}`, `${Math.max(0, total - complete)} incomplete`],
      ['Randomized', `${randomized}`, `${Math.max(0, total - randomized)} selected order`],
      ['Avg calibration', avgGain == null ? '—' : `${avgGain.toFixed(2)}x`, langs.length ? langs.join(', ') : 'No languages']
    ].map(([label, value, sub]) => `<div class="metric-tile"><b>${esc(value)}</b><span>${esc(label)} · ${esc(sub)}</span></div>`).join('');
  }

  function rowsToCSV(rows) {
    return rows.map(row => row.map(value => JSON.stringify(value ?? '')).join(',')).join('\n');
  }

  function downloadText(filename, content, type) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], { type }));
    a.download = filename;
    a.click();
  }

  function exportCurrentSummaryCSV() {
    if (!currentItems.length) {
      alert('No current records to export.');
      return;
    }
    const headers = [
      'id','createdAt','participantId','gender','age','education','stimLang','conditions',
      'nFormalTrials','expectedFormalTrials','complete','randomized','fixedNoiseGain','calibrationDb',
      'calibrationConfirmed','calibrationPlayCount','calibrationListenSeconds','calibrationAdjustmentCount',
      'uploadClientId','uploadAttemptCount','SRTs'
    ];
    const rows = currentItems.map(rec => {
      const ui = getUserInfo(rec);
      const conds = getConditionOrder(rec);
      const perC = Array.isArray(rec.perCondition) ? rec.perCondition : [];
      return [
        rec._id || '',
        rec.createdAt || '',
        rec.participantId || ui.pid || '',
        ui.gender || '',
        ui.age ?? '',
        ui.education ?? ui.educationYears ?? '',
        getStimLang(rec),
        conds.join('|'),
        getFormalCount(rec),
        getExpectedFormalCount(rec),
        isCompleteRecord(rec) ? 'yes' : 'no',
        isRandomizedRecord(rec) ? 'yes' : 'no',
        getCalibrationGain(rec),
        getCalibrationDb(rec),
        getCalibrationConfirmed(rec),
        getCalibrationPlayCount(rec),
        getCalibrationListenSeconds(rec),
        getCalibrationAdjustmentCount(rec),
        getUploadClientId(rec),
        getUploadAttemptCount(rec),
        srtSummary(perC)
      ];
    });
    downloadText(`idin_results_summary_${new Date().toISOString().slice(0,10)}.csv`, rowsToCSV([headers].concat(rows)), 'text/csv;charset=utf-8');
  }

  // ===== Auth =====
  async function checkMe(){
    try { const r = await api('me'); console.log('[ME]', r); return r.user || null; }
    catch(e){ console.warn('[ME ERROR]', e.message); return null; }
  }
  async function doLogin(username, password){
    console.log('[LOGIN] try', username);
    return api('auth/login', { method:'POST', body: JSON.stringify({ username, password }) });
  }
  async function doLogout(){ try { await api('auth/logout', { method:'POST' }); } catch {} }

  // ===== Results list =====
  async function loadList(){
    const isAdmin = window.__ME_ROLE === 'admin';
    const q = $('#q').value.trim();
    const data = await api(`results?limit=500&search=${encodeURIComponent(q)}`);
    const filteredItems = applyDashboardFilters(data.items || []);
    currentItems = filteredItems;
    $('#count').textContent = `${filteredItems.length} shown / ${data.total} records`;
    renderQcSummary(filteredItems, data.total);

    if (!filteredItems.length){
      $('#list').innerHTML = '<p class="note">No records.</p>';
      return;
    }

    const rows = filteredItems.map(it => {
      const ui = it.userInfo || {};
      const pid = it.participantId || ui.pid || '—';
      const sex = ui.gender || '—';
      const age = ui.age ?? '—';
      const eduVal = (ui.education != null ? ui.education : ui.educationYears);
      const edu = (eduVal != null && eduVal !== '') ? eduVal : '—';
      const stim = it.meta?.stimLang || ui.stimLang || '—';
      const conds = (it.meta?.conditionOrder || ui.testConditions || []).join(',');
      // SRT overview: prefer server-side perCondition aggregates; fall back to "—".
      const perC = Array.isArray(it.perCondition) ? it.perCondition : [];
      const srtStr = srtSummary(perC);
      const created = ts(it.createdAt || Date.now());
      const id = it._id;
      return `<tr>
        <td class="small mono">${esc(created)}</td>
        <td>${esc(pid)}</td>
        <td>${esc(sex)}</td>
        <td>${esc(age)}</td>
        <td>${esc(edu)}</td>
        <td>${esc(stim)}</td>
        <td class="small">${esc(conds)}</td>
        <td class="small">${esc(srtStr)}</td>
        <td>
          <button class="secondary small" data-act="detail" data-id="${id}">Detail</button>
          <button class="secondary small" data-act="json" data-id="${id}">JSON</button>
          <button class="secondary small" data-act="csv" data-id="${id}">CSV</button>
          ${isAdmin ? `<button class="danger small" data-act="del" data-id="${id}">Delete</button>` : ''}
        </td>
      </tr>`;
    }).join('');

    $('#list').innerHTML = `
      <table class="table small">
        <thead>
          <tr>
            <th>Time</th>
            <th>PID</th>
            <th>Gender</th>
            <th>Age</th>
            <th>Edu (yrs)</th>
            <th>StimLang</th>
            <th>Conditions</th>
            <th>SRTs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;

    // Event binding.
    $('#list').querySelectorAll('button[data-act="json"]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const one = await api('results/' + b.dataset.id);
        const blob = new Blob([JSON.stringify(one,null,2)], { type:'application/json' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `result_${b.dataset.id}.json`;
        a.click();
      });
    });

    $('#list').querySelectorAll('button[data-act="csv"]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const one = await api('results/' + b.dataset.id);
        const csv = trialsToCSV(one.trials || []);
        const blob = new Blob([csv], { type:'text/csv' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `trials_${b.dataset.id}.csv`;
        a.click();
      });
    });

    $('#list').querySelectorAll('button[data-act="detail"]').forEach(b=>{
      b.addEventListener('click', async ()=>{
        const one = await api('results/' + b.dataset.id);
        openDetail(one);
      });
    });

    if (isAdmin){
      $('#list').querySelectorAll('button[data-act="del"]').forEach(b=>{
        b.addEventListener('click', async ()=>{
          if (!confirm('Delete this record?')) return;
          try {
            const r = await fetch(buildUrl('results/' + b.dataset.id), { method:'DELETE', credentials:'include' });
            if (!r.ok) throw new Error(await r.text());
            await loadList();
          } catch(e) { alert('Delete failed: ' + e.message); }
        });
      });
    }
  }

  // ===== Detail modal =====
  function openDetail(doc){
    const d = document.getElementById('detailDialog');
    const main = document.getElementById('dlgMain');
    const uid = esc(doc._id || '');
    const ui = doc.userInfo || {};
    const pid = esc(doc.participantId || ui.pid || '');
    const sex = esc(ui.gender || '');
    const age = esc(ui.age ?? '');
    const edu = esc(ui.educationYears ?? ui.education ?? '');
    const stim = esc(doc.meta?.stimLang || ui.stimLang || '');
    const conds = esc((doc.meta?.conditionOrder || ui.testConditions || []).join(','));
    const calibrationGain = getCalibrationGain(doc);
    const calibrationDb = getCalibrationDb(doc);
    const calibrationConfirmed = getCalibrationConfirmed(doc) || '—';
    const calibrationPlayCount = getCalibrationPlayCount(doc) || '—';
    const calibrationListenSeconds = getCalibrationListenSeconds(doc) || '—';
    const calibrationAdjustmentCount = getCalibrationAdjustmentCount(doc) || '—';
    const uploadClientId = getUploadClientId(doc) || '—';
    const uploadAttemptCount = getUploadAttemptCount(doc) || '—';
    const perC = Array.isArray(doc.perCondition) ? doc.perCondition : [];
    const summary = doc.diffs || doc.summary || {};

    // Per-condition table.
    const pcRows = perC.map(r => `
      <tr>
        <td>${esc(r.condition)}</td>
        <td>${r.SRT ?? ''}</td>
        <td>${r.RT_all_ms ?? r.RT_all_mean_ms ?? ''}</td>
        <td>${r.RT_correct_ms ?? r.RT_correct_mean_ms ?? ''}</td>
      </tr>
    `).join('') || `<tr><td colspan="4" class="note">No per-condition metrics.</td></tr>`;

    // diffs
    const diffMap = {
      SRT3b_3: 'SRT(3b) − SRT(3f)',
      SRT2b_2: 'SRT(2b) − SRT(2f)',
      SRT5_3:  'SRT(5f) − SRT(3f)',
      SRT5_2:  'SRT(5f) − SRT(2f)',
      RT3b_3:  'RT(correct, 3b) − RT(correct, 3f)',
      RT2b_2:  'RT(correct, 2b) − RT(correct, 2f)',
      RT5_3:   'RT(correct, 5f) − RT(correct, 3f)',
      RT5_2:   'RT(correct, 5f) − RT(correct, 2f)'
    };
    const drows = Object.keys(diffMap).map(k => {
      const v = summary[k];
      if (v == null) return '';
      return `<tr><td>${diffMap[k]}</td><td>${v}</td></tr>`;
    }).join('') || `<tr><td colspan="2" class="note">No differences.</td></tr>`;

    main.innerHTML = `
      <div class="stack">
        <div class="note small mono">ID: ${uid}</div>
        <div class="small"><b>PID:</b> ${pid} &nbsp; <b>Gender:</b> ${sex} &nbsp; <b>Age:</b> ${age} &nbsp; <b>Edu(yrs):</b> ${edu} &nbsp; <b>StimLang:</b> ${stim}</div>
        <div class="small"><b>Conditions:</b> ${conds}</div>
        <div class="small"><b>Calibration:</b> ${esc(calibrationGain == null ? '—' : `${calibrationGain.toFixed(2)}x`)} / ${esc(calibrationDb == null ? '—' : `${calibrationDb} dB`)} &nbsp; <b>Confirmed:</b> ${esc(calibrationConfirmed)} &nbsp; <b>Plays:</b> ${esc(calibrationPlayCount)} &nbsp; <b>Listen(s):</b> ${esc(calibrationListenSeconds)} &nbsp; <b>Adjustments:</b> ${esc(calibrationAdjustmentCount)}</div>
        <div class="small"><b>Upload ID:</b> ${esc(uploadClientId)} &nbsp; <b>Upload attempts:</b> ${esc(uploadAttemptCount)}</div>

        <h3 style="margin-bottom:6px;">Per-condition</h3>
        <table class="table small">
          <thead><tr><th>Condition</th><th>SRT (dB)</th><th>RT (all) ms</th><th>RT (correct) ms</th></tr></thead>
          <tbody>${pcRows}</tbody>
        </table>

        <h3 style="margin:12px 0 6px;">Differences</h3>
        <table class="table small">
          <thead><tr><th>Metric</th><th>Value</th></tr></thead>
          <tbody>${drows}</tbody>
        </table>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="secondary" id="dlgJsonBtn">Download JSON</button>
          <button class="secondary" id="dlgCsvBtn">Download CSV (trials)</button>
        </div>
      </div>
    `;

    $('#dlgJsonBtn').onclick = () => {
      const blob = new Blob([JSON.stringify(doc,null,2)], { type:'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `result_${uid}.json`;
      a.click();
    };
    $('#dlgCsvBtn').onclick = () => {
      const csv = trialsToCSV(doc.trials || []);
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([csv], { type:'text/csv' }));
      a.download = `trials_${uid}.csv`;
      a.click();
    };

    $('#dlgTitle').textContent = `Result detail — ${pid}`;
    $('#dlgClose').onclick = () => d.close();
    d.showModal();
  }

  // ===== Users (admin) =====
  async function loadUsers(){
    try{
      const users = await api('users');
      $('#userList').textContent = users.map(u => `${u.username} (${u.role})`).join(' · ') || '—';
    } catch { $('#userList').textContent = '—'; }
  }
  async function addUser(){
    const username = $('#newUser').value.trim();
    const password = $('#newPass').value;
    const role = $('#newRole').value;
    if (!username || !password) { $('#userMsg').textContent = 'Enter username & password.'; return; }
    try{
      await api('users', { method:'POST', body: JSON.stringify({ username, password, role }) });
      $('#newUser').value = ''; $('#newPass').value = '';
      $('#userMsg').textContent = 'User created.';
      await loadUsers();
    }catch(e){
      $('#userMsg').textContent = 'Create failed: ' + e.message;
    }
  }

  // ===== Bootstrap =====
  document.addEventListener('DOMContentLoaded', async ()=>{
    if (location.protocol !== 'https:') { const h = document.getElementById('httpsHint'); if (h) h.textContent = 'Tip: use HTTPS so the secure cookie can be saved.'; }
    document.getElementById('loginUser').addEventListener('keydown', e=>{ if (e.key === 'Enter') document.getElementById('btnLogin').click(); });
    document.getElementById('loginPass').addEventListener('keydown', e=>{ if (e.key === 'Enter') document.getElementById('btnLogin').click(); });

    document.getElementById('btnLogin').addEventListener('click', async ()=>{
      const u = $('#loginUser').value.trim();
      const p = $('#loginPass').value;
      if (!u || !p) { $('#loginMsg').textContent = 'Please enter username & password.'; return; }
      $('#btnLogin').disabled = true; $('#loginMsg').textContent = 'Logging in…';
      try{
        await doLogin(u, p);
        const me = await checkMe();
        if (!me){ $('#loginMsg').textContent = 'Login OK, but /api/me failed. Ensure HTTPS.'; $('#btnLogin').disabled=false; return; }
        await enterDashboard(me);
      }catch(e){ console.error('[LOGIN ERROR]', e); $('#loginMsg').textContent = 'Login failed: ' + e.message; $('#btnLogin').disabled=false; }
    });

    document.getElementById('btnLogout').addEventListener('click', async ()=>{ await doLogout(); location.reload(); });
    document.getElementById('btnReload').addEventListener('click', loadList);
    document.getElementById('btnExportSummary').addEventListener('click', exportCurrentSummaryCSV);
    document.getElementById('q').addEventListener('keydown', e=>{ if (e.key === 'Enter') loadList(); });
    ['filterLang','filterCompletion','filterRandomized'].forEach(id => {
      document.getElementById(id).addEventListener('change', loadList);
    });
    document.getElementById('filterMinFormal').addEventListener('keydown', e=>{ if (e.key === 'Enter') loadList(); });
    document.getElementById('btnAddUser').addEventListener('click', addUser);

    const me = await checkMe();
    if (me) await enterDashboard(me);
  });

  async function enterDashboard(me){
    showLogin(false);
    window.__ME_ROLE = me.role;
    document.getElementById('meBadge').textContent = `Signed in as ${me.username} (${me.role})`;
    await loadList();
    if (me.role === 'admin') { document.getElementById('userAdmin').style.display = ''; await loadUsers(); }
    else { document.getElementById('userAdmin').style.display = 'none'; }
  }
})();
