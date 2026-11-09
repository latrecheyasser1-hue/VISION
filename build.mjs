import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

console.log('--- VISION BUILD START ---');

// 1. Compile TypeScript
console.log('1. Compiling TypeScript to dist/...');
execSync('npx tsc', { stdio: 'inherit' });

// 2. Sync website/public to root public/ for Vercel static CDN
console.log('2. Syncing website/public to root public/ ...');
const sourceDir = resolve('website', 'public');
const targetDir = resolve('public');

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true });
}

cpSync(sourceDir, targetDir, { recursive: true });
console.log('--- VISION BUILD FINISHED SUCCESSFULLY ---');
