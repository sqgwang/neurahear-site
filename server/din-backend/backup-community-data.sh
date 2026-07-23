#!/bin/bash
# Back up community hearing screening data independently from research iDIN data.

set -e

COMMUNITY_DATA_DIR="${COMMUNITY_DATA_DIR:-/opt/neurahear/community-screening-data}"
BACKUP_DIR="${COMMUNITY_BACKUP_DIR:-/opt/neurahear/backups-community-screening}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="community-screening-data-${TIMESTAMP}.tar.gz"

mkdir -p "$BACKUP_DIR"

if [ ! -d "$COMMUNITY_DATA_DIR" ]; then
  echo "Community screening data directory does not exist: $COMMUNITY_DATA_DIR"
  exit 1
fi

tar -czf "${BACKUP_DIR}/${BACKUP_FILE}" \
  -C "$(dirname "$COMMUNITY_DATA_DIR")" \
  "$(basename "$COMMUNITY_DATA_DIR")"

find "$BACKUP_DIR" -name "community-screening-data-*.tar.gz" -mtime +30 -delete

echo "Community screening backup created: ${BACKUP_DIR}/${BACKUP_FILE}"
ls -lh "${BACKUP_DIR}/${BACKUP_FILE}"
