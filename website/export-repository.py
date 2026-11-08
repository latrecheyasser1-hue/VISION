"""Create a reviewable, buildless repository root for browser upload.
Only an explicit allowlist of public files is included. No workspace history,
old renders, credentials, or client data is exported.
"""
from pathlib import Path
import shutil,re,json
root=Path(__file__).parent
public=root/'public'
out=root/'repository'
out.mkdir(exist_ok=True)
for name in ['index.html','style-v2.css','app.js','explore.css','explore.js']:
    text=(public/name).read_text(encoding='utf-8')
    for prefix in ['assets/fonts/','assets/videos/','assets/vendor/','assets/projects/','assets/']:
        text=text.replace(prefix,'')
    (out/name).write_text(text,encoding='utf-8')
assets=['assets/eye.svg','assets/ribbon.webp','assets/vendor/gsap.min.js',
        'assets/fonts/Anton.ttf','assets/fonts/Anton-OFL.txt','assets/fonts/Changa-Regular.ttf',
        'assets/fonts/Changa-ExtraBold.ttf','assets/fonts/Changa-OFL.txt']
assets.extend(f'assets/projects/{name}.jpg' for name in ['pyjama','clinic','asel','hk'])
for stem in ['01-VISION-brand','02-VISION-commerce','03-VISION-systems']:
    assets.extend(f'assets/videos/{stem}.{ext}' for ext in ['mp4','jpg','vtt'])
for asset in assets:
    shutil.copy2(public/asset,out/Path(asset).name)
server=(root/'server.mjs').read_text(encoding='utf-8').replace("new URL('./public/', import.meta.url)","new URL('./', import.meta.url)")
(out/'server.mjs').write_text(server,encoding='utf-8')
(out/'package.json').write_text(json.dumps({'name':'vision-public-website','version':'0.2.0','private':True,'scripts':{'dev':'node server.mjs','check':'node --check app.js && node --check explore.js && node --check server.mjs'}},indent=2)+'\n',encoding='utf-8')
(out/'README.md').write_text('''# VISION

Bright, mobile-first Arabic/French public website. This repository is a buildless static root: `index.html`, `style-v2.css`, `app.js`, and self-hosted assets live together. No dependency installation or database is required.

## Preview
Run `npm run dev`, then open http://127.0.0.1:4190. Run `npm run check` for JavaScript syntax verification. `server.mjs` is a local preview server, not a production backend.

## Scope
Public services, portfolio, project stories, problem discovery, a local fictional order/stock demo, handover details, founder introduction, process, FAQ, approved motion films and WhatsApp contact. The contact form prepares a message for +213771335039; visitors explicitly send it in WhatsApp. No data is stored and no email is shown.

Administration, authentication and private client project tracking are reserved for phase two and are not implemented.

## Design and assets
The owner supplied the Slush reference and requested light pastel colors, no dark/navy surfaces, sculptural typography and strong scroll motion. The latest direction removes all decorative starbursts and hero stickers, replacing them with construction guides, a solid/outline wordmark and a brand-eye connection path. See DESIGN-REVISION.md. Anton and Changa are distributed with their OFL licenses. Ribbon artwork was generated for VISION; the final approved V3 films are preserved. On 2026-10-24 the owner explicitly requested real public homepage screenshots for the portfolio. Pyjama DZ, ClinicFlow DZ, Asel Butik and HK STORE are captured from their public homepages. La City was excluded at the owner’s explicit request. Al Aqsa is an offline desktop application and retains an explanatory card. No private client records or authenticated screens are included.

## Performance
The 3D ribbon is a transparent 117KB WebP rather than a live 3D renderer. Fonts and GSAP are self-hosted. All three films are inline: sources load on entering the viewport, playback starts muted and pauses offscreen or when the page is hidden. Visitors can pause or enable narration from the beginning. Reduced-motion mode disables autoplay and animated choreography. The scroll story changes four cards through activity questions, planning decisions and assembled modules; scrolling backward reverses it. Homepage screenshots use native lazy loading. Scroll timelines update via one scheduled animation frame per scroll batch; the three-chapter story uses native sticky positioning on desktop and phone, with a static reading sequence for reduced motion and short landscape windows.

This is the current design preview. Hosting and a production domain have not been configured.
''',encoding='utf-8')
shutil.copy2(root/'DESIGN-REVISION.md',out/'DESIGN-REVISION.md')
# Remove local filesystem locations from the repository-facing design analysis.
design=(out/'DESIGN-REVISION.md').read_text(encoding='utf-8')
design=design.replace('C:/Users/Computs/Downloads/DESIGN.md','the owner-supplied DESIGN.md').replace('public/assets/ribbon.webp','ribbon.webp')
(out/'DESIGN-REVISION.md').write_text(design,encoding='utf-8')
manifest=[str(p.resolve()) for p in sorted(out.iterdir()) if p.is_file()]
(root/'repository-upload.json').write_text(json.dumps(manifest),encoding='utf-8')
print(json.dumps({'files':len(manifest),'bytes':sum(Path(p).stat().st_size for p in manifest),'directory':str(out.resolve())}))
