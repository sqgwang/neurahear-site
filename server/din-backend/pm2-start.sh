#!/usr/bin/env bash
# Example pm2 start script
cd "$(dirname "$0")"
pm install --production
pm install -g pm2 || true
pm run start &
# or: pm2 start ecosystem.config.js
