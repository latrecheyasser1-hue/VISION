# Distinct local Arabic voice, v3

The user rejected the Kareem speaker. V3 does not load Kareem, reuse his audio, or create a new speaker through pitch shifting.

## Model actually used

- Author source: https://huggingface.co/vadimbelsky/arabic-emirati-female-piper
- Model: `arabic-emirati-female-model.onnx`, 63.5 MB, one distinct female speaker.
- Declared dialect: Emirati Arabic. The provided script remains the approved formal Arabic text, manually vocalized.
- License metadata: `license: mit` in the author's model card, saved unchanged in `models/MODEL_CARD.md`. MIT permits commercial use subject to its terms; no exclusive-rights claim is made.
- SHA-256: `1578a9b27d01a0626227225b148179628b770607dd61bdbbc41865bd399106b1`.
- Runtime: existing local Piper 1.8 / ONNX Runtime CPU. The new model runs within the 8 GB machine's constraints and synthesizes seconds of audio within seconds.
- Inference is local. The only downloads were public model/config/card files. No project text or audio was submitted to an inference service.

## Audition

`voice-sample.wav` and `voice-sample.m4a` contain the approved first intro scene, about 7.44 seconds. They are dry voice-only samples so the speaker can be assessed clearly. There is no pitch shifting, time stretching or music masking the voice.

Native `length_scale=0.85`, noise=0.50, noise width=0.65, volume=0.88. Only small silent edges and phrase gaps were trimmed; a 3 ms anti-click edge is applied to edited clips. No pitch or speed post-processing is used.

Actual speaking rate varies with phrase length. The full intro averages about 130 Arabic space-delimited words per minute, rather than claiming 190. Achieving a strict 190 words/minute from this model would require much more aggressive duration compression, which would conflict with the requested intelligibility.

`manifest.json` contains scene durations, the exact approved text, individual spoken phrase files, and per-phrase start/duration relative to its scene. Phrase timing is measured from generated audio, not forced word alignment.

## Alternatives considered

- SA_dii high Piper: https://huggingface.co/csukuangfj/vits-piper-ar_JO-SA_dii-high . Author explicitly prohibits commercial use, so it was not used.
- FastPitch/MixerTTS local alternatives: https://huggingface.co/nipponjo/tts-arabic-onnx . More speaker IDs are available, but they require another model pipeline. The author model card does not plainly declare a model license, unlike the selected MIT model; they were not substituted silently.
- Large modern TTS such as XTTS/transformer models would require substantially larger downloads and/or more memory/compute. They were not necessary to deliver a genuinely different CPU voice audition.

Subjective quality and dialect suitability still require listening. No human listening approval is implied by successful synthesis.
