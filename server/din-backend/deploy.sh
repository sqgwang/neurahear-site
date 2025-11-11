#!/bin/bash
# 快速部署脚本 - Digit-in-Noise Backend
# 使用方法: ./deploy.sh

set -e  # 遇到错误立即退出

echo "=== Digit-in-Noise Backend 部署脚本 ==="
echo ""

# 检查是否在正确的目录
if [ ! -f "server.js" ]; then
    echo "错误: 请在 server/din-backend 目录下运行此脚本"
    exit 1
fi

# 1. 安装依赖
echo "1. 安装 Node.js 依赖..."
npm install --production

# 2. 创建数据目录
echo "2. 创建数据目录..."
mkdir -p data

# 3. 设置环境变量
echo "3. 配置环境变量..."
echo "请输入 JWT_SECRET (留空将生成随机密钥):"
read JWT_SECRET
if [ -z "$JWT_SECRET" ]; then
    JWT_SECRET=$(openssl rand -base64 32)
    echo "生成的 JWT_SECRET: $JWT_SECRET"
fi

echo "请输入 ADMIN 密码 (默认: 120120):"
read ADMIN_PASSWORD
ADMIN_PASSWORD=${ADMIN_PASSWORD:-120120}

# 4. 检查 PM2
echo "4. 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "PM2 未安装，正在安装..."
    sudo npm install -g pm2
fi

# 5. 停止旧进程（如果存在）
echo "5. 停止旧进程..."
pm2 delete din-backend 2>/dev/null || true

# 6. 启动服务
echo "6. 启动后端服务..."
PORT=4000 \
JWT_SECRET="$JWT_SECRET" \
DATA_DIR="$(pwd)/data" \
ADMIN_BOOT_PASSWORD="$ADMIN_PASSWORD" \
ALLOWED_ORIGINS="https://neurahear.com,https://www.neurahear.com" \
pm2 start server.js --name din-backend

# 7. 保存配置
echo "7. 保存 PM2 配置..."
pm2 save

# 8. 设置开机自启动
echo "8. 设置开机自启动..."
pm2 startup | tail -n 1 | bash || echo "请手动运行上面的命令来设置开机自启动"

# 9. 显示状态
echo ""
echo "=== 部署完成 ==="
pm2 status
echo ""
echo "后端服务已启动在端口 4000"
echo "健康检查: curl http://localhost:4000/health"
echo ""
echo "接下来请配置 Nginx，参考 DEPLOYMENT.md 文档"
echo ""
echo "JWT_SECRET: $JWT_SECRET"
echo "Admin 密码: $ADMIN_PASSWORD"
echo ""
echo "查看日志: pm2 logs din-backend"
