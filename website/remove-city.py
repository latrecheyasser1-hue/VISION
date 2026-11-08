from pathlib import Path
import re, shutil

root=Path(__file__).resolve().parent
app=root/'public/app.js'
text=app.read_text(encoding='utf-8')
text=re.sub(r"^ \{id:'city'.*\n",'',text,flags=re.M)
text=text.replace("['pyjama','clinic','city','asel','hk']","['pyjama','clinic','asel','hk']")
text=text.replace("${p.id==='aqsa'?(lang==='ar'?'برنامج مكتبي · بيع ومخزون وحسابات':'Logiciel desktop · Ventes, stock et comptes'):(lang==='ar'?'طلبات المطعم · المخزون · التوصيل':'Commandes · Stock · Livraison')}","${lang==='ar'?'برنامج مكتبي · بيع ومخزون وحسابات':'Logiciel desktop · Ventes, stock et comptes'}")
app.write_text(text,encoding='utf-8')
css=root/'public/style-v2.css'
css.write_text(re.sub(r'\.project-visual\[data-art=city\]\{[^}]*\}','',css.read_text(encoding='utf-8')),encoding='utf-8')
export=root/'export-repository.py'
text=export.read_text(encoding='utf-8').replace("['pyjama','clinic','city','asel','hk']","['pyjama','clinic','asel','hk']")
text=text.replace('Pyjama DZ, ClinicFlow DZ, La City, Asel Butik and HK STORE are captured from their public homepages. La City loaded after a long initial delay.', 'Pyjama DZ, ClinicFlow DZ, Asel Butik and HK STORE are captured from their public homepages. La City was excluded at the owner’s explicit request.')
export.write_text(text,encoding='utf-8')
# Keep an offline recoverable copy; exclude the image from public and upload roots.
archive=root/'archive-v1/removed-projects'
archive.mkdir(parents=True,exist_ok=True)
for source,name in [(root/'public/assets/projects/city.jpg','city-public.jpg'),(root/'repository/city.jpg','city-export.jpg')]:
    assert source.resolve().is_relative_to(root) and archive.resolve().is_relative_to(root)
    if source.exists(): shutil.move(str(source),str(archive/name))
