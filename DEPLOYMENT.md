# Digit-in-Noise Test 部署指南

## 当前问题
线上网站 `https://www.neurahear.com` 无法访问后端 API，Nginx 返回 404。

## 解决方案

### 1. 在服务器上部署后端

SSH 登录到你的服务器后执行：

```bash
# 1. 进入项目目录（假设你已经 clone 了仓库）
cd /path/to/neurahear-site/server/din-backend

# 2. 安装依赖
npm install --production

# 3. 创建数据目录
mkdir -p data

# 4. 启动后端服务（使用 PM2 管理进程）
# 先安装 PM2（如果还没有）
sudo npm install -g pm2

# 5. 设置环境变量并启动
PORT=4000 \
JWT_SECRET='your_production_secret_key' \
DATA_DIR=/path/to/neurahear-site/server/din-backend/data \
ADMIN_BOOT_PASSWORD='120120' \
ALLOWED_ORIGINS='https://neurahear.com,https://www.neurahear.com' \
pm2 start server.js --name din-backend

# 6. 保存 PM2 配置（开机自启动）
pm2 save
pm2 startup
```

### 2. 配置 Nginx

#### 方法 A: 修改现有的 Nginx 配置

找到你当前 neurahear.com 的 Nginx 配置文件（通常在 `/etc/nginx/sites-available/`）：

```bash
sudo nano /etc/nginx/sites-available/neurahear.com
```

在现有的 `server` 块中添加 API 代理配置：

```nginx
server {
    listen 443 ssl http2;
    server_name neurahear.com www.neurahear.com;
    
    # 你现有的 SSL 配置...
    
    # 添加这个 location 块用于 API 代理
    location /api/ {
        proxy_pass http://127.0.0.1:4000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
    
    # 你现有的其他 location 配置...
}
```

#### 方法 B: 使用提供的完整配置

如果你想使用单独的配置文件：

```bash
# 1. 复制配置文件
sudo cp /path/to/neurahear-site/server/din-backend/nginx.d/din-backend.conf /etc/nginx/sites-available/neurahear.com

# 2. 测试配置
sudo nginx -t

# 3. 重启 Nginx
sudo systemctl restart nginx
```

### 3. 验证部署

```bash
# 1. 检查后端服务状态
pm2 status
pm2 logs din-backend

# 2. 测试后端健康检查
curl http://localhost:4000/health

# 3. 测试 Nginx 代理
curl https://neurahear.com/api/health

# 4. 测试登录（从本地）
curl -X POST https://neurahear.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"120120"}'
```

### 4. 故障排除

#### 如果 502 Bad Gateway
```bash
# 检查后端是否运行
pm2 status
lsof -i :4000

# 检查防火墙
sudo ufw status
sudo ufw allow 4000/tcp  # 仅本地访问，不需要对外开放
```

#### 如果 404 Not Found
```bash
# 检查 Nginx 配置
sudo nginx -t
cat /etc/nginx/sites-enabled/neurahear.com | grep -A 10 "/api"

# 重启 Nginx
sudo systemctl restart nginx
```

#### 如果 CORS 错误
确保后端的 `ALLOWED_ORIGINS` 环境变量包含你的域名：
```bash
pm2 restart din-backend --update-env
```

### 5. 使用 systemd（替代 PM2）

如果你想用 systemd：

```bash
# 1. 创建 service 文件
sudo cp /path/to/neurahear-site/server/din-backend/systemd/din-backend.service /etc/systemd/system/

# 2. 编辑配置（修改路径和环境变量）
sudo nano /etc/systemd/system/din-backend.service

# 3. 启动服务
sudo systemctl daemon-reload
sudo systemctl enable din-backend
sudo systemctl start din-backend

# 4. 查看状态
sudo systemctl status din-backend
sudo journalctl -u din-backend -f
```

## 安全建议

1. **JWT_SECRET**: 使用强随机字符串
   ```bash
   # 生成随机密钥
   openssl rand -base64 32
   ```

2. **HTTPS**: 确保只通过 HTTPS 访问（Secure cookies 需要）

3. **数据备份**: 定期备份 `data/results.jsonl` 和 `data/users.json`
   ```bash
   # 添加到 crontab
   0 2 * * * tar -czf /backup/din-backend-$(date +\%Y\%m\%d).tar.gz /path/to/din-backend/data/
   ```

4. **防火墙**: 确保端口 4000 不对外开放，仅 localhost 访问

## 快速检查清单

- [ ] 后端服务运行在端口 4000
- [ ] Nginx 配置包含 `/api/` location 块
- [ ] Nginx 已重启
- [ ] `ALLOWED_ORIGINS` 包含你的域名
- [ ] SSL 证书有效
- [ ] 可以访问 `https://neurahear.com/api/health`
- [ ] Admin 可以登录

## 需要的环境变量（服务器）

```bash
PORT=4000
JWT_SECRET='<生成的随机密钥>'
DATA_DIR='/path/to/neurahear-site/server/din-backend/data'
ADMIN_BOOT_PASSWORD='120120'
ALLOWED_ORIGINS='https://neurahear.com,https://www.neurahear.com'
```
