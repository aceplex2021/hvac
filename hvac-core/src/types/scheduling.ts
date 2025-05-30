export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface TimeSlot {
  start: string // Format: "HH:MM"
  end: string // Format: "HH:MM"
}

export interface DailySchedule {
  day: DayOfWeek
  isAvailable: boolean
  timeSlots: TimeSlot[]
  breaks: TimeSlot[]
}

export interface ScheduleRule {
  id: string
  type: 'timeOfDay' | 'dayOfWeek' | 'leadTime' | 'blackout'
  value: string
  action: 'allow' | 'block' | 'requireApproval'
  description?: string
}

export interface ScheduleTemplate {
  id: string
  name: string
  description?: string
  defaultDuration: number // in minutes
  dailySchedules: DailySchedule[]
  rules: ScheduleRule[]
  bufferTime: number // in minutes
  maxBookingsPerSlot: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Appointment {
  id: string
  serviceTypeId: string
  customerId: string
  technicianId?: string
  startTime: Date
  endTime: Date
  status: 'scheduled' | 'confirmed' | 'inProgress' | 'completed' | 'cancelled'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface AvailabilityCheck {
  isAvailable: boolean
  requiresApproval: boolean
  reason?: string
  nextAvailableSlot?: Date
  suggestedSlots?: TimeSlot[]
} 