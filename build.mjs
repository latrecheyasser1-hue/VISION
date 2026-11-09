import { cpSync, mkdirSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { resolve } from 'node:path';

console.log('--- VISION BUILD START ---');

// 1. Compile TypeScript to dist/
console.log('1. Compiling TypeScript to dist/...');
execSync('npx tsc', { stdio: 'inherit' });

// 2. Sync website/public to root public/ for Vercel static CDN
console.log('2. Syncing website/public to root public/ and dist/public ...');
const sourceDir = resolve('website', 'public');
const targetRootPublic = resolve('public');
const targetDistPublic = resolve('dist', 'public');
const targetDistWebsitePublic = resolve('dist', 'website', 'public');

if (!existsSync(targetRootPublic)) {
  mkdirSync(targetRootPublic, { recursive: true });
}
cpSync(sourceDir, targetRootPublic, { recursive: true });

if (!existsSync(targetDistPublic)) {
  mkdirSync(targetDistPublic, { recursive: true });
}
cpSync(sourceDir, targetDistPublic, { recursive: true });

if (!existsSync(targetDistWebsitePublic)) {
  mkdirSync(targetDistWebsitePublic, { recursive: true });
}
cpSync(sourceDir, targetDistWebsitePublic, { recursive: true });

console.log('--- VISION BUILD FINISHED SUCCESSFULLY ---');
