from pathlib import Path
import json,subprocess,sys,hashlib,zipfile
ROOT=Path(__file__).resolve().parent
NAMES={'request':'04-VISION-Request-ENERGY','profit':'05-VISION-Profit-ENERGY','undo':'06-VISION-Undo-ENERGY'}
def run(args):return subprocess.run(args,capture_output=True,text=True,check=True)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02}:{ms//60000%60:02}:{ms//1000%60:02},{ms%1000:03}'
outdir=ROOT/'deliverables';outdir.mkdir(exist_ok=True)
for film in sys.argv[1:] or NAMES:
 s=json.loads((ROOT/f'{film}-schedule.json').read_text(encoding='utf-8'));name=NAMES[film];out=outdir/f'{name}.mp4'
 run(['ffmpeg','-y','-v','error','-threads','2','-i',str(ROOT/'renders'/f'{film}-silent.mp4'),'-i',str(ROOT/'audio/mixes'/film/'mix.wav'),'-map','0:v:0','-map','1:a:0','-c:v','copy','-c:a','aac','-b:a','192k','-ar','48000','-ac','2','-t',str(s['duration']),'-movflags','+faststart',str(out)])
 run(['ffmpeg','-v','error','-threads','2','-i',str(out),'-f','null','-'])
 probe=json.loads(run(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(out)]).stdout)
 video=next(x for x in probe['streams'] if x['codec_type']=='video');audio=next(x for x in probe['streams'] if x['codec_type']=='audio')
 assert (video['width'],video['height'],video['avg_frame_rate'])==(1080,1920,'30/1')
 assert audio['channels']==2 and audio['sample_rate']=='48000'
 assert abs(float(probe['format']['duration'])-s['duration'])<.075
 poster_time={'request':3,'profit':s['scenes'][2]['start']+4,'undo':s['scenes'][2]['start']+2}[film]
 run(['ffmpeg','-y','-v','error','-ss',str(poster_time),'-i',str(out),'-frames:v','1','-q:v','2',str(outdir/f'{name}.jpg')])
 caps=json.loads((ROOT/f'{film}-captions.json').read_text(encoding='utf-8'))
 (outdir/f'{name}.ar.srt').write_text('\n'.join(f'{i+1}\n{stamp(c["start"])} --> {stamp(c["end"])}\n{c["text"]}\n' for i,c in enumerate(caps)),encoding='utf-8-sig')
 # Sample actual final-encode frames for contact-sheet review; do not certify aesthetics from this test.
 (ROOT/'qa'/f'{film}-final').mkdir(exist_ok=True)
 for i,sc in enumerate(s['scenes']):
  t=sc['start']+sc['duration']*.65
  run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(out),'-frames:v','1','-vf','scale=270:480',str(ROOT/'qa'/f'{film}-final'/f'{i:02}.png')])
 report={'file':str(out),'duration':float(probe['format']['duration']),'bytes':out.stat().st_size,'dimensions':[1080,1920],'fps':30,'audio':'AAC stereo 48 kHz','fullDecode':'passed','captions':'burned in plus SRT','voice':s['voice'],'rate':s['rate'],'postTempo':1,'renderer':'local CSS/SVG/GSAP; no Blender, WebGL or Higgsfield','htmlSha256':hashlib.sha256((ROOT/f'{film}.html').read_bytes()).hexdigest(),'videoSha256':hashlib.sha256(out.read_bytes()).hexdigest()}
 (ROOT/'qa'/f'{film}-delivery.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
