#!/bin/sh
set -e

cleanup() {
  echo "[docker-entrypoint] Shutting down services..."
  kill "$API_PID" "$WEB_PID" 2>/dev/null || true
}

trap cleanup INT TERM

echo "[docker-entrypoint] Starting API on port ${API_PORT:-3000}"
npm run api:dev &
API_PID=$!

echo "[docker-entrypoint] Serving web client on port ${FRONTEND_PORT:-4173}"
npm run preview --workspace apps/web-client -- --host 0.0.0.0 --port "${FRONTEND_PORT:-4173}" &
WEB_PID=$!

wait -n "$API_PID" "$WEB_PID"

