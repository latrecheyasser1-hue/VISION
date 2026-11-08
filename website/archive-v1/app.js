/* VISION public experience. No accounts, database calls or tracking. */
const $=(selector,root=document)=>root.querySelector(selector);
const $$=(selector,root=document)=>[...root.querySelectorAll(selector)];
const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)');
let lang=new URL(location.href).searchParams.get('lang')==='fr'?'fr':'ar';
let currentFilter='all';
const projects=[
 {id:'pyjama',name:'Pyjama DZ',category:'commerce',art:'pyjama',icon:'i-bag',type:'E-COMMERCE / POS',url:'https://pyjama-dz.vercel.app/',ar:{short:'التجزئة والجملة وتسيير عمليات البيع.',description:'منظومة تجمع المتجر الإلكتروني وبوابة تجار الجملة ونقطة البيع، مع إدارة الطلبيات والمخازن.',features:['متجر تجزئة وبوابة لطلبات الجملة','تسيير مخزون حسب المقاسات والألوان','نقطة بيع وباركود ومتابعة الطلبات']},fr:{short:'Vente au détail, en gros et gestion des ventes.',description:'Un ensemble reliant boutique en ligne, portail grossistes et point de vente, avec gestion des commandes et des stocks.',features:['Boutique B2C et portail de commande B2B','Stock par taille et couleur','Point de vente, codes-barres et suivi des commandes']}},
 {id:'clinic',name:'ClinicFlow DZ',category:'systems',art:'clinic',icon:'i-users',type:'WEB APPLICATION',url:'https://clinicflowdz.com/',ar:{short:'تنظيم العمل داخل العيادة.',description:'منصة لإدارة العيادات، تربط المواعيد وملفات المرضى وعمل الفريق في مساحة مخصّصة.',features:['تنظيم المواعيد واستقبال المرضى','أدوار وصلاحيات بحسب المستخدم','ملفات المرضى ومتابعة نشاط العيادة']},fr:{short:'Organiser le quotidien de la clinique.',description:'Une plateforme dédiée aux cliniques, qui relie rendez-vous, dossiers patients et travail de l’équipe.',features:['Organisation des rendez-vous et de l’accueil','Rôles et accès selon l’utilisateur','Dossiers patients et suivi de l’activité']}},
 {id:'city',name:'La City',category:'commerce',art:'city',icon:'i-box',type:'ORDERING / MANAGEMENT',url:'https://massmakat-la-city.netlify.app/',ar:{short:'من طلب الزبون إلى تسيير المطعم.',description:'منصة للمطعم والمسمكة تجمع قائمة الطلب عبر الإنترنت مع الإدارة والكاشير ومتابعة التوصيل.',features:['منتجات بالوزن أو بالقطعة ورسوم طهي','طلبات ومخزون متزامنان','نقطة بيع وتنظيم مهام التوصيل']},fr:{short:'De la commande au fonctionnement du restaurant.',description:'Une plateforme pour le restaurant et la poissonnerie, reliant commande en ligne, gestion, caisse et livraison.',features:['Vente au poids ou à l’unité et frais de cuisson','Commandes et stock synchronisés','Caisse et organisation des livraisons']}},
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
 $('.story-controls').setAttribute('aria-label',lang==='ar'?'مراحل الحل':'Les étapes de la solution');
 $('.filters').setAttribute('aria-label',lang==='ar'?'تصفية المشاريع':'Filtrer les projets');
 $('#story-description').textContent=storyCopy[lang][Number($('.system-story').dataset.phase)];
 renderProjects();$('#form-status').textContent='';
 if(updateURL){const url=new URL(location.href);if(lang==='fr')url.searchParams.set('lang','fr');else url.searchParams.delete('lang');history.replaceState(null,'',url);}
}
function renderProjects(){
 $('#projects').innerHTML=projects.filter(p=>currentFilter==='all'||p.category===currentFilter).map(p=>`<article class="project"><button class="project-visual" data-project="${p.id}" data-art="${p.art}" aria-label="${lang==='ar'?'تفاصيل مشروع':'Détails du projet'} ${p.name}"><span class="project-open">↗</span><svg class="project-glyph" viewBox="0 0 24 24" aria-hidden="true"><use href="#${p.icon}"/></svg><strong dir="auto">${p.name}</strong><small>${lang==='ar'?'رسم توضيحي للمجال · بدون بيانات عملاء':'Illustration du domaine · Sans données clients'}</small></button><div class="project-meta"><div><h3 dir="auto">${p.name}</h3><p>${p[lang].short}</p></div><span>${p.type}</span></div>${p.url?`<a class="project-link" href="${p.url}" target="_blank" rel="noopener noreferrer">${lang==='ar'?'زيارة الموقع':'Visiter le site'} <span>↗</span></a>`:`<button class="project-link text-button" data-project="${p.id}">${lang==='ar'?'اكتشف البرنامج':'Découvrir le logiciel'} <span>↗</span></button>`}</article>`).join('');
 $$('[data-project]').forEach(button=>button.addEventListener('click',()=>openProject(button.dataset.project)));
 $('#project-status').textContent=lang==='ar'?`عرض ${$('#projects').children.length} مشاريع`:`${$('#projects').children.length} projets affichés`;
}
function showDialog(dialog){dialog.showModal();document.body.classList.add('modal-open');}
function openProject(id){
 const project=projects.find(p=>p.id===id),copy=project[lang];
 $('#project-detail').innerHTML=`<h2 id="project-title" dir="auto">${project.name}</h2><p>${copy.description}</p><ul>${copy.features.map(f=>`<li>${f}</li>`).join('')}</ul>${project.url?`<a class="button primary" href="${project.url}" target="_blank" rel="noopener noreferrer">${lang==='ar'?'زيارة الموقع العمومي':'Visiter le site public'} <span>↗</span></a>`:`<a class="button primary" href="#contact">${lang==='ar'?'نناقشو احتياجك':'Parlons de votre besoin'} <span>↗</span></a>`}<p class="project-detail-note">${lang==='ar'?'الوصف يشرح الوظائف المنجزة. لا نعرض محتوى داخلياً أو بيانات خاصة بالعميل.':'La présentation décrit les fonctionnalités réalisées, sans exposer de contenu interne ni de données privées.'}</p>`;
 $('#project-detail a[href="#contact"]')?.addEventListener('click',()=>$('#project-dialog').close());
 showDialog($('#project-dialog'));
}
const films={brand:{file:'01-VISION-brand',ar:'VISION — نفهم نشاطك',fr:'VISION — Comprendre votre activité'},commerce:{file:'02-VISION-commerce',ar:'التجارة الإلكترونية',fr:'Le e-commerce'},systems:{file:'03-VISION-systems',ar:'الأنظمة المخصّصة',fr:'Les logiciels sur mesure'}};
$$('[data-video]').forEach(button=>button.addEventListener('click',()=>{
 const film=films[button.dataset.video];$('#video-title').textContent=film[lang];const player=$('#film');
 player.poster=`assets/videos/${film.file}.jpg`;player.innerHTML=`<source src="assets/videos/${film.file}.mp4" type="video/mp4"><track kind="captions" src="assets/videos/${film.file}.vtt" srclang="ar" label="العربية">`;
 player.load();showDialog($('#video-dialog'));player.play().catch(()=>{});
}));
$$('dialog').forEach(dialog=>{
 $('.close-dialog',dialog).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
 dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');if(dialog.id==='video-dialog'){$('#film').pause();$('#film').removeAttribute('src');$('#film').innerHTML='';$('#film').load();}});
});
function setStep(step){$('.system-story').dataset.phase=step;$$('.story-step').forEach(b=>{const on=Number(b.dataset.step)===step;b.classList.toggle('active',on);b.setAttribute('aria-pressed',on);});$('#story-description').textContent=storyCopy[lang][step];}
$$('.story-step').forEach(button=>button.addEventListener('click',()=>{storyManuallySelected=true;setStep(Number(button.dataset.step));}));
let storyManuallySelected=false;
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
 if(!name||!activity||!need){$('#form-status').textContent=lang==='ar'?'عمّر الخانات بمعلومات المشروع قبل المتابعة.':'Complétez les champs avant de continuer.';return;}
 const message=lang==='ar'?`السلام عليكم VISION، حاب نناقش مشروع معاكم.\n\nالاسم: ${name}\nالنشاط: ${activity}\nالمشروع: ${need}`:`Bonjour VISION, je souhaite discuter d’un projet.\n\nNom : ${name}\nActivité : ${activity}\nProjet : ${need}`;
 const url=`https://wa.me/213771335039?text=${encodeURIComponent(message)}`;
 // This only opens a prepared message. The visitor explicitly sends it in WhatsApp.
 window.open(url,'_blank','noopener,noreferrer');
 $('#form-status').replaceChildren();const link=document.createElement('a');link.href=url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=lang==='ar'?'إذا ما تفتحش واتساب، اضغط هنا لفتح الرسالة ↗':'Si WhatsApp ne s’ouvre pas, ouvrez le message ici ↗';$('#form-status').append(link);
});
$('#year').textContent=new Date().getFullYear();setLanguage(lang,{updateURL:false});

// Motion is progressive enhancement. Content is visible if JS or GSAP is unavailable.
let motionContext,heroLoop,storyTimer;
function setupMotion(){
 motionContext?.revert();heroLoop=null;clearTimeout(storyTimer);
 if(reduceMotion.matches||!window.gsap)return;
 motionContext=gsap.context(()=>{
  gsap.from('.hero-copy h1,.hero-copy>p,.hero-actions',{y:24,opacity:0,duration:.7,stagger:.1,ease:'power3.out',clearProps:'all'});
  gsap.from('.focus-eye',{scale:.76,rotation:-26,opacity:0,duration:1,ease:'power3.out',clearProps:'scale,opacity'});
  gsap.from('.signal',{y:20,opacity:0,duration:.6,stagger:.12,delay:.3,clearProps:'opacity,y'});
  if(matchMedia('(min-width: 761px) and (pointer: fine)').matches){
   heroLoop=gsap.timeline({repeat:-1,yoyo:true}).to('.focus-eye',{y:-12,rotation:-8,duration:3.8,ease:'sine.inOut'},0).to('.orbital-dot',{x:28,y:20,duration:3.8,ease:'sine.inOut'},0).to('.signal-one',{y:-7,duration:3.8,ease:'sine.inOut'},0).to('.signal-two',{y:7,duration:3.8,ease:'sine.inOut'},0);
  }
 });
}
setupMotion();reduceMotion.addEventListener('change',setupMotion);
const heroObserver=new IntersectionObserver(([entry])=>{if(heroLoop){if(entry.isIntersecting&&!document.hidden)heroLoop.resume();else heroLoop.pause();}},{threshold:.05});heroObserver.observe($('.hero'));
document.addEventListener('visibilitychange',()=>{if(document.hidden)heroLoop?.pause();else if($('.hero').getBoundingClientRect().bottom>0)heroLoop?.resume();});
if('IntersectionObserver' in window){
 const reveals=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;reveals.unobserve(entry.target);if(window.gsap&&!reduceMotion.matches)gsap.from(entry.target,{y:26,opacity:.25,duration:.65,ease:'power3.out',clearProps:'all'});});},{threshold:.12});$$('.reveal').forEach(el=>reveals.observe(el));
 const storyObserver=new IntersectionObserver(([entry])=>{clearTimeout(storyTimer);if(!entry.isIntersecting||storyManuallySelected||reduceMotion.matches)return;setStep(1);storyTimer=setTimeout(()=>{if(!storyManuallySelected)setStep(2);},1000);},{threshold:.5});storyObserver.observe($('.story-canvas'));
}
// Pointer depth is limited to the hero, fine pointers and visible desktop screens.
$('.focus-stage').addEventListener('pointermove',event=>{if(reduceMotion.matches||!window.gsap||event.pointerType!=='mouse'||innerWidth<761)return;const rect=event.currentTarget.getBoundingClientRect();gsap.to('.focus-stage',{rotationY:(event.clientX-rect.left-rect.width/2)/45,rotationX:-(event.clientY-rect.top-rect.height/2)/60,duration:.55,ease:'power2.out',overwrite:true});},{passive:true});
$('.focus-stage').addEventListener('pointerleave',()=>{if(window.gsap)gsap.to('.focus-stage',{rotationX:0,rotationY:0,duration:.6});});
