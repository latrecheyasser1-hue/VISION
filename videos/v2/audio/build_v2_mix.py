"""Original 120 BPM electronic VISION groove; audible, ducked beneath speech.

No external recordings, loops, or hosted processing. V1 remains untouched.
"""
from pathlib import Path
import argparse,json,sys,subprocess,math
BASE=Path(__file__).resolve().parent
V1=BASE.parents[1]/"audio"
sys.path.insert(0,str(V1/"runtime"))
import numpy as np
import soundfile as sf
SR=48000
parser=argparse.ArgumentParser()
parser.add_argument("--video",default="intro")
parser.add_argument("--sample",action="store_true")
parser.add_argument("--schedule",type=Path)
args=parser.parse_args()
m=json.loads((BASE/"manifest.json").read_text(encoding="utf-8"))
scenes=m[args.video][:2] if args.sample else m[args.video]
if args.schedule:
    schedules=json.loads(args.schedule.read_text(encoding="utf-8"))
    schedule=(schedules["scenes"] if "scenes" in schedules else schedules[args.video])[:len(scenes)]
else:
    schedule=[]; start=0
    for s in scenes:
        duration=s["duration"]+.55
        schedule.append({"scene":s["scene"],"start":round(start,6),"duration":round(duration,6),"narration_start":round(start+.2,6)})
        start+=duration
end=schedule[-1]["start"]+schedule[-1]["duration"]
N=round(end*SR)
rng=np.random.default_rng(86102026)

def db(x):return 10**(x/20)
def hz(note):return 440*2**((note-69)/12)
def sine(f,t):return np.sin(2*np.pi*f*t)
def fit_rms(a,target):
    rms=np.sqrt(np.mean(a**2))
    return a*(db(target)/max(rms,1e-9))
def add(track,a,start,pan=0):
    i=round(start*SR)
    if i<0:a=a[-i:];i=0
    n=min(len(a),len(track)-i)
    if n<=0:return
    if a.ndim==1:
        gains=np.array([math.sqrt(1-pan),math.sqrt(1+pan)],dtype=np.float32)
        track[i:i+n]+=a[:n,None]*gains
    else:track[i:i+n]+=a[:n]
def noise_band(n,size):
    noise=rng.standard_normal(n).astype(np.float32)
    return noise-np.convolve(noise,np.ones(size)/size,"same")
def kick():
    t=np.arange(round(.30*SR),dtype=np.float32)/SR
    f=46+120*np.exp(-t*38)
    phase=2*np.pi*np.cumsum(f)/SR
    click=noise_band(len(t),8)*np.exp(-t*150)*.14
    return (np.sin(phase)*np.exp(-t*15)+click)*np.minimum(t/.0015,1)*.70
def snare():
    t=np.arange(round(.19*SR),dtype=np.float32)/SR
    noise=noise_band(len(t),20)
    return ((noise*.26*np.exp(-t*24)+sine(185,t)*.22*np.exp(-t*42)))*np.minimum(t/.001,1)
def hat(opened=False):
    d=.16 if opened else .045
    t=np.arange(round(d*SR),dtype=np.float32)/SR
    noise=noise_band(len(t),3)
    metallic=sine(7100,t)*sine(9380,t)*.15
    return (noise*.15+metallic)*np.exp(-t*(23 if opened else 90))*np.minimum(t/.0007,1)
def bass(note,length):
    t=np.arange(round(length*SR),dtype=np.float32)/SR
    f=hz(note)
    env=np.minimum(t/.009,1)*np.minimum(np.maximum(length-t,0)/.035,1)
    return (.4*sine(f,t)+.12*sine(f*2,t)+.025*sine(f*3,t))*env*np.exp(-t*1.5)
def pluck(note,length=.7):
    t=np.arange(round(length*SR),dtype=np.float32)/SR
    f=hz(note)
    env=(1-np.exp(-t*330))*np.exp(-t*8.2)
    return (.25*sine(f,t)+.09*sine(2*f,t)+.035*sine(3*f,t))*env
def chord(notes,length=2):
    t=np.arange(round(length*SR),dtype=np.float32)/SR
    env=(1-np.exp(-t*25))*np.exp(-t*2.3)*np.minimum(np.maximum(length-t,0)/.2,1)
    a=sum(sine(hz(note),t)+.10*sine(hz(note)*2,t) for note in notes)/len(notes)
    return a*env*.13
def whoosh(length=.36):
    n=round(length*SR)
    t=np.arange(n)/SR
    a=noise_band(n,12)
    a=np.convolve(a,np.ones(4)/4,"same")
    env=np.sin(np.linspace(0,np.pi,n))**1.6
    a=a*env
    a=a/max(np.max(np.abs(a)),1e-9)*db(-15)
    return np.column_stack([a,np.roll(a,80)]).astype(np.float32)
def blip(f=1300):
    t=np.arange(round(.1*SR),dtype=np.float32)/SR
    return sine(f,t)*np.sin(np.pi*t/.1)**2*np.exp(-t*20)*db(-16)

music=np.zeros((N,2),dtype=np.float32)
voice=np.zeros_like(music)
fx=np.zeros_like(music)
activity=np.zeros(N,dtype=np.float32)
for scene,timing in zip(scenes,schedule):
    a,sr=sf.read(BASE/scene["path"],dtype="float32")
    if sr!=SR:a=np.interp(np.arange(round(len(a)/sr*SR))/SR,np.arange(len(a))/sr,a).astype(np.float32)
    speech_start=timing.get("narration_start",timing["start"]+.2)
    add(voice,a,speech_start)
    i=round(speech_start*SR);j=min(N,i+len(a))
    activity[i:j]=1
    attack=round(.025*SR);release=round(.15*SR)
    if i>=attack:activity[i-attack:i]=np.linspace(0,1,attack)
    if j+release<N:activity[j:j+release]=np.linspace(1,0,release)
    at=timing["start"]
    add(fx,whoosh(),at-.10)
    add(fx,blip(1000+scene["scene"]*180),at+.08,pan=.1)

beat=.5
K=kick();S=snare();H=hat();OH=hat(True)
progression=[([62,65,69,72],38),([60,64,67,71],36),([58,62,65,69],34),([60,64,67,69],36)]
for bar in range(math.ceil(end/2)):
    at=bar*2
    notes,root=progression[bar%4]
    # Kicks and backbeat, plus alternate syncopation.
    for p in [0,.75,1,1.75] if bar%2 else [0,.5,1,1.625]:add(music,K,at+p)
    for p in [.5,1.5]:add(music,S,at+p,pan=.05)
    for eighth in range(8):
        p=eighth*.25
        add(music,OH if eighth==7 else H,at+p,pan=(-.28 if eighth%2 else .28))
    if bar%4==3:
        for p in [1.625,1.875]:add(music,H*.55,at+p,pan=-.4)
    for p,n,d in [(0,root,.3),(.75,root,.20),(1,root,.3),(1.5,root+7,.32)]:add(music,bass(n,d),at+p)
    add(music,chord(notes),at+.02,pan=-.18)
    motif=[notes[0]+12,notes[2]+12,notes[1]+12,notes[3]+12]
    for k,p in enumerate([.125,.625,1.125,1.625]):
        a=pluck(motif[(k+bar)%4])
        add(music,a,at+p,pan=(-.42 if k%2 else .42))
        add(music,a*.16,at+p+.1875,pan=(.42 if k%2 else -.42))

# Bass/beat starts on frame zero. Set bed from measured speech RMS, then duck
# 4.4dB beneath narration; this is an audible soundtrack, not sparse ambience.
active=activity>.8
speech_rms=float(np.sqrt(np.mean(voice[active]**2)))
music_rms=float(np.sqrt(np.mean(music[active]**2)))
music *= (speech_rms*db(-7.2)/max(music_rms,1e-9))
duck=1-.40*activity
music *= duck[:,None]
music_rms=float(np.sqrt(np.mean(music[active]**2)))
ratio=20*np.log10(music_rms/speech_rms)
fade=round(.18*SR)
for stem in [music,voice,fx]:stem[-fade:]*=np.linspace(1,0,fade)[:,None]
out=BASE/args.video/("preview" if args.sample else "full")
out.mkdir(parents=True,exist_ok=True)
for name,a in [("narration",voice),("music",music),("effects",fx)]:sf.write(out/f"{name}.wav",a,SR,subtype="PCM_24")
premix=out/"premix.wav"
sf.write(premix,voice+music+fx,SR,subtype="FLOAT")
final=out/"mix.wav"
filt=f"loudnorm=I=-14:TP=-1.1:LRA=7:print_format=json,aresample=48000,apad,atrim=duration={end},asetpts=N/SR/TB"
r=subprocess.run(["ffmpeg","-hide_banner","-y","-i",str(premix),"-af",filt,"-ar",str(SR),"-ac","2","-c:a","pcm_s24le",str(final)],capture_output=True,text=True,check=True)
report=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{\n'):])[0]
# FFmpeg loudnorm may preserve a fractional frame PTS offset. Enforce the exact
# decoded PCM sample count after mastering; padding only touches the silent tail.
master,master_sr=sf.read(final,dtype="float32")
if len(master)!=N:
    master=np.pad(master,((0,max(0,N-len(master))),(0,0)))[:N]
    sf.write(final,master,SR,subtype="PCM_24")
subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(final),"-c:a","aac","-b:a","192k",str(out/"mix.m4a")],check=True)
qa={"bpm":120,"duration":end,"narration_offset":.2,"speech_rms_dbfs":20*np.log10(speech_rms),"music_under_speech_db":ratio,"loudness":report,"schedule":schedule,"voice":"Kareem .69 regenerated + .68 semitone presence EQ","synthetic_original_music":True,"network_inference":False}
(out/"qa.json").write_text(json.dumps(qa,indent=2),encoding="utf-8")
(out/"schedule.json").write_text(json.dumps({args.video:schedule},indent=2),encoding="utf-8")
print(json.dumps({"output":str(final),"duration":end,"music_under_speech_db":round(ratio,2),"lufs":report['output_i'],"true_peak":report['output_tp'],"schedule":schedule},indent=2),flush=True)
