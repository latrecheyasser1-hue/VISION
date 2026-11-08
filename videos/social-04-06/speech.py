"""User-authorized Microsoft narration; only narration text is transmitted."""
from pathlib import Path
import asyncio,json,math,subprocess,sys
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'v3/runtime'))
import edge_tts
VOICE='ar-DZ-IsmaelNeural'
RATE='+22%'
SCRIPTS=json.loads((ROOT/'scripts.json').read_text(encoding='utf-8'))

async def main():
    for film in sys.argv[1:] or list(SCRIPTS):
        dest=ROOT/'audio/microsoft'/film;dest.mkdir(parents=True,exist_ok=True)
        records=[];start=0
        for i,scene in enumerate(SCRIPTS[film],1):
            out=dest/f'scene-{i:02}.mp3';metadata=dest/f'scene-{i:02}-words.json';source=dest/f'scene-{i:02}-source.json'
            fingerprint={'text':scene['text'],'voice':VOICE,'rate':RATE}
            cached=(out.is_file() and out.stat().st_size>0 and metadata.is_file() and source.is_file() and json.loads(source.read_text(encoding='utf-8'))==fingerprint)
            if not cached:
                speech=edge_tts.Communicate(scene['text'],VOICE,rate=RATE,boundary='WordBoundary')
                words=[];temporary=out.with_suffix('.part')
                with temporary.open('wb') as stream:
                    async for chunk in speech.stream():
                        if chunk['type']=='audio':stream.write(chunk['data'])
                        elif chunk['type']=='WordBoundary':words.append({'text':chunk['text'],'start':chunk['offset']/1e7,'duration':chunk['duration']/1e7})
                if not words or temporary.stat().st_size==0:raise ValueError(f'No usable narration: {film}/{i}')
                temporary.replace(out)
                metadata.write_text(json.dumps(words,ensure_ascii=False,indent=2),encoding='utf-8')
                source.write_text(json.dumps(fingerprint,ensure_ascii=False,indent=2),encoding='utf-8')
            probe=subprocess.run(['ffprobe','-v','error','-show_entries','format=duration','-of','json',str(out)],capture_output=True,text=True,check=True)
            duration=float(json.loads(probe.stdout)['format']['duration']);total=math.ceil((duration+.48)*30)/30
            records.append({'start':round(start,6),'duration':total,'voicePath':out.relative_to(ROOT).as_posix(),'voiceDuration':duration,'voiceOffset':.18,'text':scene['text'],'words':json.loads(metadata.read_text(encoding='utf-8'))})
            start+=total
            print(json.dumps({'film':film,'scene':i,'voice_duration':duration,'scene_duration':total}),flush=True)
        records.append({'start':round(start,6),'duration':1.2,'voicePath':None,'voiceDuration':0,'voiceOffset':0,'text':'','words':[]})
        result={'id':film,'voice':VOICE,'speechProvider':'Microsoft Edge online speech','rate':RATE,'pitch':'unmodified','duration':round(start+1.2,6),'scenes':records}
        (ROOT/f'{film}-schedule.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
        print(f'SCHEDULE {film} {start+1.2:.3f}',flush=True)
if __name__=='__main__':asyncio.run(main())
