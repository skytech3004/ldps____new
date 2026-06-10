#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-lps-local}"
PORT="${PORT:-3004}"
HOST="${HOST:-0.0.0.0}"

echo "==> Starting deploy in: $(pwd)"
echo "==> App: ${APP_NAME} | Host: ${HOST} | Port: ${PORT}"

echo "==> Stopping PM2 app (if running)"
pm2 stop "${APP_NAME}" || true

echo "==> git pull"
git pull

echo "==> npm i"
npm i

echo "==> Removing old Next.js cache (.next)"
rm -rf .next

echo "==> npm run build"
npm run build

echo "==> Restarting PM2 app"
if pm2 describe "${APP_NAME}" >/dev/null 2>&1; then
  pm2 restart "${APP_NAME}"
else
  pm2 start npm --name "${APP_NAME}" -- start -- -H "${HOST}" -p "${PORT}"
fi

echo "==> Reset PM2 counters and save"
pm2 reset "${APP_NAME}" || true
pm2 save

echo "==> PM2 status"
pm2 status

echo "==> Deploy completed successfully."
