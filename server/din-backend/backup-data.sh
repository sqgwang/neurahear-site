#!/bin/bash
# 备份 DIN 测试数据脚本
# 在服务器上定期运行此脚本备份测试结果

set -e

# 配置
DATA_DIR="${DATA_DIR:-/opt/neurahear/din-data}"
BACKUP_DIR="${BACKUP_DIR:-/var/www/labsite/backups/din-data}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="din-data-backup-${TIMESTAMP}.tar.gz"

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 打包数据
echo "📦 Backing up DIN test data..."
tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" -C "$(dirname "$DATA_DIR")" "$(basename "$DATA_DIR")"

echo "✅ Backup created: ${BACKUP_DIR}/${BACKUP_FILE}"

# 只保留最近 30 天的备份
echo "🧹 Cleaning up old backups (keeping last 30 days)..."
find "$BACKUP_DIR" -name "din-data-backup-*.tar.gz" -mtime +30 -delete

echo "✅ Backup complete!"
ls -lh "${BACKUP_DIR}/${BACKUP_FILE}"
