#!/bin/bash
# Double-click this file in Finder to start K53 Academy.
# It installs dependencies (first run only), starts the dev server,
# and opens the app in your browser.

cd "$(dirname "$0")" || exit 1

echo "🏁  K53 Academy — Master the Road"
echo "─────────────────────────────────"

# Install dependencies the first time.
if [ ! -d "node_modules" ]; then
  echo "📦  First run — installing dependencies (this takes a minute)…"
  npm install || { echo "❌  npm install failed. Is Node.js installed?"; read -r; exit 1; }
fi

# Open the browser a few seconds after the server boots.
( sleep 4; open "http://localhost:5300" ) &

echo "🚀  Starting server at http://localhost:5300"
echo "    (Keep this window open. Press Ctrl+C to stop.)"
echo ""
npm run dev
