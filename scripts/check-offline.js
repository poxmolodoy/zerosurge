#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.log('[check:offline] dist/ directory not found. Running "npm run build"...');
  execSync('npm run build', { stdio: 'inherit', cwd: path.resolve(__dirname, '..') });
}

// Allowlist of legitimate static namespaces and peer-reviewed clinical literature links
const ALLOWED_URL_PREFIXES = [
  // XML Namespaces (embedded in React DOM / SVG specs)
  'http://www.w3.org/2000/svg',
  'http://www.w3.org/1999/xlink',
  'http://www.w3.org/XML/1998/namespace',
  'http://www.w3.org/1999/xhtml',
  'http://www.w3.org/1998/Math/MathML',

  // React engine minified error decoder URL
  'https://reactjs.org/docs/error-decoder.html',

  // Google Workbox offline service worker internal docs warning URL
  'https://bit.ly/wb-precache',

  // Verified clinical & scientific evidence URLs (opened in external browser upon user click)
  'https://doi.org/',
  'https://pubmed.ncbi.nlm.nih.gov/',
  'https://www.ncbi.nlm.nih.gov/',
  'https://www.who.int/',
];

function isUrlAllowed(url) {
  return ALLOWED_URL_PREFIXES.some((allowed) => url.startsWith(allowed));
}

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Regex to extract URLs
  const urlRegex = /https?:\/\/[^\s"'`<>{}()[\]\\^]+/g;
  const matches = content.match(urlRegex) || [];

  const violations = [];
  for (const url of matches) {
    // Clean trailing punctuation
    const cleanUrl = url.replace(/[,;.]+$/, '');
    if (!isUrlAllowed(cleanUrl)) {
      violations.push(cleanUrl);
    }
  }

  return violations;
}

function traverseDirectory(dir) {
  let allViolations = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      allViolations = allViolations.concat(traverseDirectory(fullPath));
    } else if (entry.isFile() && /\.(html|js|css|json|svg)$/i.test(entry.name)) {
      const violations = scanFile(fullPath);
      if (violations.length > 0) {
        allViolations.push({
          file: path.relative(distDir, fullPath),
          violations,
        });
      }
    }
  }

  return allViolations;
}

console.log('[check:offline] Auditing dist/ for unauthorized external requests...');
const violations = traverseDirectory(distDir);

if (violations.length > 0) {
  console.error('\n[check:offline] FAIL: Unauthorized external URLs discovered in dist/:');
  for (const item of violations) {
    console.error(`  In file: ${item.file}`);
    for (const v of item.violations) {
      console.error(`    - ${v}`);
    }
  }
  process.exit(1);
} else {
  console.log('[check:offline] PASS: 0 unauthorized external requests found.');
  console.log('[check:offline] All fonts, styles, scripts, and assets are strictly local-only.');
  process.exit(0);
}
