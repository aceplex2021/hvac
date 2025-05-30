'use client'

import { useState, useEffect } from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { ServiceRequest } from '@/types/service-request'
import { Technician } from '@/types/technician'

interface LiveStatusProps {
  serviceRequestId?: string
  technicianId?: string
}

export function LiveStatus({ serviceRequestId, technicianId }: LiveStatusProps) {
  const [serviceRequest, setServiceRequest] = useState<ServiceRequest | null>(null)
  const [technician, setTechnician] = useState<Technician | null>(null)
  const { subscribeToServiceRequests, subscribeToTechnicianLocations } = useRealtime()

  useEffect(() => {
    if (serviceRequestId) {
      const channel = subscribeToServiceRequests((payload) => {
        if (payload.new.id === serviceRequestId) {
          setServiceRequest(payload.new)
        }
      })
      return () => channel.unsubscribe()
    }
  }, [serviceRequestId, subscribeToServiceRequests])

  useEffect(() => {
    if (technicianId) {
      const channel = subscribeToTechnicianLocations((payload) => {
        if (payload.new.technician_id === technicianId) {
          setTechnician(payload.new)
        }
      })
      return () => channel.unsubscribe()
    }
  }, [technicianId, subscribeToTechnicianLocations])

  const getStatusColor = (status: string) => {
    switch (status) {
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

  return (
    <div className="space-y-4">
      {serviceRequest && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Service Request Status</h3>
          <div className="mt-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(serviceRequest.status)}`}>
              {serviceRequest.status.replace('_', ' ')}
            </span>
            <p className="mt-1 text-sm text-gray-600">
              Last updated: {new Date(serviceRequest.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}

      {technician && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Technician Status</h3>
          <div className="mt-2">
            <p className="text-sm text-gray-600">
              Location: {technician.location}
            </p>
            <p className="text-sm text-gray-600">
              Status: {technician.status}
            </p>
            <p className="text-sm text-gray-600">
              Last updated: {new Date(technician.updated_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 