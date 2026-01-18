#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = __dirname;

console.log('==> Installing backend dependencies...');
execSync('npm install', { cwd: path.join(root, 'backend'), stdio: 'inherit' });

console.log('==> Installing frontend dependencies...');
execSync('npm install', { cwd: path.join(root, 'frontend'), stdio: 'inherit' });

console.log('==> Building frontend...');
execSync('npm run build', { cwd: path.join(root, 'frontend'), stdio: 'inherit' });

console.log('==> Starting server...');
execSync('node src/server.js', { cwd: path.join(root, 'backend'), stdio: 'inherit' });
