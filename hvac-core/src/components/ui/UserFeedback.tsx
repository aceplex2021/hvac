'use client'

import { useState } from 'react'
import { Star, Send } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserFeedbackProps {
  onSubmit: (rating: number, comment: string) => void
  className?: string
}

export function UserFeedback({ onSubmit, className = '' }: UserFeedbackProps) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(rating, comment)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className={cn('text-center p-6', className)}>
        <h3 className="text-lg font-medium mb-2">Thank you for your feedback!</h3>
        <p className="text-gray-600">We appreciate your input and will use it to improve our service.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('max-w-md mx-auto p-6 border rounded-lg', className)}>
      <h3 className="text-lg font-medium mb-4">How was your experience?</h3>
      
      <div className="flex justify-center mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="p-1"
          >
            <Star
              className={cn(
                'w-8 h-8',
                (hoverRating || rating) >= star
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              )}
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Tell us more about your experience..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
        />
      </div>

      <button
        type="submit"
        disabled={rating === 0}
        className={cn(
          'w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg',
          rating === 0
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        )}
      >
        <Send className="w-4 h-4" />
        Submit Feedback
      </button>
    </form>
  )
} 