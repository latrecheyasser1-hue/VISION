"""One-time owner-requested removal of sticker/star decoration."""
from pathlib import Path
import re

root = Path(__file__).parent
public = root / 'public'
html = (public / 'index.html').read_text(encoding='utf-8')
start = html.index('  <div class="hero-poster">')
end = html.index('  <div class="hero-copy">', start)
html = html[:start] + '''  <div class="hero-poster">
    <div class="poster-heading" aria-hidden="true"><span>VISION — DIGITAL DEVELOPMENT</span><span>ALGERIA / DZ</span></div>
    <div class="hero-construction" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <img class="hero-ribbon ribbon-back" src="assets/ribbon.webp" width="1500" height="592" fetchpriority="high" alt="" aria-hidden="true">
    <div class="wordmark-stage" aria-hidden="true">
      <div class="hero-word hero-outline"><span>V</span><span>I</span><span>S</span><span>I</span><span>O</span><span>N</span></div>
      <div class="hero-word hero-solid"><span>V</span><span>I</span><span>S</span><span>I</span><span>O</span><span>N</span></div>
    </div>
    <div class="hero-system" aria-hidden="true">
      <span class="system-origin" data-ar="فكرتك" data-fr="Votre idée">فكرتك</span>
      <svg class="system-flow" viewBox="0 0 1000 100" preserveAspectRatio="xMidYMid meet">
        <g class="flow-track"><path d="M0 50H355Q390 50 415 25H455M0 50H355Q390 50 415 75H455M545 25H585Q610 50 645 50H1000M545 75H585Q610 50 645 50H1000"/></g>
        <g class="flow-signal"><path pathLength="1" d="M0 50H355Q390 50 415 25H455M545 25H585Q610 50 645 50H1000"/></g>
        <svg x="460" y="25" width="80" height="50" viewBox="0 0 200 126"><use href="#eye-mark"/></svg>
        <g class="flow-nodes"><circle cx="4" cy="50" r="4"/><circle cx="996" cy="50" r="4"/></g>
      </svg>
      <span class="system-destination" data-ar="نظام يخدمك" data-fr="Votre solution">نظام يخدمك</span>
    </div>
  </div>
''' + html[end:]
html = re.sub(r'<(?:span|div) class="(?:chapter-spark|launch-spark|work-spark)"[^>]*>✳</(?:span|div)>', '', html)
html = html.replace('<span class="plan-cross">✳</span>', '<svg class="plan-diagram" viewBox="0 0 56 42"><rect x="20" y="2" width="16" height="10" rx="2"/><path d="M28 12V22M10 30V22H46V30"/><rect x="2" y="30" width="16" height="10" rx="2"/><rect x="38" y="30" width="16" height="10" rx="2"/></svg>')
html = html.replace('<span>✳</span>', '<span class="marquee-divider"></span>')
assert '✳' not in html and 'sticker' not in html
(public / 'index.html').write_text(html, encoding='utf-8')

js = (public / 'app.js').read_text(encoding='utf-8')
js = js.replace("gsap.from('.hero-word span',{y:mobile?45:100,rotation:8,opacity:0,duration:.85,stagger:.055,ease:'power3.out',clearProps:'all'});", "gsap.from('.hero-solid',{clipPath:'inset(0 100% 0 0)',duration:1.1,ease:'power3.inOut',clearProps:'clipPath'});\n   gsap.from('.hero-system',{y:12,opacity:0,duration:.55,delay:.45,clearProps:'all'});")
start = js.index('  const heroTimeline=')
end = js.index("  scrollTimelines.push({element:$('.hero')", start)
js = js[:start] + '''  // A construction drawing emerges as the wordmark leaves the viewport.
  const heroTimeline=gsap.timeline({paused:true})
   .to('.hero-ribbon',{y:mobile?30:80,rotation:-3,scale:1.05,duration:1,ease:'none'},0)
   .to('.hero-solid',{clipPath:'inset(0 0 0 100%)',duration:1,ease:'none'},0)
   .to('.hero-construction',{opacity:1,duration:1,ease:'none'},0)
   .fromTo('.flow-signal path',{strokeDashoffset:1},{strokeDashoffset:0,duration:.7,ease:'none'},0)
   .to('.flow-nodes',{fill:'#00bceb',duration:.3,ease:'none'},.7);
''' + js[end:]
js = js.replace("'.built-status,.launch-spark'", "'.built-status'")
js = re.sub(r"^.*fromTo\('\.chapter-spark'.*\n", '', js, flags=re.M)
js = re.sub(r"^.*const workTimeline=.*\n.*scrollTimelines.push\(\{element:\$\('\.work'\).*\n", '', js, flags=re.M)
(public / 'app.js').write_text(js, encoding='utf-8')

css = (public / 'style-v2.css').read_text(encoding='utf-8')
# Remove retired selector rules in every media query, without changing their wrappers.
retired = re.compile(r'\.(?:sticker(?:-[\w-]+)?|story-spark|chapter-spark|launch-spark|work-spark|plan-cross|poster-coordinate)(?![\w-])')
def clean_rule(m):
    selectors, body = m.groups()
    keep = [s for s in selectors.split(',') if not retired.search(s)]
    if '✳' in body:
        return '.project-visual:before{content:none}'
    return ','.join(keep) + '{' + body + '}' if keep else ''
css = re.sub(r'([^{}]+)\{([^{}]*)\}', clean_rule, css)
(public / 'style-v2.css').write_text(css, encoding='utf-8')
print('Removed decorative stars and hero stickers; installed construction wordmark and brand flow.')
