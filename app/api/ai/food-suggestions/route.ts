import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { restaurantName } = await request.json()

    if (!restaurantName) {
      return NextResponse.json(
        { error: 'Restaurant name is required', highlights: [] },
        { status: 400 }
      )
    }

    // Check if API key is configured
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey || apiKey.trim() === '') {
      console.error('Gemini API key is not configured')
      // Return fallback highlights instead of error
      return NextResponse.json({
        highlights: [
          {
            name: `About ${restaurantName}`,
            description: `${restaurantName} offers quality catering services. They specialize in providing delicious food for events. Contact them directly for menu options, pricing, and availability.`,
            imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(restaurantName)}`,
          },
        ],
      })
    }

    const prompt = `You are a food expert. Based on the restaurant name "${restaurantName}", provide a brief summary (2-3 lines) of what this restaurant is known for. Focus on:
1. What type of cuisine or food they specialize in
2. Popular dishes or specialties they're known for
3. What makes them stand out

Return your response as a JSON array with a single object in this exact format:
[
  {
    "name": "What ${restaurantName} is Known For",
    "description": "A 2-3 line summary of what this restaurant is known for, their specialties, and what makes them popular. Be specific about menu items or cuisine type."
  }
]

Return ONLY the JSON array, no additional text.`

    let highlights = []
    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const result = await model.generateContent(prompt, {
        temperature: 0.7,
        maxOutputTokens: 200,
      })

      const content = result.response?.text() || '[]'

      // Try to parse the JSON response
      highlights = JSON.parse(content)

      // Validate it's an array
      if (!Array.isArray(highlights) || highlights.length === 0) {
        throw new Error('Invalid response format')
      }
    } catch (apiError) {
      console.error('Gemini API error or parsing failed:', apiError)
      // Return fallback highlights on API error
      highlights = [
        {
          name: `About ${restaurantName}`,
          description: `${restaurantName} offers quality catering services. They specialize in providing delicious food for events. Contact them directly for menu options, pricing, and availability.`,
        },
      ]
    }

    // Add placeholder image URLs based on the highlight name
    const highlightsWithImages = highlights.map((item: any) => ({
      name: item.name,
      description: item.description,
      imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(restaurantName)}`,
    }))

    console.log('Generated highlights for', restaurantName, ':', highlightsWithImages)

    return NextResponse.json({ highlights: highlightsWithImages })
  } catch (error: any) {
    console.error('Error generating food suggestions:', error)
    // Always return fallback highlights, even on error
    return NextResponse.json({
      highlights: [
        {
          name: `About ${restaurantName}`,
          description: `${restaurantName} offers quality catering services. They specialize in providing delicious food for events. Contact them directly for menu options, pricing, and availability.`,
          imageUrl: `https://source.unsplash.com/400x300/?${encodeURIComponent(restaurantName)}`,
        },
      ],
    })
  }
}
