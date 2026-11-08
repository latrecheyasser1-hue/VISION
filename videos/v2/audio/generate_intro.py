"""V2 brighter faster local narration. V1 is read only and preserved."""
from pathlib import Path
import sys, json, subprocess, argparse
BASE=Path(__file__).resolve().parent
V1=BASE.parents[1]/"audio"
sys.path.insert(0,str(V1/"runtime"))
import numpy as np
import soundfile as sf
from piper import PiperVoice,SynthesisConfig

parser=argparse.ArgumentParser()
parser.add_argument("--video",choices=["intro","ecommerce","systems"],default="intro")
args=parser.parse_args()
scenes=json.loads((V1/"scripts.json").read_text(encoding="utf-8"))[args.video]
voice=PiperVoice.load(V1/"models/ar_JO-kareem-medium.onnx")
voice.use_tashkeel=False
# Speech is regenerated at a brisk natural duration, not accelerated V1 audio.
config=SynthesisConfig(length_scale=.69,noise_scale=.58,noise_w_scale=.72,volume=.88)
sr=voice.config.sample_rate
out=BASE/args.video
out.mkdir(exist_ok=True)
manifest=json.loads((BASE/"manifest.json").read_text(encoding="utf-8")) if (BASE/"manifest.json").exists() else {"voice":"Kareem medium locally regenerated", "length_scale":.69,"pitch_semitones":.68,"post_tempo":1.055,"network_inference":False}
manifest[args.video]=[]
for i,s in enumerate(scenes,1):
    chunks=[]
    for chunk in voice.synthesize(s["spoken"],config):
        a=chunk.audio_float_array
        active=np.flatnonzero(np.abs(a)>.004)
        if active.size:
            a=a[max(0,active[0]-round(sr*.018)):min(len(a),active[-1]+round(sr*.035))]
        chunks += [a,np.zeros(round(sr*.045),dtype=np.float32)]
    a=np.concatenate(chunks)
    raw=out/f"scene-{i:02}-raw.wav"
    target=out/f"scene-{i:02}.wav"
    sf.write(raw,a,sr,subtype="PCM_24")
    filters="highpass=f=95,equalizer=f=240:t=q:w=0.8:g=-2.5,equalizer=f=2600:t=q:w=0.85:g=3.3,treble=g=1.5:f=5500,rubberband=tempo=1.055:pitch=1.04:formant=preserved,acompressor=threshold=0.11:ratio=2.2:attack=8:release=65:makeup=1.6,loudnorm=I=-16:TP=-2:LRA=7,aresample=48000"
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(raw),"-af",filters,"-ar","48000","-c:a","pcm_s24le",str(target)],check=True)
    a,sr2=sf.read(target,dtype="float32")
    duration=len(a)/sr2
    # Trim any post-filter padding and retain a tiny articulation tail.
    active=np.flatnonzero(np.abs(a)>.003)
    if active.size:
        a=a[max(0,active[0]-round(sr2*.012)):min(len(a),active[-1]+round(sr2*.05))]
        sf.write(target,a,sr2,subtype="PCM_24")
    duration=round(len(a)/sr2,4)
    entry={"scene":i,"path":str(target.relative_to(BASE)).replace("\\","/"),"duration":duration,"text":s["text"]}
    manifest[args.video].append(entry)
    print(f"{args.video} {i}: {duration}s",flush=True)
temp=BASE/"manifest.pending.json"
temp.write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding="utf-8")
temp.replace(BASE/"manifest.json")
