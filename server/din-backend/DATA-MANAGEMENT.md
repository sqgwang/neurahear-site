# DIN 测试数据管理说明

## 📁 数据存储位置

### 生产环境
- **测试结果**：`/opt/neurahear/din-data/results.jsonl`
- **用户信息**：`/opt/neurahear/din-data/users.json`

### 本地开发
- **测试结果**：`server/din-backend/data/results.jsonl`
- **用户信息**：`server/din-backend/data/users.json`

## 🔒 数据保护机制

### Git 保护
`data/` 目录已在 `.gitignore` 中排除：
```
server/din-backend/data/
```

这意味着：
- ✅ 测试数据**不会**被提交到 GitHub
- ✅ 测试数据**不会**被 Git 追踪
- ✅ `git pull` 更新代码时**不会**影响数据文件
- ✅ 数据文件**永久**保留在服务器本地

### 自动部署安全性
当服务器从 GitHub 拉取更新时：
- Git 只更新被追踪的文件（代码、配置等）
- `data/` 目录完全不受影响
- 已存在的测试结果安全保留

## 💾 数据备份

### 手动备份
在服务器上运行：
```bash
cd /var/www/labsite/server/din-backend
./backup-data.sh
```

备份文件保存在：`/var/www/labsite/backups/din-data/`

### 设置定期自动备份（推荐）
使用 crontab 每天凌晨 2 点自动备份：

```bash
# 编辑 crontab
crontab -e

# 添加以下行（每天 2:00 AM 备份）
0 2 * * * cd /var/www/labsite/server/din-backend && ./backup-data.sh >> /var/log/din-backup.log 2>&1
```

### 恢复备份
```bash
# 1. 找到备份文件
ls -lh /var/www/labsite/backups/din-data/

# 2. 解压恢复（注意：会覆盖现有数据）
cd /var/www/labsite/server/din-backend
tar -xzf /var/www/labsite/backups/din-data/din-data-backup-YYYYMMDD_HHMMSS.tar.gz -C ../

# 3. 重启后端服务
pm2 restart din-backend
```

## 📊 数据格式

### results.jsonl
每行一个 JSON 对象（JSONL 格式）：
```json
{"timestamp":"2025-11-11T12:34:56.789Z","sessionId":"abc123","language":"mandarin","snr":-10.5,"responses":[1,2,3],"correct":2,"incorrect":1}
```

### users.json
JSON 数组：
```json
[
  {
    "username": "admin",
    "role": "admin",
    "passwordHash": "$2a$10$..."
  }
]
```

## 🔍 查看数据

### 查看最新 10 条测试结果
```bash
tail -n 10 /opt/neurahear/din-data/results.jsonl
```

### 统计测试总数
```bash
wc -l /opt/neurahear/din-data/results.jsonl
```

### 查看数据文件大小
```bash
ls -lh /opt/neurahear/din-data/
```

### 通过 Admin 界面查看
访问：https://www.neurahear.com/tools/digit-in-noise-test/admin.html
- 用户名：`admin`
- 密码：见服务器环境变量或密码管理器，不写入仓库

## ⚠️ 注意事项

1. **不要手动编辑数据文件**：可能导致格式错误
2. **定期检查磁盘空间**：随着测试数据增长，确保有足够空间
3. **定期备份**：虽然数据受 Git 保护，但服务器故障仍可能导致数据丢失
4. **备份保留策略**：默认保留最近 30 天的备份

## 📈 数据增长预估

假设每条测试记录约 500 字节：
- 100 次测试 ≈ 50 KB
- 1,000 次测试 ≈ 500 KB
- 10,000 次测试 ≈ 5 MB
- 100,000 次测试 ≈ 50 MB

JSONL 格式非常高效，即使存储数万条记录也不会有性能问题。
