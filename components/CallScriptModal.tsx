'use client'

import { X, Copy, CheckCircle } from 'lucide-react'
import { Restaurant, EventDetails } from '@/types'
import { useState } from 'react'

interface CallScriptModalProps {
  restaurant: Restaurant
  eventDetails: EventDetails
  onClose: () => void
}

export default function CallScriptModal({ restaurant, eventDetails, onClose }: CallScriptModalProps) {
  const [copied, setCopied] = useState(false)

  const generateScript = () => {
    const budgetText = eventDetails.budgetType === 'per-person' 
      ? `$${eventDetails.budget} per person`
      : `$${eventDetails.budget} total`

    return `Hi, I'm calling to inquire about catering services for an upcoming ${eventDetails.eventType}.

Event Details:

- Date: [Your Event Date]

- Number of guests: ${eventDetails.attendees}

- Location: ${eventDetails.location || 'Not specified'}

- Food preferences: ${eventDetails.foodType || 'Not specified'}

- Budget: ${budgetText}

Questions to Ask:

1. Do you have availability for catering on [Your Event Date]?

2. What package options do you offer for ${eventDetails.attendees} people?

3. Can you accommodate ${eventDetails.foodType || 'our'} cuisine preferences?

4. What is included in your catering service (setup, serving staff, cleanup)?

5. Do you provide serving equipment and tableware?

6. What is your pricing structure for an event of this size?

7. Are there any additional fees I should be aware of?

8. What is your cancellation/rescheduling policy?

9. Can you provide references from similar events you've catered?

10. When would you need final headcount and menu selections?

Notes:

- Mention you found them through CrowdCater

- Ask about any seasonal specials or discounts

- Request a detailed written quote

- Inquire about tasting options before committing

Contact Information:

${restaurant.name}

${restaurant.phoneNumber || 'N/A'}

${restaurant.address}`
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateScript())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b-3 border-black flex items-center justify-between bg-gradient-to-r from-purple-100 to-pink-100">
          <div>
            <h2 className="text-black" style={{ fontWeight: 800 }}>📞 Call Script</h2>
            <p className="text-gray-700 text-sm">{restaurant.name}</p>
          </div>
          <button
            onClick={onClose}
            className="bg-black text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors border-2 border-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <div className="bg-yellow-50 border-3 border-black rounded-2xl p-6">
            <pre className="whitespace-pre-wrap text-sm text-black" style={{ fontFamily: 'monospace' }}>
              {generateScript()}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t-3 border-black flex gap-3 bg-gray-50">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-400 to-green-400 border-3 border-black text-black hover:from-emerald-500 hover:to-green-500 transition-all flex items-center justify-center gap-2"
            style={{ fontWeight: 800 }}
          >
            {copied ? (
              <>
                <CheckCircle className="w-5 h-5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                Copy Script
              </>
            )}
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl border-3 border-black bg-white text-black hover:bg-gray-100 transition-colors"
            style={{ fontWeight: 700 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

