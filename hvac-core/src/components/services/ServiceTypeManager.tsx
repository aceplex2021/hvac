'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ServiceTypeCard } from './ServiceTypeCard'
import { ServiceTypeForm } from './ServiceTypeForm'
import { ServiceType } from '@/types/services'
import { createServiceType, updateServiceType, deleteServiceType, toggleServiceTypeActive } from '@/lib/services'

interface ServiceTypeManagerProps {
  initialServiceTypes: ServiceType[]
}

export function ServiceTypeManager({ initialServiceTypes }: ServiceTypeManagerProps) {
  const [serviceTypes, setServiceTypes] = useState(initialServiceTypes)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null)

  const handleCreate = async (data: Partial<ServiceType>) => {
    try {
      await createServiceType(data as Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>)
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to create service type:', error)
      // TODO: Add error handling UI
    }
  }

  const handleEdit = async (data: Partial<ServiceType>) => {
    if (!editingServiceType) return

    try {
      await updateServiceType(editingServiceType.id, data)
      setIsFormOpen(false)
      setEditingServiceType(null)
    } catch (error) {
      console.error('Failed to update service type:', error)
      // TODO: Add error handling UI
    }
  }

  const handleDelete = async (serviceType: ServiceType) => {
    try {
      await deleteServiceType(serviceType.id)
      setServiceTypes(prev => prev.filter(st => st.id !== serviceType.id))
    } catch (error) {
      console.error('Failed to delete service type:', error)
      // TODO: Add error handling UI
    }
  }

  const handleToggleActive = async (serviceType: ServiceType) => {
    try {
      await toggleServiceTypeActive(serviceType.id, !serviceType.isActive)
      // No state update since the function returns void
    } catch (error) {
      console.error('Failed to toggle service type active status:', error)
      // TODO: Add error handling UI
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Service Types</h1>
        <Button onClick={() => setIsFormOpen(true)}>Create Service Type</Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <ServiceTypeForm
              initialData={editingServiceType || undefined}
              onSubmit={editingServiceType ? handleEdit : handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingServiceType(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviceTypes.map(serviceType => (
          <ServiceTypeCard
            key={serviceType.id}
            serviceType={serviceType}
            onEdit={(serviceType) => {
              setEditingServiceType(serviceType)
              setIsFormOpen(true)
            }}
            onDelete={handleDelete}
            onToggleActive={handleToggleActive}
          />
        ))}
      </div>
    </div>
  )
} 