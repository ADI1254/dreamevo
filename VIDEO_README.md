# DreamPulse Video Background

## Video Setup

The application uses background videos that play during dream experiences, with a special video for the Journey world.

### Video Files
- `dream_background.mp4` - Default background video for Sanctuary and Exploration worlds
- `done.mp4` - Special background video that plays when Journey world is selected

### Video Specifications
- **Format**: MP4 (H.264 codec recommended)
- **Resolution**: 1920x1080 (Full HD) or higher recommended
- **Duration**: 4-5 minutes minimum (will loop if shorter)
- **Style**: Ambient, dream-like visuals that complement the audio narration
- **Content**: Peaceful, flowing imagery that doesn't distract from the experience
- **File Size**: Keep under 50MB for web performance

### How It Works
- **Journey World**: Plays `done.mp4` when selected
- **Other Worlds**: Play `dream_background.mp4`
- Video starts playing when the ambient audio begins (after the intro)
- Plays at 30% opacity behind the UI elements
- Loops continuously during the experience
- Fades out when the experience ends

### Adding Your Videos
1. Prepare your video files with the specifications above
2. For the Journey world special video: rename to `done.mp4`
3. For other worlds: rename to `dream_background.mp4`
4. Place both files in `frontend/assets/videos/` (replace the empty placeholder files)
5. The videos will automatically play based on world selection

### Troubleshooting
- If video doesn't play, check browser console for errors
- Ensure videos are H.264 encoded MP4
- Check file size isn't too large for web playback
- Videos will gracefully fail and continue with audio-only experience if loading fails