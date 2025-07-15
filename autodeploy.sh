#!/bin/bash
set -e

echo "[Autodeploy] Pulling latest code..."
git pull

echo "[Autodeploy] Installing dependencies..."
npm install

echo "[Autodeploy] Building app..."
npm run build

echo "[Autodeploy] Restarting service..."
sudo systemctl restart goals-app.service

echo "[Autodeploy] Done!" 