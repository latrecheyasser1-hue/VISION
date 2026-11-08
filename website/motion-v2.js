// Scroll choreography: transforms only, requested on scroll rather than an idle render loop.
let motionContext,marquee,scrollTimelines=[],scrollFrame=0,measureFrame=0;
function measureScenes(){
 scrollTimelines.forEach(scene=>{
  const rect=scene.element.getBoundingClientRect(),top=rect.top+scrollY;
  if(scene.kind==='hero'){scene.start=0;scene.end=Math.max(1,rect.height*.8);}
  else if(scene.kind==='story'&&innerWidth>760){scene.start=top;scene.end=top+Math.max(1,rect.height-innerHeight);}
  else {scene.start=top-innerHeight*.85;scene.end=top+rect.height-innerHeight*.2;}
 });
 requestScrollFrame();
}
function requestScrollFrame(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScrollScenes);}
function updateScrollScenes(){
 scrollFrame=0;
 if(reduceMotion.matches)return;
 const y=scrollY;
 scrollTimelines.forEach(scene=>{
  const progress=Math.max(0,Math.min(1,(y-scene.start)/(scene.end-scene.start)));
  scene.timeline.progress(progress);
  if(scene.kind==='story'&&!storyManuallySelected){const step=Math.min(2,Math.floor(progress*3));if(Number($('.system-story').dataset.phase)!==step)setStep(step);}
 });
}
function setupMotion(intro=false){
 motionContext?.revert();scrollTimelines=[];marquee=null;
 if(reduceMotion.matches||!window.gsap){setStep(2);return;}
 const mobile=innerWidth<=760;
 motionContext=gsap.context(()=>{
  if(intro){
   gsap.from('.hero-word span',{y:mobile?45:100,rotation:8,opacity:0,duration:.85,stagger:.055,ease:'power3.out',clearProps:'all'});
   gsap.from('.hero-ribbon',{scale:.82,opacity:0,duration:1,ease:'power3.out',clearProps:'scale,opacity'});
   gsap.from('.hero-copy',{y:20,opacity:0,duration:.6,delay:.25,clearProps:'all'});
  }
  marquee=gsap.to('.announcement>div',{xPercent:-50,duration:26,repeat:-1,ease:'none'});
  const heroTimeline=gsap.timeline({paused:true})
   .to('.hero-ribbon',{y:mobile?75:150,rotation:mobile?-8:5,scale:1.12,ease:'none'},0)
   .to('.hero-word span:nth-child(odd)',{y:mobile?-30:-65,rotation:-4,ease:'none'},0)
   .to('.hero-word span:nth-child(even)',{y:mobile?25:55,rotation:4,ease:'none'},0)
   .to('.sticker-code',{x:mobile?-10:-40,y:-65,rotation:-30,ease:'none'},0)
   .to('.sticker-eye',{x:mobile?10:40,y:50,rotation:30,ease:'none'},0)
   .to('.sticker-star',{rotation:95,y:-35,ease:'none'},0)
   .to('.sticker-label',{rotation:-20,y:30,ease:'none'},0);
  scrollTimelines.push({element:$('.hero'),kind:'hero',timeline:heroTimeline});
  const reach=mobile?20:75;
  const storyTimeline=gsap.timeline({paused:true})
   .fromTo('.system-node',{opacity:.6},{opacity:1,duration:.2},0)
   .to('.node-one',{x:reach,y:25,rotation:15,duration:.45,ease:'power1.inOut'},0)
   .to('.node-two',{x:-reach,y:25,rotation:-15,duration:.45,ease:'power1.inOut'},0)
   .to('.node-three',{x:reach,y:-25,rotation:-15,duration:.45,ease:'power1.inOut'},0)
   .to('.node-four',{x:-reach,y:-25,rotation:15,duration:.45,ease:'power1.inOut'},0)
   .to('.system-core',{rotation:10,scale:.82,duration:.45},0)
   .to('.system-node',{x:0,y:0,rotation:0,duration:.45,ease:'power2.out'},.5)
   .to('.system-core',{rotation:0,scale:1.06,duration:.45},.5)
   .to('.connections',{opacity:1,duration:.35},.55)
   .to('.flow-line',{strokeDashoffset:-85,duration:1,ease:'none'},0)
   .to('.story-spark',{rotation:120,duration:1,ease:'none'},0);
  scrollTimelines.push({element:$('.vision-section'),kind:'story',timeline:storyTimeline});
  const serviceTimeline=gsap.timeline({paused:true})
   .fromTo('.section-ribbon',{y:-35,rotation:45},{y:160,rotation:95,duration:1,ease:'none'},0)
   .fromTo('.shop-window',{rotation:-14,y:25},{rotation:-3,y:-15,duration:1,ease:'none'},0)
   .fromTo('.order-chip',{rotation:14,y:20},{rotation:-4,y:-15,duration:1,ease:'none'},0)
   .fromTo('.software-window',{rotation:12},{rotation:-3,duration:1,ease:'none'},0)
   .fromTo('.chart-bars i',{scaleY:.35},{scaleY:1,duration:.7,stagger:.04,ease:'power2.out'},.1);
  scrollTimelines.push({element:$('.services'),kind:'section',timeline:serviceTimeline});
  const workTimeline=gsap.timeline({paused:true}).fromTo('.work-spark',{rotation:0,y:0},{rotation:180,y:150,ease:'none'});
  scrollTimelines.push({element:$('.work'),kind:'section',timeline:workTimeline});
  const contactTimeline=gsap.timeline({paused:true}).fromTo('.contact-ribbon',{rotation:-40,y:30},{rotation:-12,y:-25,ease:'none'});
  scrollTimelines.push({element:$('.contact'),kind:'section',timeline:contactTimeline});
 });
 measureScenes();
}
setupMotion(true);
reduceMotion.addEventListener('change',()=>setupMotion());
window.addEventListener('scroll',requestScrollFrame,{passive:true});
let lastWidth=innerWidth;
window.addEventListener('resize',()=>{cancelAnimationFrame(measureFrame);measureFrame=requestAnimationFrame(()=>{if((lastWidth<=760)!==(innerWidth<=760)){lastWidth=innerWidth;setupMotion();}else measureScenes();});},{passive:true});
document.fonts.ready.then(measureScenes);
window.addEventListener('vision:layout',measureScenes);
const heroObserver=new IntersectionObserver(([entry])=>{if(entry.isIntersecting&&!document.hidden)marquee?.resume();else marquee?.pause();},{threshold:0});heroObserver.observe($('.hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)marquee?.pause();else if($('.hero').getBoundingClientRect().bottom>0)marquee?.resume();});
const revealed=new WeakSet();
const revealObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{
 if(!entry.isIntersecting||revealed.has(entry.target))return;
 revealed.add(entry.target);revealObserver.unobserve(entry.target);
 if(!window.gsap||reduceMotion.matches)return;
 const isPoster=entry.target.matches('.service-row,.process-list li');
 gsap.from(entry.target,{y:isPoster?65:28,rotation:isPoster?-3:0,opacity:isPoster?1:.45,duration:isPoster?.9:.65,ease:'power3.out',clearProps:'all'});
 });},{threshold:.12});
$$('.reveal').forEach(el=>revealObserver.observe(el));
