"""Authorized Microsoft narration; image/motion production remains local."""
from pathlib import Path
import asyncio,json,math,subprocess,sys,re
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'v3/runtime'))
import edge_tts
SETTINGS={'request':('ar-SA-HamedNeural','+6%',.40),'profit':('ar-SA-ZariyahNeural','+0%',.65),'undo':('ar-EG-ShakirNeural','-2%',.50)}
async def main():
 for film in sys.argv[1:] or SETTINGS:
  voice,rate,gap=SETTINGS[film]
  copy=json.loads((ROOT.parent/'social-04-06-v2'/film/'exact-copy.json').read_text(encoding='utf-8'))
  dest=ROOT/'audio'/film;dest.mkdir(parents=True,exist_ok=True)
  scenes=[];start=0
  for i,text in enumerate(copy['narration']):
   spoken=re.sub('[\u064b-\u065f\u0670]','',text) if film=='undo' else text
   path=dest/f'{i+1:02}.mp3';meta=path.with_suffix('.json');fingerprint={'text':spoken,'voice':voice,'rate':rate}
   if not (path.exists() and meta.exists() and json.loads(meta.read_text(encoding='utf-8'))['source']==fingerprint):
    words=[];temp=path.with_suffix('.part')
    with temp.open('wb') as f:
     async for chunk in edge_tts.Communicate(spoken,voice,rate=rate,boundary='WordBoundary').stream():
      if chunk['type']=='audio':f.write(chunk['data'])
      elif chunk['type']=='WordBoundary':words.append({'text':chunk['text'],'start':chunk['offset']/1e7,'duration':chunk['duration']/1e7})
    if not words or not temp.stat().st_size:raise RuntimeError('No usable speech returned')
    temp.replace(path);meta.write_text(json.dumps({'source':fingerprint,'words':words},ensure_ascii=False),encoding='utf-8')
   words=json.loads(meta.read_text(encoding='utf-8'))['words']
   # Trim only provider's surrounding silence. Preserve expressive internal pauses.
   trim=max(0,words[0]['start']-.035);end=words[-1]['start']+words[-1]['duration']+.12
   wav=path.with_suffix('.wav')
   subprocess.run(['ffmpeg','-y','-v','error','-ss',str(trim),'-i',str(path),'-t',str(end-trim),'-af','highpass=f=70','-ar','48000','-ac','1','-c:a','pcm_s24le',str(wav)],check=True)
   for w in words:w['start']-=trim
   duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]))
   shot=math.ceil((duration+gap+.3)*30)/30
   scenes.append({'start':round(start,6),'duration':shot,'text':text,'voicePath':wav.relative_to(ROOT).as_posix(),'voiceDuration':duration,'voiceOffset':.3,'words':words})
   start+=shot
   print(f'{film} {i+1}: {duration:.2f}s speech',flush=True)
  scenes[-1]['duration']+=1.2;start+=1.2
  schedule={'id':film,'voice':voice,'rate':rate,'postTempo':1,'speechProvider':'Microsoft Edge speech (online, narration text only)','duration':round(start,6),'scenes':scenes}
  (ROOT/f'{film}-schedule.json').write_text(json.dumps(schedule,ensure_ascii=False,indent=2),encoding='utf-8')
  print(f'READY {film}: {start:.2f}s',flush=True)
asyncio.run(main())
