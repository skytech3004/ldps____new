#!/usr/bin/env bash
set -euo pipefail

APP_NAME="${APP_NAME:-lps-vidyawadi}"
PORT="${PORT:-3003}"
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

echo "==> Deleting PM2 app (if running)"
pm2 delete "${APP_NAME}" || true

echo "==> Starting PM2 app"
PORT="${PORT}" pm2 start npm --name "${APP_NAME}" -- start

echo "==> Save PM2 state and set startup"
pm2 save
pm2 startup

echo "==> PM2 status"
pm2 status

echo "==> Deploy completed successfully."
