from pathlib import Path
import re
root=Path(__file__).parent/'public'
def txt(ar,fr,tag='span',cls=''):
    return f'<{tag} class="{cls}" data-ar="{ar}" data-fr="{fr}">{ar}</{tag}>'
def card(n,icon,ar,fr,detail,detailfr,kind):
    decoration='<div class="card-ticks"><i></i><i></i><i></i></div>' if kind=='plan' else '<span class="question-mark">?</span>'
    return f'<div class="brain-card brain-{n}"><div class="card-icon"><svg viewBox="0 0 24 24"><use href="#{icon}"/></svg><small>0{n}</small></div>{txt(ar,fr,"strong")}{txt(detail,detailfr,"small","card-detail")}{decoration}</div>'
q=[('i-bag','كيف تستقبل الطلب؟','Vos commandes ?','من أول تواصل إلى البيع','Du premier contact à la vente'),('i-box','كيف تتابع المخزون؟','Votre stock ?','السلع والكميات المتوفرة','Les produits et les quantités'),('i-users','كيف يخدم فريقك؟','Votre équipe ?','الأدوار والمهام اليومية','Les rôles au quotidien'),('i-chart','واش حاب تحسّن؟','Vos priorités ?','الصعوبات اللي تتكرّر','Les difficultés récurrentes')]
p=[('i-chart','نرتّبو الأولويات','Les priorités','واش نبنيو أولاً؟','Que construire en premier ?'),('i-box','نحدّدو الوظائف','Les fonctions','كل وظيفة عندها هدف','Une fonction, un objectif'),('i-users','نرسمو المسارات','Les parcours','خطوات واضحة لكل مستخدم','Des étapes pour chacun'),('i-bag','نثبتو التصوّر','Le prototype','نراجعوه معاك قبل التطوير','À valider ensemble')]
panels=''
for index,data in enumerate([q,p]):
    center=(f'<svg viewBox="0 0 200 126"><use href="#eye-mark"/></svg><b>VISION</b>' if index==0 else '<span class="plan-cross">✳</span>'+txt('تصوّر واضح','Un plan clair','b'))
    panels+=f'<div class="story-panel phase-{index}"><div class="phase-inline-title">0{index+1} / '+txt('نفهم نشاطك' if index==0 else 'نرتّبو احتياجاتك','Comprendre' if index==0 else 'Structurer')+'</div><svg class="story-wires" viewBox="0 0 1000 420" preserveAspectRatio="none"><path d="M180 95 Q350 95 500 210 T820 325 M820 95 Q650 95 500 210 T180 325"/></svg><div class="focus-orbit"></div><div class="story-hub">'+center+'</div>'+''.join(card(i+1,*v,'question' if index==0 else 'plan') for i,v in enumerate(data))+'</div>'
modules=[('i-bag','الطلبات','Commandes','كل طلب، في مكانه','Chaque commande à sa place'),('i-box','المخزون','Stock','حركة السلع واضحة','Des mouvements visibles'),('i-users','الفريق','Équipe','كل واحد يعرف دوره','Chacun connaît son rôle'),('i-chart','المتابعة','Suivi','نظرة أوضح لنشاطك','Une vision plus claire')]
panels+='<div class="story-panel phase-2"><div class="phase-inline-title">03 / '+txt('نبرمج الحل','Développer')+'</div><div class="built-window"><div class="built-toolbar"><div class="built-dots"><i></i><i></i><i></i></div><b>VISION / WORKSPACE</b><span class="built-status">✓ '+txt('على قياسك','Sur mesure')+'</span></div><div class="built-modules">'
for icon,ar,fr,dar,dfr in modules:
    panels+=f'<div class="built-module"><svg viewBox="0 0 24 24"><use href="#{icon}"/></svg>{txt(ar,fr,"strong")}{txt(dar,dfr,"small")}<div class="module-visual"><i></i><i></i><i></i><span>✓</span></div></div>'
panels+='</div><div class="built-caption">'+txt('تصوّر توضيحي لنظام مخصّص','Illustration d’un logiciel sur mesure')+'</div></div><span class="launch-spark">✳</span></div>'
section='''<section id="vision" class="vision-section section-light scroll-scene" aria-labelledby="story-title">
 <div class="story-sticky">
 <div class="section-top"><span class="eyebrow dark" data-ar="01 / الفكرة" data-fr="01 / NOTRE VISION">01 / الفكرة</span><span data-ar="من فكرتك، إلى نظامك." data-fr="De votre idée à votre solution.">من فكرتك، إلى نظامك.</span></div>
 <div class="story-chapter"><span id="story-number" aria-hidden="true">01</span><div><span class="chapter-kicker" data-ar="نبنيوها، خطوة بخطوة" data-fr="UNE ÉTAPE À LA FOIS">نبنيوها، خطوة بخطوة</span><h2 id="story-title">نفهم نشاطك.</h2></div><span class="chapter-spark" aria-hidden="true">✳</span></div>
 <div class="system-story" data-phase="0"><div class="story-stage" aria-hidden="true">'''+panels+'''</div></div>
 <div class="story-footer"><p id="story-description">نبدأ بالأسئلة الصحيحة: كيف تعمل، وأين تتكرّر الصعوبات؟</p><div class="story-progress" aria-hidden="true"><i></i><i></i><i></i></div><span class="story-scroll-hint" data-ar="كمّل التمرير، وشوف الحل يتشكّل ↓" data-fr="Continuez à défiler. La solution prend forme ↓">كمّل التمرير، وشوف الحل يتشكّل ↓</span></div>
 <ol class="sr-only"><li data-ar="نفهم نشاطك: الطلبات والمخزون والفريق والصعوبات." data-fr="Comprendre : commandes, stock, équipe et difficultés.">نفهم نشاطك: الطلبات والمخزون والفريق والصعوبات.</li><li data-ar="نرتّب الأولويات والوظائف والمسارات، ونراجع التصوّر معك." data-fr="Structurer les priorités, les fonctions et les parcours, puis valider le prototype ensemble.">نرتّب الأولويات والوظائف والمسارات، ونراجع التصوّر معك.</li><li data-ar="نبرمج نظاماً مخصّصاً، نختبره ونراجعه معك." data-fr="Développer une solution sur mesure, testée et revue ensemble.">نبرمج نظاماً مخصّصاً، نختبره ونراجعه معك.</li></ol>
 </div>
</section>'''
html=(root/'index.html').read_text(encoding='utf-8')
html=re.sub(r'<section id="vision".*?</section>',section,html,count=1,flags=re.S)
(root/'index.html').write_text(html,encoding='utf-8')
js=(root/'app.js').read_text(encoding='utf-8')
js=js.replace(" $('.story-controls').setAttribute('aria-label',lang==='ar'?'مراحل الحل':'Les étapes de la solution');\n",'')
js=js.replace(" $('#story-description').textContent=storyCopy[lang][Number($('.system-story').dataset.phase)];"," setStep(Number($('.system-story').dataset.phase));")
start=js.index('function setStep(')
end=js.index("$$('[data-filter]')",start)
js=js[:start]+'''function setStep(step){
 $('.system-story').dataset.phase=step;
 const titles={ar:['نفهم نشاطك.','نرتّبو احتياجاتك.','نبرمج الحل.'],fr:['Comprendre.','Structurer.','Développer.']};
 $('#story-title').textContent=titles[lang][step];
 $('#story-number').textContent=String(step+1).padStart(2,'0');
 $('#story-description').textContent=storyCopy[lang][step];
 $$('.story-progress i').forEach((el,i)=>el.classList.toggle('is-current',i===step));
}
'''+js[end:]
js=js.replace("scene.kind==='story'&&innerWidth>760","scene.kind==='story'")
js=js.replace("if(scene.kind==='story'&&!storyManuallySelected){const step=Math.min(2,Math.floor(progress*3));", "if(scene.kind==='story'){const step=progress<.33?0:progress<.69?1:2;")
js=js.replace(" if(reduceMotion.matches||!window.gsap){setStep(2);return;}"," const flatStory=reduceMotion.matches||!window.gsap||innerHeight<540;\n $('.vision-section').classList.toggle('story-flat',flatStory);\n if(reduceMotion.matches||!window.gsap){setStep(2);return;}")
start=js.index('  const reach=mobile?20:75;')
end=js.index('  const serviceTimeline=',start)
js=js[:start]+'''  if(!flatStory){
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
    .fromTo('.phase-1 .brain-card',{xPercent:i=>i%2===0?65:-65,yPercent:i=>i<2?35:-35,scale:.4,rotation:i=>i%2===0?-15:15,autoAlpha:0},{xPercent:0,yPercent:0,scale:1,rotation:0,autoAlpha:1,duration:.14,stagger:.015,ease:'back.out(1.2)'},.34)
    .fromTo('.phase-1 .card-ticks i',{scaleX:0},{scaleX:1,duration:.09,stagger:.006,ease:'power2.out'},.44)
    .fromTo('.phase-1 .focus-orbit',{rotation:0,scale:.75},{rotation:90,scale:1,duration:.26,ease:'none'},.36)
    // The plan folds away; four functional modules assemble into one workspace.
    .to('.phase-1 .brain-card',{scale:.65,yPercent:i=>i<2?35:-35,rotationY:65,autoAlpha:0,duration:.1,stagger:.012,ease:'power2.in'},.6)
    .to('.phase-1',{scale:.85,autoAlpha:0,duration:.08},.65)
    .to('.phase-2',{autoAlpha:1,duration:.04},.69)
    .fromTo('.built-window',{scale:.55,rotation:-8,y:45},{scale:1,rotation:0,y:0,duration:.18,ease:'back.out(1.15)'},.69)
    .fromTo('.built-module',{y:40,scale:.75,autoAlpha:0},{y:0,scale:1,autoAlpha:1,duration:.13,stagger:.025,ease:'power3.out'},.73)
    .fromTo('.module-visual i',{scaleY:.1},{scaleY:1,duration:.11,stagger:.008},.82)
    .fromTo('.built-status,.launch-spark',{scale:0,rotation:-90},{scale:1,rotation:0,duration:.12,ease:'back.out(1.8)'},.85)
    .fromTo('.chapter-spark',{rotation:0},{rotation:240,duration:1,ease:'none'},0)
    .to({}, {duration:.03},.97);
   scrollTimelines.push({element:$('.vision-section'),kind:'story',timeline:storyTimeline});
  }else setStep(2);
'''+js[end:]
# Rebuild on actual viewport changes (including short landscape screens).
js=js.replace('let lastWidth=innerWidth;','let lastWidth=innerWidth,lastHeight=innerHeight;')
js=js.replace("if((lastWidth<=760)!==(innerWidth<=760)){lastWidth=innerWidth;setupMotion();}","if(lastWidth!==innerWidth||(lastHeight<540)!==(innerHeight<540)){lastWidth=innerWidth;lastHeight=innerHeight;setupMotion();}")
(root/'app.js').write_text(js,encoding='utf-8')
