# ASO Analyzer Free - Deployment Guide

This guide covers deploying both the frontend (React app) and backend (Node.js API) for the ASO Analyzer Free project.

## Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   AI Providers  │
│   (React/Vite)  │───▶│   (Node.js)     │───▶│   Gemini/Claude │
│   Netlify       │    │   Railway/Heroku│    │   External APIs │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Frontend Deployment (Netlify)

### Option 1: Automatic Deployment (Recommended)

1. **Connect Repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com/)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Configure build settings:
     - **Base directory**: `frontend`
     - **Build command**: `npm run build`
     - **Publish directory**: `frontend/dist`

2. **Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add: `VITE_API_URL` = `https://your-backend-url.com/api`

3. **Deploy**
   - Netlify will automatically deploy on every push to main branch

### Option 2: Manual Deployment

```bash
cd frontend
npm install
npm run build
netlify deploy --prod --dir=dist
```

## Backend Deployment (Railway)

1. **Deploy to Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway deploy
   ```

2. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=3000
   AI_PROVIDER=gemini
   GEMINI_API_KEY=your_gemini_api_key
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```

## Quick Start

1. **Deploy Backend**: Use Railway or Heroku
2. **Deploy Frontend**: Use Netlify
3. **Configure Environment Variables**
4. **Test the Application**

For detailed instructions, see the sections above.