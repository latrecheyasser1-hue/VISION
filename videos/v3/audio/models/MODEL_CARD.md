---
language:
- ar
license: mit
tags:
- text-to-speech
- piper
- arabic
- emirati
library_name: piper
---

# Arabic (Emirati Female) - Piper TTS Model

This is a Piper TTS voice model for Arabic (Emirati dialect), trained with a female voice.

## Usage

### With Piper CLI

```bash
echo "مرحبا" | piper --model arabic-emirati-female-model.onnx --output_file output.wav
```

### With Python (piper-tts)

```python
from piper import PiperVoice
import wave

voice = PiperVoice.load("arabic-emirati-female-model.onnx")
with wave.open("output.wav", "wb") as wav_file:
    voice.synthesize_wav("مرحبا بكم في دبي", wav_file)
```

## Model Details

- **Language**: Arabic (Emirati dialect)
- **Voice**: Female
- **Sample Rate**: 22050 Hz
- **Format**: ONNX

## Training

This model was trained using the [Piper TTS](https://github.com/rhasspy/piper) training pipeline.
