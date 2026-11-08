(function(){
const film=window.FILM,root=document.querySelector('#root'),timing=window.FILM_TIMING||{};
const durations=film.scenes.map((s,i)=>Math.max(s.duration,((timing.scenes||[])[i]?.duration||0)+2.2));
let cursor=0;const starts=durations.map(d=>{const s=cursor;cursor+=d;return s;});
const total=cursor;root.dataset.duration=total.toFixed(3);
// All visible markup and styles are emitted statically by build.cjs so the
// HyperFrames compiler can retain them in its layer tree.
window.__timelines=window.__timelines||{};const tl=gsap.timeline({paused:true});
tl.from('.header .brand-lockup',{opacity:0,x:-18,duration:.65,ease:'power3.out'},.15);
tl.from('.film-label',{opacity:0,x:22,duration:.55,ease:'sine.out'},.3);
tl.from('.footer',{opacity:0,duration:.6,ease:'power1.out'},.4);
tl.from('.progress-fill',{scaleX:0,duration:total,ease:'none'},0);
film.scenes.forEach((s,i)=>{
 const start=starts[i],dur=durations[i],el=document.getElementById('scene-'+i),sel=q=>el.querySelectorAll(q);
 if(i){
   const T=start-.55;
   tl.set(el,{opacity:1},T);
   if(i===2||i===film.scenes.length-1)tl.fromTo(el,{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(80% at 50% 50%)',duration:.7,ease:'power3.inOut',immediateRender:false,overwrite:'auto'},T);
   else tl.fromTo(el,{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:.55,ease:'power3.inOut',immediateRender:false,overwrite:'auto'},T);
   tl.set(`#scene-${i-1}`,{opacity:0},start+.16);
 }
 s.animate(tl,sel,start,dur);
 const a=(timing.scenes||[])[i];if(a){
  // Audio is mixed offline and muxed after the deterministic visual render.
  const words=a.text.split(/\s+/);const chunks=[];for(let j=0;j<words.length;j+=9)chunks.push(words.slice(j,j+9).join(' '));
  let wordBase=0;chunks.forEach((chunk,j)=>{const count=chunk.split(/\s+/).length;const t=start+.75+a.duration*(wordBase/words.length);const end=start+.75+a.duration*((wordBase+count)/words.length);wordBase+=count;const c=document.getElementById('caption-'+i+'-'+j);tl.to(c,{opacity:1,duration:.12,ease:'none'},t);tl.to(c,{opacity:0,duration:.10,ease:'none'},Math.max(t+.15,end-.1));tl.set(c,{opacity:0},end);});
 }
});
window.__timelines.main=tl;window.VISION_MANIFEST={id:film.id,duration:total,starts,durations};
window.seekVision=t=>{tl.seek(t,false);return window.VISION_MANIFEST;};
})();
