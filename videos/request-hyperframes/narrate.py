from pathlib import Path
import sys,asyncio,json,subprocess,math
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent/'v3/runtime'))
import edge_tts
VOICE='en-US-AndrewMultilingualNeural';RATE='+25%'
SCRIPT=[
'ضغطة واحدة على تأكيد الطلب. ماذا يحدث خلف الشاشة؟',
'تجمع الواجهة البيانات: رقم المنتج، والكمية المطلوبة. هذه البيانات تسمى Payload.',
'يرسل Frontend طلب HTTP Request عبر API إلى Backend.',
'هنا تبدأ Validation: بيانات صحيحة، سعر محسوب في الخادم، ومخزون متوفر.',
'بعد التحقق، يحفظ الطلب في Database. الآن أصبح له رقم يمكن تتبعه.',
'ثم يعود Response إلى الواجهة: 201 Created. تم إنشاء الطلب.',
'Frontend، Backend، Database. ضغطة واحدة، ورحلة كاملة من البيانات.'
]
async def main():
 dest=R/'assets/voice';dest.mkdir(parents=True,exist_ok=True)
 scenes=[];start=0
 for i,text in enumerate(SCRIPT):
  p=dest/f'{i:02}.mp3';meta=p.with_suffix('.json');source={'text':text,'voice':VOICE,'rate':RATE}
  if not(p.exists() and meta.exists() and json.loads(meta.read_text(encoding='utf-8'))['source']==source):
   words=[];tmp=p.with_suffix('.part')
   with tmp.open('wb') as f:
    async for c in edge_tts.Communicate(text,VOICE,rate=RATE,boundary='WordBoundary').stream():
     if c['type']=='audio':f.write(c['data'])
     elif c['type']=='WordBoundary':words.append({'text':c['text'],'start':c['offset']/1e7,'duration':c['duration']/1e7})
   if not words or not tmp.stat().st_size:raise RuntimeError('Speech missing')
   tmp.replace(p);meta.write_text(json.dumps({'source':source,'words':words},ensure_ascii=False),encoding='utf-8')
  words=json.loads(meta.read_text(encoding='utf-8'))['words'];trim=max(0,words[0]['start']-.04);end=words[-1]['start']+words[-1]['duration']+.10
  wav=p.with_suffix('.wav')
  subprocess.run(['ffmpeg','-y','-v','error','-threads','2','-ss',str(trim),'-i',str(p),'-t',str(end-trim),'-af','highpass=f=65','-ar','48000','-ac','1','-c:a','pcm_s24le',str(wav)],check=True)
  duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(wav)]))
  for w in words:w['start']-=trim
  slot=math.ceil((duration+.14)*30)/30
  scenes.append({'id':['click','payload','request','validation','database','response','complete'][i],'start':round(start,6),'duration':slot,'voiceOffset':.08,'voiceDuration':duration,'voicePath':wav.relative_to(R).as_posix(),'words':words,'text':text});start+=slot
  print(f'Scene{i+1}: {duration:.2f}s',flush=True)
 scenes[-1]['duration']+=.65;start+=.65
 (R/'schedule.json').write_text(json.dumps({'duration':round(start,6),'voice':VOICE,'rate':RATE,'scenes':scenes},ensure_ascii=False,indent=2),encoding='utf-8')
 (R/'SCRIPT.txt').write_text('\n\n'.join(SCRIPT),encoding='utf-8')
 print(f'Complete {start:.2f}s',flush=True)
asyncio.run(main())
