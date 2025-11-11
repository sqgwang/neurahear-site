#!/usr/bin/env bash
# === Neural Hearing Lab | one-command deploy ===
set -euo pipefail

# ---------- configurable ----------
SRC_DIR="/var/www/labsite"
PUB_DIR="/var/www/neurahear"
BRANCH="${BRANCH:-main}"
LOG_FILE="$HOME/update-neurahear.log"
BACKUP_DIR="$HOME/backups/neurahear_pub"
KEEP_BACKUPS=7
LOCK_FILE="/tmp/update-neurahear.lock"
# -----------------------------------

ts() { date +"%F %T"; }
log() { echo "[$(ts)] $*" | tee -a "$LOG_FILE"; }
die() { echo "[$(ts)] ERROR: $*" | tee -a "$LOG_FILE" >&2; exit 1; }
cleanup() { rm -f "$LOCK_FILE"; }
trap cleanup EXIT

[ -e "$LOCK_FILE" ] && die "Another deployment is running. Remove $LOCK_FILE if stuck."
touch "$LOCK_FILE"

[ -d "$SRC_DIR" ] || die "SRC_DIR not found: $SRC_DIR"
mkdir -p "$PUB_DIR" "$BACKUP_DIR"

log "=== Start deploy to $PUB_DIR from $SRC_DIR (branch: $BRANCH) ==="
cd "$SRC_DIR"

log "=== Start deploy to $PUB_DIR from $SRC_DIR (branch: $BRANCH) ==="
cd "$SRC_DIR"

# === Configure Git to work despite permission issues ===
log "Configuring Git to ignore file permissions..."
git config --global --add safe.directory "$SRC_DIR" || true
git config core.fileMode false || true
# Clean lock files only (no chown needed)
find "$SRC_DIR/.git" -name "*.lock" -type f -delete 2>/dev/null || true
log "Git configured"
# === End Git config ===

log "Git fetch/reset to origin/$BRANCH ..."
git fetch origin "$BRANCH" 2>&1 | tee -a "$LOG_FILE"
git reset --hard "origin/$BRANCH"

LATEST_COMMIT="$(git rev-parse --short HEAD)"
log "On commit: $LATEST_COMMIT"
git log -1 --pretty=oneline | tee -a "$LOG_FILE"

command -v node >/dev/null || die "Node is not installed"
log "Node: $(node -v)  npm: $(npm -v)"

log "npm install (clean)..."
# Clean install with all dependencies (needed for TypeScript and build)
rm -rf node_modules package-lock.json || true
npm install 2>&1 | tee -a "$LOG_FILE"

log "npm run build ..."
npm run build

[ -d "$SRC_DIR/out" ] || die "Build OK but 'out/' not found."

STAMP="$(date +%F-%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/neurahear-pub-$STAMP.tar.gz"
log "Backup current publish dir to: $BACKUP_FILE"
tar -czf "$BACKUP_FILE" -C "$PUB_DIR" . || log "Publish dir empty, skip backup."

log "rsync to $PUB_DIR ..."
rsync -a --delete "$SRC_DIR/out/" "$PUB_DIR/"

chmod -R a+rX "$PUB_DIR"

log "Reload nginx ..."
sudo systemctl reload nginx

# Restart DIN backend if exists (with error handling)
if [ -f "$SRC_DIR/server/din-backend/server.js" ]; then
  log "Checking DIN backend..."
  
  # Only restart if PM2 process exists
  if pm2 id din-backend >/dev/null 2>&1; then
    log "Restarting DIN backend..."
    
    # Update backend dependencies if package.json changed
    cd "$SRC_DIR/server/din-backend"
    if [ -f package.json ]; then
      log "Updating backend dependencies..."
      chown -R root:root . || true
      rm -rf node_modules package-lock.json || true
      npm install --production 2>&1 | tee -a "$LOG_FILE" || log "Warning: npm install failed, but continuing..."
    fi
    
    # Restart PM2 process
    pm2 restart din-backend 2>&1 | tee -a "$LOG_FILE" || log "Warning: PM2 restart failed"
    pm2 save || log "Warning: PM2 save failed"
  else
    log "DIN backend not running in PM2, skipping restart"
  fi
else
  log "DIN backend not found, skipping"
fi

log "Rotate backups, keep last $KEEP_BACKUPS ..."
ls -1t "$BACKUP_DIR"/*.tar.gz 2>/dev/null | awk "NR>$KEEP_BACKUPS" | xargs -r rm -f

log "=== Deploy done at $(ts) | commit $LATEST_COMMIT ==="
