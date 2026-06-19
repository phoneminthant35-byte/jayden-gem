# Jayden Gem — AI Marketing Crew

## Deploy to Vercel (step by step)

### Step 1 — Get a Gemini API key (free)
1. Go to https://aistudio.google.com
2. Sign in with your Google account
3. Click "Get API key" → "Create API key"
4. Copy the key — keep it safe, never share it

### Step 2 — Set up Google Sheets auto-fill (Franky)
1. Go to https://console.cloud.google.com
2. Create a new project (call it "Jayden Gem")
3. Enable the Google Sheets API
4. Go to IAM → Service Accounts → Create service account
5. Download the JSON key file
6. Open your "Gem Crew Master Log" Google Sheet
7. Share it with the service account email (editor access)
8. Copy the Sheet ID from the URL (the long string between /d/ and /edit)

### Step 3 — Deploy to Vercel
1. Go to https://vercel.com and sign up (free)
2. Click "Add New Project" → "Upload" (drag this whole folder)
   OR: push to GitHub and import from there
3. In project settings → Environment Variables, add:
   - GEMINI_API_KEY = (your key from Step 1)
   - GOOGLE_SERVICE_ACCOUNT_JSON = (paste the entire JSON from Step 2)
   - GOOGLE_SHEET_ID = (the Sheet ID from Step 2)
4. Click Deploy

### That's it
Your app will be live at https://your-project.vercel.app

### Notes
- Gemini free tier: ~1,500 requests/day — more than enough
- localStorage saves your data in the browser on each device
- Franky writes to Sheets automatically when you log a video or save a final script
- If Sheets env vars aren't set, Franky logs a warning but the app still works
