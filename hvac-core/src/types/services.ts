export type ServiceCategory = 'installation' | 'repair' | 'maintenance'

export interface ServiceType {
  id: string
  name: string
  category: ServiceCategory
  description: string
  estimatedDuration: number // in minutes
  basePrice: number
  isActive: boolean
  requiredSkills: string[]
  requiredEquipment: string[]
  createdAt: Date
  updatedAt: Date
}

export interface ServiceTemplate {
  id: string
  businessId: string
  name: string
  description: string
  basePrice: number
  pricingModel: 'fixed' | 'hourly' | 'custom'
  pricingRules: PricingRule[]
  duration: number // in minutes
  schedulingRules: SchedulingRule[]
  requiredMaterials: MaterialRequirement[]
  checklist: ChecklistItem[]
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface PricingRule {
  id: string
  condition: string // e.g., "timeOfDay", "dayOfWeek", "emergency"
  modifier: number // percentage or fixed amount
  description: string
}

export interface SchedulingRule {
  id: string
  type: 'timeOfDay' | 'dayOfWeek' | 'leadTime' | 'blackout'
  value: string // e.g., "09:00-17:00", "weekend", "24h", "holiday"
  action: 'allow' | 'block' | 'requireApproval'
}

export interface MaterialRequirement {
  id: string
  materialId: string
  quantity: number
  isOptional: boolean
}

export interface ServiceStep {
  id: string
  order: number
  description: string
  estimatedDuration: number
  requiredPhotos: boolean
  notes?: string
}

export interface ChecklistItem {
  id: string
  description: string
  isRequired: boolean
  category: 'safety' | 'quality' | 'documentation'
}

export interface PhotoRequirement {
  id: string
  description: string
  isRequired: boolean
  stage: 'before' | 'during' | 'after'
  purpose: string
} 