# VISION motion graphics — rebuilt edition

Three new films with Arabic Microsoft Ismael narration, distinct from the rejected Kareem versions. Native speech rate +22%; pauses shortened and tempo +12% without pitch changes. Only approved narration text was sent after user authorization. HeyGen speech generation failed from credits and produced no audio.

Final deliverables are in renders/: 01-VISION-brand.mp4, 02-VISION-commerce.mp4, 03-VISION-systems.mp4. 1920x1080,30fps,H264/AAC stereo48k. Matching Arabic SRTs and JPEG posters are supplied. All UI and object artwork is original illustrative material; no client content is included.

Audio: connected HeyGen catalog music1d11740a9c6e4d67816930416cb6b467; whoosh5ae247cc40f79d97, UIpop4558aa1365870399, click09a80f87b76086e4. Original synthesized impact/confirmation/scanner accents. Each sound peak is placed from animation event markers; real speech envelope ducks the music. Stems and actual level measurements: audio/mixes/<film>/qa.json.

Sources: intro.js,commerce.js,systems.js. build.cjs builds deterministic GSAP/HyperFrames HTML. render.cjs captures the paused timeline frame-by-frame through local Chromium. finalize.py checks full decode and delivery properties. SRT timing follows provider word boundaries adjusted through pause edits and tempo change; it is not a manually corrected transcript.

Rebuild with node build.cjs all, node render.cjs all, python mix.py <film>, python finalize.py. Do not rerun speech.py without intending to regenerate speech. V1/V2 files are preserved separately.
