/* Local, read-only browser audit of authored VISION GSAP compositions. */
const fs = require('fs');
const path = require('path');
const {pathToFileURL} = require('url');
const puppeteer = require('C:/Users/Computs/AppData/Local/npm-cache/_npx/87945b1594dfe2fd/node_modules/puppeteer-core');
const videoRoot = path.resolve(__dirname, '..');
const chrome = 'C:/Users/Computs/.cache/hyperframes/chrome/chrome-headless-shell/win64-131.0.6778.85/chrome-headless-shell-win64/chrome-headless-shell.exe';
const films = process.argv.slice(2).length ? process.argv.slice(2) : ['intro', 'commerce', 'systems'];
const forbidden = ['pyjama','asel','hk store','clinicflow','la city','massmakat','الأقصى','in3itaf','baridimob'];

(async()=>{
  const browser = await puppeteer.launch({executablePath:chrome,headless:true,args:['--allow-file-access-from-files','--disable-gpu','--disable-background-networking','--disable-dev-shm-usage']});
  const report = {schemaVersion:1, purpose:'Local GSAP motion and content audit; no cloud APIs.',films:[],flags:[]};
  try {
    const page = await browser.newPage();
    await page.setViewport({width:1920,height:1080,deviceScaleFactor:1});
    for(const film of films){
      const errors=[];
      const onError = e=>errors.push(String(e.message||e));
      page.on('pageerror',onError);
      await page.goto(pathToFileURL(path.join(videoRoot,film,'index.html')).href,{waitUntil:'load'});
      await page.waitForFunction(()=>!!window.VISION_MANIFEST && !!window.__timelines?.main,{timeout:15000});
      await page.evaluate(async()=>{await document.fonts.ready;return true;});
      const meta = await page.evaluate((privateTerms)=>{
        const tl=window.__timelines.main;
        const selectorOf=el=>{
          if(!(el instanceof Element))return '(non-DOM)';
          const prefix=el.closest('.scene')?.id;
          return (prefix?'#'+prefix+' ':'')+(el.id?'#'+el.id:el.tagName.toLowerCase()+[...el.classList].slice(0,3).map(x=>'.'+x).join(''));
        };
        const tweens=[];
        const walk=(node,offset=0)=>{
          if(typeof node.getChildren==='function'){
            const at=offset+(node===tl?0:node.startTime());
            node.getChildren(false,true,true).forEach(child=>walk(child,at));
          }else{
            const vars=node.vars||{};
            const targets=(node.targets?.()||[]).filter(x=>x instanceof Element);
            if(!targets.length)return;
            const start=offset+(node.startTime?.()||0);
            const duration=node.totalDuration?.()||0;
            tweens.push({selector:selectorOf(targets[0]),targets:targets.length,start:+start.toFixed(3),end:+(start+duration).toFixed(3),duration:+duration.toFixed(3),ease:typeof vars.ease==='string'?vars.ease:'function',properties:Object.keys(vars).filter(k=>!['duration','ease','delay','repeat','yoyo','onStart','onUpdate','onComplete','stagger','parent','overwrite','immediateRender','startAt','runBackwards'].includes(k)),entrance:!!vars.runBackwards,repeat:vars.repeat||0});
          }
        };
        walk(tl);tweens.sort((a,b)=>a.start-b.start);
        const allText=document.body.innerText.toLowerCase();
        const privateContentMatches=privateTerms.filter(term=>allText.includes(term));
        const sceneRanges=[...document.querySelectorAll('.scene')].map((el,i)=>{
          const tt=tweens.filter(x=>x.selector.startsWith('#'+el.id+' '));
          return {id:el.id,key:window.FILM.scenes[i].key,start:window.VISION_MANIFEST.starts[i],duration:window.VISION_MANIFEST.durations[i],tweenCount:tt.length,earliestTween:tt.length?Math.min(...tt.map(x=>x.start)):null,latestTween:tt.length?Math.max(...tt.map(x=>x.end)):null,eases:[...new Set(tt.map(x=>x.ease))],entranceCount:tt.filter(x=>x.entrance).length};
        });
        return {id:window.FILM.id,title:window.FILM.title,...window.VISION_MANIFEST,sceneCount:window.FILM.scenes.length,tweenCount:tweens.length,privateContentMatches,remoteMedia:[...document.querySelectorAll('img[src],video[src],audio[src]')].map(el=>el.getAttribute('src')).filter(x=>/^https?:/i.test(x)),sceneRanges,tweens};
      },forbidden);
      const requested=[{label:'opening-settled',time:.6}];
      meta.starts.forEach((start,i)=>{
        if(i){requested.push({label:`transition-${i}-before`,time:start-.6},{label:`transition-${i}-mid`,time:start-.275},{label:`transition-${i}-after`,time:start+.35});}
        requested.push({label:`scene-${i}-hero`,time:start+Math.min(meta.durations[i]-1.2,Math.max(meta.durations[i]*.8,3))});
      });
      requested.sort((a,b)=>a.time-b.time);
      const states=[];
      for(const sample of requested){
        const state=await page.evaluate(({time,label})=>{
          // Return a serializable object, never the GSAP timeline (a thenable).
          window.__timelines.main.pause();window.__timelines.main.seek(time,false);
          const effectiveOpacity=el=>{let value=1;for(let n=el;n instanceof Element;n=n.parentElement){const s=getComputedStyle(n);if(s.display==='none'||s.visibility==='hidden')return 0;value*=Number(s.opacity);}return value;};
          const coverage=el=>{
            const cp=getComputedStyle(el).clipPath;
            if(cp==='none')return 1;
            if(cp.startsWith('circle(')){const r=parseFloat(cp.slice(7));return r<=.01?0:Math.min(1,Math.PI*(r/100)*(r/100));}
            if(cp.startsWith('inset(')){const vals=cp.match(/[+-]?(?:\d*\.)?\d+(?:%|px)/g)||[];const x=vals.map(v=>parseFloat(v)/(v.endsWith('%')?100:1920));const a=x.length===1?[x[0],x[0],x[0],x[0]]:x.length===2?[x[0],x[1],x[0],x[1]]:x;return Math.max(0,1-(a[1]||0)-(a[3]||0))*Math.max(0,1-(a[0]||0)-(a[2]||0));}
            return 1;
          };
          const scenes=[...document.querySelectorAll('.scene')].map(el=>{
            const opacity=effectiveOpacity(el),clipCoverage=coverage(el);
            let textCount=0,graphicCount=0;const texts=[];
            if(opacity>.05&&clipCoverage>.001){
              [...el.querySelectorAll('.scene-content *')].forEach(n=>{
                if(effectiveOpacity(n)<.05)return;
                const ownText=[...n.childNodes].filter(x=>x.nodeType===Node.TEXT_NODE).map(x=>x.textContent).join('').trim();
                const graphic=n.tagName.toLowerCase()==='svg';
                if(!ownText&&!graphic)return;
                const r=n.getBoundingClientRect();
                if(r.width<1||r.height<1||r.right<0||r.bottom<0||r.left>1920||r.top>1080)return;
                const probes=[[r.left+r.width/2,r.top+r.height/2],[r.left+r.width*.2,r.top+r.height*.5],[r.left+r.width*.8,r.top+r.height*.5]];
                const exposed=probes.some(([x,y])=>{const hit=document.elementFromPoint(x,y);return hit&&(hit===n||n.contains(hit)||(hit.contains(n)&&hit.closest('.scene')===el));});
                if(!exposed)return;
                if(ownText){textCount++;if(texts.length<4)texts.push(ownText.slice(0,100));}if(graphic)graphicCount++;
              });
            }
            return {id:el.id,opacity:+opacity.toFixed(3),clipCoverage:+clipCoverage.toFixed(3),visibleTextCount:textCount,visibleGraphicCount:graphicCount,textPreview:texts};
          });
          const captions=[...document.querySelectorAll('.caption')].filter(x=>effectiveOpacity(x)>.05).map(x=>x.innerText);
          return {label,time:+time.toFixed(3),scenes,nonempty:scenes.some(x=>x.visibleTextCount+x.visibleGraphicCount>0),activeCaptions:captions.length,captionText:captions};
        },sample);
        states.push(state);
      }
      page.off('pageerror',onError);
      const flags=[];
      if(errors.length)flags.push({type:'page-errors',errors});
      if(meta.privateContentMatches.length)flags.push({type:'private-content',matches:meta.privateContentMatches});
      if(meta.remoteMedia.length)flags.push({type:'remote-media',sources:meta.remoteMedia});
      for(const s of states){if(!s.nonempty)flags.push({type:'empty-scene-sample',at:s.time,label:s.label});if(s.activeCaptions>1)flags.push({type:'caption-overlap',at:s.time,label:s.label,count:s.activeCaptions});}
      for(const s of meta.sceneRanges){if(s.entranceCount===0)flags.push({type:'missing-entrances',scene:s.id});if(s.eases.length<3)flags.push({type:'limited-easing-variety',scene:s.id,count:s.eases.length});}
      const item={...meta,pageErrors:errors,samples:states,flags};report.films.push(item);
      console.log(`${film}: ${meta.sceneCount} scenes; ${meta.duration.toFixed(3)}s; ${meta.tweenCount} tweens; ${states.length} samples; ${flags.length} flags.`);
    }
  }finally{await browser.close();}
  report.flags=report.films.flatMap(x=>x.flags.map(flag=>({film:x.id,...flag})));
  report.ok=report.flags.length===0;
  fs.writeFileSync(path.join(__dirname,'motion-audit.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({ok:report.ok,flags:report.flags,report:path.join(__dirname,'motion-audit.json')},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;});
