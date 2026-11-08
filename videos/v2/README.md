# VISION v2 — faster, brighter, audible music

This revision responds to the rejected slow first version.

- Regenerated local Arabic speech at about 1.5x the previous speaking pace, with shorter pauses and brighter vocal processing.
- Scene timings follow the new voice with only 0.20 seconds lead and about 0.35 seconds tail.
- Faster scene builds and transitions by piecewise retiming the approved GSAP choreography.
- Original 120 BPM rhythmic kick/snare/hat/bass/pluck background music, audible below the narration with ducking.
- Clear transition, UI and scanner effects.
- Stereo mix around -14 LUFS / -1 dB true peak.
- No client content. All interfaces, objects, examples and data remain fictional.

`renders/preview-fast.mp4` is the 17-second style preview.
Finished films are `renders/*-fast.mp4` (excluding `*-silent.mp4`).

Sources are `capture.cjs`, `audio/`, and the original authored scene sources in the parent videos folder. Voice inference and rendering run locally. Captions are re-timed to the faster voice.
