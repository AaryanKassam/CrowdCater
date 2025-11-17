# Google Maps API REQUEST_DENIED Error - Fix Guide

## The Problem
You're getting "REQUEST_DENIED" even though billing is enabled. This is usually caused by **API key restrictions**.

## Solution Steps

### Step 1: Check API Key Restrictions
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your API key (`AIzaSyBg1h2wQZNchSTb1DsOcu3XrkVKoBIrzPg`)
4. Look at the **API restrictions** section

### Step 2: Fix API Restrictions

**Option A: Remove Restrictions (Easiest for Development)**
- Under "API restrictions", select **"Don't restrict key"**
- Click **Save**
- Wait 1-2 minutes for changes to propagate

**Option B: Set Specific API Restrictions (More Secure)**
- Under "API restrictions", select **"Restrict key"**
- Select these APIs:
  - ✅ Places API
  - ✅ Geocoding API
  - ✅ Maps JavaScript API
- Click **Save**

### Step 3: Check Application Restrictions
1. Scroll down to **"Application restrictions"**
2. For server-side API calls, you have two options:

**Option A: No Restrictions (Easiest)**
- Select **"None"**
- Click **Save**

**Option B: IP Address Restriction (If you have a static IP)**
- Select **"IP addresses"**
- Add your server's IP address (if deploying)
- For local development, use **"None"**

### Step 4: Verify APIs Are Enabled
1. Go to **APIs & Services** → **Library**
2. Search for and verify these are enabled:
   - ✅ **Places API** (New) - This is the NEW Places API
   - ✅ **Geocoding API**
   - ✅ **Maps JavaScript API**

**IMPORTANT**: Make sure you enable **"Places API (New)"** not just "Places API"

### Step 5: Check Billing
1. Go to **Billing** in Google Cloud Console
2. Make sure:
   - A billing account is linked to your project
   - The billing account is active
   - You have a valid payment method

### Step 6: Wait and Restart
- After making changes, wait 1-2 minutes
- **Restart your Next.js server** (stop and run `npm run dev` again)
- Try the search again

## Common Issues

### Issue: "This API project is not authorized to use this API"
**Fix**: Enable the API in the Library section (Step 4)

### Issue: "API key not valid"
**Fix**: 
- Make sure you copied the full API key
- Check for extra spaces in `.env.local`
- Restart your server after changing `.env.local`

### Issue: Still getting REQUEST_DENIED after all steps
**Fix**:
1. Create a NEW API key
2. Don't set any restrictions initially
3. Test if it works
4. Then add restrictions one by one

## Testing Your API Key

You can test your API key directly in the browser:
```
https://maps.googleapis.com/maps/api/place/textsearch/json?query=catering+restaurants+New+York&key=YOUR_API_KEY
```

Replace `YOUR_API_KEY` with your actual key. If you see results, the key works. If you see "REQUEST_DENIED", the restrictions are the issue.

## Quick Fix Checklist
- [ ] API restrictions set to "Don't restrict key" OR specific APIs selected
- [ ] Application restrictions set to "None" (for local dev)
- [ ] Places API (New) is enabled
- [ ] Geocoding API is enabled
- [ ] Billing is enabled and active
- [ ] Server restarted after changes
- [ ] No extra spaces in `.env.local` file

