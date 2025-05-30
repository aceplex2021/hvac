'use client'

import { useState } from 'react'
import { ServiceRequest } from '@/types/service-request'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ServiceRequestListProps {
  requests: ServiceRequest[]
  onStatusUpdate: (requestId: string, status: ServiceRequest['status'], notes?: string) => Promise<void>
  onSelect: (request: ServiceRequest) => void
  className?: string
}

export function ServiceRequestList({
  requests,
  onStatusUpdate,
  onSelect,
  className
}: ServiceRequestListProps) {
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const [updatingRequestId, setUpdatingRequestId] = useState<string | null>(null)

  const handleStatusUpdate = async (requestId: string, status: ServiceRequest['status'], notes?: string) => {
    setUpdatingRequestId(requestId)
    try {
      await onStatusUpdate(requestId, status, notes)
      if (expandedRequestId === requestId) {
        setExpandedRequestId(null)
      }
    } catch (error) {
      console.error('Error updating request status:', error)
    } finally {
      setUpdatingRequestId(null)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div
            className="flex justify-between items-start cursor-pointer"
            onClick={() => setExpandedRequestId(expandedRequestId === request.id ? null : request.id)}
          >
            <div>
              <h3 className="text-lg font-medium">
                Request #{request.id}
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(request.requestedDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  request.status === 'completed' && 'bg-green-100 text-green-800',
                  request.status === 'scheduled' && 'bg-blue-100 text-blue-800',
                  request.status === 'in_progress' && 'bg-yellow-100 text-yellow-800',
                  request.status === 'pending' && 'bg-gray-100 text-gray-800',
                  request.status === 'cancelled' && 'bg-red-100 text-red-800'
                )}
              >
                {request.status.replace('_', ' ')}
              </span>
              <span
                className={cn(
                  'px-2 py-1 rounded-full text-xs font-medium',
                  request.priority === 'emergency' && 'bg-red-100 text-red-800',
                  request.priority === 'high' && 'bg-orange-100 text-orange-800',
                  request.priority === 'medium' && 'bg-yellow-100 text-yellow-800',
                  request.priority === 'low' && 'bg-green-100 text-green-800'
                )}
              >
                {request.priority}
              </span>
            </div>
          </div>

          {expandedRequestId === request.id && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Description</h4>
                  <p className="mt-1 text-sm text-gray-600">{request.description}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Notes</h4>
                  <p className="mt-1 text-sm text-gray-600">{request.notes || 'No additional notes'}</p>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={() => onSelect(request)}
                >
                  View Details
                </Button>
                <div className="flex items-center space-x-2">
                  <select
                    value={request.status}
                    onChange={(e) => handleStatusUpdate(
                      request.id,
                      e.target.value as ServiceRequest['status']
                    )}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={updatingRequestId === request.id}
                  >
                    <option value="pending">Pending</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  {updatingRequestId === request.id && (
                    <span className="text-sm text-gray-500">Updating...</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 