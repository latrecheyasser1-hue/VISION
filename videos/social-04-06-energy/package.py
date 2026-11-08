from pathlib import Path
import json,zipfile
R=Path(__file__).resolve().parent
reports=[json.loads((R/'qa'/f'{i}-delivery.json').read_text()) for i in ['request','profit','undo']]
for r in reports:
 assert Path(r['file']).is_file() and r['fullDecode']=='passed'
readme='''VISION — ENERGY / النسخ السريعة الجديدة

04: Request / Frontend / API / Backend / Database — 25.82 ثانية
05: Dashboard / Revenue / Profit / Query — 26.55 ثانية
06: Undo / Transaction / Rollback / Audit Log — 24.38 ثانية

1080×1920، عمودي، 30fps. تعليق فصيح سريع، ثلاثة رواة، موسيقى ومؤثرات.
تمت إعادة كتابة النصوص وبناء الحركة. ليست النسخ البطيئة السابقة مسرّعة.
الكابتشن مدمج داخل MP4؛ ملف SRT اختياري، لا تضفه مرة ثانية فوقه.
البيانات أمثلة توضيحية. لا معلومات عملاء، لا نشر تلقائي.
'''
(R/'deliverables'/'اقرأني.txt').write_text(readme,encoding='utf-8-sig')
archive=R/'VISION-ENERGY-04-06.zip'
with zipfile.ZipFile(archive,'w',compression=zipfile.ZIP_STORED) as z:
 for p in sorted((R/'deliverables').iterdir()):z.write(p,p.name)
status={'status':'rendered-and-decoded','creativeApproval':'pending','route':'local CSS/SVG/GSAP/FFmpeg; Microsoft narration only','archive':str(archive),'archiveBytes':archive.stat().st_size,'films':reports}
(R/'production-status.json').write_text(json.dumps(status,indent=2,ensure_ascii=False),encoding='utf-8');print(json.dumps({'archive':str(archive),'bytes':archive.stat().st_size,'complete':3}),flush=True)
