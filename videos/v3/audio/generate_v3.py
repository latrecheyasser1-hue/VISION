"""New, distinct local Arabic female voice; no Kareem or pitch modification.

Only public model files were downloaded. This script makes no network requests.
"""
from pathlib import Path
import argparse,sys,json,re,hashlib
BASE=Path(__file__).resolve().parent
V1=BASE.parents[1]/"audio"
sys.path.insert(0,str(V1/"runtime"))
import numpy as np
import soundfile as sf
from piper import PiperVoice,SynthesisConfig

p=argparse.ArgumentParser()
p.add_argument("--sample",action="store_true")
p.add_argument("--video",choices=["intro","ecommerce","systems","all"],default="intro")
p.add_argument("--length",type=float,default=.85)
args=p.parse_args()
source=json.loads((V1/"scripts.json").read_text(encoding="utf-8"))
model=BASE/"models/arabic-emirati-female-model.onnx"
voice=PiperVoice.load(model)
voice.use_tashkeel=False
cfg=SynthesisConfig(length_scale=args.length,noise_scale=.50,noise_w_scale=.65,volume=.88)
SR=voice.config.sample_rate
mf=BASE/("sample-manifest.json" if args.sample else "manifest.json")
manifest=json.loads(mf.read_text(encoding="utf-8")) if mf.exists() else {"model":"vadimbelsky/arabic-emirati-female-piper","model_url":"https://huggingface.co/vadimbelsky/arabic-emirati-female-piper","declared_license":"MIT","speaker":"Arabic Emirati female (entirely different speaker/model)","native_length_scale":args.length,"pitch_modified":False,"external_inference":False,"model_sha256":hashlib.sha256(model.read_bytes()).hexdigest(),"videos":{}}

def phrases(text):
    return [x.strip() for x in re.findall(r"[^،,:.؟!?]+[،,:.؟!?]*",text) if x.strip()]

for video,scenes in source.items():
    if args.video!="all" and video!=args.video:continue
    out=BASE/video
    out.mkdir(exist_ok=True)
    records=[]
    for i,scene in enumerate(scenes,1):
        if args.sample and i!=1:break
        spoken_phrases=phrases(scene["spoken"])
        caption_phrases=phrases(scene["text"])
        tracks=[];times=[];elapsed=0
        for j,spoken in enumerate(spoken_phrases,1):
            chunks=[]
            for chunk in voice.synthesize(spoken,cfg):
                a=chunk.audio_float_array
                active=np.flatnonzero(np.abs(a)>.004)
                if active.size:a=a[max(0,active[0]-round(SR*.025)):min(len(a),active[-1]+round(SR*.045))]
                chunks.append(a)
            a=np.concatenate(chunks)
            # A tiny zero-crossfade edge suppresses edit ticks, preserving speech.
            n=min(round(SR*.003),len(a)//10)
            a[:n]*=np.linspace(0,1,n)
            a[-n:]*=np.linspace(1,0,n)
            raw=out/f"scene-{i:02}-phrase-{j:02}.wav"
            sf.write(raw,a,SR,subtype="PCM_24")
            dur=len(a)/SR
            text=caption_phrases[j-1] if j<=len(caption_phrases) else spoken
            times.append({"phrase":j,"start":round(elapsed,6),"duration":round(dur,6),"text":text,"spoken":spoken,"path":str(raw.relative_to(BASE)).replace("\\","/")})
            tracks.append(a);elapsed+=dur
            if j<len(spoken_phrases):
                gap=.075 if spoken[-1:] in "،,:" else .11
                tracks.append(np.zeros(round(SR*gap),dtype=np.float32));elapsed+=gap
        a=np.concatenate(tracks)
        full=out/(f"sample-scene-{i:02}.wav" if args.sample else f"scene-{i:02}.wav")
        sf.write(full,a,SR,subtype="PCM_24")
        duration=len(a)/SR
        count=len(scene["text"].split())
        records.append({"scene":i,"duration":round(duration,6),"words":count,"wpm":round(count/duration*60,1),"path":str(full.relative_to(BASE)).replace("\\","/"),"text":scene["text"],"phrases":times})
        print(f"{video} scene {i}: {duration:.3f}s, {count/duration*60:.1f}wpm, {len(times)}phrases",flush=True)
    manifest["videos"][video]=records
    pending=mf.with_suffix(".pending.json")
    pending.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
    pending.replace(mf)
