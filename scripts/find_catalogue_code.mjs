import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== 'dist' && entry.name !== '.next') {
        searchDir(fullPath);
      }
    } else if (entry.isFile()) {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.js') || fullPath.endsWith('.mjs') || fullPath.endsWith('.tsx') || fullPath.endsWith('.jsx') || fullPath.endsWith('.html') || fullPath.endsWith('.json')) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('كتالوج') || content.includes('catalogue')) {
          console.log(`Found in: ${fullPath}`);
        }
      }
    }
  }
}

searchDir('.');
