export interface EventDetails {
  attendees: number
  eventType: string
  foodType?: string
  budget: number
  budgetType: 'total' | 'per-person'
  location?: string
  locationCoordinates?: {
    lat: number
    lng: number
  }
}

export interface Restaurant {
  placeId: string
  name: string
  address: string
  phoneNumber?: string
  rating?: number
  priceLevel?: number
  website?: string
  menuItems: MenuItem[]
  menuImages: string[]
  foodSuggestions?: FoodSuggestion[]
  coordinates?: {
    lat: number
    lng: number
  }
  distance?: number // Distance in km
}

export interface MenuItem {
  name: string
  description?: string
  price?: string
  imageUrl?: string
}

export interface FoodSuggestion {
  name: string
  description: string
  estimatedPrice?: string
  imageUrl?: string
}

export interface CallScript {
  greeting: string
  introduction: string
  eventDetails: string
  request: string
  closing: string
}

