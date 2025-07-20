#!/bin/bash

echo "🔧 Building frontend..."
cd frontend
npm install
npm run build

echo "📁 Copying frontend build to backend..."
rm -rf ../backend/static
mkdir -p ../backend/static
cp -r dist/* ../backend/static/

echo "✅ Done!"
