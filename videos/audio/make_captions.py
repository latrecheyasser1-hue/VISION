"""Export scene-level Arabic subtitles from the actual narration schedule."""
from pathlib import Path
import json
import textwrap

BASE=Path(__file__).resolve().parent
manifest=json.loads((BASE/"manifest.json").read_text(encoding="utf-8"))
schedule=json.loads((BASE/"schedule.json").read_text(encoding="utf-8"))

def timestamp(t,decimal=","):
    ms=round(t*1000)
    h,ms=divmod(ms,3600000)
    m,ms=divmod(ms,60000)
    s,ms=divmod(ms,1000)
    return f"{h:02}:{m:02}:{s:02}{decimal}{ms:03}"

for video,scenes in manifest["videos"].items():
    srt=[]
    vtt=["WEBVTT\n"]
    for i,(scene,timing) in enumerate(zip(scenes,schedule[video]),1):
        start=timing["start"]+.75
        end=start+scene["duration"]
        text="\n".join(textwrap.wrap(scene["text"],width=65,break_long_words=False))
        srt += [f"{i}\n{timestamp(start)} --> {timestamp(end)}\n{text}\n"]
        vtt += [f"{timestamp(start,'.')} --> {timestamp(end,'.')}\n{text}\n"]
    (BASE/video/"narration.ar.srt").write_text("\n".join(srt),encoding="utf-8")
    (BASE/video/"narration.ar.vtt").write_text("\n".join(vtt),encoding="utf-8")
    print(video,"captions ready")
