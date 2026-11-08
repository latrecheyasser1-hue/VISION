# VISION — educational reels 04–06

Three original, portrait motion graphics made from Yasser's approved educational scenarios. No sales CTA, no client screenshots and no private client data. Previous approved V3 films and the website are preserved.

## Deliverables

- `renders/04-VISION-request.mp4` — the frontend → backend → database request journey, 25.87 seconds.
- `renders/05-VISION-profit.mp4` — sales, costs and incomplete data, 27.70 seconds.
- `renders/06-VISION-undo.mp4` — reversing a sale and preserving its audit trail, 29.17 seconds.
- Matching `.ar.srt` captions and `.jpg` poster frames alongside each video.
- Existing unified Reels cover: `../../assets/social/VISION-Reels-1080x1920.png`.

1080×1920 (9:16), 30fps, H.264, AAC stereo 48kHz. Arabic captions are burned into the videos. The SRT copies are for editing; don't enable duplicate platform captions unless desired.

## Creative direction

Read `DESIGN.md` for the visual system. White, ice and cyan; large Arabic typography; dimensional diagrams; physical changes in the examples. The main inspiration was the typography, geometric transformation and changing scale in [this Prompt Motion reference](https://prompt-motion.com/motiondsgnr-9dcfa6). Its footage is not included in these films. The three visual modules are original code and fictional examples.

Narration uses the previously approved Microsoft `ar-DZ-IsmaelNeural` voice and V3 pace: +22% speech rate, excess pauses shortened, 1.12× post-tempo with preserved pitch. Music and source effects reuse the approved V3 sound catalog; see `../v3/catalog-assets.json` and the audio provenance files. Additional effects are synthesized. Motion markers drive click, whoosh, impact, scan, pop and confirmation sounds. Music ducks under the actual narration envelope.

The profit illustration is a simplified example for one period, before other costs or taxes. The undo example preserves a cancelled invoice and reverses the sale's stock and financial effects. These are teaching diagrams, not screenshots of implemented client systems.

## Rebuild

From the repository workspace:

```powershell
node videos/social-04-06/build.cjs all
node videos/social-04-06/render.cjs all --qa
python videos/social-04-06/mix.py request
python videos/social-04-06/mix.py profit
python videos/social-04-06/mix.py undo
node videos/social-04-06/render.cjs all
python videos/social-04-06/finalize.py
```

`build.cjs` embeds local fonts, GSAP and each original scene module in a seekable composition. The renderer uses a local Chromium instance via pipes, with no website navigation. `request.js`, `profit.js` and `undo.js` own the visuals. Narration timings live in the matching `*-schedule.json` files; regenerate motion markers and audio mixes after any timing change.

## Verification

- `qa/*-layout.json`: two visual samples per scene, text frame bounds, caption layout and browser errors.
- `qa/*-lint.json`: HyperFrames source lint; all three compositions pass with zero errors and zero warnings.
- `qa/metadata-equivalence.json`: final source metadata cleanup checked against the export's sampled images.
- `audio/narration-qa.json`: speech files and scene boundaries.
- `audio/final-mix-qa.json`: final mix timing, loudness, marker alignment and clipping.
- `qa/*-delivery.json`: full final video decode, resolution, frame rate, audio channels and duration.

The new visual treatment is a proposed continuation of VISION's approved fast motion style, ready for Yasser's review.
