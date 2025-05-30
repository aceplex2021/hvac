import { useState } from 'react'
import { ServiceType, ServiceCategory } from '@/types/services'
import { Button } from '@/components/ui/Button'
import { FormField } from '@/components/ui/FormField'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card'

interface ServiceTypeFormProps {
  initialData?: Partial<ServiceType>
  onSubmit: (data: Partial<ServiceType>) => void
  onCancel: () => void
}

const SERVICE_CATEGORIES: ServiceCategory[] = ['installation', 'repair', 'maintenance']

export function ServiceTypeForm({ initialData, onSubmit, onCancel }: ServiceTypeFormProps) {
  const [formData, setFormData] = useState<Partial<ServiceType>>({
    name: '',
    category: 'installation',
    description: '',
    estimatedDuration: 60,
    basePrice: 0,
    isActive: true,
    requiredSkills: [],
    requiredEquipment: [],
    ...initialData,
  })

  const [skillInput, setSkillInput] = useState('')
  const [equipmentInput, setEquipmentInput] = useState('')

  const handleChange = (field: keyof ServiceType, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.requiredSkills?.includes(skillInput.trim())) {
      handleChange('requiredSkills', [...(formData.requiredSkills || []), skillInput.trim()])
      setSkillInput('')
    }
  }

  const handleAddEquipment = () => {
    if (equipmentInput.trim() && !formData.requiredEquipment?.includes(equipmentInput.trim())) {
      handleChange('requiredEquipment', [...(formData.requiredEquipment || []), equipmentInput.trim()])
      setEquipmentInput('')
    }
  }

  const handleRemoveSkill = (skill: string) => {
    handleChange(
      'requiredSkills',
      formData.requiredSkills?.filter(s => s !== skill) || []
    )
  }

  const handleRemoveEquipment = (equipment: string) => {
    handleChange(
      'requiredEquipment',
      formData.requiredEquipment?.filter(e => e !== equipment) || []
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData ? 'Edit Service Type' : 'Create Service Type'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            label="Name"
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            required
          />

          <div>
            <label className="text-sm font-medium">Category</label>
            <select
              className="mt-1 block w-full rounded-md border border-gray-200 p-2"
              value={formData.category}
              onChange={e => handleChange('category', e.target.value)}
              required
            >
              {SERVICE_CATEGORIES.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <FormField
            label="Description"
            type="text"
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Estimated Duration (minutes)"
              type="number"
              value={formData.estimatedDuration}
              onChange={e => handleChange('estimatedDuration', parseInt(e.target.value))}
              required
              min={1}
            />

            <FormField
              label="Base Price ($)"
              type="number"
              value={formData.basePrice}
              onChange={e => handleChange('basePrice', parseFloat(e.target.value))}
              required
              min={0}
              step={0.01}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Required Skills</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 p-2"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                placeholder="Enter a required skill"
              />
              <Button type="button" onClick={handleAddSkill}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requiredSkills?.map(skill => (
                <span
                  key={skill}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded-full flex items-center"
                >
                  {skill}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => handleRemoveSkill(skill)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Required Equipment</label>
            <div className="flex gap-2 mt-1">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-200 p-2"
                value={equipmentInput}
                onChange={e => setEquipmentInput(e.target.value)}
                placeholder="Enter required equipment"
              />
              <Button type="button" onClick={handleAddEquipment}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.requiredEquipment?.map(equipment => (
                <span
                  key={equipment}
                  className="px-2 py-1 text-sm bg-purple-100 text-purple-800 rounded-full flex items-center"
                >
                  {equipment}
                  <button
                    type="button"
                    className="ml-2 text-purple-600 hover:text-purple-800"
                    onClick={() => handleRemoveEquipment(equipment)}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => handleChange('isActive', e.target.checked)}
              className="rounded border-gray-300"
            />
            <label htmlFor="isActive" className="text-sm font-medium">
              Active
            </label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update' : 'Create'} Service Type
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 