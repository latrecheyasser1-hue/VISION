# VISION — Three motion graphics films

The approved Arabic scenarios, black/white/cyan identity and local voice generation are preserved. All illustrations, product examples, QR art, transactions and interfaces are fictional. No client screenshots, footage, products or records appear.

## Delivery

- `renders/01-vision-introduction.mp4` — 61.451 s
- `renders/02-vision-ecommerce.mp4` — 79.125 s
- `renders/03-vision-management.mp4` — 83.709 s

1920 × 1080, 30 fps, H.264 video, AAC stereo audio, fast-start MP4. Arabic narration, baked reading captions, original synthesized background tones and effects. Separate Arabic SRT/VTT sidecars are included. `review.html` plays the three films locally.

## Sources

- `DESIGN.md`: visual identity and constraints.
- `intro/scenes.js`, `commerce/scenes.js`, `systems/scenes.js`: authored scenes and choreography.
- `shared/`: local fonts, GSAP, visual primitives and timing engine.
- `audio/manifest.json`: exact voice scripts and measured narration durations.
- `audio/schedule.json`: frame timing and scene durations.
- `audio/{intro,ecommerce,systems}/`: narration WAVs, separate stems, final mix, SRT and VTT.
- `audio/PROVENANCE.md`: local narration engine/model provenance.
- `qa/`: rendered layout checks and final codec/decode checks.

The spoken text in intro scene 3 is exactly: «ثم نبرمج لك نظاماً يناسب متطلباتك.»

## Rebuild

Use Node >= 22, HyperFrames CLI, local Chrome and FFmpeg.

1. `node videos/build.cjs`
2. Run `hyperframes lint videos/intro` (repeat for commerce and systems).
3. `node videos/capture.cjs all`
4. The capture script exports the exact inspected paused GSAP timelines and calls `finalize.py` to mux and validate each result.

On this machine, the installed HyperFrames 0.6.70 export path produced blank frames although its snapshots were correct. The delivered films therefore use a deterministic local Chrome/FFmpeg capture of the same authored compositions. `capture.cjs` records every frame directly, and final validation extracts real MP4 frames as well as decoding the full files. No cloud rendering is used.

Run `audio/build_mix.py` if the scene schedule changes. TTS synthesis uses downloaded Piper weights locally; no narration text is submitted to remote inference. Model/runtime folders are working dependencies and need not be distributed with the finished videos.

Do not use the fictional data as performance claims. Connection to stock/POS/delivery and offline use are explicitly conditional in the narration. Audio was measured for clipping and level; visual inspection covered scene builds, completed states and transitions.
