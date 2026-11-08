from pathlib import Path
import re

root=Path(__file__).parent
p=root/'public'
html=(p/'index.html').read_text(encoding='utf-8')

def player(key,stem,title):
    return f'''<figure class="inline-film" id="{key}-video"><video class="inline-player" data-film="{key}" data-src="assets/videos/{stem}.mp4" poster="assets/videos/{stem}.jpg" width="1920" height="1080" controls muted loop playsinline preload="none" aria-label="{title}"><track kind="captions" src="assets/videos/{stem}.vtt" srclang="ar" label="العربية"></video><figcaption><span data-ar="{title}" data-fr="{'VISION en 30 secondes' if key=='brand' else 'E-commerce' if key=='commerce' else 'Logiciels sur mesure'}">{title}</span><div class="film-actions"><button type="button" data-play="{key}" data-ar="تشغيل" data-fr="Lire">تشغيل</button><button type="button" data-sound="{key}" data-ar="اسمع الشرح من البداية ↗" data-fr="Écouter depuis le début ↗">اسمع الشرح من البداية ↗</button></div></figcaption></figure>'''

html=re.sub(r'<button class="watch" data-video="brand">(.*?)</button>',r'<a class="watch" href="#brand-video">\1</a>',html,flags=re.S)
for key,art,stem,title in [('commerce','commerce-art','02-VISION-commerce','التجارة الإلكترونية'),('systems','systems-art','03-VISION-systems','الأنظمة المخصّصة')]:
    html=re.sub(r'<button class="text-button" data-video="'+key+r'">.*?</button>','',html,flags=re.S)
    html=re.sub(r'<div class="'+art+r'" aria-hidden="true">.*?</article>',player(key,stem,title)+'</article>',html,count=1,flags=re.S)
brand='''<section class="brand-film-section" aria-labelledby="brand-film-title"><article class="service-row brand-film"><div class="service-info"><span class="micro service-tag">VISION / LE FILM</span><h2 id="brand-film-title" data-ar="نفهم نشاطك.<br>ونبرمج الحل." data-fr="Votre métier.<br>Notre point de départ.">نفهم نشاطك.<br>ونبرمج الحل.</h2><p data-ar="من فهم الاحتياج إلى التسليم: شوف كيفاش نحوّلو فكرتك إلى نظام يناسب متطلباتك." data-fr="Du premier échange à la livraison : découvrez comment votre idée devient une solution adaptée à votre activité.">من فهم الاحتياج إلى التسليم: شوف كيفاش نحوّلو فكرتك إلى نظام يناسب متطلباتك.</p><span class="film-duration" data-ar="الفيديو التعريفي · 30 ثانية" data-fr="Le film VISION · 30 secondes">الفيديو التعريفي · 30 ثانية</span></div>'''+player('brand','01-VISION-brand','VISION — نفهم نشاطك')+'''</article></section>\n'''
html=html.replace('<section id="services"',brand+'<section id="services"',1)
html=re.sub(r'<dialog id="video-dialog".*?</dialog>\n','',html,flags=re.S)
(p/'index.html').write_text(html,encoding='utf-8')

js=(p/'app.js').read_text(encoding='utf-8')
start=js.index('const films=')
end=js.index("$$('dialog')",start)
js=js[:start]+js[end:]
js=js.replace("if(dialog.id==='video-dialog'){$('#film').pause();$('#film').removeAttribute('src');$('#film').innerHTML='';$('#film').load();}",'')
# Replace removed mockup animation targets with restrained frame movement.
start=js.index("   .fromTo('.shop-window'")
end=js.index("  scrollTimelines.push({element:$('.services')",start)
js=js[:start]+"   .fromTo('.services .inline-film',{y:18},{y:-8,duration:1,ease:'none'},0);\n"+js[end:]
old='<span class="project-open">↗</span><svg class="project-glyph" viewBox="0 0 24 24" aria-hidden="true"><use href="#${p.icon}"/></svg><strong dir="auto">${p.name}</strong><small>${lang===\'ar\'?\'تصوّر توضيحي\':\'Illustration du domaine\'}</small>'
new='''<span class="project-open">↗</span>${['pyjama','clinic','asel','hk'].includes(p.id)?`<img class="project-home" src="assets/projects/${p.id}.jpg" alt="${lang==='ar'?'الصفحة الرئيسية لموقع':'Page d’accueil de'} ${p.name}" width="1264" height="591" loading="lazy" decoding="async">`:`<svg class="project-glyph" viewBox="0 0 24 24" aria-hidden="true"><use href="#${p.icon}"/></svg><strong dir="auto">${p.name}</strong><small>${p.id==='aqsa'?(lang==='ar'?'برنامج مكتبي · بيع ومخزون وحسابات':'Logiciel desktop · Ventes, stock et comptes'):(lang==='ar'?'طلبات المطعم · المخزون · التوصيل':'Commandes · Stock · Livraison')}</small>`}'''
assert old in js
js=js.replace(old,new)
js=js.replace('class="project-visual" data-project=', 'class="project-visual ${[\'pyjama\',\'clinic\',\'asel\',\'hk\'].includes(p.id)?\'has-home\':\'\'}" data-project=')
(p/'app.js').write_text(js,encoding='utf-8')
