#!/bin/bash
set -e

echo "Installing dependencies..."
npm install --prefix backend
npm install --prefix frontend

echo "Building frontend..."
npm run build --prefix frontend

echo "Build complete!"
