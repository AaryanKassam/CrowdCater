'use client'

import { useState, useEffect } from 'react'
import { EventDetails } from '@/types'
import { getFoodRecommendations } from '@/lib/ai'
import { searchCateringRestaurants, getCurrentLocation, getLocationFromCoordinates } from '@/lib/googleMaps'
import ErrorDisplay from './ErrorDisplay'

interface EventFormProps {
  onSubmit: (details: EventDetails) => void
  onRestaurantsFound: (restaurants: any[]) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

export default function EventForm({
  onSubmit,
  onRestaurantsFound,
  loading,
  setLoading,
}: EventFormProps) {
  const [attendees, setAttendees] = useState<number>(50)
  const [attendeesInput, setAttendeesInput] = useState<string>('50')
  const [eventType, setEventType] = useState('')
  const [foodType, setFoodType] = useState('')
  const [budget, setBudget] = useState<number>(1000)
  const [budgetInput, setBudgetInput] = useState<string>('1000')
  const [budgetType, setBudgetType] = useState<'total' | 'per-person'>('total')
  const [location, setLocation] = useState('')
  const [aiRecommendations, setAiRecommendations] = useState<string[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [useLocation, setUseLocation] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Try to get user's location
    if (useLocation) {
      getCurrentLocation()
        .then((coords) => {
          getLocationFromCoordinates(coords.lat, coords.lng)
            .then((address) => {
              setLocation(address)
            })
            .catch((error) => {
              console.error('Error getting address from coordinates:', error)
              setUseLocation(false)
            })
        })
        .catch((error) => {
          console.error('Error getting current location:', error)
          setUseLocation(false)
          setError('Unable to get your location. Please enter it manually.')
        })
    }
  }, [useLocation])

  const handleEventTypeChange = async (type: string) => {
    setEventType(type)
    if (type && attendees && budget) {
      setLoading(true)
      try {
        const recommendations = await getFoodRecommendations(
          type,
          attendees,
          budget,
          budgetType
        )
        setAiRecommendations(recommendations)
        setShowRecommendations(true)
      } catch (error) {
        console.error('Error getting recommendations:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!location) {
      setError('Please enter a location or use your current location')
      return
    }

    if (!eventType) {
      setError('Please enter an event type')
      return
    }

    // Get coordinates for the location
    let locationCoords = null
    try {
      const geocodeResponse = await fetch('/api/geocode/forward', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ address: location }),
      })
      const geocodeData = await geocodeResponse.json()
      if (geocodeData.coordinates) {
        locationCoords = geocodeData.coordinates
      }
    } catch (error) {
      console.error('Error geocoding location:', error)
    }

    const details: EventDetails = {
      attendees,
      eventType,
      foodType: foodType || aiRecommendations[0] || 'Catering',
      budget,
      budgetType,
      location,
      locationCoordinates: locationCoords,
    }

    setLoading(true)
    try {
      console.log('Searching for restaurants with:', { location, foodType: details.foodType })
      const restaurants = await searchCateringRestaurants(
        location,
        details.foodType,
        locationCoords
      )
      console.log('Found restaurants:', restaurants)
      
      if (restaurants.length === 0) {
        setError('No restaurants found. Try adjusting your location or food type.')
      } else {
        onRestaurantsFound(restaurants)
        onSubmit(details)
      }
    } catch (error: any) {
      console.error('Error searching restaurants:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      setError(`Error searching for restaurants: ${errorMessage}. Please check your API keys in .env.local and try again.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Details</h2>
      
      <ErrorDisplay error={error} onDismiss={() => setError(null)} />
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Number of Attendees */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Attendees
          </label>
          <input
            type="number"
            min="1"
            value={attendeesInput}
            onChange={(e) => {
              const value = e.target.value;
              setAttendeesInput(value);
              if (value !== '') {
                const num = parseInt(value);
                if (!isNaN(num) && num > 0) {
                  setAttendees(num);
                }
              }
            }}
            onBlur={(e) => {
              const value = e.target.value;
              if (!value || parseInt(value) < 1) {
                setAttendeesInput('50');
                setAttendees(50);
              } else {
                const num = parseInt(value);
                if (!isNaN(num) && num > 0) {
                  setAttendeesInput(value);
                  setAttendees(num);
                }
              }
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Event Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Event Type
          </label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => handleEventTypeChange(e.target.value)}
            placeholder="e.g., Wedding, Corporate Meeting, Birthday Party"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* AI Recommendations */}
        {showRecommendations && aiRecommendations.length > 0 && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <p className="text-sm font-medium text-primary-900 mb-2">
              Quick Select:
            </p>
            <div className="flex flex-wrap gap-2">
              {aiRecommendations.map((rec, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setFoodType(rec)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    foodType === rec
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-primary-700 border border-primary-300 hover:bg-primary-100'
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Food Type (Direct Input) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Food Type (or select from AI recommendations above)
          </label>
          <input
            type="text"
            value={foodType}
            onChange={(e) => setFoodType(e.target.value)}
            placeholder="e.g., Italian, BBQ, Vegetarian"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Budget
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              min="1"
              value={budgetInput}
              onChange={(e) => {
                const value = e.target.value;
                setBudgetInput(value);
                if (value !== '') {
                  const num = parseFloat(value);
                  if (!isNaN(num) && num > 0) {
                    setBudget(num);
                  }
                }
              }}
              onBlur={(e) => {
                const value = e.target.value;
                if (!value || parseFloat(value) < 1) {
                  setBudgetInput('1000');
                  setBudget(1000);
                } else {
                  const num = parseFloat(value);
                  if (!isNaN(num) && num > 0) {
                    setBudgetInput(value);
                    setBudget(num);
                  }
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
            <select
              value={budgetType}
              onChange={(e) => setBudgetType(e.target.value as 'total' | 'per-person')}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="total">Total</option>
              <option value="per-person">Per Person</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter city, address, or zip code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required={!useLocation}
            />
            <button
              type="button"
              onClick={() => setUseLocation(!useLocation)}
              className={`px-4 py-2 rounded-lg border ${
                useLocation
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
            >
              📍 Use My Location
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Searching...' : 'Find Catering Options'}
        </button>
      </form>
    </div>
  )
}

