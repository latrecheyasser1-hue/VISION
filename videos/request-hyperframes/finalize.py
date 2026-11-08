from pathlib import Path
import json,subprocess,hashlib,zipfile
R=Path(__file__).resolve().parent
def run(a):return subprocess.run(a,capture_output=True,text=True,check=True)
video=R/'deliverables/04-VISION-Request-HyperFrames.mp4'
s=json.loads((R/'schedule.json').read_text(encoding='utf-8'))
run(['ffmpeg','-v','error','-threads','2','-i',str(video),'-f','null','-'])
probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(video)]).stdout)
v=next(x for x in probe['streams'] if x['codec_type']=='video');a=next(x for x in probe['streams'] if x['codec_type']=='audio')
assert (v['width'],v['height'],v['avg_frame_rate'])==(1080,1920,'30/1')
assert abs(float(probe['format']['duration'])-s['duration'])<.1
assert a['codec_name']=='aac' and a['channels']==2
caps=json.loads((R/'captions.json').read_text(encoding='utf-8'))
assert all(c['end']>c['start'] for c in caps)
assert all(x['end']<=y['start'] for x,y in zip(caps,caps[1:]))
def stamp(t):
 n=round(t*1000);return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02},{n%1000:03}'
(video.with_suffix('.srt')).write_text('\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}\n' for i,c in enumerate(caps)),encoding='utf-8-sig')
run(['ffmpeg','-y','-v','error','-threads','2','-i',str(R/'assets/sound/narration.wav'),'-c:a','aac','-b:a','192k',str(R/'deliverables/VOICE-Arabic-English.m4a')])
run(['ffmpeg','-y','-v','error','-ss','27.8','-i',str(video),'-frames:v','1','-q:v','2',str(video.with_suffix('.jpg'))])
from PIL import Image,ImageDraw
out=R/'qa/final-frames';out.mkdir(exist_ok=True);sheet=Image.new('RGB',(360*4,670*2),'#dce6ed')
for i,sc in enumerate(s['scenes']):
 t=sc['start']+sc['duration']*.7;target=out/f'{i:02}.png'
 run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(video),'-frames:v','1','-vf','scale=360:640',str(target)])
 x=(i%4)*360;y=(i//4)*670;sheet.paste(Image.open(target),(x,y+30));ImageDraw.Draw(sheet).text((x+10,y+8),f'{sc["id"]} @ {t:.2f}s',fill='black')
sheet.save(R/'qa/final-contact.png')
report={'file':str(video),'bytes':video.stat().st_size,'duration':float(probe['format']['duration']),'dimensions':[1080,1920],'fps':30,'audioCodec':a['codec_name'],'audioSampleRate':a['sample_rate'],'fullDecode':'passed','sha256':hashlib.sha256(video.read_bytes()).hexdigest(),'renderer':'official HyperFrames0.8.216;1worker;low-memory-mode','voice':s['voice'],'rate':s['rate'],'english':'Literal English text; no Arabic phonetic substitution','creativeApproval':'pending','listening':'Measured, not heard','captions':'burned in plus optionalSRT'}
(R/'qa/delivery.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
with zipfile.ZipFile(R/'deliverables/VISION-Request-HyperFrames.zip','w',compression=zipfile.ZIP_STORED) as z:
 for f in sorted((R/'deliverables').iterdir()):
  if f.suffix!='.zip':z.write(f,f.name)
 z.write(R/'SCRIPT.txt','SCRIPT.txt')
 z.write(R/'REVIEW.md','REVIEW.md')
print(json.dumps(report),flush=True)
