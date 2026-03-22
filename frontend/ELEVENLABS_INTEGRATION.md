# ElevenLabs TTS Integration Guide

For premium, human-like audio similar to ElevenLabs, you can integrate their API.

## Setup

1. Get an ElevenLabs API key from https://elevenlabs.io
2. Add your API key to the environment or config

## Implementation

Replace the `speakText` function in `script.js` with ElevenLabs API calls:

```javascript
async function speakTextElevenLabs(text, options = {}, onEnd = null) {
  const ELEVENLABS_API_KEY = 'YOUR_API_KEY_HERE';
  const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel - calm, soothing voice
  
  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY
      },
      body: JSON.stringify({
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.0,
          use_speaker_boost: true
        }
      })
    });
    
    if (!response.ok) throw new Error('ElevenLabs API error');
    
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    audio.volume = options.volume || 0.88;
    audio.playbackRate = options.rate || 0.72;
    
    if (onEnd) {
      audio.onended = onEnd;
    }
    
    await audio.play();
  } catch (error) {
    console.error('ElevenLabs error:', error);
    // Fallback to Web Speech API
    speakText(text, options, onEnd);
  }
}
```

## Recommended Voices for DreamPulse

- **Rachel** (21m00Tcm4TlvDq8ikWAM) - Calm, soothing, natural
- **Domi** (AZnzlk1XvdvUeBnXmlld) - Warm, friendly
- **Bella** (EXAVITQu4vr4xnSDxMaL) - Soft, gentle
- **Antoni** (ErXwobaYiN019PkySvjV) - Deep, calming

## Cost Considerations

ElevenLabs has usage-based pricing. For production, consider:
- Caching audio responses
- Using Web Speech API as fallback
- Pre-generating common phrases






