const fs=require('node:fs/promises');
const path=require('node:path');
const sharp=require('C:/Users/Computs/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const out=path.resolve(__dirname,'VISION-Brand-Kit');
const eye='<path fill="#080e17" d="M4 57L65 13Q100 -9 135 13L196 57H162L119 31Q100 20 81 31L38 57ZM4 70H38L81 96Q100 107 119 96L162 70H196L135 114Q100 136 65 114Z"/><circle cx="100" cy="63" r="21" fill="#00bceb"/>';
// Outlined geometric lettering: portable SVGs with no font dependencies.
const word='<g fill="#080e17"><path d="M0 0H25L53 69L81 0H106L64 96H42Z"/><path d="M119 0H141V96H119Z"/><path d="M229 0H187C166 0 154 12 154 29S166 57 187 57H201C210 57 214 60 214 66S210 76 201 76H155V96H203C224 96 237 84 237 66S224 38 204 38H190C181 38 177 35 177 29S181 20 190 20H229Z"/><path d="M250 0H272V96H250Z"/><path fill-rule="evenodd" d="M337 -3C308 -3 286 19 286 48S308 99 337 99S388 77 388 48S366 -3 337 -3ZM337 19C354 19 366 31 366 48S354 77 337 77S308 65 308 48S320 19 337 19Z"/><path d="M402 96V0H423L470 59V0H492V96H472L424 37V96Z"/></g>';
const svg=(w,h,body)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="VISION">${body}</svg>`;
(async()=>{
 await fs.mkdir(out,{recursive:true});
 const files={
 'VISION-logo.svg':svg(770,200,`<g transform="translate(20 37)">${eye}</g><g transform="translate(248 52)">${word}</g>`),
 'VISION-symbol.svg':svg(240,160,`<g transform="translate(20 17)">${eye}</g>`),
 'VISION-instagram-white.svg':svg(1080,1080,`<rect width="1080" height="1080" fill="white"/><g transform="translate(210 332.1) scale(3.3)">${eye}</g>`),
 'VISION-instagram-blue.svg':svg(1080,1080,`<rect width="1080" height="1080" fill="#dceeff"/><g transform="translate(210 332.1) scale(3.3)">${eye}</g>`)
 };
 for(const [name,source] of Object.entries(files)){
  await fs.writeFile(path.join(out,name),source);
  await sharp(Buffer.from(source)).resize(name.includes('instagram')?1080:name.includes('symbol')?1440:2310).png().toFile(path.join(out,name.replace('.svg','.png')));
 }
 await fs.writeFile(path.join(out,'README.txt'),'VISION BRAND KIT\n\nInstagram: upload VISION-instagram-white.png (1080 x 1080). Blue alternative included. Eye centered with room for the circular profile crop.\n\nVISION-logo.svg: full horizontal logo, transparent background.\nVISION-symbol.svg: eye symbol only, transparent background.\nAll SVGs are editable vector paths; no external fonts or embedded bitmaps.\n\nColors: ink #080e17, cyan #00bceb, light blue #dceeff.\nVector reconstruction based on the approved concept and current website eye, not a new identity. The original generated concept remains in the parent folder.\n');
 console.log(out);
})();
