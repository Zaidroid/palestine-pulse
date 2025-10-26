#!/bin/bash

echo "🧹 Clearing Vite cache..."
rm -rf .vite node_modules/.vite

echo "🧹 Clearing browser cache instructions:"
echo "1. Open DevTools (F12 or Cmd+Option+I)"
echo "2. Right-click the refresh button"
echo "3. Select 'Empty Cache and Hard Reload'"
echo ""
echo "Or press: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)"
echo ""
echo "✅ Vite cache cleared!"
echo "Now restart your dev server with: npm run dev"
