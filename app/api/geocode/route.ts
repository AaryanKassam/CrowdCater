import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { lat, lng } = await request.json()
    const apiKey = process.env.GOOGLE_MAPS_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Maps API key not configured', address: `${lat}, ${lng}` },
        { status: 500 }
      )
    }

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    if (data.status === 'OK' && data.results.length > 0) {
      return NextResponse.json({ address: data.results[0].formatted_address })
    }
    
    return NextResponse.json({ address: `${lat}, ${lng}` })
  } catch (error) {
    console.error('Error getting location:', error)
    return NextResponse.json(
      { error: 'Failed to get location', address: `${lat}, ${lng}` },
      { status: 500 }
    )
  }
}

