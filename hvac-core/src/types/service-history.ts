export interface ServiceHistory {
  id: string
  serviceRequestId: string
  technicianId: string
  status: ServiceStatus
  startTime: Date
  endTime: Date | null
  notes: string
  partsUsed: PartUsage[]
  laborHours: number
  totalCost: number
  createdAt: Date
  updatedAt: Date
}

export interface PartUsage {
  id: string
  partId: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

export type ServiceStatus = 
  | 'scheduled'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'rescheduled'

export interface ServiceHistoryFilters {
  dateRange?: {
    start: Date
    end: Date
  }
  status?: ServiceStatus[]
  technicianId?: string
  customerId?: string
  serviceTypeId?: string
}

export interface ServiceHistoryAnalytics {
  totalServices: number
  averageCompletionTime: number
  totalRevenue: number
  statusDistribution: Record<ServiceStatus, number>
  technicianPerformance: {
    id: string
    name: string
    completedServices: number
    averageRating: number
  }[]
  serviceTypeDistribution: {
    id: string
    name: string
    count: number
  }[]
} 