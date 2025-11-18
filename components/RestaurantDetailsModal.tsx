'use client'

import { X } from 'lucide-react'
import { Restaurant, FoodSuggestion } from '@/types'
import { useEffect } from 'react'

interface RestaurantDetailsModalProps {
  restaurant: Restaurant
  suggestions: FoodSuggestion[]
  isLoading: boolean
  onClose: () => void
  onGenerateCallScript?: () => void
}

export default function RestaurantDetailsModal({ 
  restaurant, 
  suggestions, 
  isLoading, 
  onClose,
  onGenerateCallScript
}: RestaurantDetailsModalProps) {
  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b-3 border-black flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100">
          <div>
            <h2 className="text-black text-2xl" style={{ fontWeight: 800 }}>{restaurant.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors border-2 border-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div 
          className="p-6 overflow-y-auto flex-1"
          onWheel={(e) => {
            const target = e.currentTarget
            const isAtTop = target.scrollTop === 0
            const isAtBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 1
            
            if ((isAtTop && e.deltaY < 0) || (isAtBottom && e.deltaY > 0)) {
              e.preventDefault()
            }
          }}
        >
          <div className="space-y-6">
            {/* Restaurant Image */}
            {restaurant.menuImages && restaurant.menuImages.length > 0 && (
              <div className="border-3 border-black rounded-2xl overflow-hidden">
                <img
                  src={restaurant.menuImages[0]}
                  alt={restaurant.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement
                    target.src = `https://source.unsplash.com/800x400/?restaurant,${encodeURIComponent(restaurant.name)}`
                  }}
                />
              </div>
            )}

            {/* Restaurant Info */}
            <div className="bg-yellow-50 border-3 border-black rounded-2xl p-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {restaurant.rating && (
                  <div>
                    <p className="text-sm font-bold text-black mb-1">Rating</p>
                    <p className="text-lg font-bold text-black">⭐ {restaurant.rating.toFixed(1)}</p>
                  </div>
                )}
                {restaurant.priceLevel && (
                  <div>
                    <p className="text-sm font-bold text-black mb-1">Price Level</p>
                    <p className="text-lg font-bold text-black">{'$'.repeat(restaurant.priceLevel)}</p>
                  </div>
                )}
                {restaurant.distance !== undefined && (
                  <div>
                    <p className="text-sm font-bold text-black mb-1">Distance</p>
                    <p className="text-lg font-bold text-black">📍 {restaurant.distance} km away</p>
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-black mb-1">Address</p>
                  <p className="text-lg font-bold text-black">{restaurant.address}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white border-3 border-black rounded-2xl p-6">
              <h3 className="text-lg font-bold text-black mb-4">Contact Information</h3>
              <div className="space-y-3">
                {restaurant.phoneNumber ? (
                  <div className="flex items-center gap-3">
                    <span className="text-black font-semibold text-xl">📞</span>
                    <a
                      href={`tel:${restaurant.phoneNumber}`}
                      className="text-black hover:text-gray-700 font-medium text-lg"
                    >
                      {restaurant.phoneNumber}
                    </a>
                  </div>
                ) : null}
                {restaurant.website ? (
                  <div className="flex items-center gap-3">
                    <span className="text-black font-semibold text-xl">🌐</span>
                    <a
                      href={restaurant.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-700 font-medium text-lg truncate"
                    >
                      Visit Website
                    </a>
                  </div>
                ) : null}
                {!restaurant.phoneNumber && !restaurant.website && (
                  <p className="text-gray-600 text-lg">No contact information available</p>
                )}
              </div>
            </div>

            {/* Images */}
            <div className="bg-white border-3 border-black rounded-2xl p-6">
              <h3 className="text-lg font-bold text-black mb-4">Images</h3>
              {restaurant.menuImages && restaurant.menuImages.length > 1 ? (
                <div className="grid grid-cols-2 gap-3">
                  {restaurant.menuImages.slice(1).map((imageUrl, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-black"
                    >
                      <img
                        src={imageUrl}
                        alt={`Menu image ${idx + 2}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No additional images available</p>
              )}
            </div>

            {/* Highlights */}
            <div className="bg-white border-3 border-black rounded-2xl p-6">
              <h3 className="text-lg font-bold text-black mb-4">Highlights</h3>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  <p className="mt-4 text-gray-600">Generating highlights...</p>
                </div>
              ) : suggestions.length > 0 ? (
                <div className="space-y-4">
                  {suggestions.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-gray-50 border-2 border-black rounded-lg p-4"
                    >
                      <h4 className="font-bold text-black mb-2 text-lg">{item.name}</h4>
                      <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No highlights available. Contact restaurant for more information.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-3 border-black flex gap-3 bg-gray-50">
          {onGenerateCallScript && (
            <button
              onClick={onGenerateCallScript}
              className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-black via-gray-800 to-gray-700 border-3 border-black text-white hover:from-gray-900 hover:via-gray-800 hover:to-gray-600 transition-all flex items-center justify-center gap-2 font-bold"
              style={{ fontWeight: 700 }}
            >
              📞 Generate Call Script
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-3 rounded-xl border-3 border-black bg-white text-black hover:bg-gray-100 transition-colors font-bold ${onGenerateCallScript ? '' : 'flex-1'}`}
            style={{ fontWeight: 700 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

