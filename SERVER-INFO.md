# 🖥️ 服务器部署信息

## � 紧急：数据保护警告

**⚠️ 发现问题**：自动部署可能会删除测试数据！

**必须立即检查**：
1. 数据目录是否在项目外：`DATA_DIR=/opt/neurahear/din-data` ✅
2. 部署脚本是否使用了危险命令（`git reset --hard` 或 `git clean`）❌

**详细修复步骤**：请查看 [URGENT-DATA-PROTECTION.md](./URGENT-DATA-PROTECTION.md)

---

## �📍 服务器地址
- **域名**：neurahear.com / www.neurahear.com
- **服务器提供商**：阿里云 ECS (Alibaba Cloud)
- **操作系统**：Ubuntu + Nginx

## 📂 项目部署路径

### 主项目目录
```
/var/www/labsite
```

### 后端服务目录
```
/var/www/labsite/server/din-backend
```

### 关键文件位置
- **后端代码**：`/var/www/labsite/server/din-backend/server.js`
- **环境配置**：`/var/www/labsite/server/din-backend/.env`
- **⚠️ 测试数据（应该在项目外！）**：
  - **推荐位置**：`/opt/neurahear/din-data/` ✅ 安全
  - **危险位置**：`/var/www/labsite/server/din-backend/data/` ❌ 可能被删除
  - 测试结果：`results.jsonl`
  - 用户信息：`users.json`
- **备份目录**：`/var/www/labsite/backups/din-data/`

## 🔧 服务管理

### PM2 进程管理
```bash
# 查看后端服务状态
pm2 status

# 查看日志
pm2 logs din-backend

# 重启服务
pm2 restart din-backend

# 停止服务
pm2 stop din-backend

# 启动服务
pm2 start din-backend
```

### Nginx 配置
- **配置文件**：`/etc/nginx/sites-available/neurahear`
- **API 代理**：`/api/` → `http://127.0.0.1:4000`

```bash
# 测试 Nginx 配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx

# 查看 Nginx 状态
sudo systemctl status nginx
```

## 🌐 访问地址

### 前端页面
- **DIN 测试首页**：https://www.neurahear.com/tools/digit-in-noise-test/
- **管理后台**：https://www.neurahear.com/tools/digit-in-noise-test/admin.html
  - 用户名：`admin`
  - 密码：`120120`

### 后端 API
- **基础地址**：https://www.neurahear.com/api/
- **登录接口**：POST `/api/auth/login`
- **结果提交**：POST `/api/results`
- **查看结果**：GET `/api/results` (需管理员权限)

## 🔄 部署更新流程

### 1. 本地推送代码
```bash
git add .
git commit -m "更新说明"
git push origin main
```

### 2. SSH 登录服务器
```bash
ssh root@[服务器IP]
# 或使用你配置的 SSH 别名
```

### 3. 进入项目目录并更新
```bash
cd /var/www/labsite
git pull origin main
```

### 4. 更新后端（如有后端代码变更）
```bash
cd /var/www/labsite/server/din-backend
npm install  # 如果有新依赖
pm2 restart din-backend
```

### 5. 重建前端（如有前端代码变更）
```bash
cd /var/www/labsite
npm install  # 如果有新依赖
npm run build
# 如果静态文件有更新，可能需要复制到 Nginx 目录
```

## 🔑 环境变量配置

后端环境变量文件：`/var/www/labsite/server/din-backend/.env`

```env
PORT=4000
JWT_SECRET=YXRLRnkWvvQHb0CGbRryF8keC8zGr9weq496tZKJONA=
ADMIN_BOOT_PASSWORD=120120
ALLOWED_ORIGINS=https://neurahear.com,https://www.neurahear.com
DATA_DIR=/var/www/labsite/server/din-backend/data
NODE_ENV=production
```

## 📊 监控命令

### 检查后端是否运行
```bash
# 本地检查（在服务器上）
curl http://localhost:4000/health

# 外部检查
curl https://www.neurahear.com/api/auth/login
```

### 查看数据统计
```bash
# 测试结果总数
wc -l /var/www/labsite/server/din-backend/data/results.jsonl

# 查看最新测试
tail -n 5 /var/www/labsite/server/din-backend/data/results.jsonl

# 数据文件大小
ls -lh /var/www/labsite/server/din-backend/data/
```

### 磁盘空间
```bash
# 查看整体磁盘使用
df -h

# 查看项目目录大小
du -sh /var/www/labsite
```

## 💾 数据备份

### 手动备份
```bash
cd /var/www/labsite/server/din-backend
./backup-data.sh
```

### 设置自动备份（推荐）
```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点自动备份
0 2 * * * cd /var/www/labsite/server/din-backend && ./backup-data.sh >> /var/log/din-backup.log 2>&1
```

## 🆘 常见问题排查

### 后端无法访问
```bash
# 1. 检查进程是否运行
pm2 status

# 2. 查看错误日志
pm2 logs din-backend --err

# 3. 重启服务
pm2 restart din-backend

# 4. 检查端口占用
netstat -tlnp | grep 4000
```

### Nginx 502 错误
```bash
# 1. 检查后端是否在运行
pm2 status

# 2. 检查 Nginx 配置
sudo nginx -t

# 3. 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 数据丢失
```bash
# 恢复最新备份
cd /var/www/labsite/server/din-backend
tar -xzf /var/www/labsite/backups/din-data/din-data-backup-[最新日期].tar.gz -C ../
pm2 restart din-backend
```

## 📝 相关文档

- **部署文档**：`DEPLOYMENT.md`
- **数据管理**：`server/din-backend/DATA-MANAGEMENT.md`
- **Nginx 配置示例**：`server/din-backend/nginx-snippet.conf`

## 🔗 快速访问

| 项目 | 地址 |
|------|------|
| 网站首页 | https://www.neurahear.com |
| DIN 测试 | https://www.neurahear.com/tools/digit-in-noise-test/ |
| 管理后台 | https://www.neurahear.com/tools/digit-in-noise-test/admin.html |
| GitHub 仓库 | https://github.com/sqgwang/neurahear-site |

---

**💡 提示**：将此文档保存在项目根目录，每次忘记部署路径时可以快速查看！
