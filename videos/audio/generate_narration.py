"""Generate approved Arabic narration with a fully local Piper CPU model.

This file performs no network requests. Model weights are downloaded separately.
"""
from pathlib import Path
import json
import sys
import wave
import argparse

BASE = Path(__file__).resolve().parent
sys.path.insert(0, str(BASE / "runtime"))
import numpy as np
from piper import PiperVoice, SynthesisConfig

parser = argparse.ArgumentParser()
parser.add_argument("--sample", action="store_true")
parser.add_argument("--only", action="append", default=[], help="Regenerate video:scene (repeatable)")
args = parser.parse_args()

scripts = json.loads((BASE / "scripts.json").read_text(encoding="utf-8"))
voice = PiperVoice.load(BASE / "models/ar_JO-kareem-medium.onnx")
voice.use_tashkeel = False  # scripts already vocalized; no automatic downloads
config = SynthesisConfig(length_scale=1.04, noise_scale=0.5, noise_w_scale=0.65, volume=0.82)
manifest = {"engine":"Piper 1.8 CPU offline", "voice":"ar_JO-kareem-medium", "sample_rate":22050, "network_inference":False, "videos":{}}
old_manifest = json.loads((BASE/"manifest.json").read_text(encoding="utf-8")) if args.only else None
sr = voice.config.sample_rate

for video, scenes in scripts.items():
    records = []
    outdir = BASE / video
    outdir.mkdir(exist_ok=True)
    for i, scene in enumerate(scenes, 1):
        if args.only and f"{video}:{i}" not in args.only:
            records.append(old_manifest["videos"][video][i-1])
            continue
        if args.sample and not (video == "intro" and i == 1):
            continue
        chunks = []
        for chunk in voice.synthesize(scene["spoken"], config):
            a = chunk.audio_float_array
            threshold = 0.004
            voiced = np.flatnonzero(np.abs(a) > threshold)
            if voiced.size:
                a = a[max(0, voiced[0] - int(sr*.05)):min(len(a), voiced[-1] + int(sr*.10))]
            chunks += [a, np.zeros(int(sr*.16), dtype=np.float32)]
        audio = np.concatenate(chunks)
        audio = np.concatenate([np.zeros(int(sr*.05)), audio, np.zeros(int(sr*.12))])
        path = outdir / f"scene-{i:02}.wav"
        with wave.open(str(path), "wb") as w:
            w.setnchannels(1)
            w.setsampwidth(2)
            w.setframerate(sr)
            w.writeframes((np.clip(audio, -1, 1)*32767).astype(np.int16).tobytes())
        duration = round(len(audio)/sr, 3)
        record = {"scene":i, "path":str(path.relative_to(BASE.parent)).replace("\\", "/"), "duration":duration, "text":scene["text"], "spoken":scene["spoken"]}
        records.append(record)
        print(f"{video} {i}: {duration:.3f}s", flush=True)
    if records:
        manifest["videos"][video] = records

name = "sample-manifest.json" if args.sample else "manifest.json"
(BASE/name).write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
