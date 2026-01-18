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

// Copy telegram.html to dist directory
const telegramHtmlSrc = join(__dirname, 'frontend', 'telegram.html');
const telegramHtmlDest = join(__dirname, 'frontend', 'dist', 'telegram.html');
copyFileSync(telegramHtmlSrc, telegramHtmlDest);

// Also copy the main index.html content to telegram.html but keep the telegram-specific parts
const indexPath = join(__dirname, 'frontend', 'dist', 'index.html');
const indexContent = readFileSync(indexPath, 'utf8');

// Read the telegram template
const telegramTemplate = readFileSync(telegramHtmlSrc, 'utf8');

// Extract the telegram-specific parts
const tgScriptMatch = telegramTemplate.match(/<script src="https:\/\/telegram\.org\/js\/telegram-web-app\.js"><\/script>/);
const tgStyleMatch = telegramTemplate.match(/<style>[\s\S]*?<\/style>/);

if (tgScriptMatch && tgStyleMatch) {
  // Replace the head section with telegram-specific parts
  const headStart = indexContent.indexOf('<head>');
  const headEnd = indexContent.indexOf('</head>') + 7;
  const headContent = indexContent.substring(headStart, headEnd);

  // Replace the head with telegram version
  let updatedIndexContent = indexContent.replace(headContent,
    `<head>${tgStyleMatch[0]}
    ${tgScriptMatch[0]}</head>`
  );

  // Write the updated content to telegram.html
  writeFileSync(telegramHtmlDest, updatedIndexContent);
}

console.log('Build completed successfully!');