from pathlib import Path
root=Path(__file__).parent
p=root/'public/index.html'
s=p.read_text(encoding='utf-8')
s=s.replace('assets/fonts/Dubai-Bold.ttf','assets/fonts/Changa-ExtraBold.ttf').replace('href="style.css"','href="style-v2.css"')
start=s.index('<section class="hero"')
end=s.index('<section id="vision"',start)
s=s[:start]+(root/'hero-v2.html').read_text(encoding='utf-8')+'\n'+s[end:]
s=s.replace('<header class="header">','<div class="announcement" aria-hidden="true"><div>YOUR IDEAS. BUILT DIFFERENT. <span>✳</span> نفهم نشاطك. ونطوّر الحل. <span>✳</span> YOUR IDEAS. BUILT DIFFERENT. <span>✳</span> نفهم نشاطك. ونطوّر الحل. <span>✳</span></div></div><header class="header">')
s=s.replace('class="vision-section section-light"','class="vision-section section-light scroll-scene"')
s=s.replace('<div class="section-top reveal"><span class="eyebrow dark" data-ar="01 / الفكرة"','<div class="story-sticky"><div class="section-top reveal"><span class="eyebrow dark" data-ar="01 / الفكرة"',1)
s=s.replace('<h2 class="vision-heading reveal" data-ar="كلّ نشاط عنده طريقته.<br>وحلّه يبدأ من فهمها." data-fr="À chaque activité,<br>sa façon d’avancer.">كلّ نشاط عنده طريقته.<br>وحلّه يبدأ من فهمها.</h2>','<h2 class="vision-heading" data-ar="فكرتك.<br>نرتّبوها. نبنيوها." data-fr="Votre idée.<br>On lui donne vie.">فكرتك.<br>نرتّبوها. نبنيوها.</h2><span class="story-spark" aria-hidden="true">✳</span>')
s=s.replace('<span class="illustration-note" data-ar="تمثيل توضيحي لطريقة عملنا" data-fr="Illustration de notre approche">تمثيل توضيحي لطريقة عملنا</span>\n  </div>','<span class="illustration-note" data-ar="مرّر لتشوف كيفاش تتشكّل الفكرة" data-fr="Faites défiler pour voir l’idée prendre forme">مرّر لتشوف كيفاش تتشكّل الفكرة</span>\n  </div></div>',1)
s=s.replace('<section id="services" class="services section-light">','<section id="services" class="services section-light"><div class="section-ribbon" aria-hidden="true"><img src="assets/ribbon.webp" width="1500" height="592" loading="lazy" alt=""></div>')
s=s.replace('<span class="micro">01 / WEB & E-COMMERCE</span>','<span class="micro service-tag">01 / WEB & E-COMMERCE</span>')
s=s.replace('<span class="micro">02 / CUSTOM SOFTWARE</span>','<span class="micro service-tag">02 / CUSTOM SOFTWARE</span>')
s=s.replace('<section id="work" class="work">','<section id="work" class="work"><div class="work-spark" aria-hidden="true">✳</div>')
s=s.replace('<section id="contact" class="contact">','<section id="contact" class="contact"><div class="contact-ribbon" aria-hidden="true"><img src="assets/ribbon.webp" width="1500" height="592" loading="lazy" alt=""></div>')
s=s.replace('<span class="eyebrow dark" data-ar="الخطوة الجاية تبدأ بحديث."','<span class="eyebrow dark contact-badge" data-ar="الخطوة الجاية تبدأ بحديث."')
s=s.replace('VISI'+'ON®','VISION')
p.write_text(s,encoding='utf-8')
