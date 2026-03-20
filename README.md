# APEX Autopilot — Instagram Command Center

AI-powered Instagram content management for APEX Agency.

**Stack:** Next.js 14 + Gemini 3.1 Pro (text) + Nano Banana 2 (images)

---

## Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

```bash
# In this folder:
git init
git add .
git commit -m "APEX Autopilot v3"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/apex-autopilot.git
git push -u origin main
```

### Step 2: Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your `apex-autopilot` repo from GitHub
4. Framework: **Next.js** (auto-detected)
5. Click **Deploy**
6. Wait ~60 seconds

Your app will be live at `apex-autopilot.vercel.app` (or customize the domain).

### Step 3: Use it

1. Open your deployed URL
2. Click ⚙ Settings
3. Paste your Gemini API key (from aistudio.google.com)
4. Click **▲ GENERATE WEEK**
5. Review posts, approve, download all

---

## Run Locally

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## How It Works

- **Gemini 3.1 Pro** writes captions using real APEX website data
- **Nano Banana 2** generates branded images automatically
- **6 pillar templates** (SVG) ensure consistent brand identity
- **Self-learning engine** tracks performance and adjusts strategy
- **Asset request queue** flags posts that need your photos
- API calls go through `/api/gemini` server route (no CORS issues)
- Settings saved in browser localStorage

## Cost

~$1.50/month for 20 posts with images. Your API key never leaves your browser → server route → Google. It's never stored on any server.
