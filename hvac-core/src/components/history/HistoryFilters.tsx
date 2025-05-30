'use client'

import { useState } from 'react'
import { ServiceHistoryFilters } from '@/types/service-history'
import { Button } from '@/components/ui/Button'
import { format } from 'date-fns'

interface HistoryFiltersProps {
  filters: ServiceHistoryFilters
  onFiltersChange: (filters: ServiceHistoryFilters) => void
}

export function HistoryFilters({ filters, onFiltersChange }: HistoryFiltersProps) {
  const [dateRange, setDateRange] = useState({
    start: filters.dateRange?.start || new Date(new Date().setMonth(new Date().getMonth() - 1)),
    end: filters.dateRange?.end || new Date()
  })
  const [status, setStatus] = useState<string[]>(filters.status || [])
  const [technicianId, setTechnicianId] = useState<string | undefined>(filters.technicianId)
  const [customerId, setCustomerId] = useState<string | undefined>(filters.customerId)
  const [serviceTypeId, setServiceTypeId] = useState<string | undefined>(filters.serviceTypeId)

  const handleApply = () => {
    onFiltersChange({
      dateRange,
      status: status.length ? status : undefined,
      technicianId,
      customerId,
      serviceTypeId
    })
  }

  const handleReset = () => {
    setDateRange({
      start: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      end: new Date()
    })
    setStatus([])
    setTechnicianId(undefined)
    setCustomerId(undefined)
    setServiceTypeId(undefined)
    onFiltersChange({})
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={format(dateRange.start, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                start: new Date(e.target.value)
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            <input
              type="date"
              value={format(dateRange.end, 'yyyy-MM-dd')}
              onChange={(e) => setDateRange(prev => ({
                ...prev,
                end: new Date(e.target.value)
              }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            multiple
            value={status}
            onChange={(e) => setStatus(Array.from(e.target.selectedOptions, option => option.value))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="rescheduled">Rescheduled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Technician
          </label>
          <select
            value={technicianId || ''}
            onChange={(e) => setTechnicianId(e.target.value || undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Technicians</option>
            {/* TODO: Add technician options */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer
          </label>
          <select
            value={customerId || ''}
            onChange={(e) => setCustomerId(e.target.value || undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Customers</option>
            {/* TODO: Add customer options */}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Service Type
          </label>
          <select
            value={serviceTypeId || ''}
            onChange={(e) => setServiceTypeId(e.target.value || undefined)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Service Types</option>
            {/* TODO: Add service type options */}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          onClick={handleApply}
        >
          Apply Filters
        </Button>
      </div>
    </div>
  )
} 