const { execSync } = require('child_process');
const { copyFileSync, mkdirSync } = require('fs');
const { join } = require('path');

// Ensure dist directory exists
const distDir = join(__dirname, 'frontend', 'dist');
mkdirSync(distDir, { recursive: true });

// Run the build command
execSync('cd frontend && npm run build', { stdio: 'inherit' });

// Copy telegram.html to dist directory
const telegramHtmlSrc = join(__dirname, 'frontend', 'telegram.html');
const telegramHtmlDest = join(__dirname, 'frontend', 'dist', 'telegram.html');
copyFileSync(telegramHtmlSrc, telegramHtmlDest);

console.log('Build completed successfully!');