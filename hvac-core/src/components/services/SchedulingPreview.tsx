'use client'

import { useState } from 'react'
import { ServiceTemplate } from '@/types/services'
import { checkAvailability } from '@/lib/scheduling'

interface SchedulingPreviewProps {
  template: any // Accept both ServiceTemplate and ScheduleTemplate for preview
}

export function SchedulingPreview({ template }: SchedulingPreviewProps) {
  const [context, setContext] = useState({
    timeOfDay: '09:00',
    dayOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase(),
    isHoliday: false,
    leadTime: 24,
    requestedDate: new Date()
  })

  const result = checkAvailability(
    template,
    context.requestedDate,
    context.timeOfDay,
    60 // default duration in minutes
  )

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Scheduling Preview</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Requested Date</label>
          <input
            type="date"
            value={context.requestedDate.toISOString().split('T')[0]}
            onChange={e => {
              const date = new Date(e.target.value)
              setContext(prev => ({
                ...prev,
                requestedDate: date,
                dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
              }))
            }}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Time of Day</label>
          <input
            type="time"
            value={context.timeOfDay}
            onChange={e => setContext(prev => ({ ...prev, timeOfDay: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Lead Time (hours)</label>
          <input
            type="number"
            min="0"
            value={context.leadTime}
            onChange={e => setContext(prev => ({ ...prev, leadTime: Number(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={context.isHoliday}
            onChange={e => setContext(prev => ({ ...prev, isHoliday: e.target.checked }))}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="ml-2 text-sm text-gray-700">Holiday</span>
        </div>

        <div className="pt-4 border-t">
          <div className="space-y-2">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">Availability:</span>
              <span className={`ml-2 text-sm font-medium ${
                result.isAvailable ? 'text-green-600' : 'text-red-600'
              }`}>
                {result.isAvailable ? 'Available' : 'Not Available'}
              </span>
            </div>

            {result.requiresApproval && (
              <div className="text-yellow-600 text-sm">
                ⚠️ Approval Required: {result.reason}
              </div>
            )}

            {!result.isAvailable && result.reason && (
              <div className="text-red-600 text-sm">
                ❌ {result.reason}
              </div>
            )}

            {!result.isAvailable && result.nextAvailableSlot && (
              <div className="text-blue-600 text-sm">
                Next available slot: {result.nextAvailableSlot.toLocaleDateString()} at 9:00 AM
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 