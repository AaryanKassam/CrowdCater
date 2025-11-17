'use client'

import { useState } from 'react'
import { Restaurant, EventDetails, FoodSuggestion } from '@/types'
import { generateCallScript, getRestaurantHighlights } from '@/lib/ai'

interface RestaurantResultsProps {
  restaurants: Restaurant[]
  eventDetails: EventDetails | null
}

export default function RestaurantResults({
  restaurants,
  eventDetails,
}: RestaurantResultsProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [callScript, setCallScript] = useState<string>('')
  const [loadingScript, setLoadingScript] = useState(false)
  const [expandedRestaurants, setExpandedRestaurants] = useState<Set<string>>(new Set())
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set())
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<Map<string, FoodSuggestion[]>>(new Map())

  const toggleExpand = async (restaurant: Restaurant) => {
    const isExpanded = expandedRestaurants.has(restaurant.placeId)
    
    if (isExpanded) {
      // Collapse
      const newExpanded = new Set(expandedRestaurants)
      newExpanded.delete(restaurant.placeId)
      setExpandedRestaurants(newExpanded)
    } else {
      // Expand and load suggestions if not already loaded
      setExpandedRestaurants(new Set([...expandedRestaurants, restaurant.placeId]))
      
      if (!restaurantSuggestions.has(restaurant.placeId)) {
        setLoadingSuggestions(new Set([...loadingSuggestions, restaurant.placeId]))
        
        try {
          const highlights = await getRestaurantHighlights(
            restaurant.name,
            restaurant.placeId
          )
          
          console.log('Received highlights for', restaurant.name, ':', highlights)
          console.log('Highlights length:', highlights.length)
          
          if (highlights && highlights.length > 0) {
            // Create a new Map to ensure React detects the change
            const newSuggestions = new Map(restaurantSuggestions)
            newSuggestions.set(restaurant.placeId, highlights)
            setRestaurantSuggestions(newSuggestions)
            console.log('Updated suggestions map, new size:', newSuggestions.size)
          } else {
            console.warn('No highlights received for', restaurant.name)
            // Set empty array to show "no highlights" message
            const newSuggestions = new Map(restaurantSuggestions)
            newSuggestions.set(restaurant.placeId, [])
            setRestaurantSuggestions(newSuggestions)
          }
        } catch (error) {
          console.error('Error loading restaurant highlights:', error)
          // Set empty array on error
          const newSuggestions = new Map(restaurantSuggestions)
          newSuggestions.set(restaurant.placeId, [])
          setRestaurantSuggestions(newSuggestions)
        } finally {
          const newLoading = new Set(loadingSuggestions)
          newLoading.delete(restaurant.placeId)
          setLoadingSuggestions(newLoading)
        }
      }
    }
  }

  const handleGenerateScript = async (restaurant: Restaurant) => {
    if (!eventDetails) {
      alert('Event details are missing. Please search again.')
      return
    }

    setSelectedRestaurant(restaurant)
    setLoadingScript(true)
    setCallScript('')
    
    try {
      const script = await generateCallScript(eventDetails, restaurant)
      setCallScript(script)
    } catch (error: any) {
      console.error('Error generating script:', error)
      const errorMessage = error?.message || 'Unknown error occurred'
      setCallScript(`Error generating call script: ${errorMessage}\n\nPlease prepare your own script or try again.`)
    } finally {
      setLoadingScript(false)
    }
  }

  if (restaurants.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-gray-600">No catering restaurants found in your area. Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Catering Options ({restaurants.length})
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {restaurants.map((restaurant) => {
          const isExpanded = expandedRestaurants.has(restaurant.placeId)
          const isLoading = loadingSuggestions.has(restaurant.placeId)
          const suggestions = restaurantSuggestions.get(restaurant.placeId) || []
          
          // Debug logging
          if (isExpanded) {
            console.log('Restaurant:', restaurant.name, 'Suggestions:', suggestions, 'Loading:', isLoading)
          }

          return (
            <div
              key={restaurant.placeId}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Restaurant Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 flex-1">
                    {restaurant.name}
                  </h3>
                  <button
                    onClick={() => toggleExpand(restaurant)}
                    className="ml-2 text-primary-600 hover:text-primary-700 font-semibold text-sm"
                  >
                    {isExpanded ? '▲ Collapse' : '▼ Expand'}
                  </button>
                </div>
                {restaurant.rating && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-gray-700 font-medium">
                      {restaurant.rating.toFixed(1)}
                    </span>
                    {restaurant.priceLevel && (
                      <span className="text-gray-500">
                        {'$'.repeat(restaurant.priceLevel)}
                      </span>
                    )}
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-600">{restaurant.address}</p>
                  {restaurant.distance !== undefined && (
                    <p className="text-sm font-medium text-primary-600">
                      📍 {restaurant.distance} km away
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-6 space-y-3 border-b border-gray-200">
                {restaurant.phoneNumber && (
                  <div className="flex items-center gap-3">
                    <span className="text-primary-600 font-semibold">📞</span>
                    <a
                      href={`tel:${restaurant.phoneNumber}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {restaurant.phoneNumber}
                    </a>
                  </div>
                )}
                {restaurant.website && (
                  <div className="flex items-center gap-3">
                    <span className="text-primary-600 font-semibold">🌐</span>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700 font-medium truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="p-6 space-y-6 border-b border-gray-200">
                  {/* Menu Images */}
                  {restaurant.menuImages.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">
                        📋 Images:
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        {restaurant.menuImages.map((imageUrl, idx) => (
                          <div
                            key={idx}
                            className="relative aspect-video rounded-lg overflow-hidden bg-gray-100"
                          >
                            <img
                              src={imageUrl}
                              alt={`Menu image ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Highlights */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Highlights:
                    </h4>
                    {isLoading ? (
                      <div className="text-center py-4">
                        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                        <p className="mt-2 text-sm text-gray-600">Generating highlights...</p>
                      </div>
                    ) : suggestions.length > 0 ? (
                      <div className="space-y-3">
                        {suggestions.map((item, idx) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                          >
                            <h5 className="font-semibold text-gray-900 mb-2">{item.name}</h5>
                            <p className="text-sm text-gray-700 leading-relaxed">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No highlights available. Contact restaurant for more information.</p>
                    )}
                  </div>
                </div>
              )}

              {/* Generate Call Script Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => handleGenerateScript(restaurant)}
                  className="w-full bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                >
                  📞 Generate Call Script
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Call Script Modal */}
      {selectedRestaurant && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                Call Script for {selectedRestaurant.name}
              </h3>
              <button
                onClick={() => {
                  setSelectedRestaurant(null)
                  setCallScript('')
                }}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              {loadingScript ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <p className="mt-4 text-gray-600">Generating call script...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-800">
                    {callScript || 'No script generated yet.'}
                  </div>
                  {callScript && (
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(callScript)
                          alert('Call script copied to clipboard!')
                        }}
                        className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                      >
                        📋 Copy Script
                      </button>
                      {selectedRestaurant.phoneNumber && (
                        <a
                          href={`tel:${selectedRestaurant.phoneNumber}`}
                          className="flex-1 bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                        >
                          📞 Call Now
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
