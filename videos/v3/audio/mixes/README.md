# VISION V3 production audio

These are the active final soundtrack mixes for the three V3 motion films.

The production narrator is **Microsoft `ar-DZ-IsmaelNeural`**, a genuinely different speaker from the rejected Kareem voice. The parent production pipeline obtained this online speech after user authorization, at +22% voice rate, then tightened long pauses and applied a 1.12 tempo multiplier. Pitch is unmodified. The local female Piper audition remains a separate backup elsewhere and is not loaded by the mixer.

Each film folder contains:

- `mix.wav`: mastered stereo 48 kHz, 24-bit PCM; exact visual schedule length.
- `mix.m4a`: AAC listening copy.
- `narration.wav`, `music.wav`, `effects.wav`: aligned separate stems.
- `premix.wav`: floating-point unmastered mix.
- `qa.json`: measured loudness, clip checks, source voice metadata, speech onsets and every sound marker.

The current music and whoosh/pop/click sounds came from the connected HeyGen catalog and are preserved in `videos/v3/sound/`; catalog source records are in `videos/v3/catalog-assets.json`. No V1 or V2 score is used. The 18-second music clip loops with a 0.5-second crossfade. Impact/success/scan transients are synthesized locally.

Music sits 10 dB below measured speech RMS while voice is active and ducks from the actual delivered voice envelope. Sound markers are aligned to visual event peaks, using the agreed catalog offsets (whoosh 0.11 s, pop 0.05 s, click 0.065 s). The mixer rejects markers outside the retimed film. Individual narration starts at each scene's configured offset (0.18 s by default).

`QA_SUMMARY.json` consolidates measurements. The mastering target is approximately -14 LUFS with a -1.2 dBTP limiter ceiling to preserve a resampling margin. All three masters have zero clipped samples. Automated checks do not constitute subjective listening approval.

Rebuild only after schedules, voices and hit lists are final:

```powershell
python videos/v3/mix.py intro
python videos/v3/mix.py commerce
python videos/v3/mix.py systems
```
