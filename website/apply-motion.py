from pathlib import Path
root=Path(__file__).parent
p=root/'public/app.js'
s=p.read_text(encoding='utf-8')
s=s.split('// Motion is progressive enhancement.')[0]
s=s.replace("رسم توضيحي للمجال · بدون بيانات عملاء","تصوّر توضيحي").replace("Illustration du domaine · Sans données clients","Illustration du domaine")
s=s.replace("if(updateURL){const url=", "window.dispatchEvent(new Event('vision:layout'));\n if(updateURL){const url=")
s+= '\n'+(root/'motion-v2.js').read_text(encoding='utf-8')
p.write_text(s,encoding='utf-8')
