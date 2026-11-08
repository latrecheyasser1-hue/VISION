"""Original deterministic VISION sound design + local narration mixing.

Usage: python videos/audio/build_mix.py --schedule videos/audio/schedule.json

Schedule schema: {"intro":[{"start":0,"duration":14},...], ...}.
The approved narration begins 0.75 s after each scene begins.
No remote music, samples, audio processing, or speech service is used.
"""
from pathlib import Path
import argparse
import json
import math
import subprocess
import sys
import wave

BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE/"runtime"))
import numpy as np
import soundfile as sf

SR = 48000
parser = argparse.ArgumentParser()
parser.add_argument("--schedule", type=Path, default=BASE/"schedule.json")
parser.add_argument("--video", choices=["intro","ecommerce","systems"])
args = parser.parse_args()
manifest = json.loads((BASE/"manifest.json").read_text(encoding="utf-8"))
mins = {"intro":[14,14,8,14,11],"ecommerce":[10,12,10,13,13,10],"systems":[12,14,12,13,14,10]}
if args.schedule.exists():
    schedule = json.loads(args.schedule.read_text(encoding="utf-8-sig"))
else:
    schedule = {}
    for video, scenes in manifest["videos"].items():
        t = 0
        entries = []
        for i, scene in enumerate(scenes):
            duration = math.ceil(max(mins[video][i], scene["duration"]+2.2)*30)/30
            entries.append({"start":round(t,6),"duration":duration})
            t += duration
        schedule[video] = entries
    args.schedule.write_text(json.dumps(schedule,indent=2),encoding="utf-8")

def db(value):
    return 10**(value/20)

def put(track, clip, at, pan=0):
    i = round(at*SR)
    n = min(len(clip), len(track)-i)
    if n <= 0 or i < 0:
        return
    if clip.ndim == 1:
        gains = np.array([math.sqrt((1-pan)/2), math.sqrt((1+pan)/2)],dtype=np.float32)
        track[i:i+n] += clip[:n,None]*gains
    else:
        track[i:i+n] += clip[:n]

def bell(freq, length=2.8, level=-28):
    t = np.arange(round(length*SR), dtype=np.float32)/SR
    attack = 1-np.exp(-t*220)
    body = (np.sin(2*np.pi*freq*t)*np.exp(-t*2.2)
            +.19*np.sin(2*np.pi*freq*2.003*t)*np.exp(-t*4.5)
            +.045*np.sin(2*np.pi*freq*3.99*t)*np.exp(-t*8))
    return (db(level)*attack*body).astype(np.float32)

def soft_click(length=.06, freq=1700, level=-28):
    t = np.arange(round(length*SR),dtype=np.float32)/SR
    return (db(level)*np.sin(2*np.pi*freq*t)*np.sin(np.pi*t/length)**2*np.exp(-t*70)).astype(np.float32)

def whoosh(seed, length=.6, level=-36):
    rng = np.random.default_rng(seed)
    n = round(length*SR)
    white = rng.standard_normal(n).astype(np.float32)
    smooth = np.convolve(white,np.ones(10)/10,"same")
    band = smooth - np.convolve(smooth,np.ones(110)/110,"same")
    env = np.sin(np.linspace(0,np.pi,n,dtype=np.float32))**2
    band /= max(float(np.max(np.abs(band))),1e-6)
    a = db(level)*band*env
    return np.column_stack((a, np.roll(a,100))).astype(np.float32)

qa = {"sample_rate":SR,"channels":2,"narration_offset":.75,"videos":{}}
for vi,(video, scenes) in enumerate(manifest["videos"].items()):
    if args.video and args.video != video:
        continue
    entries = schedule[video]
    end = max(s["start"]+s["duration"] for s in entries)
    count = math.ceil(end*SR)
    voice = np.zeros((count,2),dtype=np.float32)
    bed = np.zeros_like(voice)
    fx = np.zeros_like(voice)
    rows = []

    for si,(scene, timing) in enumerate(zip(scenes,entries)):
        audio, sr = sf.read(BASE.parent/scene["path"],dtype="float32")
        peak = float(np.max(np.abs(audio)))
        rms = float(np.sqrt(np.mean(audio**2)))
        duration = len(audio)/sr
        frames = np.array_split(audio, max(1,round(duration/.02)))
        silent = [float(np.sqrt(np.mean(f**2))) < .004 for f in frames]
        longest_silence = current_silence = 0
        for is_silent in silent:
            current_silence = current_silence + 1 if is_silent else 0
            longest_silence = max(longest_silence,current_silence)
        fit_margin = timing["duration"]-.75-duration
        if fit_margin < .3:
            raise ValueError(f"{video} scene {si+1} narration does not fit ({fit_margin:.3f}s tail)")
        resampled = np.interp(np.arange(round(duration*SR))/SR,np.arange(len(audio))/sr,audio).astype(np.float32)
        # Raise speech toward a comfortable perceptual level; master loudness
        # is calibrated by FFmpeg loudnorm after all stems are combined.
        put(voice,resampled,timing["start"]+.75)
        row={"scene":si+1,"duration":round(duration,3),"peak_dbfs":round(20*np.log10(max(peak,1e-9)),2),"rms_dbfs":round(20*np.log10(max(rms,1e-9)),2),"clipped_samples":int(np.count_nonzero(np.abs(audio)>=.999)),"tail_seconds":round(fit_margin,3),"longest_silence_seconds":round(longest_silence*duration/len(frames),3)}
        rows.append(row)
        at = timing["start"]
        if si:
            put(fx,whoosh(104+vi*10+si),max(0,at-.2))
        put(fx,soft_click(freq=1400+si*120),at+.28,pan=(-.2 if si%2 else .2))

    # A quiet, custom harmonic bed. Sparse original notes; no sample library.
    notes=[293.6648,440.0,523.2511,659.2551,523.2511,440.0,349.2282,440.0]
    for j,at in enumerate(np.arange(1.65,end-2,3.2)):
        put(bed,bell(notes[(j+vi*2)%len(notes)],level=-37),float(at),pan=(-.38 if j%2 else .38))
    # Warm, very low level continuous pad with slow deterministic breathing.
    t=np.arange(count,dtype=np.float32)/SR
    fade=np.minimum(1,t/2.5)*np.minimum(1,np.maximum(0,end-t)/3)
    pad=np.zeros(count,dtype=np.float32)
    for f,g in [(146.8324,.6),(220,.35),(261.6256,.20)]:
        pad += g*np.sin(2*np.pi*f*t+.08*np.sin(2*np.pi*.13*t))
    pad *= db(-47)*(1+.12*np.sin(2*np.pi*.09*t))*fade
    put(bed,pad,0)
    # Notification, scanner, and brand sonic signature, quiet before speech.
    if video == "ecommerce":
        at=entries[3]["start"]+.18
        put(fx,bell(880,.42,-29),at,pan=.15)
        put(fx,bell(1174.659,.5,-30),at+.16,pan=-.15)
    if video == "systems":
        at=entries[2]["start"]+.20
        put(fx,soft_click(.13,2100,-23),at)
        put(fx,soft_click(.10,2450,-28),at+.15)
    outro=entries[-1]["start"]+.1
    for at,f in [(0,587.3295),(.18,880),(.37,1174.659)]:
        put(fx,bell(f,1.4,-30),outro+at,pan=(at-.18))
    # Tail fades prevent a click on the last frame.
    tail=min(round(1.5*SR),count)
    for stem in [voice,bed,fx]:
        stem[-tail:] *= np.linspace(1,0,tail,dtype=np.float32)[:,None]
    out=BASE/video
    out.mkdir(exist_ok=True)
    sf.write(out/"narration-aligned.wav",voice,SR,subtype="PCM_24")
    sf.write(out/"sound-bed.wav",bed,SR,subtype="PCM_24")
    sf.write(out/"effects.wav",fx,SR,subtype="PCM_24")
    premix=out/"premix.wav"
    sf.write(premix,voice+bed+fx,SR,subtype="FLOAT")
    final=out/"mix.wav"
    cmd=["ffmpeg","-hide_banner","-y","-i",str(premix),"-af",f"loudnorm=I=-17:TP=-1.5:LRA=8:print_format=json,atrim=duration={end:.6f},asetpts=N/SR/TB","-ar",str(SR),"-ac","2","-c:a","pcm_s24le",str(final)]
    result=subprocess.run(cmd,capture_output=True,text=True,check=True)
    report=result.stderr[result.stderr.rfind("{\n"):]
    try:
        norm=json.JSONDecoder().raw_decode(report)[0]
    except json.JSONDecodeError:
        norm={"log":report}
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(final),"-c:a","aac","-b:a","192k",str(out/"mix.m4a")],check=True)
    data,_=sf.read(final,dtype="float32")
    qa["videos"][video]={"duration":round(end,3),"scenes":rows,"mix_peak_dbfs":round(20*np.log10(max(float(np.max(np.abs(data))),1e-9)),2),"mix_clipped_samples":int(np.count_nonzero(np.abs(data)>=.999)),"loudnorm":norm}
    print(f"{video}: {end:.3f}s | {final} | peak {qa['videos'][video]['mix_peak_dbfs']} dBFS",flush=True)
(BASE/"audio-qa.json").write_text(json.dumps(qa,indent=2,ensure_ascii=False),encoding="utf-8")
print("QA:",BASE/"audio-qa.json")
