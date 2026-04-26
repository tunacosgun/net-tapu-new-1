#!/bin/bash
# Deploy script for two-domain setup
# Run on VPS: bash deploy-new-design.sh

set -e

echo "=== Step 1: Pull latest from GitHub ==="
cd /opt/nettapu
git pull origin main

echo "=== Step 2: Check nettapu-new repo ==="
if [ ! -d "/opt/nettapu-new" ]; then
  echo "ERROR: /opt/nettapu-new not found!"
  echo "Please ensure new design files are at /opt/nettapu-new/"
  exit 1
fi
echo "Found /opt/nettapu-new: $(ls /opt/nettapu-new | head -5)"

echo "=== Step 3: Build web-new container ==="
cd /opt/nettapu
docker compose build web-new 2>&1

echo "=== Step 4: Start web-new container ==="
docker compose up -d web-new

echo "=== Step 5: Restart nginx ==="
docker compose restart nginx

echo "=== Step 6: Check status ==="
docker compose ps

echo ""
echo "✅ Done! Check:"
echo "  - https://nettapu-demo.tunasoft.tech  (old design)"
echo "  - https://nettapu.tunasoft.tech        (new design)"
