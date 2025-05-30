export interface ServiceRequest {
  id: string
  customerId: string
  serviceTypeId: string
  status: 'pending' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'emergency'
  description: string
  notes?: string
  requestedDate: Date
  scheduledDate?: Date
  completedDate?: Date
  assignedTechnicianId?: string
  estimatedDuration?: number // in minutes
  actualDuration?: number // in minutes
  createdAt: Date
  updatedAt: Date
}

export interface ServiceRequestDetails extends ServiceRequest {
  customer: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  serviceType: {
    id: string
    name: string
    description: string
  }
  technician?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  history: {
    id: string
    status: ServiceRequest['status']
    notes?: string
    createdAt: Date
    createdBy: string
  }[]
} 