"""Tight spoken pacing from delivered word timing, preserving every spoken word."""
from pathlib import Path
import json,subprocess,sys,math
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'audio/runtime'))
import numpy as np
import soundfile as sf
SR=48000;TEMPO=1.12
def read(path):
 r=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','1','pipe:1'],capture_output=True,check=True)
 return np.frombuffer(r.stdout,dtype='<f4').copy()
for film in sys.argv[1:] or ['intro','commerce','systems']:
 p=ROOT/f'{film}-schedule.json';sch=json.loads(p.read_text(encoding='utf-8'));start=0
 for i,s in enumerate(sch['scenes'],1):
  raw=ROOT/'audio/microsoft'/film/f'scene-{i:02}.mp3';words=json.loads(raw.with_name(f'scene-{i:02}-words.json').read_text(encoding='utf-8'));a=read(raw)
  cuts=[]
  if words[0]['start']>.04:cuts.append((0,words[0]['start']-.04))
  for x,y in zip(words,words[1:]):
   end=x['start']+x['duration'];gap=y['start']-end
   if gap>.32:cuts.append((end+.09,y['start']-.09))
  last=words[-1]['start']+words[-1]['duration']+.09
  if last<len(a)/SR:cuts.append((last,len(a)/SR))
  chunks=[];prev=0
  for left,right in cuts:
   chunks.append(a[round(prev*SR):round(left*SR)]);prev=right
  chunks.append(a[round(prev*SR):]);joined=np.concatenate(chunks)
  for x in words:
   x['start']=(x['start']-sum(max(0,min(x['start'],r)-l) for l,r in cuts if x['start']>l))/TEMPO
   x['duration']/=TEMPO
  temp=raw.with_name(f'scene-{i:02}-trimmed.wav');out=raw.with_suffix('.wav');sf.write(temp,joined,SR,subtype='PCM_24')
  subprocess.run(['ffmpeg','-y','-v','error','-i',str(temp),'-af',f'atempo={TEMPO},highpass=f=85,afade=t=in:d=0.005','-c:a','pcm_s24le',str(out)],check=True)
  info=sf.info(out);vd=info.duration;d=math.ceil((vd+.44)*30)/30
  if film=='intro' and i==3:d=max(d,3.5)
  s.update(start=round(start,6),duration=d,voicePath=out.relative_to(ROOT).as_posix(),voiceDuration=vd,words=words)
  start+=d
 sch.update(duration=round(start,6),postTempo=TEMPO,pauseMax=.18)
 p.write_text(json.dumps(sch,ensure_ascii=False,indent=2),encoding='utf-8')
 print(film,round(start,2),'seconds',flush=True)
