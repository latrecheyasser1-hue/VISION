"""Approximate phrase captions using exact per-scene speech boundaries."""
from pathlib import Path
import json
BASE=Path(__file__).resolve().parent
m=json.loads((BASE/"manifest.json").read_text(encoding="utf-8"))
def ts(t,d=","):
    n=round(t*1000);h,n=divmod(n,3600000);mi,n=divmod(n,60000);s,ms=divmod(n,1000)
    return f"{h:02}:{mi:02}:{s:02}{d}{ms:03}"
for video,sched_name in [("intro","intro"),("ecommerce","commerce"),("systems","systems")]:
    p=BASE.parent/f"{sched_name}-schedule.json"
    if not p.exists():continue
    schedule=json.loads(p.read_text(encoding="utf-8"))["scenes"]
    srt=[];vtt=["WEBVTT\n"];idx=1
    for scene,timing in zip(m[video],schedule):
        words=scene["text"].split()
        phrases=[" ".join(words[j:j+6]) for j in range(0,len(words),6)]
        weights=[len(x.replace(" ","")) for x in phrases]
        total=sum(weights);elapsed=0
        for phrase,w in zip(phrases,weights):
            start=timing["start"]+.2+scene["duration"]*elapsed/total
            end=timing["start"]+.2+scene["duration"]*(elapsed+w)/total
            elapsed+=w
            srt.append(f"{idx}\n{ts(start)} --> {ts(end)}\n{phrase}\n")
            vtt.append(f"{ts(start,'.')} --> {ts(end,'.')}\n{phrase}\n")
            idx+=1
    out=BASE/video
    (out/"narration.ar.srt").write_text("\n".join(srt),encoding="utf-8")
    (out/"narration.ar.vtt").write_text("\n".join(vtt),encoding="utf-8")
    print(video,"phrase captions ready")
