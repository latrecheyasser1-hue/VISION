// Faster VISION v2: piecewise retiming of the approved authored scenes.
const fs=require('fs'),path=require('path'),{spawn,spawnSync}=require('child_process'),{pathToFileURL}=require('url');
const puppet=require('C:/Users/Computs/AppData/Local/npm-cache/_npx/87945b1594dfe2fd/node_modules/puppeteer-core');
const ROOT=path.dirname(__dirname),HERE=__dirname,CHROME='C:/Users/Computs/.cache/hyperframes/chrome/chrome-headless-shell/win64-131.0.6778.85/chrome-headless-shell-win64/chrome-headless-shell.exe';
const names={intro:'01-vision-introduction-fast',commerce:'02-vision-ecommerce-fast',systems:'03-vision-management-fast'};
async function render(id,preview){
 const audioId=id==='commerce'?'ecommerce':id,manifest=JSON.parse(fs.readFileSync(path.join(HERE,'audio/manifest.json'),'utf8'));
 const old=JSON.parse(fs.readFileSync(path.join(ROOT,id,'schedule.json'),'utf8'));
 const records=(manifest.videos||manifest)[audioId];let cursor=0;const schedule=records.map((r,i)=>{const duration=Math.ceil((r.duration+.55)*30)/30;const x={start:cursor,duration,sourceStart:old.scenes[i].start,sourceDuration:old.scenes[i].duration,text:r.text};cursor+=duration;return x;});
 const duration=preview?schedule.slice(0,2).reduce((sum,s)=>sum+s.duration,0):cursor,total=Math.ceil(duration*30);
 fs.mkdirSync(path.join(HERE,'renders'),{recursive:true});fs.writeFileSync(path.join(HERE,id+'-schedule.json'),JSON.stringify({id,duration:cursor,scenes:schedule},null,2));
 if(process.argv.includes('--schedule-only')){console.log(JSON.stringify({id,duration:cursor}));return;}
 const stem=preview?'preview-fast':names[id],out=path.join(HERE,'renders',stem+'-silent.mp4');
 const browser=await puppet.launch({executablePath:CHROME,headless:true,timeout:30000,protocolTimeout:30000,args:['--no-sandbox','--disable-dev-shm-usage','--disable-background-timer-throttling','--font-render-hinting=none','--allow-file-access-from-files']});
 try{const page=await browser.newPage();await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));await page.goto(pathToFileURL(path.join(ROOT,id,'index.html')).href,{waitUntil:'load'});await page.evaluate(()=>document.fonts.ready);
 await page.addStyleTag({content:'.caption-layer{display:none!important}#fast-caption{position:absolute;left:250px;right:250px;bottom:88px;z-index:200;text-align:center;direction:rtl;font:32px/1.5 Dubai,sans-serif;color:#080e17;pointer-events:none}#fast-caption span{background:#fff;padding:7px 24px;border-radius:9px;box-shadow:0 0 0 1px #e8f0f3}'});
 await page.evaluate(()=>{const c=document.createElement('div');c.id='fast-caption';document.querySelector('#root').append(c)});
 const enc=spawn('ffmpeg',['-y','-hide_banner','-loglevel','error','-f','image2pipe','-vcodec','mjpeg','-framerate','30','-i','pipe:0','-an','-c:v','libx264','-preset','fast','-crf','17','-pix_fmt','yuv420p','-movflags','+faststart',out],{windowsHide:true,stdio:['pipe','ignore','pipe']});let err='';enc.stderr.on('data',x=>err+=x);
 for(let f=0;f<total;f++){const t=f/30;let ix=schedule.findIndex(s=>t>=s.start&&t<s.start+s.duration);if(ix<0)ix=schedule.length-1;const s=schedule[ix],local=t-s.start,source=s.sourceStart+local/s.duration*s.sourceDuration;
 const r=records[ix],voiceTime=local-.2,words=r.text.split(/\s+/);let caption='';if(voiceTime>=0&&voiceTime<r.duration){const word=Math.floor(voiceTime/r.duration*words.length),group=Math.floor(word/6);caption=words.slice(group*6,group*6+6).join(' ')}
 await page.evaluate(({source,caption,t,duration})=>{window.__timelines.main.seek(source,false);document.getElementById('fast-caption').innerHTML=caption?'<span>'+caption+'</span>':'';document.querySelector('.progress-fill').style.transform='scaleX('+(t/duration)+')';},{source,caption,t,duration});
 const jpg=await page.screenshot({type:'jpeg',quality:96,optimizeForSpeed:true});await new Promise((resolve,reject)=>enc.stdin.write(jpg,e=>e?reject(e):resolve()));if(f%150===0||f===total-1)console.log(JSON.stringify({film:id,frame:f+1,total,percent:Math.round(100*(f+1)/total)}));}
 enc.stdin.end();await new Promise((resolve,reject)=>enc.on('close',c=>c===0?resolve():reject(new Error(err))));if(errors.length)throw new Error(errors.join('\n'));console.log('Silent complete: '+out);
 }finally{await browser.close()}
}
(async()=>{const id=process.argv[2]||'intro',preview=process.argv.includes('--preview');for(const f of id==='all'?Object.keys(names):[id])await render(f,preview)})().catch(e=>{console.error(e);process.exit(1)});
