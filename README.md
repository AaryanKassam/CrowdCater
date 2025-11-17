# CrowdCater - AI-Powered Catering Solutions

A modern web application that helps you find the perfect catering for your event using AI recommendations and Google Maps integration.

## Features

- 🎯 **Event Details Input**: Enter number of attendees, event type, food preferences, and budget
- 🤖 **AI Food Recommendations**: Get intelligent food suggestions based on your event type
- 📍 **Location-Based Search**: Find catering restaurants in your area
- 📞 **Contact Information**: Get phone numbers and websites for each restaurant
- 📸 **Menu Images**: View menu images from Google Maps
- 📝 **Call Scripts**: AI-generated professional call scripts for contacting restaurants

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory with the following:

```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

**Note:** These API keys are used server-side only for security. Do NOT use `NEXT_PUBLIC_` prefix as these keys should remain private.

### 3. Get API Keys

#### OpenAI API Key
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste it into `.env.local`

#### Google Maps API Key
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Places API
   - Geocoding API
   - Maps JavaScript API
4. Go to Credentials and create an API key
5. Copy and paste it into `.env.local`

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter the number of attendees for your event
2. Specify the event type (e.g., Wedding, Corporate Meeting, Birthday Party)
3. Wait for AI food recommendations or enter a food type directly
4. Set your budget (total or per person)
5. Enter your location or use your current location
6. Click "Find Catering Options" to search for restaurants
7. Browse results and click "Generate Call Script" for any restaurant
8. Use the generated script to call the restaurant

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **OpenAI API** - AI recommendations and call script generation
- **Google Maps API** - Restaurant search and menu images

## Project Structure

```
CaterAI/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── EventForm.tsx       # Event details form
│   └── RestaurantResults.tsx # Restaurant results display
├── lib/
│   ├── ai.ts              # OpenAI integration
│   └── googleMaps.ts      # Google Maps integration
├── types/
│   └── index.ts           # TypeScript type definitions
└── package.json
```

## Notes

- The app uses Google Places API to search for restaurants that offer catering
- Menu images are fetched from Google Maps photos
- Call scripts are generated using OpenAI's GPT-4 model
- Location services require user permission for geolocation

## License

MIT

