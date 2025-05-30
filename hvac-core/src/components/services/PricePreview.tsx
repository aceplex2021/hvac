'use client'

import { useState } from 'react'
import { ServiceTemplate } from '@/types/services'
import { calculatePrice } from '@/lib/pricing'

interface PricePreviewProps {
  template: ServiceTemplate
}

export function PricePreview({ template }: PricePreviewProps) {
  const [context, setContext] = useState({
    timeOfDay: '09:00',
    dayOfWeek: 'monday',
    isEmergency: false,
    isHoliday: false,
    customerType: 'residential',
    location: {
      zipCode: '',
      distance: 0
    }
  })

  const [hours, setHours] = useState(1)

  const price = calculatePrice(template, context, template.pricingModel === 'hourly' ? hours : undefined)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Price Preview</h3>
      
      <div className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700">Day of Week</label>
          <select
            value={context.dayOfWeek}
            onChange={e => setContext(prev => ({ ...prev, dayOfWeek: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="monday">Monday</option>
            <option value="tuesday">Tuesday</option>
            <option value="wednesday">Wednesday</option>
            <option value="thursday">Thursday</option>
            <option value="friday">Friday</option>
            <option value="saturday">Saturday</option>
            <option value="sunday">Sunday</option>
          </select>
        </div>

        {template.pricingModel === 'hourly' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Hours</label>
            <input
              type="number"
              min="1"
              value={hours}
              onChange={e => setHours(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        )}

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={context.isEmergency}
              onChange={e => setContext(prev => ({ ...prev, isEmergency: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Emergency Service</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={context.isHoliday}
              onChange={e => setContext(prev => ({ ...prev, isHoliday: e.target.checked }))}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">Holiday</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Customer Type</label>
          <select
            value={context.customerType}
            onChange={e => setContext(prev => ({ ...prev, customerType: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Distance (miles)</label>
          <input
            type="number"
            min="0"
            value={context.location.distance}
            onChange={e => setContext(prev => ({
              ...prev,
              location: { ...prev.location, distance: Number(e.target.value) }
            }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-medium">Final Price</span>
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 