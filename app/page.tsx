'use client'

import { useState, useRef } from 'react'
import EventForm from '@/components/EventForm'
import RestaurantResults from '@/components/RestaurantResults'
import { EventDetails, Restaurant } from '@/types'
import { ChevronDown } from 'lucide-react' 

export default function Home() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const handleFormSubmit = async (details: EventDetails) => {
    setEventDetails(details)
    setLoading(true)
    setShowScrollButton(false)
    try {
      // This will be handled by the EventForm component
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRestaurantsFound = (restaurants: Restaurant[]) => {
    setRestaurants(restaurants)
    if (restaurants.length > 0) {
      setShowScrollButton(true)
    }
  }

  const scrollToResults = () => {
    resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-black via-gray-800 to-gray-700 border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img
                src="/CrowdCater.png"
                alt="CrowdCater Logo"
                className="object-contain"
                style={{ height: '200px', marginTop: '-40px', marginBottom: '-40px' }}
                onError={(e) => {
                  // Fallback to text if logo not found
                  const target = e.currentTarget as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<h1 class="text-white text-4xl tracking-tight" style="font-weight: 800">🍽️ CrowdCater</h1>'
                  }
                }}
              />
              <p className="text-white/90 text-lg">Quickly Find The Perfect Catering Solutions For Your Event</p>
            </div>
            {showScrollButton && (
              <button
                onClick={scrollToResults}
                className="bg-black text-white px-6 py-3 rounded-full border-2 border-white hover:bg-gray-900 transition-all flex items-center gap-2 shadow-lg animate-bounce"
                style={{ fontWeight: 700 }}
              >
                View Results <ChevronDown className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Event Details Form */}
        <EventForm 
          onSubmit={handleFormSubmit}
          onRestaurantsFound={handleRestaurantsFound}
          loading={loading}
          setLoading={setLoading}
        />
        
        {/* Restaurant Results */}
        {restaurants.length > 0 && (
          <div ref={resultsRef} className="mt-12">
            <RestaurantResults 
              restaurants={restaurants}
              eventDetails={eventDetails}
            />
          </div>
        )}
      </div>
    </div>
  )
}

