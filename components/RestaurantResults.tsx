'use client' 

import { useState } from 'react'
import { Restaurant, EventDetails, FoodSuggestion } from '@/types'
import { getRestaurantHighlights } from '@/lib/ai'
import CallScriptModal from './CallScriptModal'
import RestaurantDetailsModal from './RestaurantDetailsModal'
import { Utensils, Star } from 'lucide-react'

interface RestaurantResultsProps {
  restaurants: Restaurant[]
  eventDetails: EventDetails | null
}

export default function RestaurantResults({
  restaurants,
  eventDetails,
}: RestaurantResultsProps) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [showCallScript, setShowCallScript] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [detailsRestaurant, setDetailsRestaurant] = useState<Restaurant | null>(null)
  const [loadingSuggestions, setLoadingSuggestions] = useState<Set<string>>(new Set())
  const [restaurantSuggestions, setRestaurantSuggestions] = useState<Map<string, FoodSuggestion[]>>(new Map())

  const handleExpand = async (restaurant: Restaurant) => {
    setDetailsRestaurant(restaurant)
    setShowDetailsModal(true)
    
    // Load suggestions if not already loaded
    if (!restaurantSuggestions.has(restaurant.placeId)) {
      const newLoading = new Set(Array.from(loadingSuggestions))
      newLoading.add(restaurant.placeId)
      setLoadingSuggestions(newLoading)
      
      try {
        const highlights = await getRestaurantHighlights(
          restaurant.name,
          restaurant.placeId
        )
        
        if (highlights && highlights.length > 0) {
          const newSuggestions = new Map(restaurantSuggestions)
          newSuggestions.set(restaurant.placeId, highlights)
          setRestaurantSuggestions(newSuggestions)
        } else {
          const newSuggestions = new Map(restaurantSuggestions)
          newSuggestions.set(restaurant.placeId, [])
          setRestaurantSuggestions(newSuggestions)
        }
      } catch (error) {
        console.error('Error loading restaurant highlights:', error)
        const newSuggestions = new Map(restaurantSuggestions)
        newSuggestions.set(restaurant.placeId, [])
        setRestaurantSuggestions(newSuggestions)
      } finally {
        const newLoading = new Set(Array.from(loadingSuggestions))
        newLoading.delete(restaurant.placeId)
        setLoadingSuggestions(newLoading)
      }
    }
  }

  const handleGenerateScript = (restaurant: Restaurant) => {
    if (!eventDetails) {
      alert('Event details are missing. Please search again.')
      return
    }

    setSelectedRestaurant(restaurant)
    setShowCallScript(true)
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
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500 w-12 h-12 rounded-full flex items-center justify-center">
          <Utensils className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-black">
            Your Catering Options
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {restaurants.length} caterer{restaurants.length !== 1 ? 's' : ''} found near you
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
        {restaurants.map((restaurant) => {

          return (
            <div
              key={`restaurant-${restaurant.placeId}`}
              className="bg-yellow-50 border-2 border-black rounded-xl overflow-hidden hover:shadow-lg transition-shadow relative flex flex-col h-full"
            >
              {/* Restaurant Content */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Restaurant Image */}
                <div className="flex justify-center mb-4 relative">
                  <div className="bg-white border-2 border-black rounded-lg overflow-hidden w-full aspect-video relative">
                    {restaurant.menuImages && restaurant.menuImages.length > 0 ? (
                      <img
                        src={restaurant.menuImages[0]}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to Unsplash placeholder
                          const target = e.currentTarget as HTMLImageElement
                          target.src = `https://source.unsplash.com/400x300/?restaurant,${encodeURIComponent(restaurant.name)}`
                        }}
                      />
                    ) : (
                      <img
                        src={`https://source.unsplash.com/400x300/?restaurant,${encodeURIComponent(restaurant.name)}`}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Final fallback - show placeholder icon
                          const target = e.currentTarget as HTMLImageElement
                          target.style.display = 'none'
                          const parent = target.parentElement
                          if (parent) {
                            parent.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-100"><svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg></div>'
                          }
                        }}
                      />
                    )}
                    {/* Rating Badge - positioned over image */}
                    {restaurant.rating && (
                      <div className="absolute top-2 right-2 bg-yellow-400 border-2 border-black rounded-full px-3 py-1 flex items-center gap-1 z-10">
                        <Star className="w-4 h-4 fill-black text-black" />
                        <span className="text-black font-bold text-sm">
                          {restaurant.rating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="text-center flex-grow">
                  <h3 className="text-xl font-bold text-black mb-3">
                    {restaurant.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    {restaurant.rating && (
                      <p className="text-sm font-medium text-gray-700">
                        ⭐ {restaurant.rating.toFixed(1)}
                      </p>
                    )}
                    {restaurant.priceLevel && (
                      <p className="text-sm font-medium text-gray-700">
                        {'$'.repeat(restaurant.priceLevel)}
                      </p>
                    )}
                    {restaurant.distance !== undefined && (
                      <p className="text-sm font-medium text-gray-700">
                        📍 {restaurant.distance} km away
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      {restaurant.address}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => handleExpand(restaurant)}
                  className="w-full mt-auto text-black hover:bg-yellow-100 font-semibold text-sm py-2 rounded-lg border-2 border-black transition-colors"
                  type="button"
                >
                  ▼ Expand
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Restaurant Details Modal */}
      {showDetailsModal && detailsRestaurant && (
        <RestaurantDetailsModal
          restaurant={detailsRestaurant}
          suggestions={restaurantSuggestions.get(detailsRestaurant.placeId) || []}
          isLoading={loadingSuggestions.has(detailsRestaurant.placeId)}
          onClose={() => {
            setShowDetailsModal(false)
            setDetailsRestaurant(null)
          }}
          onGenerateCallScript={() => {
            setShowDetailsModal(false)
            setDetailsRestaurant(null)
            handleGenerateScript(detailsRestaurant)
          }}
        />
      )}

      {/* Call Script Modal */}
      {showCallScript && selectedRestaurant && eventDetails && (
        <CallScriptModal
          restaurant={selectedRestaurant}
          eventDetails={eventDetails}
          onClose={() => {
            setShowCallScript(false)
            setSelectedRestaurant(null)
          }}
        />
      )}
    </div>
  )
}
