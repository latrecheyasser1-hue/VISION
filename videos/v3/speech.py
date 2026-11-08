"""User-authorized Microsoft narration. Only approved film text is transmitted."""
from pathlib import Path
import asyncio,json,subprocess,sys,math
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT/'runtime'))
import edge_tts
VOICE='ar-DZ-IsmaelNeural'
RATE='+22%'
SCRIPTS=json.loads((ROOT.parent/'v2/audio/manifest.json').read_text(encoding='utf-8'))
async def main():
    requested=sys.argv[1:] or ['intro','commerce','systems']
    for film in requested:
        key='ecommerce' if film=='commerce' else film
        dest=ROOT/'audio/microsoft'/film;dest.mkdir(parents=True,exist_ok=True)
        records=[];start=0
        for i,scene in enumerate(SCRIPTS[key],1):
            out=dest/f'scene-{i:02}.mp3';metadata=dest/f'scene-{i:02}-words.json'
            if not out.exists() or not metadata.exists():
                speech=edge_tts.Communicate(scene['text'],VOICE,rate=RATE,boundary='WordBoundary')
                words=[]
                with out.open('wb') as f:
                    async for chunk in speech.stream():
                        if chunk['type']=='audio':f.write(chunk['data'])
                        elif chunk['type']=='WordBoundary':words.append({'text':chunk['text'],'start':chunk['offset']/1e7,'duration':chunk['duration']/1e7})
                metadata.write_text(json.dumps(words,ensure_ascii=False,indent=2),encoding='utf-8')
            p=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(out)],capture_output=True,text=True,check=True)
            duration=float(json.loads(p.stdout)['format']['duration'])
            total=math.ceil((duration+.48)*30)/30
            # Enough landing time for the user-corrected short custom-software phrase.
            if film=='intro' and i==3:total=max(total,4.0)
            records.append({'start':round(start,6),'duration':total,'voicePath':out.relative_to(ROOT).as_posix(),'voiceDuration':duration,'voiceOffset':.18,'text':scene['text'],'words':json.loads(metadata.read_text(encoding='utf-8'))})
            start+=total
            print(json.dumps({'film':film,'scene':i,'voice_duration':duration,'scene_duration':total}),flush=True)
        result={'id':film,'voice':VOICE,'speechProvider':'Microsoft Edge online speech','rate':RATE,'pitch':'unmodified','duration':round(start,6),'scenes':records}
        (ROOT/f'{film}-schedule.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        print('SCHEDULE '+film+' '+str(start),flush=True)
asyncio.run(main())
