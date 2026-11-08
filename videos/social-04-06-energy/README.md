# VISION ENERGY — revision after speed/quality rejection

The user rejected videos/social-04-06-local as slow and insufficiently technical. This is a new editorial and motion build, not a sped-up export. The originals remain untouched.

| Film | Duration | Voice | Rate | Original score |
|---|---:|---|---|---:|
| Request |25.816667s|ar-SA-HamedNeural|+32%|142 BPM|
| Profit |26.55s|ar-SA-ZariyahNeural|+28%|132 BPM|
| Undo |24.383333s|ar-EG-ShakirNeural|+30%|148 BPM|

Formal Arabic narration with software-development terminology; phonetic Arabic spellings instruct the speech provider, while caption assembly rejoins the corresponding terms into their English spelling. Captions use actual word timestamps. No additional time-stretch is applied; pitch is not shifted.

## Visual and factual revisions
- Request: kinetic CLICK, JSON payload, POST /orders, API, Backend validation, database INSERT, 201 Created response. Validation checkmarks and their sounds follow the words for data, price and stock.
- Profit: Revenue versus Profit, fixed100,000 base with60/15/25 geometric portions, simplified25,000 result, SQL example and a missing expense field. No invented revenue uplift. Example is before any additional costs/taxes.
- Undo: distinguish Delete from undo, group sale updates in a transaction, Rollback **before** Commit; after commit use a compensating action and retain the audit trail. Demo user and invoice are fictional.
- Each film has a different rapid instrumental arrangement and event score. 20 /15 /15 discrete effects, independent of rhythmic percussion. Local synthesis, no downloaded song.

## Production
User explicitly chose lightweight local work without Blender/Higgsfield. Motion-design source principles were adapted into deterministic SVG/CSS/GSAP, not presented as a photorealistic recreation. Arabic fonts and GSAP are embedded; no remote visual assets or page requests during render. Microsoft receives narration text only under earlier authorization.

`deliverables/` contains finished MP4, matching SRT and frame posters. `VISION-ENERGY-04-06.zip` is created only after all three full-decode checks pass. `production-status.json` distinguishes delivery from user creative approval.

Run `node build.cjs`, `node render.cjs all --qa`, `python score.py request profit undo`, then `node render.cjs all --deliver`. Render is serial with one Chromium, below-normal priority and a two-thread encoder. Native1080×1920 /30fps /H.264 /AAC.

## Verification scope
Lint and runtime checks, rendered scene samples, title/data bounds, deterministic timelines, complete final-file decode and audio signal metrics are checked. Sampled frames and numeric audio checks are not claimed as a full human real-time viewing/listening pass. User creative review remains necessary.

Final-frame review caught a brief overlap in caption transitions. Caption intervals are now clamped before the next group and replaced without crossfading; qa/caption-timing.json checks that at most one group is visible. All three films were re-exported after that correction.

The installed framework's contrast sampler includes hidden or covered scenes, incorrectly comparing white-on-ink text against the ice background of another scene. Its runtime returns ok; active visual backgrounds are checked in the actual scene samples. Large foreground text uses ink/ice, ink/cyan, white/ink and cyan/ink; POST on ice is darkened to #00738D. Outlined echo type is decorative. See qa/contrast-notes.json.
