import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { placeId } = await request.json()
    
    if (!placeId) {
      return NextResponse.json(
        { error: 'Place ID is required', reviews: [] },
        { status: 400 }
      )
    }
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured', reviews: [] },
        { status: 500 }
      )
    }

    // Fetch place details with reviews using Places API (New)
    // Place ID format: places/ChIJ... or just ChIJ...
    // The place ID from search results is already in the format "places/ChIJ..."
    let normalizedPlaceId = placeId
    if (!placeId.startsWith('places/')) {
      normalizedPlaceId = `places/${placeId}`
    }
    
    console.log('Fetching reviews for place ID:', normalizedPlaceId)
    const url = `https://places.googleapis.com/v1/${normalizedPlaceId}`
    
    // Try to get reviews - the new API might require different field mask
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'reviews,displayName',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Google Places API error:', JSON.stringify(data, null, 2))
      return NextResponse.json(
        { error: 'Failed to fetch reviews', reviews: [] },
        { status: response.status || 500 }
      )
    }

    console.log('Reviews API response:', JSON.stringify(data, null, 2))

    // Filter reviews to only 4+ stars
    // The new API returns reviews in a different format
    const reviewsArray = data.reviews || []
    console.log('Reviews array length:', reviewsArray.length)
    
    const reviews = reviewsArray
      .filter((review: any) => {
        const rating = review.rating
        const isValid = rating && typeof rating === 'number' && rating >= 4
        if (!isValid) {
          console.log('Filtered out review with rating:', rating)
        }
        return isValid
      })
      .map((review: any) => {
        // Handle different possible text formats
        let reviewText = ''
        if (typeof review.text === 'string') {
          reviewText = review.text
        } else if (review.text?.text) {
          reviewText = review.text.text
        } else if (review.text?.originalText) {
          reviewText = review.text.originalText
        } else if (review.text?.localizedText) {
          reviewText = review.text.localizedText
        }
        
        return {
          rating: review.rating,
          text: reviewText,
          author: review.authorAttribution?.displayName || review.authorDisplayName || 'Anonymous',
        }
      })
      .filter((review: any) => review.text && review.text.length > 0) // Only include reviews with text

    console.log('Filtered reviews count:', reviews.length)

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews', reviews: [] },
      { status: 500 }
    )
  }
}

