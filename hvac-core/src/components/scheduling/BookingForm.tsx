'use client'

import { useState } from 'react'
import { Appointment, TimeSlot } from '@/types/scheduling'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface BookingFormProps {
  date: Date
  timeSlot: TimeSlot
  serviceTypeId: string
  onSubmit: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  className?: string
}

export function BookingForm({
  date,
  timeSlot,
  serviceTypeId,
  onSubmit,
  onCancel,
  className
}: BookingFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'> = {
        serviceTypeId,
        customerId: 'current-user-id', // TODO: Get from auth context
        startTime: date,
        endTime: new Date(date.getTime() + 60 * 60 * 1000), // 1 hour duration
        status: 'scheduled',
        notes: notes.trim() || undefined
      }

      await onSubmit(appointment)
    } catch (error) {
      console.error('Failed to book appointment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Appointment Details</h3>
          <p className="text-sm text-gray-600">
            {date.toLocaleDateString()} at {timeSlot.start} - {timeSlot.end}
          </p>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            placeholder="Any special instructions or requirements..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Booking...' : 'Confirm Appointment'}
        </Button>
      </div>
    </form>
  )
} 