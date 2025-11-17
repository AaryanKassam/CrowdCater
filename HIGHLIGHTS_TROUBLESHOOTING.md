# Highlights Feature - Troubleshooting Guide

## What I Fixed

### 1. **API Key Validation**
- Added check for missing/invalid OpenAI API key
- Returns fallback highlights if API key is not configured
- No more silent failures

### 2. **Comprehensive Error Handling**
- Wrapped OpenAI API calls in try-catch
- Returns fallback highlights on any API error
- Always returns something, never an empty array

### 3. **State Update Fix**
- Fixed React state update to create new Map object
- Added extensive logging to track state changes
- Ensures React detects state changes and re-renders

### 4. **Fallback Highlights**
- Multiple layers of fallbacks:
  - If API key missing → fallback
  - If API call fails → fallback
  - If JSON parsing fails → fallback
  - If empty response → fallback
- Always shows something to the user

## Potential Issues & Solutions

### Issue 1: OpenAI API Key Not Configured
**Symptoms:** Highlights show fallback text instead of AI-generated content

**Solution:**
1. Check `.env.local` file exists in root directory
2. Verify it contains: `OPENAI_API_KEY=sk-...`
3. Restart the development server after adding/changing the key
4. Check server console for "OpenAI API key is not configured" message

### Issue 2: API Key Invalid or Expired
**Symptoms:** Highlights show fallback text, server console shows API errors

**Solution:**
1. Go to https://platform.openai.com/api-keys
2. Verify your API key is active
3. Check if you have credits/billing set up
4. Generate a new key if needed
5. Update `.env.local` and restart server

### Issue 3: Network/API Errors
**Symptoms:** Highlights show fallback text, browser console shows fetch errors

**Solution:**
1. Check internet connection
2. Check browser console (F12) for network errors
3. Check server terminal for API error messages
4. Verify OpenAI API is accessible from your network

### Issue 4: State Not Updating
**Symptoms:** Loading spinner shows but highlights never appear

**Solution:**
1. Open browser console (F12)
2. Look for logs:
   - "Generating highlights for: [restaurant name]"
   - "Received highlights for [name]: [...]"
   - "Updated suggestions map, new size: X"
3. If logs show highlights but UI doesn't update, it's a React rendering issue
4. Try refreshing the page

## Debugging Steps

1. **Check Browser Console:**
   - Open DevTools (F12)
   - Go to Console tab
   - Expand a restaurant card
   - Look for logs starting with "Generating highlights", "Received highlights", etc.

2. **Check Server Terminal:**
   - Look for logs like "Generated highlights for [name]"
   - Check for error messages
   - Verify API key is being read

3. **Test API Directly:**
   - Open browser console
   - Run: `fetch('/api/ai/food-suggestions', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({restaurantName: 'Test Restaurant'}) }).then(r => r.json()).then(console.log)`
   - Should return highlights object

## Expected Behavior

✅ **Working correctly:**
- Click "Expand" → Shows "Generating highlights..." spinner
- After 1-3 seconds → Shows AI-generated summary (2-3 lines)
- Summary describes what restaurant is known for

❌ **Not working:**
- Click "Expand" → Shows spinner forever
- Click "Expand" → Shows "No highlights available" immediately
- Click "Expand" → Nothing happens

## Current Implementation

The highlights feature now:
1. **Always returns something** - Never shows empty state
2. **Has multiple fallbacks** - Works even if AI API fails
3. **Logs everything** - Easy to debug
4. **Validates API key** - Checks before making calls
5. **Handles all errors** - Catches and recovers from any error

## Next Steps if Still Not Working

1. Check `.env.local` has valid `OPENAI_API_KEY`
2. Restart development server
3. Check browser console for errors
4. Check server terminal for API errors
5. Try the test API call above
6. Verify OpenAI account has credits

