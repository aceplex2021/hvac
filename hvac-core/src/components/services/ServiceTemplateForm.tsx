'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ServiceTemplate, PricingRule, SchedulingRule, MaterialRequirement, ChecklistItem } from '@/types/services'
import { PricePreview } from './PricePreview'
import { SchedulingPreview } from './SchedulingPreview'

interface ServiceTemplateFormProps {
  businessId: string
  initialData?: ServiceTemplate
  onSubmit: (data: Partial<ServiceTemplate>) => Promise<void>
  onCancel: () => void
}

export function ServiceTemplateForm({ businessId, initialData, onSubmit, onCancel }: ServiceTemplateFormProps) {
  const [formData, setFormData] = useState<Partial<ServiceTemplate>>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    basePrice: initialData?.basePrice || 0,
    pricingModel: initialData?.pricingModel || 'fixed',
    duration: initialData?.duration || 60,
    pricingRules: initialData?.pricingRules || [],
    schedulingRules: initialData?.schedulingRules || [],
    requiredMaterials: initialData?.requiredMaterials || [],
    checklist: initialData?.checklist || [],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const addPricingRule = () => {
    setFormData(prev => ({
      ...prev,
      pricingRules: [
        ...(prev.pricingRules || []),
        {
          id: crypto.randomUUID(),
          condition: '',
          modifier: 0,
          description: ''
        }
      ]
    }))
  }

  const addSchedulingRule = () => {
    setFormData(prev => ({
      ...prev,
      schedulingRules: [
        ...(prev.schedulingRules || []),
        {
          id: crypto.randomUUID(),
          type: 'timeOfDay',
          value: '',
          action: 'allow'
        }
      ]
    }))
  }

  const addChecklistItem = () => {
    setFormData(prev => ({
      ...prev,
      checklist: [
        ...(prev.checklist || []),
        {
          id: crypto.randomUUID(),
          description: '',
          isRequired: true,
          category: 'safety'
        }
      ]
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Base Price</label>
              <input
                type="number"
                value={formData.basePrice}
                onChange={e => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
              <input
                type="number"
                value={formData.duration}
                onChange={e => setFormData(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pricing Model</label>
            <select
              value={formData.pricingModel}
              onChange={e => setFormData(prev => ({ ...prev, pricingModel: e.target.value as 'fixed' | 'hourly' | 'custom' }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="fixed">Fixed Price</option>
              <option value="hourly">Hourly Rate</option>
              <option value="custom">Custom Rules</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Pricing Rules</h3>
              <Button type="button" onClick={addPricingRule}>Add Rule</Button>
            </div>
            {formData.pricingRules?.map((rule, index) => (
              <div key={rule.id} className="grid grid-cols-3 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Condition"
                  value={rule.condition}
                  onChange={e => {
                    const newRules = [...(formData.pricingRules || [])]
                    newRules[index] = { ...rule, condition: e.target.value }
                    setFormData(prev => ({ ...prev, pricingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  placeholder="Modifier"
                  value={rule.modifier}
                  onChange={e => {
                    const newRules = [...(formData.pricingRules || [])]
                    newRules[index] = { ...rule, modifier: Number(e.target.value) }
                    setFormData(prev => ({ ...prev, pricingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={rule.description}
                  onChange={e => {
                    const newRules = [...(formData.pricingRules || [])]
                    newRules[index] = { ...rule, description: e.target.value }
                    setFormData(prev => ({ ...prev, pricingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Scheduling Rules</h3>
              <Button type="button" onClick={addSchedulingRule}>Add Rule</Button>
            </div>
            {formData.schedulingRules?.map((rule, index) => (
              <div key={rule.id} className="grid grid-cols-3 gap-4 mb-2">
                <select
                  value={rule.type}
                  onChange={e => {
                    const newRules = [...(formData.schedulingRules || [])]
                    newRules[index] = { ...rule, type: e.target.value as any }
                    setFormData(prev => ({ ...prev, schedulingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="timeOfDay">Time of Day</option>
                  <option value="dayOfWeek">Day of Week</option>
                  <option value="leadTime">Lead Time</option>
                  <option value="blackout">Blackout Period</option>
                </select>
                <input
                  type="text"
                  placeholder="Value"
                  value={rule.value}
                  onChange={e => {
                    const newRules = [...(formData.schedulingRules || [])]
                    newRules[index] = { ...rule, value: e.target.value }
                    setFormData(prev => ({ ...prev, schedulingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <select
                  value={rule.action}
                  onChange={e => {
                    const newRules = [...(formData.schedulingRules || [])]
                    newRules[index] = { ...rule, action: e.target.value as any }
                    setFormData(prev => ({ ...prev, schedulingRules: newRules }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="allow">Allow</option>
                  <option value="block">Block</option>
                  <option value="requireApproval">Require Approval</option>
                </select>
              </div>
            ))}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-medium">Checklist Items</h3>
              <Button type="button" onClick={addChecklistItem}>Add Item</Button>
            </div>
            {formData.checklist?.map((item, index) => (
              <div key={item.id} className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="text"
                  placeholder="Description"
                  value={item.description}
                  onChange={e => {
                    const newItems = [...(formData.checklist || [])]
                    newItems[index] = { ...item, description: e.target.value }
                    setFormData(prev => ({ ...prev, checklist: newItems }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <select
                  value={item.category}
                  onChange={e => {
                    const newItems = [...(formData.checklist || [])]
                    newItems[index] = { ...item, category: e.target.value as any }
                    setFormData(prev => ({ ...prev, checklist: newItems }))
                  }}
                  className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="safety">Safety</option>
                  <option value="quality">Quality</option>
                  <option value="documentation">Documentation</option>
                </select>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <PricePreview template={{
            id: '',
            businessId: '',
            name: formData.name || '',
            description: formData.description || '',
            basePrice: formData.basePrice || 0,
            pricingModel: formData.pricingModel || 'fixed',
            pricingRules: formData.pricingRules || [],
            duration: formData.duration || 60,
            schedulingRules: formData.schedulingRules || [],
            requiredMaterials: formData.requiredMaterials || [],
            checklist: formData.checklist || [],
            isActive: formData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
          }} />
          <SchedulingPreview template={{
            id: '',
            name: formData.name || '',
            description: formData.description || '',
            defaultDuration: 60,
            dailySchedules: [],
            rules: [],
            bufferTime: 0,
            maxBookingsPerSlot: 1,
            isActive: formData.isActive ?? true,
            createdAt: new Date(),
            updatedAt: new Date()
          }} />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit">Save Template</Button>
      </div>
    </form>
  )
} 