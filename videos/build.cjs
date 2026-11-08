const fs=require('fs'),path=require('path'),vm=require('vm');const base=__dirname;
const audio=JSON.parse(fs.readFileSync(path.join(base,'audio/manifest.json'),'utf8'));
const files={intro:'intro',commerce:'ecommerce',systems:'systems'},schedule={};
for(const [id,audioId] of Object.entries(files)){
 const dir=path.join(base,id);if(!fs.existsSync(path.join(dir,'scenes.js')))continue;
 const v=fs.readFileSync(path.join(base,'shared/visuals.js'),'utf8'), scenes=fs.readFileSync(path.join(dir,'scenes.js'),'utf8');
 const context={window:{}};vm.createContext(context);vm.runInContext(v.replace('window.V={};','window.V={};var V=window.V;')+scenes,context);const film=context.window.FILM;
 const aa=audio.videos[audioId];const timing={scenes:aa.map(a=>({src:'../'+a.path,duration:a.duration,text:a.text}))};
 let cursor=0;schedule[audioId]=film.scenes.map((s,i)=>{const duration=Math.max(s.duration,aa[i].duration+2.2);const x={start:Number(cursor.toFixed(3)),duration:Number(duration.toFixed(3))};cursor+=duration;return x;});
 fs.mkdirSync(path.join(dir,'assets'),{recursive:true});for(const name of ['Dubai-Regular.ttf','Dubai-Bold.ttf','Consolas.ttf','gsap.min.js'])fs.copyFileSync(path.join(base,'shared',name),path.join(dir,'assets',name));
 let css=fs.readFileSync(path.join(base,'shared/base.css'),'utf8');for(const name of ['Dubai-Regular.ttf','Dubai-Bold.ttf','Consolas.ttf'])css=css.replaceAll("url('"+name+"')","url('data:font/ttf;base64,"+fs.readFileSync(path.join(base,'shared',name)).toString('base64')+"')");
 const gsap=fs.readFileSync(path.join(base,'shared/gsap.min.js'),'utf8');const engine=fs.readFileSync(path.join(base,'shared/engine.js'),'utf8');
 const captionHTML=aa.map((a,i)=>{const words=a.text.split(/\s+/),chunks=[];for(let j=0;j<words.length;j+=9)chunks.push(words.slice(j,j+9).join(' '));return chunks.map((txt,j)=>`<div id="caption-${i}-${j}" class="caption"><span>${txt}</span></div>`).join('');}).join('');
 const markup=film.scenes.map((s,i)=>`<section id="scene-${i}" class="scene" style="z-index:${i+1};${i?'opacity:0;':''}"><div class="scene-content">${s.html}</div></section>`).join('')+`<div class="header">${context.window.V.logo()}<div class="film-label">${film.title}</div></div><div class="caption-layer" id="captions">${captionHTML}</div><div class="footer"><span>مشاهد توضيحية • بيانات تجريبية</span><span class="mono">VISION / ${film.id.toUpperCase()}</span></div><div class="progress-track"><div class="progress-fill"></div></div>`;
 const html=`<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=1920,height=1080"><title>VISION — ${film.title}</title><style>${css}\n${film.css||''}</style><script src="data:application/javascript;base64,${Buffer.from(gsap).toString('base64')}"></script></head><body><div id="root" data-composition-id="main" data-start="0" data-duration="${cursor.toFixed(3)}" data-width="1920" data-height="1080">${markup}</div><script>${v}\nwindow.FILM_TIMING=${JSON.stringify(timing)};\n${scenes}\n${engine}</script></body></html>`;
 fs.writeFileSync(path.join(dir,'index.html'),html);fs.writeFileSync(path.join(dir,'schedule.json'),JSON.stringify({id,title:film.title,duration:cursor,scenes:schedule[audioId]},null,2));
 const config={name:`VISION ${id}`,version:'1.0.0',private:true,scripts:{dev:'hyperframes preview',check:'hyperframes lint && hyperframes inspect',render:'hyperframes render --fps 30 --quality high --workers 1'}};
 fs.writeFileSync(path.join(dir,'package.json'),JSON.stringify(config,null,2));console.log(`${id}: ${cursor.toFixed(3)} seconds`);
}
fs.writeFileSync(path.join(base,'audio/schedule.json'),JSON.stringify(schedule,null,2));
