import { mkdir, copyFile, writeFile, stat } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=dirname(fileURLToPath(import.meta.url));
const files=['index.html','style-v2.css','explore.css','app.js','explore.js','assets/eye.svg','assets/ribbon.webp','assets/vendor/gsap.min.js',
 'assets/fonts/Anton.ttf','assets/fonts/Anton-OFL.txt','assets/fonts/Changa-Regular.ttf','assets/fonts/Changa-ExtraBold.ttf','assets/fonts/Changa-OFL.txt',
 ...['pyjama','clinic','asel','hk'].map(n=>`assets/projects/${n}.jpg`),
 ...['01-VISION-brand','02-VISION-commerce','03-VISION-systems'].flatMap(n=>['mp4','jpg','vtt'].map(ext=>`assets/videos/${n}.${ext}`))];
let bytes=0;
for(const file of files){
 const source=resolve(root,'public',file),target=resolve(root,'deploy',file);
 const info=await stat(source);if(info.size>25*1024*1024)throw Error(`Asset too large: ${file}`);
 await mkdir(dirname(target),{recursive:true});await copyFile(source,target);bytes+=info.size;
}
await writeFile(resolve(root,'deployment-manifest.json'),JSON.stringify({files,bytes},null,2)+'\n');
console.log(`Prepared ${files.length} public files (${bytes} bytes).`);
