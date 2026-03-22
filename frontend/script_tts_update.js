/**
 * UPDATED TTS VOICE SELECTION - ULTRA NATURAL HUMAN-LIKE FEMALE VOICE
 * Replace the selectBestVoice() function in script.js with this improved version
 * 
 * This prioritizes Microsoft Edge Neural voices which sound almost identical to
 * premium services like ElevenLabs, but are completely free!
 */

function selectBestVoice() {
  console.log('🎙️ Available voices:', voices.length);
  console.log(voices.map(v => `${v.name} (${v.lang})`).join('\n'));
  
  // Priority 1: Microsoft Edge Neural voices (BEST - sound exactly like human)
  // These are high-quality neural TTS voices that rival premium services
  const edgeNeuralFemale = [
    'Microsoft Aria Online (Natural) - English (United States)',
    'Microsoft Jenny Online (Natural) - English (United States)', 
    'Microsoft Michelle Online (Natural) - English (United States)',
    'Microsoft Ana Online (Natural) - English (United States)',
    'Microsoft Emma Online (Natural) - English (United States)',
    'Microsoft Sonia Online (Natural) - English (United Kingdom)',
    'Microsoft Libby Online (Natural) - English (United Kingdom)',
    'Microsoft Clara Online (Natural) - English (Canada)',
    'Microsoft Natasha Online (Natural) - English (Australia)'
  ];
  
  selectedVoice = voices.find(v => edgeNeuralFemale.includes(v.name));
  
  if (selectedVoice) {
    console.log('✨ Found premium Microsoft Neural voice!');
  }
  
  // Priority 2: Any Microsoft Neural/Natural voice (still excellent)
  if (!selectedVoice) {
    selectedVoice = voices.find(v => 
      v.name.includes('Microsoft') && 
      (v.name.includes('Natural') || v.name.includes('Neural')) &&
      v.lang.includes('en')
    );
    if (selectedVoice) {
      console.log('✨ Found Microsoft Neural voice');
    }
  }
  
  // Priority 3: Google high-quality voices
  if (!selectedVoice) {
    selectedVoice = voices.find(v => 
      v.name.includes('Google') && 
      v.name.includes('female') &&
      v.lang.includes('en-US')
    );
    if (selectedVoice) {
      console.log('✨ Found Google female voice');
    }
  }
  
  // Priority 4: Apple/Mac high-quality voices (Samantha, Karen, Victoria, etc.)
  if (!selectedVoice) {
    const appleVoices = [
      'samantha', 'karen', 'victoria', 'allison', 
      'susan', 'fiona', 'moira', 'tessa', 'veena'
    ];
    
    selectedVoice = voices.find(v => {
      const nameLower = v.name.toLowerCase();
      return appleVoices.some(name => nameLower.includes(name)) && v.lang.includes('en');
    });
    
    if (selectedVoice) {
      console.log('✨ Found Apple premium voice');
    }
  }
  
  // Priority 5: Amazon Polly-style voices (if available)
  if (!selectedVoice) {
    const pollyVoices = [
      'joanna', 'kendra', 'kimberly', 'salli', 
      'ivy', 'emma', 'amy', 'olivia', 'aria'
    ];
    
    selectedVoice = voices.find(v => {
      const nameLower = v.name.toLowerCase();
      return pollyVoices.some(name => nameLower.includes(name)) && v.lang.includes('en');
    });
    
    if (selectedVoice) {
      console.log('✨ Found Polly-style voice');
    }
  }
  
  // Priority 6: Any female English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(v => 
      v.lang.includes('en') && 
      (v.name.toLowerCase().includes('female') ||
       v.name.toLowerCase().includes('woman'))
    );
    if (selectedVoice) {
      console.log('✨ Found female English voice');
    }
  }
  
  // Final fallback: First English voice available
  if (!selectedVoice) {
    selectedVoice = voices.find(v => v.lang.includes('en')) || voices[0];
    console.log('⚠️ Using fallback voice');
  }
  
  console.log('🎤 SELECTED VOICE:', selectedVoice ? selectedVoice.name : 'None');
  console.log('   URI:', selectedVoice ? selectedVoice.voiceURI : 'None');
  console.log('   Language:', selectedVoice ? selectedVoice.lang : 'None');
  console.log('   Local:', selectedVoice ? selectedVoice.localService : 'None');
  
  return selectedVoice;
}

/**
 * USAGE NOTE:
 * 
 * For the MOST NATURAL human-like voice:
 * 1. Use Microsoft Edge browser (has the best free neural voices)
 * 2. The voice will automatically select "Aria" or "Jenny" which sound very human
 * 3. Adjust speech rate to 0.85-0.95 for more natural pacing
 * 
 * Alternative free options:
 * - Chrome on Mac: Will use Samantha (good quality)
 * - Chrome on Windows: Will use Zira or native voices
 * - Firefox: Limited voice selection, may need premium service
 * 
 * For PREMIUM human-like voice (optional upgrade):
 * - ElevenLabs API (500 chars/month free): https://elevenlabs.io
 * - Google Cloud TTS (300 chars/month free): https://cloud.google.com/text-to-speech
 * - See ELEVENLABS_INTEGRATION.md for integration guide
 */
