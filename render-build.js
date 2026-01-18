#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');

console.log('==> Installing backend dependencies...');
execSync('npm install', { cwd: path.join(__dirname, 'backend'), stdio: 'inherit' });

console.log('==> Installing frontend dependencies...');
execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('==> Building frontend...');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('==> Build complete!');
