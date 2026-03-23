/**
 * Vercel Serverless — GET /api/story/:world/:mood
 * Reads story text from bundled data/stories (no Python / Render).
 */
const fs = require('fs').promises;
const path = require('path');

const ALLOWED = {
  world: new Set(['journey', 'sanctuary', 'exploration', 'clearing', 'viking', 'claude']),
  mood: new Set(['calm', 'confident', 'curious', 'tts'])
};

function storyFileName(world, mood) {
  if (world === 'claude' && mood === 'tts') return 'claude_story_tts.txt';
  return `${world}_${mood}.txt`;
}

module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const world = String(req.query.world || '').toLowerCase();
  const mood = String(req.query.mood || '').toLowerCase();

  if (!ALLOWED.world.has(world) || !ALLOWED.mood.has(mood)) {
    return res.status(400).json({ error: 'Invalid world or mood' });
  }

  const base = path.join(process.cwd(), 'data', 'stories');
  let fileName = storyFileName(world, mood);
  let filePath = path.join(base, fileName);

  try {
    let text = await fs.readFile(filePath, 'utf8');
    return res.status(200).json({ world, mood, story: text });
  } catch {
    /* clearing: fall back to exploration stories if no clearing_*.txt */
    if (world === 'clearing') {
      fileName = `exploration_${mood}.txt`;
      filePath = path.join(base, fileName);
      try {
        const text = await fs.readFile(filePath, 'utf8');
        return res.status(200).json({ world, mood, story: text });
      } catch {
        /* fall through */
      }
    }
    return res.status(404).json({ error: 'Story not found' });
  }
};
