"""Trim excessive TTS pauses and retain the approved V3 tempo without pitch shift."""
from pathlib import Path
import json,subprocess,sys,math
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'audio/runtime'))
import numpy as np
import soundfile as sf
SR=48000;TEMPO=1.12
def read(path):
    result=subprocess.run(['ffmpeg','-v','error','-i',str(path),'-f','f32le','-ar',str(SR),'-ac','1','pipe:1'],capture_output=True,check=True)
    return np.frombuffer(result.stdout,dtype='<f4').copy()
for film in sys.argv[1:] or ['request','profit','undo']:
    path=ROOT/f'{film}-schedule.json';schedule=json.loads(path.read_text(encoding='utf-8'));start=0
    for i,scene in enumerate(schedule['scenes'],1):
        if not scene['text']:
            scene.update(start=round(start,6),duration=1.2,voicePath=None,voiceDuration=0,voiceOffset=0,words=[]);start+=1.2;continue
        raw=ROOT/'audio/microsoft'/film/f'scene-{i:02}.mp3'
        words=json.loads(raw.with_name(f'scene-{i:02}-words.json').read_text(encoding='utf-8'));audio=read(raw);cuts=[]
        if words[0]['start']>.04:cuts.append((0,words[0]['start']-.04))
        for left,right in zip(words,words[1:]):
            end=left['start']+left['duration']
            if right['start']-end>.32:cuts.append((end+.09,right['start']-.09))
        last=words[-1]['start']+words[-1]['duration']+.09
        if last<len(audio)/SR:cuts.append((last,len(audio)/SR))
        chunks=[];previous=0
        for left,right in cuts:chunks.append(audio[round(previous*SR):round(left*SR)]);previous=right
        chunks.append(audio[round(previous*SR):]);joined=np.concatenate(chunks)
        for word in words:
            removed=sum(max(0,min(word['start'],right)-left) for left,right in cuts if word['start']>left)
            word['start']=(word['start']-removed)/TEMPO;word['duration']/=TEMPO
        temporary=raw.with_name(f'scene-{i:02}-trimmed.wav');out=raw.with_suffix('.wav');sf.write(temporary,joined,SR,subtype='PCM_24')
        subprocess.run(['ffmpeg','-y','-v','error','-i',str(temporary),'-af',f'atempo={TEMPO},highpass=f=85,afade=t=in:d=0.005','-c:a','pcm_s24le',str(out)],check=True)
        voice_duration=sf.info(out).duration;duration=math.ceil((voice_duration+.44)*30)/30
        scene.update(start=round(start,6),duration=duration,voicePath=out.relative_to(ROOT).as_posix(),voiceDuration=voice_duration,words=words);start+=duration
    schedule.update(duration=round(start,6),postTempo=TEMPO,pauseMax=.18)
    path.write_text(json.dumps(schedule,ensure_ascii=False,indent=2),encoding='utf-8')
    print(film,round(start,3),'seconds',flush=True)
