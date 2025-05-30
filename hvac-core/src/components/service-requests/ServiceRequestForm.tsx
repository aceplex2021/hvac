'use client'

import { useState } from 'react'
import { ServiceRequest } from '@/types/service-request'
import { Button } from '@/components/ui/Button'
import { CustomerSearch } from '@/components/customers/CustomerSearch'
import { cn } from '@/lib/utils'

interface ServiceRequestFormProps {
  onSubmit: (request: Omit<ServiceRequest, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  onCancel: () => void
  className?: string
}

export function ServiceRequestForm({ onSubmit, onCancel, className }: ServiceRequestFormProps) {
  const [formData, setFormData] = useState({
    customerId: '',
    serviceTypeId: '',
    priority: 'medium' as const,
    description: '',
    notes: '',
    requestedDate: new Date(),
    estimatedDuration: 60
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit({
        ...formData,
        status: 'pending',
        requestedDate: new Date(formData.requestedDate)
      })
    } catch (error) {
      console.error('Error submitting service request:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <CustomerSearch
            onSelect={(customer) => setFormData({ ...formData, customerId: customer.id })}
          />
        </div>

        <div>
          <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700">
            Service Type
          </label>
          <select
            id="serviceType"
            value={formData.serviceTypeId}
            onChange={(e) => setFormData({ ...formData, serviceTypeId: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select a service type</option>
            {/* TODO: Add service types from database */}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={2}
          />
        </div>

        <div>
          <label htmlFor="requestedDate" className="block text-sm font-medium text-gray-700">
            Requested Date
          </label>
          <input
            type="datetime-local"
            id="requestedDate"
            value={formData.requestedDate.toISOString().slice(0, 16)}
            onChange={(e) => setFormData({ ...formData, requestedDate: new Date(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="estimatedDuration" className="block text-sm font-medium text-gray-700">
            Estimated Duration (minutes)
          </label>
          <input
            type="number"
            id="estimatedDuration"
            value={formData.estimatedDuration}
            onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="15"
            step="15"
            required
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
          {isSubmitting ? 'Submitting...' : 'Create Request'}
        </Button>
      </div>
    </form>
  )
} 