# DreamPulse Wix Integration Guide

## Current Setup
- **Wix Site**: https://jujveb-my-site-q10i3vos-yoanoneglobalsolut.wix-vibe-site.com/
- **Backend**: FastAPI running on port 8000 (local)
- **Frontend**: HTML/JS app in `frontend/` folder

## Integration Options

### ⭐ OPTION 1: Hybrid Approach (Recommended)
Use Wix for marketing, redirect to your frontend for the actual experience.

**Steps:**
1. Deploy your backend to a cloud service:
   - **Railway** (free tier): https://railway.app
   - **Render** (free tier): https://render.com
   - **PythonAnywhere** (free tier): https://www.pythonanywhere.com
   
2. Deploy your frontend:
   - **Netlify**: https://netlify.com (easiest - drag & drop)
   - **Vercel**: https://vercel.com
   - **GitHub Pages**: Free with your repo
   
3. Update Wix buttons:
   - "Begin Your Journey" → Link to your deployed frontend
   - "Explore Journey" → Link with `?world=journey`
   - "Enter Sanctuary" → Link with `?world=sanctuary`
   - "Begin Romance" → Link with `?world=exploration`

**Pros:**
✅ Keep beautiful Wix landing page
✅ No Wix limitations on your experience
✅ Full control over user experience
✅ Easy to maintain

**Cons:**
❌ Users leave Wix site to use app

---

### OPTION 2: Full Wix Integration (Wix Velo)
Build the experience directly in Wix using their code platform.

**Steps:**

1. **Enable Wix Velo** (Developer Mode):
   - In Wix Editor, click "Dev Mode" at top
   - Enable Velo

2. **Deploy Your Backend**:
   - Your FastAPI backend MUST be publicly accessible
   - Deploy to Railway/Render/PythonAnywhere
   - Note the public URL (e.g., `https://dreampulse-backend.railway.app`)

3. **Update Backend CORS** (already configured in main.py):
   ```python
   allow_origins=["*"]  # Already set - allows Wix to call it
   ```

4. **Add Backend Function in Wix**:
   - In Velo, create file: `backend/http-functions.js`
   - Paste code from `wix-backend-code.js`
   - Replace `BACKEND_URL` with your deployed backend URL

5. **Add Frontend Code**:
   - Select a button (e.g., "Explore Journey")
   - Click "Add event" → onClick
   - Paste code from `wix-frontend-code.js`
   - Update button IDs to match your Wix elements

6. **Add Story Display Elements**:
   - Add a Text element for story content (ID: `storyText`)
   - Add a loading indicator (ID: `loadingText`)
   - Add an error message element (ID: `errorText`)
   - Optional: Create a Lightbox for immersive story display

**Pros:**
✅ Users stay on Wix site
✅ Seamless experience
✅ Use Wix design tools

**Cons:**
❌ Limited audio/video control in Wix
❌ May not support Web Speech API
❌ Backend deployment required (no localhost)
❌ Wix Velo learning curve

---

### OPTION 3: Embedded iFrame
Embed your frontend inside a Wix page.

**Steps:**
1. Deploy your frontend (Netlify/Vercel)
2. In Wix, add "HTML iFrame" element
3. Set source to your frontend URL
4. Style to fit your Wix page

**Pros:**
✅ Keep Wix design
✅ Run your frontend as-is

**Cons:**
❌ iFrame limitations (audio autoplay, fullscreen)
❌ Mobile responsiveness issues
❌ Not recommended for immersive experiences

---

## Quick Start: Deploy Backend

### Railway Deployment (Easiest)
```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Initialize project
cd f:\DREAMPULSE 6 JAN 26\NEW\dreampulse\backend
railway init

# 4. Add requirements.txt if missing
echo "fastapi
uvicorn[standard]" > requirements.txt

# 5. Deploy
railway up
```

### Update Backend URL in Frontend
Once deployed, update your frontend to point to the Railway URL:

```javascript
// frontend/script.js or claude_experience.js
const BACKEND_URL = 'https://your-app.railway.app'; // Replace localhost
```

---

## Recommended Path

**For Best Results:**
1. ✅ Deploy backend to Railway (5 minutes)
2. ✅ Deploy frontend to Netlify (drag & drop folder)
3. ✅ Update Wix "Begin Your Journey" button to link to Netlify URL
4. ✅ Keep Wix as your marketing/landing page

This gives you:
- Professional Wix landing page
- Full control over user experience
- No limitations from Wix platform
- Easy updates and maintenance

---

## Testing Locally First

Before deploying, test the connection:

1. **Start your backend**:
   ```bash
   cd backend
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Use ngrok to expose it publicly** (temporary):
   ```bash
   ngrok http 8000
   ```
   
3. **Test from Wix** using the ngrok URL

---

## Need Help?
- Wix Velo Docs: https://www.wix.com/velo/reference/api-overview/introduction
- Railway Docs: https://docs.railway.app/
- Netlify Docs: https://docs.netlify.com/
