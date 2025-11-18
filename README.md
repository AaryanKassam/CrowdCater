# CrowdCater - AI-Powered Catering Solutions

A modern web application that helps you find the perfect catering for your event using AI recommendations and Google Maps integration.

## Features

- 🎯 **Event Details Input**: Enter number of attendees, event type, food preferences, and budget
- 🤖 **AI Food Recommendations**: Get intelligent food suggestions based on your event type
- 📍 **Location-Based Search**: Find catering restaurants in your area
- 📞 **Contact Information**: Get phone numbers and websites for each restaurant
- 📸 **Menu Images**: View menu images from Google Maps
- 📝 **Call Scripts**: AI-generated professional call scripts for contacting restaurants

Usage: 
1. Enter the number of attendees for your event
2. Specify the event type (e.g., Wedding, Corporate Meeting, Birthday Party)
3. Wait for AI food recommendations or enter a food type directly
4. Set your budget (total or per person)
5. Enter your location or use your current location
6. Click "Find Catering Options" to search for restaurants
7. Browse results and click "Generate Call Script" for any restaurant
8. Use the generated script to call the restaurant

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```bash
cp .env.example .env.local
```

Then edit `.env.local` and add your API keys:

```env
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

**Important:** The `.env.local` file is already in `.gitignore` and will NOT be committed to git. Never commit your actual API keys!

#### Getting API Keys:

**Google Maps API Key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API (New)
   - Geocoding API
4. Create credentials (API Key)
5. Copy the key to your `.env.local` file

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key to your `.env.local` file

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Google Maps API** - Restaurant search and menu images
- **Google Gemini AI** - AI-powered food recommendations and call scripts