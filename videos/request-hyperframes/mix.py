from pathlib import Path
import sys,json,subprocess,math
R=Path(__file__).resolve().parent
sys.path.insert(0,str(R.parent/'audio/runtime'))
import numpy as np
import soundfile as sf
SR=48000
def read(p,af=None):
 cmd=['ffmpeg','-v','error','-threads','2','-i',str(p)]
 if af:cmd+=['-af',af]
 b=subprocess.check_output(cmd+['-f','f32le','-ar',str(SR),'-ac','2','pipe:1']);return np.frombuffer(b,dtype='<f4').copy().reshape(-1,2)
def put(dst,a,t,g=1):
 st=round(t*SR)
 if st<0:a=a[-st:];st=0
 n=min(len(a),len(dst)-st)
 if n>0:dst[st:st+n]+=a[:n]*g
def rms(a):return max(float(np.sqrt(np.mean(a*a))),1e-8)
s=json.loads((R/'schedule.json').read_text(encoding='utf-8'));n=round(s['duration']*SR)
voice=np.zeros((n,2),np.float32)
for sc in s['scenes']:put(voice,read(R/sc['voicePath']),sc['start']+sc['voiceOffset'])
voice*=10**(-18/20)/rms(voice)
source=read(R/'assets/sound/music-source.wav','atempo=1.090909')
# Rearrange the existing original instrumental into a144BPM bed; no new synthesis.
beat=60/144;bar=beat*4;take=source[round(bar*SR):round(9*bar*SR)].copy();music=np.zeros_like(voice)
for at in np.arange(0,s['duration'],8*bar):put(music,take,float(at))
music*=10**(-24/20)/rms(music)
envelope=np.ones(n,np.float32)
for sc in s['scenes']:
 a=round((sc['start']+sc['voiceOffset'])*SR);b=min(n,a+round(sc['voiceDuration']*SR));envelope[a:b]=.48
# Smooth gain transitions, not audio; keep speech in front.
step=480;small=envelope[::step];sm=np.convolve(np.pad(small,(6,6),mode='edge'),np.ones(13)/13,'valid');env=np.interp(np.arange(n),np.arange(len(sm))*step,sm)
music*=env[:,None]
music[-round(.65*SR):]*=np.linspace(1,0,round(.65*SR))[:,None]
effects=np.zeros_like(voice);paths={'click':R/'.media/audio/sfx/sfx_001.mp3','whoosh':R/'.media/audio/sfx/sfx_002.mp3','impact':R/'.media/audio/sfx/sfx_003.mp3'}
waves={k:read(v) for k,v in paths.items()};events=[]
for h in json.loads((R/'hits.json').read_text()):
 a=waves[h['kind']].copy();a*=10**(-22/20)/rms(a);peak=np.argmax(np.max(np.abs(a),axis=1))/SR;start=h['time']+1/30-peak
 put(effects,a,start,h['gain']);events.append({**h,'audioStart':start,'peakOffset':peak})
dest=R/'assets/sound'
for name,a in [('narration',voice),('music',music),('effects',effects),('premix',voice+music+effects)]:sf.write(dest/f'{name}.wav',a,SR,subtype='PCM_24')
result=subprocess.run(['ffmpeg','-y','-hide_banner','-threads','2','-i',str(dest/'premix.wav'),'-af','loudnorm=I=-14.5:TP=-1.5:LRA=6:print_format=json','-ar',str(SR),'-ac','2','-c:a','pcm_s24le',str(dest/'mix.wav')],capture_output=True,text=True,check=True)
mix=read(dest/'mix.wav');report={'duration':len(mix)/SR,'peakDbFS':float(20*np.log10(np.max(np.abs(mix)))),'clippedSamples':int(np.sum(np.abs(mix)>=1)),'normalization':json.JSONDecoder().raw_decode(result.stderr[result.stderr.rfind('{'):])[0],'events':events,'sources':'Existing original VISION score rearranged144BPM; bundled HyperFrames SFX; new Microsoft Andrew Multilingual narration','listening':'Signal measured; not a human listening certification'}
(R/'qa/audio-master.json').write_text(json.dumps(report,indent=2));print(json.dumps({k:v for k,v in report.items() if k!='events'}))
