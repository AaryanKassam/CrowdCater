# Setup Guide for CaterAI

## 📍 Root Directory Information

**Your root directory is called:** `CaterAI`  
**Full path:** `/Users/aaryankassam/CaterAI`

This is where ALL commands should be run and where ALL files should be created.

---

## Step 1: Install Node.js (Required First!)

You got "command not found: npm" because Node.js is not installed. You need to install it first.

### Option A: Using Homebrew (Recommended for Mac)
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

### Option B: Download from Official Website
1. Go to https://nodejs.org/
2. Download the LTS (Long Term Support) version for macOS
3. Run the installer
4. Restart your terminal

### Verify Installation
After installing, verify it works:
```bash
node --version
npm --version
```

You should see version numbers. If you still get "command not found", restart your terminal.

---

## Step 2: Navigate to the Root Directory

Open your terminal and run:
```bash
cd /Users/aaryankassam/CaterAI
```

Or if you're already in your home directory:
```bash
cd CaterAI
```

**Verify you're in the right place:**
```bash
pwd
# Should show: /Users/aaryankassam/CaterAI

ls
# Should show files like: package.json, tsconfig.json, app/, components/, etc.
```

---

## Step 3: Install Dependencies

**Location:** Run this in the root directory (`/Users/aaryankassam/CaterAI`)

```bash
npm install
```

This will create a `node_modules` folder and install all required packages.

---

## Step 4: Create the .env.local File

**Location:** Create this file in the root directory (`/Users/aaryankassam/CaterAI`)

You can create it using:
```bash
touch .env.local
```

Then open it in your editor and add:
```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Or create it manually:**
1. Open Finder
2. Navigate to `/Users/aaryankassam/CaterAI`
3. Create a new file called `.env.local` (the dot at the beginning is important!)
4. Add the two lines above with your actual API keys

---

## Step 5: Get Your API Keys

### OpenAI API Key
1. Go to https://platform.openai.com/
2. Sign up or log in
3. Click on your profile → "API Keys"
4. Click "Create new secret key"
5. Copy the key and paste it in `.env.local` after `OPENAI_API_KEY=`

### Google Maps API Key
1. Go to https://console.cloud.google.com/
2. Create a new project or select existing one
3. Enable these APIs:
   - Places API - 
   - Geocoding API 
   - Maps JavaScript API
4. Go to "Credentials" → "Create Credentials" → "API Key" AIzaSyBg1h2wQZNchSTb1DsOcu3XrkVKoBIrzPg
5. Copy the key and paste it in `.env.local` after `GOOGLE_MAPS_API_KEY=`

---

## Step 6: Run the Development Server

**Location:** Run this in the root directory (`/Users/aaryankassam/CaterAI`)

```bash
npm run dev
```

You should see:
```
▲ Next.js 14.0.4
- Local:        http://localhost:3000
```

**Open your browser and go to:** http://localhost:3000

---

## Quick Reference

| What | Where |
|------|-------|
| **Root Directory** | `/Users/aaryankassam/CaterAI` |
| **Install Dependencies** | Run `npm install` in root directory |
| **Create .env.local** | Create in root directory |
| **Run Dev Server** | Run `npm run dev` in root directory |
| **View App** | http://localhost:3000 |

---

## Troubleshooting

### "command not found: npm"
→ Install Node.js first (Step 1)

### "Cannot find module"
→ Make sure you ran `npm install` in the root directory

### "API key not configured"
→ Make sure `.env.local` exists in the root directory with your keys

### Port 3000 already in use
→ Either stop the other process or run: `npm run dev -- -p 3001`

---

## File Structure

```
CaterAI/                    ← ROOT DIRECTORY (this is where you run commands)
├── .env.local             ← CREATE THIS FILE HERE
├── package.json
├── tsconfig.json
├── app/
├── components/
├── lib/
├── types/
└── node_modules/          ← Created after running npm install
```

