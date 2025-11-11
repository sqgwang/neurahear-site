# 🚨 紧急：数据丢失问题修复

## ⚠️ 问题描述

**症状**：每次推送代码到 GitHub 后，线上测试数据就消失了

**原因**：服务器上的自动部署脚本 `/usr/local/bin/update-neurahear.sh` 可能在执行以下操作之一：
- `git reset --hard` - 会删除所有未追踪的文件
- `git clean -fd` - 会删除所有未追踪的文件和目录
- 重新克隆整个项目 - 会删除 `data/` 目录

## ✅ 立即修复步骤

### 第一步：SSH 登录服务器并备份现有数据（如果还有）

```bash
ssh root@[服务器IP]

# 检查数据是否还在
ls -la /var/www/labsite/server/din-backend/data/

# 立即备份（如果数据还在）
mkdir -p /var/www/labsite/backups/emergency-backup
cp -r /var/www/labsite/server/din-backend/data/ /var/www/labsite/backups/emergency-backup/data-$(date +%Y%m%d_%H%M%S)
```

### 第二步：将 data/ 目录移到安全位置

```bash
# 创建持久数据目录（在项目外）
sudo mkdir -p /opt/neurahear/din-data
sudo chown -R $USER:$USER /opt/neurahear

# 如果还有数据，复制过去
if [ -d /var/www/labsite/server/din-backend/data ]; then
  cp -r /var/www/labsite/server/din-backend/data/* /opt/neurahear/din-data/
fi

# 修改后端环境变量指向新位置
cd /var/www/labsite/server/din-backend
```

创建或编辑 `.env` 文件：
```bash
nano .env
```

确保包含：
```env
PORT=4000
JWT_SECRET=YXRLRnkWvvQHb0CGbRryF8keC8zGr9weq496tZKJONA=
ADMIN_BOOT_PASSWORD=120120
ALLOWED_ORIGINS=https://neurahear.com,https://www.neurahear.com
DATA_DIR=/opt/neurahear/din-data
NODE_ENV=production
```

**重要**：`DATA_DIR` 现在指向项目外的安全目录！

### 第三步：更新 PM2 配置

```bash
cd /var/www/labsite/server/din-backend

# 删除旧进程
pm2 delete din-backend

# 用新环境变量重启
pm2 start server.js --name din-backend

# 验证新配置
pm2 logs din-backend --lines 20
```

你应该看到日志显示：
```
DATA_DIR = /opt/neurahear/din-data
```

### 第四步：验证数据持久化

```bash
# 检查数据目录
ls -la /opt/neurahear/din-data/

# 应该看到
# - results.jsonl
# - users.json
```

### 第五步：修改自动部署脚本（关键！）

查看当前的部署脚本：
```bash
cat /usr/local/bin/update-neurahear.sh
```

**需要确保脚本中：**
1. ❌ **不要** 使用 `git reset --hard`
2. ❌ **不要** 使用 `git clean -fd`
3. ❌ **不要** 删除并重新克隆项目
4. ✅ **只使用** `git pull` 更新代码

**安全的部署脚本应该是：**

```bash
#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# 进入项目目录
cd /var/www/labsite

# 拉取最新代码（不删除未追踪文件）
git fetch origin main
git pull origin main

# 更新依赖（如果需要）
npm install --production

# 更新后端依赖
cd server/din-backend
npm install --production

# 重启后端（数据目录在项目外，不受影响）
pm2 restart din-backend

echo "✅ Deployment complete!"
```

编辑脚本：
```bash
sudo nano /usr/local/bin/update-neurahear.sh
```

删除所有 `git reset --hard` 和 `git clean` 命令！

### 第六步：测试部署不会删除数据

```bash
# 1. 在本地做一个小改动并推送
echo "# Test" >> /var/www/labsite/test.txt
git add test.txt
git commit -m "Test deployment"

# 2. 等待 GitHub Actions 自动部署完成（约 1-2 分钟）

# 3. 检查数据是否还在
ls -la /opt/neurahear/din-data/
cat /opt/neurahear/din-data/results.jsonl | wc -l
```

如果数据还在，说明修复成功！✅

## 🔒 长期保护措施

### 1. 设置自动备份（推荐）

```bash
# 编辑 crontab
crontab -e

# 添加每天凌晨 2 点备份
0 2 * * * tar -czf /var/www/labsite/backups/din-data/din-data-backup-$(date +\%Y\%m\%d_\%H\%M\%S).tar.gz -C /opt/neurahear din-data && find /var/www/labsite/backups/din-data -name "din-data-backup-*.tar.gz" -mtime +30 -delete
```

### 2. 监控数据目录

```bash
# 添加监控脚本
cat > /usr/local/bin/check-din-data.sh << 'EOF'
#!/bin/bash
DATA_COUNT=$(cat /opt/neurahear/din-data/results.jsonl 2>/dev/null | wc -l)
if [ "$DATA_COUNT" -eq 0 ]; then
  echo "⚠️ WARNING: DIN data is empty!" | mail -s "DIN Data Alert" your-email@example.com
fi
EOF

chmod +x /usr/local/bin/check-din-data.sh

# 每小时检查一次
echo "0 * * * * /usr/local/bin/check-din-data.sh" | crontab -
```

### 3. 文档更新

在项目的 `.env.example` 中添加：
```env
# CRITICAL: Data directory MUST be outside project directory
# to prevent deletion during deployments
DATA_DIR=/opt/neurahear/din-data
```

## 📋 快速检查清单

服务器上执行：

```bash
# ✅ 1. 数据目录在项目外
echo "DATA_DIR location:"
pm2 logs din-backend --lines 5 | grep DATA_DIR

# ✅ 2. 数据文件存在
ls -lh /opt/neurahear/din-data/

# ✅ 3. 部署脚本不使用危险命令
grep -E "reset.*--hard|git clean" /usr/local/bin/update-neurahear.sh
# 应该返回空（没有找到）

# ✅ 4. 备份任务已设置
crontab -l | grep din-data
```

## 🆘 如果数据已经丢失

如果测试数据已经全部丢失：

1. **检查备份**：
   ```bash
   ls -la /var/www/labsite/backups/
   ```

2. **恢复最新备份**（如果有）：
   ```bash
   tar -xzf /var/www/labsite/backups/din-data/din-data-backup-[最新].tar.gz -C /opt/neurahear/
   pm2 restart din-backend
   ```

3. **如果没有备份**：
   - 数据无法恢复
   - 立即按照上述步骤修复，防止再次发生
   - 通知用户数据丢失情况

## ⚡ 快速修复命令（一键执行）

如果你信任这个脚本，可以一次性执行：

```bash
# 在服务器上执行
sudo mkdir -p /opt/neurahear/din-data
sudo chown -R $USER:$USER /opt/neurahear
[ -d /var/www/labsite/server/din-backend/data ] && cp -r /var/www/labsite/server/din-backend/data/* /opt/neurahear/din-data/
cd /var/www/labsite/server/din-backend
cat > .env << 'EOF'
PORT=4000
JWT_SECRET=YXRLRnkWvvQHb0CGbRryF8keC8zGr9weq496tZKJONA=
ADMIN_BOOT_PASSWORD=120120
ALLOWED_ORIGINS=https://neurahear.com,https://www.neurahear.com
DATA_DIR=/opt/neurahear/din-data
NODE_ENV=production
EOF
pm2 delete din-backend 2>/dev/null || true
pm2 start server.js --name din-backend
pm2 save
echo "✅ Data directory moved to /opt/neurahear/din-data"
pm2 logs din-backend --lines 10
```

---

**❗ 最重要的事**：修改 `/usr/local/bin/update-neurahear.sh`，移除所有会删除文件的 Git 命令！
