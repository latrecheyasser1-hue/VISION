# VISION — Inside one click / HyperFrames remake

The requested film rebuilt using official HyperFrames0.8.216 and its current authoring contract.1080×1920,30fps,36.45seconds. Formal Arabic narration with English technical terms preserved in English. New speech; no voice cloning.

- `index.html` mounts7 editable scenes plus the caption composition.
- `build.cjs` regenerates source from the preserved scripts and schedule.
- `narrate.py` holds narration text/voice/cache; online Microsoft narration only.
- `mix.py` arranges existing local original music and bundled HyperFrames SFX.
- `hf.cjs` runs the pinned official installed CLI with below-normal process priority.
- `deliverables/04-VISION-Request-HyperFrames.mp4` is the final file once qa/delivery.json verifies it.
- `REVIEW.md` states actual checks and limitations.

Render locally: `node hf.cjs render --quality delivery --workers 1 --low-memory-mode --fps 30 --output deliverables/04-VISION-Request-HyperFrames.mp4`.

Reference: https://github.com/heygen-com/hyperframes . Installed official authoring/CLI skills in the user's Codex skills directory; registry/media-use installed by the official scaffold. Agent-cursor and cinematic-zoom registry sources were inspected for their approach; the rendered machine and SVG travel are custom adaptations, not mounts of the unmodified demos.

No Blender, paid rendering, client screens or automatic publishing. Prior exports remain untouched.
