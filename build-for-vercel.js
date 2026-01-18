const { execSync } = require('child_process');
const { copyFileSync, mkdirSync, readFileSync, writeFileSync } = require('fs');
const { join } = require('path');

// Ensure dist directory exists
const distDir = join(__dirname, 'frontend', 'dist');
mkdirSync(distDir, { recursive: true });

// Install dependencies in frontend directory (including devDependencies)
execSync('cd frontend && npm install', { stdio: 'inherit' });

// Run the build command
execSync('cd frontend && npx vite build', { stdio: 'inherit' });

// Copy the original index.html to telegram.html
const indexPath = join(__dirname, 'frontend', 'dist', 'index.html');
const telegramHtmlDest = join(__dirname, 'frontend', 'dist', 'telegram.html');

// Read the built index.html
const indexContent = readFileSync(indexPath, 'utf8');

// Read the telegram template
const telegramTemplate = readFileSync(join(__dirname, 'frontend', 'telegram.html'), 'utf8');

// Extract the telegram-specific parts
const tgScriptMatch = telegramTemplate.match(/<script src="https:\/\/telegram\.org\/js\/telegram-web-app\.js"><\/script>/);
const tgMetaMatch = telegramTemplate.match(/<meta http-equiv="Content-Security-Policy"[^>]*>/);
const tgStyleMatch = telegramTemplate.match(/<style>[\s\S]*?<\/style>/);

if (tgScriptMatch && tgStyleMatch && tgMetaMatch) {
  // Replace the head section with telegram-specific parts
  const headStart = indexContent.indexOf('<head>');
  const headEnd = indexContent.indexOf('</head>') + 7;
  const headContent = indexContent.substring(headStart, headEnd);

  // Replace the head with telegram version
  let updatedIndexContent = indexContent.replace(headContent,
    `<head>
    ${tgMetaMatch[0]}
    ${tgStyleMatch[0]}
    ${tgScriptMatch[0]}</head>`
  );

  // Write the updated content to telegram.html
  writeFileSync(telegramHtmlDest, updatedIndexContent);
} else {
  // If extraction fails, just copy the template
  copyFileSync(join(__dirname, 'frontend', 'telegram.html'), telegramHtmlDest);
}

console.log('Build completed successfully!');