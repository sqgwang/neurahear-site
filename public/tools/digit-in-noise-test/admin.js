// admin.js — DIN Admin (extended fields + per-record CSV/JSON download + detail modal)
// 同域 '/api/...'; 强制凭证；列表展示 PID/性别/年龄/教育年限/语言/SRT 概览；支持 CSV 下载

(function(){
  // ===== Helpers =====
  const $ = sel => document.querySelector(sel);
  function esc(s){ return String(s==null?'':s).replace(/[&<>"]/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;' }[c])); }
  function ts(x){ try{ return new Date(x).toLocaleString(); }catch{ return ''; } }

  // 强制把任何 path 重写成 "/api/..."
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

  // CSV 生成（与 results 页面一致）
  function trialsToCSV(trials){
    const headers = [
      'participantId','condition','nDigits','digitsPresented',
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
    const data = await api(`results?limit=200&search=${encodeURIComponent(q)}`);
    $('#count').textContent = `${data.total} records`;

    if (!data.items?.length){
      $('#list').innerHTML = '<p class="note">No records.</p>';
      return;
    }

    const rows = data.items.map(it => {
      const ui = it.userInfo || {};
      const pid = it.participantId || ui.pid || '—';
      const sex = ui.gender || '—';
      const age = ui.age ?? '—';
      const eduVal = (ui.education != null ? ui.education : ui.educationYears);
      const edu = (eduVal != null && eduVal !== '') ? eduVal : '—';
      const stim = it.meta?.stimLang || ui.stimLang || '—';
      const conds = (it.meta?.conditionOrder || ui.testConditions || []).join(',');
      // SRT 概览：优先后端聚合的 perCondition；没有就显示“—”
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
          <button class="secondary small" data-act="detail" data-id="${id}">详情</button>
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

    // 事件绑定
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
    const perC = Array.isArray(doc.perCondition) ? doc.perCondition : [];
    const summary = doc.diffs || doc.summary || {};

    // per-condition 表
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
    document.getElementById('q').addEventListener('keydown', e=>{ if (e.key === 'Enter') loadList(); });
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
