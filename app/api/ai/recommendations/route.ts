import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { eventType, attendees, budget, budgetType } = await request.json()

    const perPersonBudget = budgetType === 'per-person'
      ? budget
      : Math.round(budget / attendees)

    const prompt = `You are a catering expert. Based on the following event details, recommend 5-7 specific food types or cuisines that would be perfect for this event. Be specific and practical.

Event Type: ${eventType}
Number of Attendees: ${attendees}
Budget per person: $${perPersonBudget}

Provide your recommendations as a JSON array of strings, each being a specific food type or cuisine. Example: ["Italian", "Mediterranean", "BBQ", "Asian Fusion", "Mexican", "Vegetarian Options", "Seafood"]

Return ONLY the JSON array, no additional text.`

    let recommendations: string[] = []

    try {
      const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' })

      const result = await model.generateContent(prompt, {
        temperature: 0.7,
        maxOutputTokens: 200,
      })

      const content = result.response?.text() || '[]'
      const parsed = JSON.parse(content)

      recommendations = Array.isArray(parsed) ? parsed : []
    } catch (apiError) {
      console.error('Gemini API error or parsing failed:', apiError)
      // Fallback recommendations on API error
      recommendations = ['Italian', 'American', 'Asian', 'Mexican', 'Mediterranean']
    }

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    return NextResponse.json(
      { error: 'Failed to get recommendations', recommendations: ['Italian', 'American', 'Asian', 'Mexican', 'Mediterranean'] },
      { status: 500 }
    )
  }
}
