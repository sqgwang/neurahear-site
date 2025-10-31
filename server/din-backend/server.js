// server.js
// ======================================================
// Digit-in-Noise backend (Express)
// - Auth: cookie (JWT)
// - Roles: admin / viewer
// - Storage: JSONL (results), JSON (users)
// - CORS: allow GitHub Pages (sqgwang.github.io) with credentials
// - Ready for Render.com (PORT env, optional persistent disk via DATA_DIR)
// - Admin bootstrap: random on first run, or set ADMIN_BOOT_PASSWORD
// ======================================================

'use strict';

const express = require('express');
const path = require('path');
const fs = require('fs');
const fsp = fs.promises;
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();

// ----------- Config -----------
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-env';
const TOKEN_COOKIE = 'token';

// 数据目录：若在 Render 绑定了持久盘（例如挂载 /opt/data），请设置环境变量 DATA_DIR=/opt/data
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const RESULTS_FILE = path.join(DATA_DIR, 'results.jsonl');

// 允许的前端来源：从环境变量 ALLOWED_ORIGINS 读（逗号分隔），否则默认允许你的 GitHub Pages 主机
const RAW_ALLOWED = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean)
  : ['https://sqgwang.github.io'];

// 信任代理（让 secure cookie 在 Render/反向代理下生效）
app.set('trust proxy', 1);

// ----------- CORS（更健壮的匹配）-----------
console.log('CORS allowed origins:', RAW_ALLOWED);
app.use(cors({
  origin(origin, cb) {
    // 允许无 Origin 的请求（如 curl、健康检查）
    if (!origin) return cb(null, true);

    // 规范化传入的 Origin
    let o = origin;
    try { o = new URL(origin).origin; } catch {}

    // 等值或前缀匹配（避免末尾斜杠等差异）
    const ok = RAW_ALLOWED.some(allow => o === allow || o.startsWith(allow + '/'));
    if (ok) return cb(null, true);

    return cb(new Error('Not allowed by CORS: ' + origin));
  },
  credentials: true,
  methods: ['GET','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// ----------- Helpers -----------
function ensureDirs() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(RESULTS_FILE)) fs.writeFileSync(RESULTS_FILE, '', 'utf8');
  if (!fs.existsSync(USERS_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const password = Math.random().toString(36).slice(-10);
    const admin = {
      id: 'u_' + Date.now(),
      username: 'admin',
      passHash: bcrypt.hashSync(password, salt),
      role: 'admin',
      createdAt: new Date().toISOString()
    };
    fs.writeFileSync(USERS_FILE, JSON.stringify({ users: [admin] }, null, 2), 'utf8');
    console.log(`\n=== First run bootstrap ===\nAdmin account created:\n  username: admin\n  password: ${password}\nChange it via POST /api/users or edit data/users.json\n==========================\n`);
  }
}
async function loadUsers() {
  const txt = await fsp.readFile(USERS_FILE, 'utf8');
  return JSON.parse(txt).users || [];
}
async function saveUsers(users) {
  await fsp.writeFile(USERS_FILE, JSON.stringify({ users }, null, 2), 'utf8');
}
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
function requireAuth(req, res, next) {
  try {
    const token = req.cookies[TOKEN_COOKIE];
    if (!token) return res.status(401).json({ error: 'unauthorized' });
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: 'unauthorized' });
  }
}
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') return res.status(403).json({ error: 'forbidden' });
  next();
}
function genId(prefix = 'r') {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${rand}`;
}
async function appendResult(rec) {
  await fsp.appendFile(RESULTS_FILE, JSON.stringify(rec) + '\n', 'utf8');
}
async function readAllResults() {
  const txt = await fsp.readFile(RESULTS_FILE, 'utf8');
  if (!txt.trim()) return [];
  return txt
    .trim()
    .split('\n')
    .map(l => { try { return JSON.parse(l); } catch { return null; } })
    .filter(Boolean);
}

// ----------- Middleware -----------
ensureDirs();
app.use(express.json({ limit: '4mb' }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 60_000, max: 120 })); // 基本限流

// ----------- 可选：用环境变量强制设置/重置 admin 密码 -----------
const ADMIN_BOOT_PASSWORD = process.env.ADMIN_BOOT_PASSWORD;
(async () => {
  try {
    if (!ADMIN_BOOT_PASSWORD) return;
    const users = await loadUsers();
    let admin = users.find(u => u.username.toLowerCase() === 'admin');
    const salt = bcrypt.genSaltSync(10);
    if (!admin) {
      admin = {
        id: 'u_' + Date.now(),
        username: 'admin',
        passHash: bcrypt.hashSync(ADMIN_BOOT_PASSWORD, salt),
        role: 'admin',
        createdAt: new Date().toISOString()
      };
      users.push(admin);
      await saveUsers(users);
      console.log('Admin created from ADMIN_BOOT_PASSWORD env');
    } else {
      admin.passHash = bcrypt.hashSync(ADMIN_BOOT_PASSWORD, salt);
      await saveUsers(users);
      console.log('Admin password reset from ADMIN_BOOT_PASSWORD env');
    }
  } catch (e) {
    console.error('Admin bootstrap error', e);
  }
})();

// ----------- Healthcheck -----------
app.get('/health', (req, res) => {
  res.json({ ok: true, time: new Date().toISOString() });
});

// ----------- Auth -----------
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'missing credentials' });

  const users = await loadUsers();
  const u = users.find(x => x.username.toLowerCase() === String(username).toLowerCase());
  if (!u) return res.status(401).json({ error: 'invalid credentials' });

  const ok = bcrypt.compareSync(password, u.passHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });

  const token = signToken({ sub: u.id, username: u.username, role: u.role });
  res.cookie(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'None',   // 跨站必须 None
    secure: true,       // HTTPS 必须 true（Render 默认 HTTPS）
    maxAge: 7 * 24 * 3600 * 1000
  });
  res.json({ ok: true, user: { username: u.username, role: u.role } });
});

app.post('/api/auth/logout', (req, res) => {
  // 跨站清除 cookie 建议也带相同属性
  res.clearCookie(TOKEN_COOKIE, { httpOnly: true, sameSite: 'None', secure: true });
  res.json({ ok: true });
});

app.get('/api/me', requireAuth, (req, res) => {
  res.json({ user: { username: req.user.username, role: req.user.role } });
});

// ----------- Users (admin only) -----------
app.get('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const users = await loadUsers();
  res.json(users.map(u => ({
    id: u.id, username: u.username, role: u.role, createdAt: u.createdAt
  })));
});

app.post('/api/users', requireAuth, requireAdmin, async (req, res) => {
  const { username, password, role = 'viewer' } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'missing fields' });

  const users = await loadUsers();
  if (users.some(u => u.username.toLowerCase() === String(username).toLowerCase())) {
    return res.status(409).json({ error: 'username exists' });
  }
  const salt = bcrypt.genSaltSync(10);
  const u = {
    id: genId('u'),
    username,
    passHash: bcrypt.hashSync(password, salt),
    role,
    createdAt: new Date().toISOString()
  };
  users.push(u);
  await saveUsers(users);
  res.json({ ok: true, id: u.id });
});

app.post('/api/users/reset', requireAuth, requireAdmin, async (req, res) => {
  const { username, newPassword } = req.body || {};
  if (!username || !newPassword) return res.status(400).json({ error: 'missing fields' });

  const users = await loadUsers();
  const u = users.find(x => x.username.toLowerCase() === String(username).toLowerCase());
  if (!u) return res.status(404).json({ error: 'not found' });

  const salt = bcrypt.genSaltSync(10);
  u.passHash = bcrypt.hashSync(newPassword, salt);
  await saveUsers(users);
  res.json({ ok: true });
});

// ----------- Results -----------
/**
 * 期望 payload（建议结构）：
 * {
 *   sessionId, participantId, userInfo, perCondition, diffs, snrTracks, trials, meta, createdAt
 * }
 * 其中 trials 为数组，作为“有效负载”校验字段。
 */
app.post('/api/results', async (req, res) => {
  const rec = req.body || {};
  if (!rec || !Array.isArray(rec.trials)) {
    return res.status(400).json({ error: 'invalid payload' });
  }
  rec._id = genId('r');
  rec._ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
  rec._ua = req.headers['user-agent'] || '';
  rec.createdAt = rec.createdAt || new Date().toISOString();

  await appendResult(rec);
  res.json({ ok: true, id: rec._id });
});

// 列表：需要登录
app.get('/api/results', requireAuth, async (req, res) => {
  const { limit = 50, offset = 0, search = '' } = req.query;
  const all = await readAllResults();
  const q = String(search || '').trim().toLowerCase();
  const filtered = q ? all.filter(r => JSON.stringify(r).toLowerCase().includes(q)) : all;

  const start = Math.max(0, parseInt(offset, 10) || 0);
  const end = start + Math.min(500, parseInt(limit, 10) || 50);
  const slice = filtered.slice().reverse().slice(start, end); // 最新在前
  res.json({ total: filtered.length, items: slice });
});

// 详情：需要登录
app.get('/api/results/:id', requireAuth, async (req, res) => {
  const all = await readAllResults();
  const it = all.find(r => r._id === req.params.id);
  if (!it) return res.status(404).json({ error: 'not found' });
  res.json(it);
});

// 删除：仅 admin
app.delete('/api/results/:id', requireAuth, requireAdmin, async (req, res) => {
  const all = await readAllResults();
  const next = all.filter(r => r._id !== req.params.id);
  if (next.length === all.length) return res.status(404).json({ error: 'not found' });

  const lines = next.map(r => JSON.stringify(r)).join('\n') + (next.length ? '\n' : '');
  await fsp.writeFile(RESULTS_FILE, lines, 'utf8');
  res.json({ ok: true });
});

// ----------- Error handlers -----------
// 处理 CORS 与其它未捕获错误
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (String(err.message || '').startsWith('Not allowed by CORS')) {
    return res.status(403).json({ error: 'CORS rejected', detail: err.message });
  }
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'internal error' });
});

// ----------- Start -----------
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
  console.log(`DATA_DIR = ${DATA_DIR}`);
});
