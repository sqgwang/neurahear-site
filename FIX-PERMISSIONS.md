# 一次性权限修复指南

## 问题说明
GitHub Actions 部署时遇到权限问题，因为 `/var/www/neurahear/` 目录中的文件所有者与部署用户不匹配。

## 解决方案：在服务器上执行以下命令

SSH 到你的服务器后，执行：

```bash
# 1. 删除旧的构建产物目录（会重新生成）
sudo rm -rf /var/www/neurahear/_next

# 2. 确保部署用户拥有目标目录的写权限
sudo chown -R $(whoami):$(whoami) /var/www/neurahear

# 3. 设置正确的权限（755 = 所有人可读可执行，所有者可写）
sudo chmod -R 755 /var/www/neurahear

# 4. 重新运行一次完整部署
cd /var/www/labsite
git pull origin main
npm install
npm run build
rsync -av --delete out/ /var/www/neurahear/
cd server/din-backend
npm install --production
pm2 restart din-backend

echo "✅ 权限修复完成！"
```

## 执行后
下次 GitHub Actions 自动部署时应该不会再有权限错误。

## 备用方案（如果上述方案无效）
如果你的 SSH 用户是 root，使用：

```bash
# 方案B：使用 root 用户重置所有权限
sudo rm -rf /var/www/neurahear/*
cd /var/www/labsite
git pull origin main
npm install
npm run build
rsync -av --delete out/ /var/www/neurahear/
chown -R www-data:www-data /var/www/neurahear
chmod -R 755 /var/www/neurahear
```
