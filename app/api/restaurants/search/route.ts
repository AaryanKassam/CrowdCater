import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { location, foodType, locationCoordinates } = await request.json()
    
    if (!location || !foodType) {
      return NextResponse.json(
        { error: 'Location and foodType are required', restaurants: [] },
        { status: 400 }
      )
    }
    
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      console.error('Google Maps API key not found in environment variables')
      return NextResponse.json(
        { error: 'Google Maps API key not configured. Please add GOOGLE_MAPS_API_KEY to your .env.local file', restaurants: [] },
        { status: 500 }
      )
    }

    // Use Google Places API (New) Text Search
    const query = `catering ${foodType} ${location}`
    const url = `https://places.googleapis.com/v1/places:searchText`
    
    const requestBody = {
      textQuery: query,
      maxResultCount: 10,
      includedType: 'restaurant',
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.priceLevel,places.websiteUri,places.photos,places.location',
      },
      body: JSON.stringify(requestBody),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Google Places API (New) error:', JSON.stringify(data, null, 2))
      const errorMessage = data.error?.message || data.error?.status || 'Request failed'
      return NextResponse.json(
        { 
          error: `Google Maps API error: ${errorMessage}. Make sure Places API (New) is enabled in Google Cloud Console.`, 
          restaurants: [],
        },
        { status: response.status || 500 }
      )
    }

    const places = data.places || []
    const restaurants = []

    // Process each place from the new API format
    for (const place of places) {
      // Get menu images from photos
      const menuImages: string[] = []
      if (place.photos && place.photos.length > 0) {
        // Get first 3 photos as potential menu images
        place.photos.slice(0, 3).forEach((photo: any) => {
          // New API uses photo name - format: places/PLACE_ID/photos/PHOTO_REFERENCE
          // For media access, we need to use the photo name directly
          if (photo.name) {
            const photoUrl = `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=800&key=${apiKey}`
            menuImages.push(photoUrl)
          }
        })
      }

      // Try to extract menu items from place name and type
      const menuItems = [
        { name: 'Catering Package', description: 'Contact restaurant for full catering menu' },
        { name: 'Custom Menu Options', description: 'Available upon request' },
      ]

      const restaurantCoords = place.location ? {
        lat: place.location.latitude,
        lng: place.location.longitude,
      } : undefined

      // Calculate distance if we have both coordinates
      let distance: number | undefined = undefined
      if (locationCoordinates && restaurantCoords) {
        const R = 6371 // Earth's radius in km
        const dLat = (restaurantCoords.lat - locationCoordinates.lat) * (Math.PI / 180)
        const dLng = (restaurantCoords.lng - locationCoordinates.lng) * (Math.PI / 180)
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(locationCoordinates.lat * (Math.PI / 180)) *
            Math.cos(restaurantCoords.lat * (Math.PI / 180)) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        distance = Math.round((R * c) * 10) / 10 // Round to 1 decimal place
      }

      restaurants.push({
        placeId: place.id,
        name: place.displayName?.text || 'Restaurant',
        address: place.formattedAddress || '',
        phoneNumber: place.nationalPhoneNumber || '',
        rating: place.rating,
        priceLevel: place.priceLevel ? (place.priceLevel === 'PRICE_LEVEL_FREE' ? 0 : 
                                        place.priceLevel === 'PRICE_LEVEL_INEXPENSIVE' ? 1 :
                                        place.priceLevel === 'PRICE_LEVEL_MODERATE' ? 2 :
                                        place.priceLevel === 'PRICE_LEVEL_EXPENSIVE' ? 3 : 4) : undefined,
        website: place.websiteUri,
        menuItems,
        menuImages,
        coordinates: restaurantCoords,
        distance,
      })
    }

    return NextResponse.json({ restaurants })
  } catch (error) {
    console.error('Error searching restaurants:', error)
    return NextResponse.json(
      { error: 'Failed to search restaurants', restaurants: [] },
      { status: 500 }
    )
  }
}

