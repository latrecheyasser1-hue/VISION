# VISION educational Reels 04–06 audio

The voice and pacing follow the user-approved V3 production: Microsoft
`ar-DZ-IsmaelNeural`, native speech rate `+22%`, local pause compaction and
pitch-preserving `atempo=1.12`. Only the script text is transmitted to Microsoft.
Existing V3 voice files are never replaced. Raw new speech and word timestamps
are cached under `audio/microsoft/` with a source fingerprint.

## Production

```powershell
python -u videos/social-04-06/speech.py
python videos/social-04-06/prepare_speech.py
python videos/social-04-06/mix.py request
python videos/social-04-06/mix.py profit
python videos/social-04-06/mix.py undo
```

The online speech command needs network access. Local preparation and mixing do
not generate hosted audio. They reuse the approved music and sound catalog at
`../v3/sound/`; provenance is recorded in `../v3/catalog-assets.json`.

## Timing contract

- IDs are `request`, `profit`, `undo`.
- Schedules have exactly six scenes: five narrated scenes and a silent 1.2s brand
  scene. All scene durations sum to the film duration and are 30fps aligned.
- `start` and `duration` locate a scene in the film.
- `voicePath` is relative to this directory; `voiceOffset` is the local scene
  speech offset. `words[].start` is relative to the processed speech file, so
  film word time is `scene.start + scene.voiceOffset + word.start`.
- The final scene has `text: ""`, `voicePath: null`, `voiceDuration: 0`, and
  `words: []`.
- Animation writes `<id>-hits.json`, an array of `{time,kind,level,pan}`. `time`
  is the visual/sonic peak in film seconds, not the sound file start. Kind is
  `whoosh`, `pop`, `click`, `impact`, `success`, or `scan`; level is linear and
  pan is −1 through 1.

## Mix and checks

Narration determines scene duration; no spoken words are truncated to fit.
Music is sidechained from the actual voice RMS envelope and calibrated 10dB
below active voice RMS. The master targets −14LUFS and −1.2dBTP, 48kHz stereo.
Every rendered mix includes separated stems, a WAV master, AAC, and `qa.json`
recording loudness, source, sound markers, duration, peaks, and clipping count.
The mixer rejects out-of-range hit markers or narration that overruns a scene.

No client data, project screenshots, passwords, or live client interfaces are
sent to speech generation. Content is educational with a short brand signature,
not a sales CTA. The profit example is simplified and must retain the on-screen
qualification before other costs or taxes.
