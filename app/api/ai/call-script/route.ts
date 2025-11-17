import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

const gemini = new GoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY || '',
})

export async function POST(request: NextRequest) {
  try {
    const { eventDetails, restaurant } = await request.json()

    const perPersonBudget = eventDetails.budgetType === 'per-person'
      ? eventDetails.budget
      : Math.round(eventDetails.budget / eventDetails.attendees)

    const prompt = `Create a professional phone call script for calling a restaurant to inquire about catering. The script should be natural, polite, and include all necessary information.

Restaurant: ${restaurant.name}
Event Type: ${eventDetails.eventType}
Number of Attendees: ${eventDetails.attendees}
Food Type: ${eventDetails.foodType || 'Not specified'}
Budget per person: $${perPersonBudget}
Total Budget: $${eventDetails.budgetType === 'total' ? eventDetails.budget : eventDetails.budget * eventDetails.attendees}

Create a script with the following sections:
1. Greeting and introduction
2. Explain the event details
3. Request information about catering options
4. Mention budget
5. Ask about next steps
6. Closing

Make it conversational and professional. Return the script as a single formatted text with clear sections.`

    // Use Gemini model
    const model = gemini.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const result = await model.generateContent(prompt, {
      temperature: 0.8,
      maxOutputTokens: 500,
    })

    const script = result.response?.text() || 'Script generation failed. Please prepare your own script.'

    return NextResponse.json({ script })
  } catch (error) {
    console.error('Error generating call script:', error)
    return NextResponse.json(
      { error: 'Failed to generate script', script: 'Error generating call script. Please prepare your own.' },
      { status: 500 }
    )
  }
}
