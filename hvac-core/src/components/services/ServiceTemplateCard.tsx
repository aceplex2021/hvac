'use client'

import { Button } from '@/components/ui/Button'
import { ServiceTemplate } from '@/types/services'

interface ServiceTemplateCardProps {
  template: ServiceTemplate
  onEdit: (template: ServiceTemplate) => void
  onDelete: (template: ServiceTemplate) => void
}

export function ServiceTemplateCard({ template, onEdit, onDelete }: ServiceTemplateCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{template.name}</h3>
          <p className="text-sm text-gray-500">{template.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(template)}>Edit</Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(template)}>Delete</Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700">Pricing</h4>
          <div className="mt-1">
            <span className="text-lg font-semibold">${template.basePrice}</span>
            <span className="text-sm text-gray-500 ml-2">({template.pricingModel})</span>
          </div>
          {template.pricingRules.length > 0 && (
            <div className="mt-2 text-sm text-gray-600">
              {template.pricingRules.length} pricing rule{template.pricingRules.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Duration</h4>
          <p className="mt-1 text-sm text-gray-600">{template.duration} minutes</p>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Scheduling Rules</h4>
          {template.schedulingRules.length > 0 ? (
            <ul className="mt-1 text-sm text-gray-600">
              {template.schedulingRules.map(rule => (
                <li key={rule.id} className="flex items-center">
                  <span className="capitalize">{rule.type}</span>
                  <span className="mx-1">-</span>
                  <span>{rule.value}</span>
                  <span className="mx-1">-</span>
                  <span className="capitalize">{rule.action}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No scheduling rules</p>
          )}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700">Checklist Items</h4>
          {template.checklist.length > 0 ? (
            <ul className="mt-1 text-sm text-gray-600">
              {template.checklist.map(item => (
                <li key={item.id} className="flex items-center">
                  <span className="capitalize">{item.category}</span>
                  <span className="mx-1">-</span>
                  <span>{item.description}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-1 text-sm text-gray-500">No checklist items</p>
          )}
        </div>
      </div>
    </div>
  )
} 