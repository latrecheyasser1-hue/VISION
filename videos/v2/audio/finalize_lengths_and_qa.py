from pathlib import Path
import sys,json,subprocess,shutil
BASE=Path(__file__).resolve().parent
V1=BASE.parents[1]/"audio"
sys.path.insert(0,str(V1/"runtime"))
import soundfile as sf
import numpy as np
manifest=json.loads((BASE/"manifest.json").read_text(encoding="utf-8"))
old=json.loads((V1/"manifest.json").read_text(encoding="utf-8"))
summary={}
for name in ["intro","ecommerce","systems"]:
    path=BASE/name/"full/mix.wav"
    q=json.loads((path.parent/"qa.json").read_text(encoding="utf-8"))
    a,sr=sf.read(path,dtype="float32")
    n=round(q["duration"]*sr)
    if len(a)!=n:
        a=np.pad(a,((0,max(0,n-len(a))),(0,0)))[:n]
        sf.write(path,a,sr,subtype="PCM_24")
    shutil.copyfile(path,BASE/f"{name}-mix.wav")
    subprocess.run(["ffmpeg","-hide_banner","-loglevel","error","-y","-i",str(path),"-c:a","aac","-b:a","192k",str(path.with_suffix(".m4a"))],check=True)
    summary[name]={"duration":len(a)/sr,"sample_rate":sr,"channels":a.shape[1],"peak_dbfs":round(float(20*np.log10(np.max(np.abs(a)))),3),"clipped_samples":int(np.count_nonzero(np.abs(a)>=.999)),"lufs":q["loudness"]["output_i"],"true_peak":q["loudness"]["output_tp"],"music_under_speech_db":q["music_under_speech_db"],"speech_speed_vs_v1":sum(s["duration"] for s in old["videos"][name])/sum(s["duration"] for s in manifest[name])}
(BASE/"QA_SUMMARY.json").write_text(json.dumps(summary,indent=2),encoding="utf-8")
print(json.dumps(summary,indent=2))
