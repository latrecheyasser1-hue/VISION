# VISION v2 audio

V1 files were preserved. All v2 synthesis and processing occurred locally.

## Narration revision

The same approved Arabic script is regenerated with the local Piper Kareem medium male voice. Native synthesis length is 0.69 rather than V1's 1.04. Long sentence padding was removed. Rubber Band adds a further 1.055 tempo multiplier and a small +0.68 semitone lift with formants preserved. Presence EQ reduces 240 Hz and lifts 2.6 kHz, with light compression. This is approximately 1.5 times the V1 speaking speed, plus shorter gaps between scenes.

`manifest.json` records each actual speech duration. Scene speech starts at +0.20 seconds and each visual scene has at least a 0.35 second tail. Root schedules quantize durations to 30 fps.

## Music and effects revision

`build_v2_mix.py` synthesizes a new deterministic 120 BPM electronic groove with kick, backbeat snare, alternating hi-hats, syncopated bass, chord stabs and stereo plucks. It begins immediately. The music sits about 11.6 dB below measured speech RMS while speaking and rises in gaps. A dedicated ducking envelope protects speech intelligibility. Transition whooshes and short interface tones are separate effects stems.

No third-party music, samples or remote speech processing were used. Mastering targets -14 LUFS and a ceiling near -1 dBTP (a -1.1 dBTP limiter target provides a small resampling margin) at stereo 48 kHz/24-bit PCM. The per-film `full/qa.json` files record the measured final loudness and ratio. AAC copies and separate narration/music/effects stems are included.

Caption files use groups of up to six Arabic words and approximate proportional timing within measured scene speech boundaries; they are not forced word alignment.

## Voice alternatives investigated

- SA_dii Piper high: https://huggingface.co/csukuangfj/vits-piper-ar_JO-SA_dii-high — explicitly excludes commercial use, so it was not used.
- Local FastPitch/MixerTTS with additional speaker IDs: https://huggingface.co/nipponjo/tts-arabic-onnx — available but not installed for this rapid revision.
- Emirati female Piper: https://huggingface.co/vadimbelsky/arabic-emirati-female-piper — a possible different voice, but dialect and speaker differ from the currently chosen male MSA voice; not used. The user requested Arabic fusha and local synthesis; male gender was an implementation choice.

The actual v2 model remains local Kareem, not a claim to a new speaker. No human listening approval is implied by automated level checks.
