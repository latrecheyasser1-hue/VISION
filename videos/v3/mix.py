"""Align approved V3 voice, connected-catalog music, and animation hit sounds.

Usage: python videos/v3/mix.py intro
       python videos/v3/mix.py intro --schedule PATH --hits PATH
       python videos/v3/mix.py --check-assets

No hosted inference or voice generation occurs here. No older score is loaded.

Schedule: {id,duration,scenes:[{start,duration,voicePath,voiceDuration,
           voiceStart?}],speechPath?,speechOffset?}.
Paths are absolute or relative to videos/v3. Full-film speechPath overrides the
per-scene voice placement; speechOffset defaults to .18 s. Per-scene voices
begin at scene.start+.18; voiceStart is an optional input-file trim in seconds.

Hits: [{time,kind,level,pan}], level is LINEAR (default1), pan−1..1.
time is the VISUAL HIT/SONIC PEAK, not the start of the sound file.
"""
from pathlib import Path
import argparse,json,math,subprocess,sys
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/"audio/runtime"))
import numpy as np
import soundfile as sf
SR=48000

def db(value):return 10**(value/20)
def peakdb(a):return float(20*np.log10(max(float(np.max(np.abs(a))),1e-12)))
def read(path):
    path=Path(path)
    if not path.is_absolute():path=ROOT/path
    if not path.is_file():raise FileNotFoundError(path)
    r=subprocess.run(["ffmpeg","-hide_banner","-v","error","-i",str(path),"-f","f32le","-acodec","pcm_f32le","-ar",str(SR),"-ac","2","pipe:1"],capture_output=True,check=True)
    return np.frombuffer(r.stdout,dtype="<f4").copy().reshape(-1,2)

def add(track,clip,at,pan=0):
    start=round(at*SR)
    if start<0:clip=clip[-start:];start=0
    n=min(len(clip),len(track)-start)
    if n<=0:return
    p=max(-1,min(1,pan))
    gains=np.array([math.sqrt(1-p),math.sqrt(1+p)],dtype=np.float32)
    track[start:start+n]+=clip[:n]*gains

def frame_rms(a,frame=.02):
    size=round(frame*SR)
    mono=np.mean(a*a,axis=1)
    mono=np.pad(mono,(0,(-len(mono))%size))
    return np.sqrt(np.mean(mono.reshape(-1,size),axis=1))

def active_rms(a):
    envelope=frame_rms(a)
    threshold=max(.004,float(np.max(envelope))*.05)
    frames=envelope>threshold
    if not np.any(frames):raise ValueError("The speech file appears silent")
    return float(np.sqrt(np.mean(envelope[frames]**2)))

def voice_gain(a):
    # Match healthy speech levels per clip, without clipping a delivered stem.
    gain=min(db(-17.5)/max(active_rms(a),1e-9),.94/max(float(np.max(np.abs(a))),1e-9))
    return a*gain,gain

def loop_music(source,length,crossfade=.50):
    target=np.zeros((length,2),dtype=np.float32)
    fade=min(round(crossfade*SR),len(source)//4)
    step=len(source)-fade
    start=0;iteration=0
    while start<length:
        clip=source.copy()
        if iteration:
            clip[:fade]*=np.sin(np.linspace(0,np.pi/2,fade))[:,None]
        if start+len(clip)<length:
            clip[-fade:]*=np.cos(np.linspace(0,np.pi/2,fade))[:,None]
        n=min(len(clip),length-start)
        target[start:start+n]+=clip[:n]
        start+=step;iteration+=1
    return target

def crisp_synth(kind):
    rng=np.random.default_rng({"impact":570,"success":571,"scan":572}[kind])
    duration={"impact":.24,"success":.23,"scan":.17}[kind]
    n=round(duration*SR);t=np.arange(n,dtype=np.float32)/SR
    noise=rng.standard_normal(n).astype(np.float32)
    high=noise-np.convolve(noise,np.ones(9)/9,"same")
    if kind=="impact":
        f=52+130*np.exp(-t*65)
        body=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*27)
        a=(body+.32*high*np.exp(-t*95))*np.minimum(t/.002,1)
        offset=.008
    elif kind=="success":
        # Airy double snap; no sine beep or generic notification tone.
        env=np.exp(-t*75)+.65*np.exp(-np.maximum(0,t-.075)*95)*(t>=.075)
        a=high*env*np.minimum(t/.0015,1)
        a+=.25*np.sin(2*np.pi*260*t)*np.exp(-t*75)
        offset=.007
    else:
        # Two close mechanical ticks resembling an optical scanner action.
        env=np.exp(-t*130)+.72*np.exp(-np.maximum(0,t-.07)*150)*(t>=.07)
        a=(high+.15*np.sin(2*np.pi*880*t))*env*np.minimum(t/.0008,1)
        offset=.004
    a=np.column_stack([a,np.roll(a,14)]).astype(np.float32)
    return a,offset

def assets():
    sounds=ROOT/"sound"
    out={"music":read(sounds/"music.wav")}
    for name,offset,peak in [("whoosh",.11,-10),("pop",.05,-12),("click",.065,-15)]:
        a=read(sounds/f"{name}.mp3")
        a*=db(peak)/max(float(np.max(np.abs(a))),1e-9)
        out[name]=(a,offset,peak)
    for name,peak in [("impact",-9),("success",-12),("scan",-13)]:
        a,offset=crisp_synth(name)
        a*=db(peak)/max(float(np.max(np.abs(a))),1e-9)
        out[name]=(a,offset,peak)
    return out

def main():
    p=argparse.ArgumentParser()
    p.add_argument("id",nargs="?",choices=["intro","commerce","ecommerce","systems"])
    p.add_argument("--schedule",type=Path)
    p.add_argument("--hits",type=Path)
    p.add_argument("--check-assets",action="store_true")
    p.add_argument("--music-relative-db",type=float,default=-10.)
    a=p.parse_args()
    catalog=assets()
    if a.check_assets:
        print(json.dumps({"music_seconds":len(catalog['music'])/SR,"catalog_sounds":{k:{"seconds":len(v[0])/SR,"peak_offset":v[1],"peak_dbfs":v[2]} for k,v in catalog.items() if k!='music'}},indent=2));return
    if not a.id:p.error("Provide a film id")
    file=a.schedule or ROOT/f"{a.id}-schedule.json"
    schedule=json.loads(file.read_text(encoding="utf-8-sig"))
    scenes=schedule["scenes"]
    end=schedule.get("duration",max(s['start']+s['duration'] for s in scenes))
    count=round(end*SR)
    voice=np.zeros((count,2),dtype=np.float32)
    speech_records=[]
    if schedule.get("speechPath"):
        clip=read(schedule["speechPath"])
        at=schedule.get("speechOffset",.18)
        clip,gain=voice_gain(clip)
        if at+len(clip)/SR>end+.02:raise ValueError("Full-film narration exceeds the schedule duration")
        add(voice,clip,at)
        speech_records.append({"source":schedule["speechPath"],"start":at,"duration":len(clip)/SR,"gain_db":20*np.log10(gain)})
    else:
        for i,s in enumerate(scenes,1):
            if not s.get("voicePath"):raise ValueError(f"Scene{i} is missing voicePath; no fallback voice is auto-selected")
            clip=read(s["voicePath"])
            trim=round(s.get("voiceStart",0)*SR)
            clip=clip[trim:]
            if s.get("voiceDuration") is not None:clip=clip[:round(s["voiceDuration"]*SR)]
            at=s["start"]+s.get("voiceOffset",.18)
            if at+len(clip)/SR>s["start"]+s["duration"]+.02:
                raise ValueError(f"Narration exceeds scene{i} duration; increase the scene, do not truncate speech")
            clip,gain=voice_gain(clip)
            add(voice,clip,at)
            speech_records.append({"scene":i,"source":s["voicePath"],"start":at,"duration":len(clip)/SR,"gain_db":20*np.log10(gain)})

    # Sidechain tracks the delivered voice's actual RMS, including real pauses.
    env=frame_rms(voice)
    active=env>max(.004,float(np.max(env))*.05)
    target=max(float(np.percentile(env[active],65)),.008)
    detector=np.clip(env/target,0,1)
    smooth=np.empty_like(detector);state=0
    for i,value in enumerate(detector):
        coeff=.75 if value>state else .20 # fast20ms attack;100ms-ish release
        state+=(value-state)*coeff;smooth[i]=state
    x=np.arange(count)/SR
    speech_env=np.interp(x,(np.arange(len(smooth))+.5)*.02,smooth)
    duck=1-.55*speech_env # max~7dB music duck, relaxed during actual pauses
    music=loop_music(catalog["music"],count)*duck[:,None]
    mask=np.repeat(active,round(.02*SR))[:count]
    vrms=float(np.sqrt(np.mean(voice[mask]**2)))
    mrms=float(np.sqrt(np.mean(music[mask]**2)))
    music*=vrms*db(a.music_relative_db)/max(mrms,1e-9)
    ratio=20*np.log10(float(np.sqrt(np.mean(music[mask]**2)))/vrms)
    # Tiny opening ramp prevents a wave edit click, without delaying the music.
    music[:round(.006*SR)]*=np.linspace(0,1,round(.006*SR))[:,None]

    fx=np.zeros_like(voice)
    hitfile=a.hits or ROOT/f"{a.id}-hits.json"
    if not hitfile.is_file():raise FileNotFoundError(f"Animation hits are required for the final mix: {hitfile}")
    hits=json.loads(hitfile.read_text(encoding="utf-8-sig"))
    if isinstance(hits,dict):hits=hits.get("hits",[])
    hit_records=[]
    for hit in hits:
        if not (0<=hit["time"]<=end):raise ValueError(f"Sound marker {hit['time']:.3f}s is outside this {end:.3f}s film; regenerate hits after retiming")
        kind=hit["kind"]
        if kind not in catalog:raise ValueError(f"Unknown sound kind:{kind}")
        clip,offset,peak=catalog[kind]
        level=float(hit.get("level",1))
        if level<0:raise ValueError("Hit level must be linear >=0")
        add(fx,clip*level,hit["time"]-offset,hit.get("pan",0))
        hit_records.append({**hit,"clip_start":hit["time"]-offset,"peak_offset":offset,"nominal_peak_dbfs":peak+20*np.log10(max(level,1e-9))})
    tail=min(round(.3*SR),count)
    for stem in [music,fx]:stem[-tail:]*=np.linspace(1,0,tail)[:,None]
    out=ROOT/"audio/mixes"/a.id
    out.mkdir(parents=True,exist_ok=True)
    for name,stem in [("narration",voice),("music",music),("effects",fx)]:sf.write(out/f"{name}.wav",stem,SR,subtype="PCM_24")
    sf.write(out/"premix.wav",voice+music+fx,SR,subtype="FLOAT")
    final=out/"mix.wav"
    filt=f"loudnorm=I=-14:TP=-1.2:LRA=7:print_format=json,aresample=48000,apad,atrim=duration={end},asetpts=N/SR/TB"
    r=subprocess.run(["ffmpeg","-hide_banner","-y","-i",str(out/"premix.wav"),"-af",filt,"-ar",str(SR),"-c:a","pcm_s24le",str(final)],capture_output=True,text=True,check=True)
    norm=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{\n'):])[0]
    master,_=sf.read(final,dtype="float32")
    master=np.pad(master,((0,max(0,count-len(master))),(0,0)))[:count]
    sf.write(final,master,SR,subtype="PCM_24")
    subprocess.run(["ffmpeg","-hide_banner","-v","error","-y","-i",str(final),"-c:a","aac","-b:a","192k",str(out/"mix.m4a")],check=True)
    report={"id":a.id,"duration":len(master)/SR,"sample_rate":SR,"channels":2,"voice":schedule.get("voice"),"speech_provider":schedule.get("speechProvider"),"pitch":schedule.get("pitch"),"post_tempo":schedule.get("postTempo"),"music_source":"sound/music.wav from connected HeyGen catalog; no older score","music_under_speech_rms_db":ratio,"real_voice_sidechain":True,"master_peak_dbfs":peakdb(master),"clipped_samples":int(np.count_nonzero(np.abs(master)>=.999)),"loudness":norm,"speech":speech_records,"hits":hit_records,"stem_peaks_dbfs":{"voice":peakdb(voice),"music":peakdb(music),"effects":peakdb(fx)}}
    (out/"qa.json").write_text(json.dumps(report,indent=2,ensure_ascii=False),encoding="utf-8")
    print(json.dumps({k:v for k,v in report.items() if k not in ['hits','speech']},indent=2))
    print("OUTPUT:",final,flush=True)

if __name__=="__main__":main()
