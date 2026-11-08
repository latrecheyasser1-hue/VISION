// Local deterministic fallback capture for HyperFrames compositions.
// Uses the same paused GSAP timeline as inspected snapshots; no remote services.
const fs=require('fs'),path=require('path'),{spawn,spawnSync}=require('child_process'),{pathToFileURL}=require('url');
const puppeteer=require('C:/Users/Computs/AppData/Local/npm-cache/_npx/87945b1594dfe2fd/node_modules/puppeteer-core');
const ROOT=__dirname;const CHROME='C:/Users/Computs/.cache/hyperframes/chrome/chrome-headless-shell/win64-131.0.6778.85/chrome-headless-shell-win64/chrome-headless-shell.exe';
const films={intro:'01-vision-introduction',commerce:'02-vision-ecommerce',systems:'03-vision-management'};
async function render(id,limit){
 const schedule=JSON.parse(fs.readFileSync(path.join(ROOT,id,'schedule.json'),'utf8'));
 const duration=limit||schedule.duration,total=Math.ceil(duration*30),stem=films[id];
 const output=path.join(ROOT,limit?'qa':'renders',stem+(limit?'-capture-test':'-silent')+'.mp4');
 console.log('Launching '+id);
 const browser=await puppeteer.launch({executablePath:CHROME,headless:true,timeout:30000,protocolTimeout:30000,args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-timer-throttling','--font-render-hinting=none','--allow-file-access-from-files']});
 console.log('Browser ready');
 try{
  const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
  const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(pathToFileURL(path.join(ROOT,id,'index.html')).href,{waitUntil:'load',timeout:30000});console.log('Page loaded');await page.evaluate(()=>document.fonts.ready);console.log('Fonts ready');await page.waitForFunction(()=>window.__timelines?.main&&window.VISION_MANIFEST);console.log('Timeline ready');
  if(errors.length)throw new Error(errors.join('\n'));
  const enc=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',output],{windowsHide:true,stdio:['pipe','ignore','pipe']});
  let errorText='';enc.stderr.on('data',x=>errorText+=x);let encErr;enc.on('error',e=>encErr=e);
  for(let i=0;i<total;i++){
   await page.evaluate(t=>{window.__timelines.main.seek(t,false);},i/30);
   const jpg=await page.screenshot({type:'jpeg',quality:96,optimizeForSpeed:true});
   await new Promise((resolve,reject)=>enc.stdin.write(jpg,e=>e?reject(e):resolve()));
   if(i%150===0||i===total-1)console.log(JSON.stringify({film:id,frame:i+1,total,percent:Math.round(100*(i+1)/total)}));
  }
  enc.stdin.end();await new Promise((resolve,reject)=>enc.on('close',code=>code===0?resolve():reject(new Error(errorText||String(encErr)))));
  if(errors.length)throw new Error(errors.join('\n'));
  console.log('Completed: '+output);
  if(!limit){const final=spawnSync('python',[path.join(ROOT,'finalize.py'),id],{windowsHide:true,stdio:'inherit'});if(final.status!==0)throw new Error('Finalization failed: '+id);}
 }finally{await browser.close()}
}
(async()=>{const id=process.argv[2]||'all',limit=Number(process.argv[3])||0;for(const item of id==='all'?Object.keys(films):[id])await render(item,limit);})().catch(e=>{console.error(e);process.exit(1)});
