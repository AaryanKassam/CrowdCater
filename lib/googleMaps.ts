import { Restaurant, MenuItem } from '@/types'

declare global {
  interface Window {
    google: any
  }
}

// Calculate distance between two coordinates in km
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLng = (lng2 - lng1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export async function searchCateringRestaurants(
  location: string,
  foodType: string,
  locationCoordinates?: { lat: number; lng: number } | null
): Promise<Restaurant[]> {
  try {
    console.log('Calling API with:', { location, foodType, locationCoordinates })
    const response = await fetch('/api/restaurants/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        location,
        foodType,
        locationCoordinates,
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
    
    return data.restaurants || []
  } catch (error: any) {
    console.error('Error searching restaurants:', error)
    throw error // Re-throw to let the component handle it
  }
}

export function getCurrentLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      }
    )
  })
}

export async function getLocationFromCoordinates(
  lat: number,
  lng: number
): Promise<string> {
  try {
    const response = await fetch('/api/geocode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ lat, lng }),
    })

    const data = await response.json()
    return data.address || `${lat}, ${lng}`
  } catch (error) {
    console.error('Error getting location:', error)
    return `${lat}, ${lng}`
  }
}

