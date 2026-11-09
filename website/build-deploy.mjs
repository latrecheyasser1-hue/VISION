import { mkdir, copyFile, writeFile, stat, readdir } from 'node:fs/promises';
import { resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(root, 'public');
const deployDir = resolve(root, 'deploy');

async function getFilesRecursively(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const res = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...await getFilesRecursively(res));
    } else {
      files.push(res);
    }
  }
  return files;
}

const allFilePaths = await getFilesRecursively(publicDir);
const files = allFilePaths.map(p => relative(publicDir, p).replace(/\\/g, '/'));

let bytes = 0;
for (const file of files) {
  const source = resolve(publicDir, file);
  const target = resolve(deployDir, file);
  const info = await stat(source);
  if (info.size > 25 * 1024 * 1024) throw Error(`Asset too large: ${file}`);
  await mkdir(dirname(target), { recursive: true });
  await copyFile(source, target);
  bytes += info.size;
}

await writeFile(resolve(root, 'deployment-manifest.json'), JSON.stringify({ files, bytes }, null, 2) + '\n');
console.log(`Prepared ${files.length} public and admin files (${bytes} bytes) in ${deployDir}`);
