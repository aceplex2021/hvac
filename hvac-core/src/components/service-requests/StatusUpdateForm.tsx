'use client'

import { useState } from 'react'
import { ServiceRequest } from '@/types/service-request'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface StatusUpdateFormProps {
  currentStatus: ServiceRequest['status']
  onUpdate: (status: ServiceRequest['status'], notes?: string) => Promise<void>
  className?: string
}

export function StatusUpdateForm({ currentStatus, onUpdate, className }: StatusUpdateFormProps) {
  const [newStatus, setNewStatus] = useState<ServiceRequest['status']>(currentStatus)
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onUpdate(newStatus, notes.trim() || undefined)
      setNotes('')
    } catch (error) {
      console.error('Error updating status:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-4', className)}>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Update Status
        </label>
        <select
          id="status"
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value as ServiceRequest['status'])}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Status Update Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
          placeholder="Add any relevant notes about this status change..."
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || newStatus === currentStatus}
        >
          {isSubmitting ? 'Updating...' : 'Update Status'}
        </Button>
      </div>
    </form>
  )
} 