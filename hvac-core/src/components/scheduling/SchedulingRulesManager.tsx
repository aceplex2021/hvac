'use client'

import { useState } from 'react'
import { ScheduleRule, ScheduleTemplate } from '@/types/scheduling'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface SchedulingRulesManagerProps {
  template: ScheduleTemplate
  onUpdate: (rules: ScheduleRule[]) => void
  className?: string
}

export function SchedulingRulesManager({
  template,
  onUpdate,
  className
}: SchedulingRulesManagerProps) {
  const [rules, setRules] = useState<ScheduleRule[]>(template.rules)

  const addRule = () => {
    const newRule: ScheduleRule = {
      id: crypto.randomUUID(),
      type: 'timeOfDay',
      value: '',
      action: 'allow',
      description: ''
    }
    setRules([...rules, newRule])
  }

  const updateRule = (index: number, field: keyof ScheduleRule, value: string) => {
    const newRules = [...rules]
    newRules[index] = {
      ...newRules[index],
      [field]: value
    }
    setRules(newRules)
    onUpdate(newRules)
  }

  const removeRule = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index)
    setRules(newRules)
    onUpdate(newRules)
  }

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Scheduling Rules</h3>
        <Button onClick={addRule}>Add Rule</Button>
      </div>

      <div className="space-y-4">
        {rules.map((rule, index) => (
          <div key={rule.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                value={rule.type}
                onChange={(e) => updateRule(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="timeOfDay">Time of Day</option>
                <option value="dayOfWeek">Day of Week</option>
                <option value="leadTime">Lead Time</option>
                <option value="blackout">Blackout Period</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Value</label>
              <input
                type="text"
                value={rule.value}
                onChange={(e) => updateRule(index, 'value', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder={getPlaceholder(rule.type)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Action</label>
              <select
                value={rule.action}
                onChange={(e) => updateRule(index, 'action', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="allow">Allow</option>
                <option value="block">Block</option>
                <option value="requireApproval">Require Approval</option>
              </select>
            </div>

            <div className="flex items-end space-x-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={rule.description || ''}
                  onChange={(e) => updateRule(index, 'description', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Rule description"
                />
              </div>
              <Button
                variant="destructive"
                onClick={() => removeRule(index)}
                className="self-end"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function getPlaceholder(type: string): string {
  switch (type) {
    case 'timeOfDay':
      return 'e.g., 09:00-17:00'
    case 'dayOfWeek':
      return 'e.g., monday, tuesday'
    case 'leadTime':
      return 'e.g., 24 (hours)'
    case 'blackout':
      return 'e.g., 2024-01-01-2024-01-07'
    default:
      return ''
  }
} 