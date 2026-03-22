# Viking Sea Cinematic Audio Assets

This directory contains all the orchestral, SFX, and ambient layers for the Viking Sea experience.

## Required Audio Files

### Orchestral Themes
- `viking_opening_theme.mp3` - Epic opening (strings, horns, drums)
- `viking_voyage_theme.mp3` - Journey begins (adventurous, building)
- `viking_discovery_theme.mp3` - Exploration (wonder, discovery)
- `viking_storm_rising.mp3` - Tension building (dark strings, ominous)
- `viking_battle_drums.mp3` - Combat ready (war drums, intense)
- `viking_victory_fanfare.mp3` - Triumph (brass fanfare, celebratory)
- `viking_ending_theme.mp3` - Resolution (epic but settling)

### Sound Effects
- `ship_creaks.mp3` - Wooden ship creaking
- `sails_flapping.mp3` - Billowing sails
- `rope_creaks.mp3` - Rope tension
- `crew_orders.mp3` - Faint crew shouting
- `waves_crashing.mp3` - Ocean waves
- `wind_howling.mp3` - Strong wind
- `seagulls.mp3` - Calling seagulls
- `thunder_distant.mp3` - Thunder
- `wind_intensifies.mp3` - Storm wind
- `ship_rocks.mp3` - Ship tilting/rocking
- `drums_war.mp3` - War drums
- `swords_clash.mp3` - Metal weapons
- `horn_battle_call.mp3` - Horn signal
- `cheer_crew.mp3` - Crew celebration
- `horn_fanfare.mp3` - Victory horn
- `bells_celebration.mp3` - Celebration bells
- `distant_land.mp3` - Shore sounds
- `waves_gentle.mp3` - Calm water

### Ambient Pads (Emotional Sustenance)
- `ocean_distant_waves.mp3` - Subtle ocean ambience
- `storm_brewing.mp3` - Building storm pad
- `endless_sea_pad.mp3` - Open ocean emotion
- `storm_pad_intense.mp3` - Dark, ominous pad
- `adrenaline_pad.mp3` - Heart-pounding tension
- `victory_pad.mp3` - Triumphant emotion
- `resolution_pad.mp3` - Peaceful conclusion

## Recommended Sources

### Free/Royalty-Free Audio
1. **Epidemic Sound** - High-quality orchestral & SFX library
2. **YouTube Audio Library** - Search: "epic orchestral", "Norse", "cinematic"
3. **Freesound.org** - Community SFX (filter by CC0/CC-BY license)
4. **Pixabay Music** - Free high-quality orchestral themes
5. **Zapsplat** - Cinematic sound effects & orchestral music

### Search Terms
- "Epic orchestral theme"
- "Viking Norse music"
- "Ship sailing sound effect"
- "Ocean waves ambience"
- "War drums cinematic"
- "Victory fanfare"

## Implementation Notes

- **Duration**: Keep orchestral themes 2-4 minutes (loop during scenes)
- **Format**: MP3 for web compatibility
- **Volume**: Normalize all files to -14dB to -16dB LUFS
- **Layering**: Orchestral plays softly (0.4 volume) under narration
- **Ducking**: Orchestral reduces to 0.15 when voice speaks

## Audio Layering Example

```
Timeline (seconds):
0s    |[Orchestral Theme]──────────────────────
      |                    [SFX: Ship Creaks]─
      |[Ambient Ocean]─────────────────────────
10s   |🎙️ Narration starts (orchestral ducks to 0.15)
      |[Voice narration]──────────────────
      |[SFX: Wind]─────────────────────
25s   |🎙️ Narration ends (orchestral returns to 0.4)
```

## Quality Checklist

- [ ] All audio files normalized to consistent loudness
- [ ] Orchestral themes tested with volume ducking
- [ ] SFX validated at appropriate volumes (not overpowering)
- [ ] Ambient pads tested for smooth looping
- [ ] Voice narration sits clearly above all layers
- [ ] Crossfades between scenes tested (1000ms)
- [ ] Mobile device playback tested (smaller audio files)

## Performance Tips

- Use `.mp3` format (better compression than WAV)
- Compress audio to 128-192 kbps bitrate
- Remove silence/dead space from ends
- Keep files under 5MB when possible
- Pre-cache frequently used layers in browser
