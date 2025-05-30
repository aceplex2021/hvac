'use client'

import { ServiceRequest } from '@/types/service-request'
import { format } from 'date-fns'
import { Button } from '@/components/ui/Button'

interface ServiceRequestListMobileProps {
  requests: ServiceRequest[]
  onSelect: (request: ServiceRequest) => void
}

export function ServiceRequestListMobile({ requests, onSelect }: ServiceRequestListMobileProps) {
  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <div
          key={request.id}
          className="bg-white rounded-lg shadow p-4"
          onClick={() => onSelect(request)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-gray-900">{request.customer_name}</h3>
              <p className="text-sm text-gray-500">{request.service_type}</p>
            </div>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              getStatusColor(request.status)
            }`}>
              {request.status}
            </span>
          </div>
          
          <div className="mt-2 text-sm text-gray-600">
            <p>{format(new Date(request.scheduled_date), 'MMM d, yyyy h:mm a')}</p>
            <p className="mt-1">{request.address}</p>
          </div>

          <div className="mt-3 flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onSelect(request)
              }}
            >
              View Details
            </Button>
            <span className="text-xs text-gray-500">
              Updated {format(new Date(request.updated_at), 'MMM d, h:mm a')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800'
    case 'in_progress':
      return 'bg-yellow-100 text-yellow-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
} 