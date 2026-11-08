/* VISION public experience. No accounts, database calls or tracking. */
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let lang=new URL(location.href).searchParams.get('lang')==='fr'?'fr':'ar';
let currentFilter='all';
const projects=[
 {id:'pyjama',name:'Pyjama DZ',category:'commerce',art:'pyjama',icon:'i-bag',type:'E-COMMERCE / POS',url:'https://pyjama-dz.vercel.app/',ar:{short:'التجزئة والجملة وتسيير عمليات البيع.',description:'منظومة تجمع المتجر الإلكتروني وبوابة تجار الجملة ونقطة البيع، مع إدارة الطلبيات والمخازن.',features:['متجر تجزئة وبوابة لطلبات الجملة','تسيير مخزون حسب المقاسات والألوان','نقطة بيع وباركود ومتابعة الطلبات']},fr:{short:'Vente au détail, en gros et gestion des ventes.',description:'Un ensemble reliant boutique en ligne, portail grossistes et point de vente, avec gestion des commandes et des stocks.',features:['Boutique B2C et portail de commande B2B','Stock par taille et couleur','Point de vente, codes-barres et suivi des commandes']}},
 {id:'clinic',name:'ClinicFlow DZ',category:'systems',art:'clinic',icon:'i-users',type:'WEB APPLICATION',url:'https://clinicflowdz.com/',ar:{short:'تنظيم العمل داخل العيادة.',description:'منصة لإدارة العيادات، تربط المواعيد وملفات المرضى وعمل الفريق في مساحة مخصّصة.',features:['تنظيم المواعيد واستقبال المرضى','أدوار وصلاحيات بحسب المستخدم','ملفات المرضى ومتابعة نشاط العيادة']},fr:{short:'Organiser le quotidien de la clinique.',description:'Une plateforme dédiée aux cliniques, qui relie rendez-vous, dossiers patients et travail de l’équipe.',features:['Organisation des rendez-vous et de l’accueil','Rôles et accès selon l’utilisateur','Dossiers patients et suivi de l’activité']}},
 {id:'aqsa',name:'الأقصى / Al Aqsa',category:'systems',art:'aqsa',icon:'i-chart',type:'DESKTOP / OFFLINE',url:null,ar:{short:'برنامج بيع وتسيير يعمل دون إنترنت.',description:'برنامج مكتبي مخصّص لمحل أعشاب وتوابل الأقصى، لإدارة البيع والمنتجات وحسابات الزبائن محلياً.',features:['بيع بالوزن أو بالوحدة','تتبّع الديون والدفعات وسجل الزبون','طباعة وصولات A5 وإعادة طباعة الوصولات السابقة']},fr:{short:'Vente et gestion sur ordinateur, hors ligne.',description:'Un logiciel desktop pour le magasin d’herbes et d’épices Al Aqsa, dédié aux ventes, aux produits et aux comptes clients.',features:['Vente au poids ou à l’unité','Suivi des dettes, versements et historique client','Impression de bons A5 et réimpression des anciens bons']}},
 {id:'asel',name:'Asel Butik',category:'commerce',art:'asel',icon:'i-bag',type:'E-COMMERCE / DESKTOP',url:'https://asel-butik.netlify.app/',ar:{short:'المتجر والمحل في منظومة واحدة.',description:'متجر للأزياء النسائية مع نظام تسيير ونقطة بيع، يشمل المتغيرات والباركود والطباعة الحرارية.',features:['منتجات بالمقاسات والألوان','نقطة بيع وطباعة حرارية','بيع دون اتصال مع مزامنة عند عودة الإنترنت']},fr:{short:'La boutique et le magasin, réunis.',description:'Une boutique de mode féminine avec gestion et point de vente, variantes, codes-barres et impression thermique.',features:['Produits par taille et couleur','Point de vente et impression thermique','Ventes hors ligne et synchronisation au retour de la connexion']}},
 {id:'hk',name:'HK STORE',category:'commerce',art:'hk',icon:'i-chart',type:'E-COMMERCE / POS',url:'https://hk--store.vercel.app/',ar:{short:'تجارة إلكترونية وتسيير للمحل.',description:'متجر للساعات والعطور والإكسسوارات، مرتبط بنقطة بيع وإدارة المخزون والطلبات والمصاريف.',features:['طلب عبر الإنترنت بالدفع عند الاستلام','مزامنة مخزون المتجر ونقطة البيع','متابعة المبيعات والمصاريف والتقارير']},fr:{short:'E-commerce et gestion du magasin.',description:'Une boutique de montres, parfums et accessoires, associée à une caisse et à la gestion des stocks, commandes et dépenses.',features:['Commande en ligne avec paiement à la livraison','Stock partagé entre boutique et caisse','Suivi des ventes, dépenses et rapports']}}
];
const storyCopy={ar:['نبدأ بالأسئلة الصحيحة: كيف تعمل، وأين تتكرّر الصعوبات؟','نرتّب الأولويات ونربط الوظائف بطريقة عملك، قبل بدء التطوير.','نحوّل التصوّر إلى نظام مترابط، نختبره ونراجعه معك.'],fr:['Les bonnes questions : comment travaillez-vous et où se situent les difficultés ?','Nous définissons les priorités et les fonctions utiles avant le développement.','Nous transformons le concept en un système cohérent, testé et revu avec vous.']};
function translate(root=document){
 $$('[data-ar]',root).forEach(el=>{el.innerHTML=el.dataset[lang];});
 $$('[data-placeholder-ar]',root).forEach(el=>{el.placeholder=el.dataset[lang==='ar'?'placeholderAr':'placeholderFr'];});
}
function setLanguage(next,{updateURL=true}={}){
 lang=next;document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';
 translate();$('#language').textContent=lang==='ar'?'FR':'ع';$('#language').setAttribute('aria-label',lang==='ar'?'Passer en français':'التبديل إلى العربية');
 document.title=lang==='ar'?'VISION — نبرمج لك نظاماً يناسب متطلباتك':'VISION — Votre activité. Votre solution.';
 $('meta[name=description]').content=lang==='ar'?'VISION — مواقع ومتاجر إلكترونية وأنظمة مخصّصة لنشاطك في الجزائر.':'VISION — Sites web, e-commerce et logiciels sur mesure en Algérie.';
 $('#navigation').setAttribute('aria-label',lang==='ar'?'القائمة الرئيسية':'Navigation principale');
 $('#menu').setAttribute('aria-label',lang==='ar'?'القائمة':'Menu');
 $$('.close-dialog').forEach(x=>x.setAttribute('aria-label',lang==='ar'?'إغلاق':'Fermer'));
 $('.filters').setAttribute('aria-label',lang==='ar'?'تصفية المشاريع':'Filtrer les projets');
 setStep(Number($('.system-story').dataset.phase));
 renderProjects();$('#form-status').textContent='';
 window.dispatchEvent(new Event('vision:layout'));
 if(updateURL){const url=new URL(location.href);if(lang==='fr')url.searchParams.set('lang','fr');else url.searchParams.delete('lang');history.replaceState(null,'',url);}
}
function renderProjects(){
 $('#projects').innerHTML=projects.filter(p=>currentFilter==='all'||p.category===currentFilter).map(p=>`<article class="project"><button class="project-visual ${['pyjama','clinic','asel','hk'].includes(p.id)?'has-home':''}" data-project="${p.id}" data-art="${p.art}" aria-label="${lang==='ar'?'تفاصيل مشروع':'Détails du projet'} ${p.name}"><span class="project-open">↗</span>${['pyjama','clinic','asel','hk'].includes(p.id)?`<img class="project-home" src="${p.id}.jpg" alt="${lang==='ar'?'الصفحة الرئيسية لموقع':'Page d’accueil de'} ${p.name}" width="1264" height="591" loading="lazy" decoding="async">`:`<svg class="project-glyph" viewBox="0 0 24 24" aria-hidden="true"><use href="#${p.icon}"/></svg><strong dir="auto">${p.name}</strong><small>${lang==='ar'?'برنامج مكتبي · بيع ومخزون وحسابات':'Logiciel desktop · Ventes, stock et comptes'}</small>`}</button><div class="project-meta"><div><h3 dir="auto">${p.name}</h3><p>${p[lang].short}</p></div><span>${p.type}</span></div>${p.url?`<a class="project-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${lang==='ar'?'زيارة الموقع':'Visiter le site'} <span>↗</span></a>`:`<button class="project-link text-button" data-project="${p.id}">${lang==='ar'?'اكتشف البرنامج':'Découvrir le logiciel'} <span>↗</span></button>`}</article>`).join('');
 $$('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));
 $('#project-status').textContent=lang==='ar'?`عرض ${$('#projects').children.length} مشاريع`:`${$('#projects').children.length} projets affichés`;
}
function showDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
function openProject(id){
 const project=projects.find(p=>p.id===id),copy=project[lang];
 $('#project-detail').innerHTML=`<h2 id="project-title" dir="auto">${project.name}</h2><p>${copy.description}</p>${typeof projectStoryHTML==='function'?projectStoryHTML(project):''}<ul>${copy.features.map(f=>`<li>${f}</li>`).join('')}</ul>${project.url?`<a class="button primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${lang==='ar'?'زيارة الموقع العمومي':'Visiter le site public'} <span>↗</span></a>`:`<a class="button primary" href="#contact">${lang==='ar'?'نناقشو احتياجك':'Parlons de votre besoin'} <span>↗</span></a>`}<p class="project-detail-note">${lang==='ar'?'الوصف يشرح الوظائف المنجزة. لا نعرض محتوى داخلياً أو بيانات خاصة بالعميل.':'La présentation décrit les fonctionnalités réalisées, sans exposer de contenu interne ni de données privées.'}</p>`;
 $('#project-detail a[href="#contact"]')?.addEventListener('click',()=>$('#project-dialog').close());
 showDialog($('#project-dialog'));
}
$$('dialog').forEach(dialog=>{
 $('.close-dialog',dialog).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');});
});
function setStep(step){
 $('.system-story').dataset.phase=step;
 const titles={ar:['نفهم نشاطك.','نرتّبو احتياجاتك.','نبرمج الحل.'],fr:['Comprendre.','Structurer.','Développer.']};
 $('#story-title').textContent=titles[lang][step];
 $('#story-number').textContent=String(step+1).padStart(2,'0');
 $('#story-description').textContent=storyCopy[lang][step];
 $$('.story-progress i').forEach((el,i)=>el.classList.toggle('is-current',i===step));
}
$$('[data-filter]').forEach(button=>button.addEventListener('click',()=>{currentFilter=button.dataset.filter;$$('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',b===button);});renderProjects();if(window.gsap&&!reduceMotion.matches)gsap.from('.project',{y:20,opacity:0,stagger:.06,duration:.38,clearProps:'all'});}));
function closeMenu(){$('#menu').setAttribute('aria-expanded','false');$('#navigation').classList.remove('open');}
$('#menu').addEventListener('click',()=>{const open=$('#menu').getAttribute('aria-expanded')!=='true';$('#menu').setAttribute('aria-expanded',open);$('#navigation').classList.toggle('open',open);});
$$('#navigation a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
document.addEventListener('click',e=>{if(!e.target.closest('.header'))closeMenu();});
$('#language').addEventListener('click',()=>setLanguage(lang==='ar'?'fr':'ar'));
$('#brief').addEventListener('submit',event=>{
 event.preventDefault();if(!event.target.reportValidity())return;
 const data=new FormData(event.target);const name=String(data.get('name')).trim(),activity=String(data.get('activity')).trim(),need=String(data.get('need')).trim();
 if(!name||!activity){$('#form-status').textContent=lang==='ar'?'عمّر اسمك ونشاطك قبل المتابعة. شرح المشكل اختياري.':'Indiquez votre nom et votre activité. La description de la difficulté est facultative.';return;}
 const message=lang==='ar'?`السلام عليكم VISION، حاب نهدر معاكم على نشاطي.\n\nالاسم: ${name}\nالنشاط: ${activity}${need?`\nالمشكل اللي راه يواجهني: ${need}`:''}`:`Bonjour VISION, je souhaite échanger avec vous au sujet de mon activité.\n\nNom : ${name}\nActivité : ${activity}${need?`\nDifficulté rencontrée : ${need}`:''}`;
 const url=`https://wa.me/213771335039?text=${encodeURIComponent(message)}`;
 // This only opens a prepared message. The visitor explicitly sends it in WhatsApp.
 window.open(url,'_blank','noopener,noreferrer');
 $('#form-status').replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=lang==='ar'?'إذا ما تفتحش واتساب، اضغط هنا لفتح الرسالة ↗':'Si WhatsApp ne s’ouvre pas, ouvrez le message ici ↗';$('#form-status').append(link);
});
$('#year').textContent=new Date().getFullYear();setLanguage(lang,{updateURL:false});


// Scroll choreography: transforms, clipping and SVG strokes; no idle render loop.
let motionContext,marquee,scrollTimelines=[],scrollFrame=0,measureFrame=0;
function measureScenes(){
 scrollTimelines.forEach(scene=>{
  const rect=scene.element.getBoundingClientRect(),top=rect.top+scrollY;
  if(scene.kind==='hero'){scene.start=0;scene.end=Math.max(1,rect.height*.8);}
  else if(scene.kind==='story'){scene.start=top;scene.end=top+Math.max(1,rect.height-innerHeight);}
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
  if(scene.kind==='story'){const step=progress<.33?0:progress<.69?1:2;if(Number($('.system-story').dataset.phase)!==step)setStep(step);}
 });
}
function setupMotion(intro=false){
 motionContext?.revert();scrollTimelines=[];marquee=null;
 const flatStory=reduceMotion.matches||!window.gsap||innerHeight<540;
 $('.vision-section').classList.toggle('story-flat',flatStory);
 if(reduceMotion.matches||!window.gsap){setStep(2);return;}
 const mobile=innerWidth<=760;
 motionContext=gsap.context(()=>{
  if(intro){
   gsap.fromTo('.wordmark-stage',{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0 0% 0 0)',duration:1.1,ease:'power3.inOut',clearProps:'clipPath'});
   gsap.from('.hero-system',{y:12,opacity:0,duration:.55,delay:.45,clearProps:'all'});
   gsap.from('.hero-ribbon',{opacity:0,duration:1,ease:'power3.out',clearProps:'opacity'});
   gsap.from('.hero-copy',{y:20,opacity:0,duration:.6,delay:.25,clearProps:'all'});
  }
  marquee=gsap.to('.announcement>div',{xPercent:-50,duration:26,repeat:-1,ease:'none'});
  // A construction drawing emerges as the wordmark leaves the viewport.
  const heroTimeline=gsap.timeline({paused:true})
   .to('.hero-ribbon',{y:mobile?30:80,rotation:-3,scale:1.05,duration:1,ease:'none'},0)
   .fromTo('.hero-solid',{clipPath:'inset(0 0 0 0%)'},{clipPath:'inset(0 0 0 100%)',duration:1,ease:'none'},0)
   .to('.hero-construction',{opacity:1,duration:1,ease:'none'},0)
   .fromTo('.flow-signal path',{strokeDashoffset:1},{strokeDashoffset:0,duration:.7,ease:'none'},0)
   .to('.flow-nodes',{fill:'#00bceb',duration:.3,ease:'none'},.7);
  scrollTimelines.push({element:$('.hero'),kind:'hero',timeline:heroTimeline});
  if(!flatStory){
   const storyTimeline=gsap.timeline({paused:true});
   gsap.set('.phase-1,.phase-2',{autoAlpha:0});
   // 0–24: questions orbit around the activity, with a readable hold.
   storyTimeline.fromTo('.phase-0 .brain-card',{y:35,scale:.82,rotation:i=>[-14,12,9,-11][i]},{y:0,scale:1,rotation:i=>[-5,5,3,-4][i],duration:.15,stagger:.018,ease:'power3.out'},0)
    .fromTo('.phase-0 .focus-orbit',{scale:.65,rotation:-40},{scale:1.1,rotation:35,duration:.27,ease:'none'},0)
    .to('.phase-0 .story-wires',{strokeDashoffset:-100,duration:.3,ease:'none'},0)
    // Gather the questions into the centre. The next cards unfold as a plan.
    .to('.phase-0 .brain-card',{xPercent:i=>i%2===0?65:-65,yPercent:i=>i<2?35:-35,scale:.5,rotation:0,autoAlpha:0,duration:.12,stagger:.012,ease:'power2.in'},.24)
    .to('.phase-0 .story-hub',{scale:.4,rotation:90,autoAlpha:0,duration:.11},.27)
    .to('.phase-0',{autoAlpha:0,duration:.05},.32)
    .to('.phase-1',{autoAlpha:1,duration:.05},.33)
    .fromTo('.phase-1 .story-hub',{scale:.4,rotation:-90},{scale:1,rotation:0,duration:.13,ease:'back.out(1.5)'},.33)
    .fromTo('.phase-1 .brain-card',{xPercent:i=>i%2===0?65:-65,yPercent:i=>i<2?35:-35,scale:.4,rotation:i=>i%2===0?-15:15,autoAlpha:0},{xPercent:0,yPercent:0,scale:1,rotation:0,autoAlpha:1,duration:.14,stagger:.015,ease:'power3.out'},.34)
    .fromTo('.phase-1 .card-ticks i',{scaleX:0},{scaleX:1,duration:.09,stagger:.006,ease:'power2.out'},.44)
    .fromTo('.phase-1 .focus-orbit',{rotation:0,scale:.75},{rotation:90,scale:1,duration:.26,ease:'none'},.36)
    // The plan folds away; four functional modules assemble into one workspace.
    .to('.phase-1 .brain-card',{scale:.65,yPercent:i=>i<2?35:-35,rotationY:65,autoAlpha:0,duration:.1,stagger:.012,ease:'power2.in'},.6)
    .to('.phase-1',{scale:.85,autoAlpha:0,duration:.08},.65)
    .to('.phase-2',{autoAlpha:1,duration:.04},.69)
    .fromTo('.built-window',{scale:.55,rotation:-8,y:45},{scale:1,rotation:0,y:0,duration:.18,ease:'power3.out'},.69)
    .fromTo('.built-module',{y:40,scale:.75,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.13,stagger:.025,ease:'power3.out'},.73)
    .fromTo('.module-visual i',{scaleY:.1},{scaleY:1,duration:.11,stagger:.008},.82)
    .fromTo('.built-status',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.12,ease:'back.out(1.8)'},.85)
    .to({}, {duration:.03},.97);
   scrollTimelines.push({element:$('.vision-section'),kind:'story',timeline:storyTimeline});
  }else setStep(2);
  const serviceTimeline=gsap.timeline({paused:true})
   .fromTo('.section-ribbon',{y:-35,rotation:45},{y:160,rotation:95,duration:1,ease:'none'},0)
   .fromTo('.services .inline-film',{y:18},{y:-8,duration:1,ease:'none'},0);
  scrollTimelines.push({element:$('.services'),kind:'section',timeline:serviceTimeline});
  const contactTimeline=gsap.timeline({paused:true}).fromTo('.contact-ribbon',{rotation:-40,y:30},{rotation:-12,y:-25,ease:'none'});
  scrollTimelines.push({element:$('.contact'),kind:'section',timeline:contactTimeline});
 });
 measureScenes();
}
setupMotion(true);
reduceMotion.addEventListener('change',()=>setupMotion());
window.addEventListener('scroll',requestScrollFrame,{passive:true});
let lastWidth=innerWidth,lastHeight=innerHeight;
window.addEventListener('resize',()=>{cancelAnimationFrame(measureFrame);measureFrame=requestAnimationFrame(()=>{if(lastWidth!==innerWidth||(lastHeight<540)!==(innerHeight<540)){lastWidth=innerWidth;lastHeight=innerHeight;setupMotion();}else measureScenes();});},{passive:true});
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
// Filters, expanded answers and translated text can move later scroll scenes.
new ResizeObserver(()=>{cancelAnimationFrame(measureFrame);measureFrame=requestAnimationFrame(measureScenes);}).observe($('#main'));

// Inline films load as they enter view. Autoplay is muted; sound is an explicit choice.
const inlinePlayers=$$('.inline-player');
const filmState=new WeakMap(inlinePlayers.map(v=>[v,{visible:false,manualPause:false,autoPausing:false}]));
function loadInline(v){if(!v.getAttribute('src')){v.src=v.dataset.src;v.load();}}
function syncFilmControls(){
 inlinePlayers.forEach(v=>{
  const play=$(`[data-play="${v.dataset.film}"]`),sound=$(`[data-sound="${v.dataset.film}"]`);
  play.textContent=v.paused?(lang==='ar'?'تشغيل ▶':'Lire ▶'):(lang==='ar'?'توقيف مؤقت Ⅱ':'Pause Ⅱ');
  play.setAttribute('aria-label',`${play.textContent} — ${v.getAttribute('aria-label')}`);
  sound.textContent=v.muted?(lang==='ar'?'اسمع الشرح من البداية ↗':'Écouter depuis le début ↗'):(lang==='ar'?'كتم الصوت':'Couper le son');
  sound.setAttribute('aria-pressed',String(!v.muted));
 });
}
function pauseOffscreen(v){
 if(v.paused)return;
 const state=filmState.get(v);state.autoPausing=true;v.pause();
}
function autoplayInline(v){
 const state=filmState.get(v);
 if(state.visible&&!state.manualPause&&!document.hidden&&!reduceMotion.matches){
  loadInline(v);v.play().catch(syncFilmControls);
 }
}
inlinePlayers.forEach(v=>{
 v.muted=true;
 v.addEventListener('pause',()=>{
  const state=filmState.get(v);
  if(!state.autoPausing&&state.visible&&!document.hidden)state.manualPause=true;
  state.autoPausing=false;syncFilmControls();
 });
 v.addEventListener('play',()=>{filmState.get(v).manualPause=false;syncFilmControls();});
 v.addEventListener('volumechange',()=>{
  if(!v.muted)inlinePlayers.filter(other=>other!==v).forEach(other=>{other.muted=true;});
  syncFilmControls();
 });
 $(`[data-play="${v.dataset.film}"]`).addEventListener('click',()=>{
  if(v.paused){filmState.get(v).manualPause=false;loadInline(v);v.play().catch(syncFilmControls);}
  else {filmState.get(v).manualPause=true;v.pause();}
 });
 $(`[data-sound="${v.dataset.film}"]`).addEventListener('click',()=>{
  if(!v.muted){v.muted=true;return;}
  loadInline(v);v.currentTime=0;v.muted=false;filmState.get(v).manualPause=false;
  v.play().catch(syncFilmControls);
 });
});
const filmObserver=new IntersectionObserver(entries=>{
 entries.forEach(entry=>{
  const v=entry.target;filmState.get(v).visible=entry.isIntersecting&&entry.intersectionRatio>=.25;
  if(filmState.get(v).visible){loadInline(v);autoplayInline(v);}else pauseOffscreen(v);
 });
},{threshold:[0,.25]});
inlinePlayers.forEach(v=>filmObserver.observe(v));
document.addEventListener('visibilitychange',()=>inlinePlayers.forEach(v=>document.hidden?pauseOffscreen(v):autoplayInline(v)));
reduceMotion.addEventListener('change',()=>inlinePlayers.forEach(v=>reduceMotion.matches?pauseOffscreen(v):autoplayInline(v)));
window.addEventListener('vision:layout',syncFilmControls);
syncFilmControls();
