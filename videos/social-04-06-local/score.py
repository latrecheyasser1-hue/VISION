"""Three original lightweight instrumental scores + event-synchronous Foley.
No downloaded music, cloud music generation, or use of previous score.
"""
from pathlib import Path
import sys,json,subprocess,math
ROOT=Path(__file__).resolve().parent
sys.path.insert(0,str(ROOT.parent/'audio/runtime'))
import numpy as np
import soundfile as sf
SR=48000
def db(n):return 10**(n/20)
def read(p):
 r=subprocess.run(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ar',str(SR),'-ac','2','pipe:1'],capture_output=True,check=True)
 return np.frombuffer(r.stdout,dtype='<f4').copy().reshape(-1,2)
def put(track,a,at,level=1,pan=0):
 a=np.asarray(a,dtype=np.float32)
 if a.ndim==1:a=np.column_stack((a,a))
 start=round(at*SR)
 if start<0:a=a[-start:];start=0
 n=min(len(a),len(track)-start)
 if n>0:track[start:start+n]+=a[:n]*level*np.array([math.sqrt(1-pan),math.sqrt(1+pan)])
def tone(midi,duration=1,kind='pluck'):
 t=np.arange(round(duration*SR),dtype=np.float32)/SR;f=440*2**((midi-69)/12)
 if kind=='pad':
  a=sum(np.sin(2*np.pi*f*(h+det)*t+det*20)/h**2 for h in [1,2,3] for det in [-.002,.002])*.28
  env=np.minimum(t/.35,1)*np.minimum((duration-t)/.6,1)
 elif kind=='bass':
  a=(np.sin(2*np.pi*f*t)+.22*np.sin(4*np.pi*f*t))*.7;env=np.minimum(t/.015,1)*np.exp(-t*3.4)
 elif kind=='felt':
  a=np.sin(2*np.pi*f*t)*np.exp(-t*1.6)+.28*np.sin(2*np.pi*f*2.002*t)*np.exp(-t*3.7)+.12*np.sin(2*np.pi*f*3.01*t)*np.exp(-t*6)
  env=np.minimum(t/.006,1)*np.minimum((duration-t)/.08,1)*.7
 else:
  a=sum(np.sin(2*np.pi*f*(h+.0007*h*h)*t)*np.exp(-t*(2+h*.7))/h**1.5 for h in range(1,6))*.6
  env=np.minimum(t/.004,1)*np.minimum((duration-t)/.04,1)
 return a*env
def percussion(kind,seed=1):
 rng=np.random.default_rng(seed);dur={'kick':.35,'hat':.08,'snare':.18,'rim':.1}[kind];t=np.arange(round(dur*SR))/SR;n=rng.standard_normal(len(t));hi=n-np.convolve(n,np.ones(15)/15,'same')
 if kind=='kick':a=np.sin(2*np.pi*(48*t+1.6*(1-np.exp(-t*25))))*np.exp(-t*16)
 elif kind=='hat':a=hi*np.exp(-t*75)*.15
 elif kind=='rim':a=(np.sin(2*np.pi*1400*t)+.4*hi)*np.exp(-t*95)*.24
 else:a=(hi*.3+np.sin(2*np.pi*180*t)*.15)*np.exp(-t*26)
 return a*np.minimum(t/.001,1)
def effect(kind,seed):
 rng=np.random.default_rng(seed);dur={'whoosh':.55,'stretch':1.2,'paper':.28,'tear':.45,'glass':.6,'resolve':.65,'print':.3}.get(kind,.22)
 t=np.arange(round(dur*SR))/SR;noise=rng.standard_normal(len(t));hi=noise-np.convolve(noise,np.ones(23)/23,'same')
 if kind in ['whoosh','stretch']:
  env=np.sin(np.pi*t/dur)**2;a=(np.convolve(noise,np.ones(40)/40,'same')+np.sin(2*np.pi*(65*t+15*t*t))*.11)*env;peak=dur*.52
 elif kind in ['glass','resolve','pluck']:
  a=tone(86 if kind=='glass' else 74,dur,'felt');a+=.35*tone(81,dur,'pluck');peak=.008
 elif kind in ['paper','tear','print']:
  env=np.exp(-t*(13 if kind=='tear' else 30));a=hi*env*(.4+.6*np.sin(2*np.pi*38*t)**2);peak=.01
 elif kind in ['mechanical','stamp']:
  a=(np.sin(2*np.pi*(74*t+1.2*(1-np.exp(-t*40))))+.26*hi)*np.exp(-t*28);peak=.006
 else:a=(hi+.2*np.sin(2*np.pi*850*t))*np.exp(-t*90);peak=.004
 a*=np.minimum(t/.0015,1);a=a/max(np.max(np.abs(a)),1e-6)
 return a,peak
def make(film):
 s=json.loads((ROOT/f'{film}-schedule.json').read_text(encoding='utf-8'));hits=json.loads((ROOT/f'{film}-hits.json').read_text());duration=s['duration'];n=round(duration*SR)
 voice=np.zeros((n,2),np.float32);music=np.zeros_like(voice);fx=np.zeros_like(voice)
 for sc in s['scenes']:
  a=read(ROOT/sc['voicePath']);rms=np.sqrt(np.mean(a*a));a*=min(db(-19)/max(rms,1e-5),.9/max(np.max(np.abs(a)),1e-5));put(voice,a,sc['start']+sc['voiceOffset'])
 bpm={'request':112,'profit':76,'undo':72}[film];beat=60/bpm
 chords={'request':[[50,57,60,64],[46,53,57,60],[53,60,64,67],[48,55,58,62]],'profit':[[48,55,59,62],[45,52,55,59],[53,57,60,64],[43,50,55,59]],'undo':[[38,50,57,60],[34,46,53,57],[41,53,60,64],[36,48,55,58]]}[film]
 bars=math.ceil(duration/(beat*4))
 for bar in range(bars):
  time=bar*beat*4;ch=chords[bar%4]
  if film=='request':
   for j in range(4):put(music,tone(ch[0]-12,.7,'bass'),time+j*beat,.21)
   for j in range(8):
    note=ch[[0,2,1,3,1,2,3,2][j]]+12;a=tone(note,.75,'pluck');put(music,a,time+j*beat/2,.095,(-1)**j*.35);put(music,a,time+j*beat/2+beat*.75,.022,-(-1)**j*.35)
   for j in range(4):
    put(music,percussion('kick'),time+j*beat,.3);put(music,percussion('hat',bar+j),time+(j+.5)*beat,.18)
    if j%2:put(music,percussion('rim'),time+j*beat,.25)
  elif film=='profit':
   for j,m in enumerate(ch):put(music,tone(m+12,2.5,'felt'),time+j*.035,.13,(j-1.5)*.18)
   for j in [0,2]:put(music,tone(ch[0]-12,1.1,'bass'),time+j*beat,.18)
   for j in [1,3]:put(music,percussion('rim',bar),time+j*beat,.13)
   for j,m in enumerate([ch[2]+12,ch[3]+12,ch[1]+24]):put(music,tone(m,1.3,'pluck'),time+(1.5+j*.75)*beat,.075,(-1)**j*.28)
  else:
   for j,m in enumerate(ch):put(music,tone(m,beat*4+.5,'pad'),time,.09,(j-1.5)*.22)
   for j in range(8):put(music,tone(ch[j%3]+12,.7,'pluck'),time+j*beat/2,.045,(-1)**j*.4)
   for j in [0,2]:put(music,percussion('kick'),time+j*beat,.22)
   if bar%2==1:put(music,tone(ch[3]+12,2.5,'felt'),time+beat*3,.14)
 # Resolve to a sustained final chord and keep the last reading window calm.
 tail_start=s['scenes'][-1]['start']+(s['scenes'][-1]['duration']*.72)
 tail=max(0,n-round(tail_start*SR));music[-tail:]*=np.linspace(1,.12,tail)[:,None]
 # Actual voice sidechain, with quiet space breathing between phrases.
 block=960;power=np.mean(voice*voice,axis=1);env=np.sqrt(np.mean(np.pad(power,(0,(-n)%block)).reshape(-1,block),axis=1));det=np.clip(env/.06,0,1);smooth=[];state=0
 for v in det:state+=(v-state)*(.8 if v>state else .17);smooth.append(state)
 duck=1-.62*np.interp(np.arange(n)/SR,np.arange(len(smooth))*.02,smooth);music*=duck[:,None]
 active=np.repeat(env>.008,block)[:n];vr=np.sqrt(np.mean(voice[active]**2));mr=np.sqrt(np.mean(music[active]**2));music*=vr*db(-12)/max(mr,1e-8)
 for i,h in enumerate(hits):
  a,offset=effect(h['kind'],100+i);put(fx,a,h['time']-offset,db(-15)*h.get('level',1),h.get('pan',0))
 fade=round(.35*SR)
 for a in [music,fx]:a[-fade:]*=np.linspace(1,0,fade)[:,None]
 dest=ROOT/'audio/mixes'/film;dest.mkdir(parents=True,exist_ok=True)
 for name,a in [('narration',voice),('music',music),('effects',fx),('premix',voice+music+fx)]:sf.write(dest/f'{name}.wav',a,SR,subtype='FLOAT' if name=='premix' else 'PCM_24')
 r=subprocess.run(['ffmpeg','-y','-hide_banner','-i',str(dest/'premix.wav'),'-af',f'loudnorm=I=-14:TP=-1.2:LRA=8:print_format=json,aresample=48000,apad,atrim=duration={duration}', '-ar','48000','-c:a','pcm_s24le',str(dest/'mix.wav')],capture_output=True,text=True,check=True)
 norm=json.JSONDecoder().raw_decode(r.stderr[r.stderr.rfind('{\n'):])[0]
 master,_=sf.read(dest/'mix.wav',dtype='float32');report={'film':film,'voice':s['voice'],'rate':s['rate'],'music':'original locally synthesized score','bpm':bpm,'speechDucking':True,'effectCount':len(hits),'peakDbFS':float(20*np.log10(max(np.max(np.abs(master)),1e-9))),'clippedSamples':int(np.count_nonzero(np.abs(master)>=.999)),'normalization':norm}
 (dest/'qa.json').write_text(json.dumps(report,indent=2),encoding='utf-8');print(json.dumps(report),flush=True)
for film in sys.argv[1:] or ['request','profit','undo']:make(film)
