'use client'

import { ServiceRequestDetails } from '@/types/service-request'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ServiceRequestDetailsProps {
  request: ServiceRequestDetails
  onUpdateStatus: (status: ServiceRequestDetails['status'], notes?: string) => Promise<void>
  onAssignTechnician: (technicianId: string) => Promise<void>
  className?: string
}

export function ServiceRequestDetails({
  request,
  onUpdateStatus,
  onAssignTechnician,
  className
}: ServiceRequestDetailsProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">Service Request #{request.id}</h2>
          <p className="text-gray-600">
            Created on {new Date(request.createdAt).toLocaleDateString()}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Name:</span>{' '}
              {request.customer.firstName} {request.customer.lastName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {request.customer.email}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {request.customer.phone}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Service Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Service Type:</span>{' '}
              {request.serviceType.name}
            </p>
            <p>
              <span className="font-medium">Requested Date:</span>{' '}
              {new Date(request.requestedDate).toLocaleDateString()}
            </p>
            {request.scheduledDate && (
              <p>
                <span className="font-medium">Scheduled Date:</span>{' '}
                {new Date(request.scheduledDate).toLocaleDateString()}
              </p>
            )}
            {request.estimatedDuration && (
              <p>
                <span className="font-medium">Estimated Duration:</span>{' '}
                {request.estimatedDuration} minutes
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <p className="text-gray-700">{request.description}</p>
        {request.notes && (
          <>
            <h4 className="text-md font-semibold mt-4 mb-2">Additional Notes</h4>
            <p className="text-gray-700">{request.notes}</p>
          </>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">History</h3>
        <div className="space-y-4">
          {request.history.map((entry) => (
            <div
              key={entry.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">
                    Status changed to {entry.status.replace('_', ' ')}
                  </p>
                  <p className="text-sm text-gray-600">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    entry.status === 'completed' && 'bg-green-100 text-green-800',
                    entry.status === 'scheduled' && 'bg-blue-100 text-blue-800',
                    entry.status === 'in_progress' && 'bg-yellow-100 text-yellow-800',
                    entry.status === 'pending' && 'bg-gray-100 text-gray-800',
                    entry.status === 'cancelled' && 'bg-red-100 text-red-800'
                  )}
                >
                  {entry.status.replace('_', ' ')}
                </span>
              </div>
              {entry.notes && (
                <p className="mt-2 text-sm text-gray-600">{entry.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 