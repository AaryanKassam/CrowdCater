import { EventDetails, Restaurant, FoodSuggestion } from '@/types'

export async function getFoodRecommendations(
  eventType: string,
  attendees: number,
  budget: number,
  budgetType: 'total' | 'per-person'
): Promise<string[]> {
  try {
    const response = await fetch('/api/ai/recommendations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventType,
        attendees,
        budget,
        budgetType,
      }),
    })

    const data = await response.json()
    return data.recommendations || []
  } catch (error) {
    console.error('Error getting AI recommendations:', error)
    // Fallback recommendations
    return ['Italian', 'American', 'Asian', 'Mexican', 'Mediterranean']
  }
}

export async function generateCallScript(
  eventDetails: EventDetails,
  restaurant: Restaurant
): Promise<string> {
  try {
    const response = await fetch('/api/ai/call-script', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventDetails,
        restaurant,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.error) {
      throw new Error(data.error)
    }
    
    return data.script || 'Script generation failed. Please prepare your own script.'
  } catch (error) {
    console.error('Error generating call script:', error)
    const perPersonBudget = eventDetails.budgetType === 'per-person'
      ? eventDetails.budget
      : Math.round(eventDetails.budget / eventDetails.attendees)
    return `Hello, I'm calling to inquire about catering services for a ${eventDetails.eventType} event with ${eventDetails.attendees} attendees. I'm interested in ${eventDetails.foodType || 'catering options'} and have a budget of approximately $${perPersonBudget} per person. Could you tell me about your catering options and availability?`
  }
}

export async function getRestaurantHighlights(
  restaurantName: string,
  placeId: string
): Promise<FoodSuggestion[]> {
  try {
    console.log('Generating highlights for:', restaurantName)
    
    // Simply generate highlights based on restaurant name
    const highlightsResponse = await fetch('/api/ai/food-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        restaurantName,
      }),
    })

    const highlightsData = await highlightsResponse.json()
    
    console.log('Highlights API response status:', highlightsResponse.status)
    console.log('Highlights response data:', highlightsData)
    
    // Always return highlights, even if there was an error (API provides fallback)
    const highlights = highlightsData.highlights || []
    
    // If no highlights, provide a default one
    if (highlights.length === 0) {
      console.warn('No highlights returned, using fallback')
      return [
        {
          name: `About ${restaurantName}`,
          description: `${restaurantName} offers quality catering services. They specialize in providing delicious food for events. Contact them directly for menu options, pricing, and availability.`,
        },
      ]
    }
    
    console.log('Generated highlights count:', highlights.length)
    
    // Map highlights to FoodSuggestion format
    return highlights.map((h: any) => ({
      name: h.name || `About ${restaurantName}`,
      description: h.description || `${restaurantName} offers quality catering services.`,
      imageUrl: h.imageUrl,
    }))
  } catch (error) {
    console.error('Error getting restaurant highlights:', error)
    // Return fallback highlights instead of empty array
    return [
      {
        name: `About ${restaurantName}`,
        description: `${restaurantName} offers quality catering services. They specialize in providing delicious food for events. Contact them directly for menu options, pricing, and availability.`,
      },
    ]
  }
}

