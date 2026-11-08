# VISION audio provenance

All narration was synthesized on this Windows computer using the CPU. The approved Arabic script was never submitted to a hosted speech or inference service.

## Narration

- Runtime: Piper TTS 1.8.0 / ONNX Runtime CPU.
- Voice: `ar_JO-kareem-medium`, one Arabic male speaker, 22,050 Hz.
- Model source: https://huggingface.co/rhasspy/piper-voices/tree/main/ar/ar_JO/kareem/medium
- The original model card is preserved in `models/MODEL_CARD.txt`; its dataset reference is https://github.com/AliMokhammad/arabicttstrain/ . The model card delegates dataset licensing to that reference; no new license claim is made here.
- Scripts in `scripts.json` preserve the approved plain text and manually vocalized synthesis text. VISION is supplied in Latin letters in synthesis for a correctly pronounced /v/.
- Synthesis parameters: length 1.04; noise 0.5; width noise 0.65; volume 0.82.
- Local generation script: `generate_narration.py`. It contains no network code; model downloads were separate.

## Original sound design

`build_mix.py` synthesizes all background tones, transition sounds, UI clicks, notification notes and the scanner sound from mathematical oscillators and seeded noise. No recordings or third-party music samples are used.

The sparse tonal bed is deliberately quiet beneath the voice. Per-scene speech begins 0.75 seconds after the visual scene start. Final mixes are stereo, 48 kHz, 24-bit PCM, with an AAC copy. FFmpeg loudness processing targets -17 LUFS and -1.5 dBTP.

## QA limits

`audio-qa.json` records duration fit, peak levels, clipping counts and the loudness processor's measurements. Phoneme inspection confirmed the brand's initial /v/. No human listening approval is implied by these automated measurements.
