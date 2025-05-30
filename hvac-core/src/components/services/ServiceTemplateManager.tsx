'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ServiceTemplate, PricingRule, SchedulingRule, MaterialRequirement, ChecklistItem } from '@/types/services'
import { createServiceTemplate, updateServiceTemplate, deleteServiceTemplate } from '@/lib/services'

interface ServiceTemplateManagerProps {
  businessId: string
  initialTemplates: ServiceTemplate[]
}

export function ServiceTemplateManager({ businessId, initialTemplates }: ServiceTemplateManagerProps) {
  const [templates, setTemplates] = useState(initialTemplates)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<ServiceTemplate | null>(null)

  const handleCreate = async (data: Partial<ServiceTemplate>) => {
    try {
      const newTemplate = await createServiceTemplate({
        ...data,
        businessId,
        pricingRules: [],
        schedulingRules: [],
        requiredMaterials: [],
        checklist: [],
        isActive: true
      } as ServiceTemplate)
      setTemplates(prev => [newTemplate, ...prev])
      setIsFormOpen(false)
    } catch (error) {
      console.error('Failed to create service template:', error)
    }
  }

  const handleEdit = async (data: Partial<ServiceTemplate>) => {
    if (!editingTemplate) return

    try {
      const updatedTemplate = await updateServiceTemplate(editingTemplate.id, data)
      setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t))
      setIsFormOpen(false)
      setEditingTemplate(null)
    } catch (error) {
      console.error('Failed to update service template:', error)
    }
  }

  const handleDelete = async (template: ServiceTemplate) => {
    try {
      await deleteServiceTemplate(template.id)
      setTemplates(prev => prev.filter(t => t.id !== template.id))
    } catch (error) {
      console.error('Failed to delete service template:', error)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Service Templates</h1>
        <Button onClick={() => setIsFormOpen(true)}>Create Template</Button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl">
            <ServiceTemplateForm
              businessId={businessId}
              initialData={editingTemplate || undefined}
              onSubmit={editingTemplate ? handleEdit : handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingTemplate(null)
              }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map(template => (
          <ServiceTemplateCard
            key={template.id}
            template={template}
            onEdit={(template) => {
              setEditingTemplate(template)
              setIsFormOpen(true)
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  )
} 