'use client'

interface ErrorDisplayProps {
  error: string | null
  onDismiss: () => void
}

export default function ErrorDisplay({ error, onDismiss }: ErrorDisplayProps) {
  if (!error) return null

  return (
    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <span className="text-red-500 text-xl">⚠️</span>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
        <button
          onClick={onDismiss}
          className="ml-4 text-red-500 hover:text-red-700"
        >
          ×
        </button>
      </div>
    </div>
  )
}

