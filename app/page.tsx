'use client'

import { useState } from 'react'
import EventForm from '@/components/EventForm'
import RestaurantResults from '@/components/RestaurantResults'
import { EventDetails, Restaurant } from '@/types'

export default function Home() {
  const [eventDetails, setEventDetails] = useState<EventDetails | null>(null)
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(false)

  const handleFormSubmit = async (details: EventDetails) => {
    setEventDetails(details)
    setLoading(true)
    try {
      // This will be handled by the EventForm component
    } catch (error) {
      console.error('Error submitting form:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-2">
            CrowdCater
          </h1>
          <p className="text-xl text-gray-600">
            Quickly Find The Perfect Catering Solutions For Your Event
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <EventForm 
            onSubmit={handleFormSubmit}
            onRestaurantsFound={setRestaurants}
            loading={loading}
            setLoading={setLoading}
          />
          
          {restaurants.length > 0 && (
            <RestaurantResults 
              restaurants={restaurants}
              eventDetails={eventDetails}
            />
          )}
        </div>
      </div>
    </main>
  )
}

