#!/bin/bash
# 一次性服务器权限修复脚本
# 请在服务器上以 root 用户执行此脚本

set -e

echo "========================================="
echo "  Neurahear 服务器权限修复脚本"
echo "========================================="
echo ""

# 检查是否为 root
if [ "$EUID" -ne 0 ]; then 
    echo "❌ 错误: 请使用 root 用户执行此脚本"
    echo "   使用命令: sudo bash SERVER-FIX.sh"
    exit 1
fi

echo "✓ Root 权限确认"
echo ""

# 获取当前 SSH 用户（如果通过 sudo 执行）
ACTUAL_USER="${SUDO_USER:-root}"
echo "当前用户: $ACTUAL_USER"
echo ""

echo "步骤 1/5: 备份当前目录权限信息"
ls -la /var/www/neurahear > /tmp/neurahear-permissions-backup.txt 2>&1 || true
echo "✓ 备份保存到 /tmp/neurahear-permissions-backup.txt"
echo ""

echo "步骤 2/5: 强制删除所有旧文件"
# 使用 find 命令逐个删除，避免权限问题
find /var/www/neurahear -mindepth 1 -delete 2>/dev/null || {
    echo "尝试使用 root 权限删除..."
    rm -rf /var/www/neurahear/* /var/www/neurahear/.[!.]* 2>/dev/null || true
}
echo "✓ 旧文件已清理"
echo ""

echo "步骤 3/5: 设置目录所有权"
# 将目录所有权设置为 SSH 用户
chown -R $ACTUAL_USER:$ACTUAL_USER /var/www/neurahear
echo "✓ 所有权设置为 $ACTUAL_USER:$ACTUAL_USER"
echo ""

echo "步骤 4/5: 设置目录权限"
chmod 755 /var/www/neurahear
echo "✓ 目录权限设置为 755"
echo ""

echo "步骤 5/5: 验证配置"
echo "目录信息:"
ls -lad /var/www/neurahear
echo ""
echo "目录内容:"
ls -la /var/www/neurahear | head -n 10
echo ""

echo "========================================="
echo "  ✅ 修复完成！"
echo "========================================="
echo ""
echo "下一步:"
echo "1. 在 GitHub 上手动触发 Actions 工作流"
echo "2. 或者推送新的代码到 main 分支"
echo "3. 部署应该能够正常完成"
echo ""
