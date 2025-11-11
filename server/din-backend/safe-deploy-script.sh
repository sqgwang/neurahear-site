#!/bin/bash
# Safe deployment script for neurahear-site
# This script updates code WITHOUT deleting untracked files
# Place this at: /usr/local/bin/update-neurahear.sh

set -e

echo "🚀 Starting safe deployment for NeuraHear..."

# Configuration
PROJECT_DIR="/var/www/labsite"
BRANCH="${BRANCH:-main}"
BACKEND_DIR="$PROJECT_DIR/server/din-backend"

# Navigate to project
cd "$PROJECT_DIR" || exit 1

echo "📂 Working directory: $(pwd)"
echo "🌿 Branch: $BRANCH"

# Fetch latest changes
echo "📥 Fetching latest changes..."
git fetch origin "$BRANCH"

# Check if there are changes
LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" = "$REMOTE" ]; then
    echo "✅ Already up to date!"
    exit 0
fi

echo "🔄 Updating code..."

# SAFE UPDATE: Only pull tracked files
# DO NOT use: git reset --hard (deletes untracked files!)
# DO NOT use: git clean -fd (deletes untracked files!)
git pull origin "$BRANCH"

# Install/update frontend dependencies if package.json changed
if git diff --name-only "$LOCAL" "$REMOTE" | grep -q "package.json\|package-lock.json"; then
    echo "📦 Updating frontend dependencies..."
    npm install --production
fi

# Install/update backend dependencies
cd "$BACKEND_DIR" || exit 1
if git diff --name-only "$LOCAL" "$REMOTE" | grep -q "server/din-backend/package.json\|server/din-backend/package-lock.json"; then
    echo "📦 Updating backend dependencies..."
    npm install --production
fi

# Restart backend service
echo "🔄 Restarting backend service..."
pm2 restart din-backend

# Wait for service to start
sleep 2

# Check service status
echo "✅ Deployment complete!"
pm2 status din-backend

# Show recent logs
echo ""
echo "📋 Recent logs:"
pm2 logs din-backend --lines 10 --nostream

echo ""
echo "✅ Deployment successful!"
echo "🔍 Data directory: Check with: pm2 logs din-backend | grep DATA_DIR"
