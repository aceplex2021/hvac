'use client'

import { CustomerProfile } from '@/types/customer'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface CustomerProfileProps {
  customer: CustomerProfile
  onEdit: () => void
  className?: string
}

export function CustomerProfile({ customer, onEdit, className }: CustomerProfileProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow p-6', className)}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {customer.firstName} {customer.lastName}
          </h2>
          <p className="text-gray-600">{customer.email}</p>
          <p className="text-gray-600">{customer.phone}</p>
        </div>
        <Button onClick={onEdit}>Edit Profile</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Address:</span> {customer.address.street}
            </p>
            <p>
              {customer.address.city}, {customer.address.state} {customer.address.zipCode}
            </p>
            <p>{customer.address.country}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-4">Preferences</h3>
          <div className="space-y-2">
            <p>
              <span className="font-medium">Preferred Contact:</span>{' '}
              {customer.preferences.preferredContactMethod}
            </p>
            <p>
              <span className="font-medium">Preferred Time:</span>{' '}
              {customer.preferences.preferredTimeOfDay}
            </p>
            {customer.preferences.specialInstructions && (
              <p>
                <span className="font-medium">Special Instructions:</span>{' '}
                {customer.preferences.specialInstructions}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-4">Service History</h3>
        <div className="space-y-4">
          {customer.serviceHistory.map((service) => (
            <div
              key={service.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">{service.serviceType}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(service.date).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={cn(
                    'px-2 py-1 rounded-full text-xs font-medium',
                    service.status === 'completed' && 'bg-green-100 text-green-800',
                    service.status === 'scheduled' && 'bg-blue-100 text-blue-800',
                    service.status === 'cancelled' && 'bg-red-100 text-red-800'
                  )}
                >
                  {service.status}
                </span>
              </div>
              {service.notes && (
                <p className="mt-2 text-sm text-gray-600">{service.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
} 