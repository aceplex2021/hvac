export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface CustomerProfile extends Customer {
  serviceHistory: {
    id: string
    serviceType: string
    date: Date
    status: 'completed' | 'scheduled' | 'cancelled'
    notes?: string
  }[]
  preferences: {
    preferredContactMethod: 'email' | 'phone' | 'text'
    preferredTimeOfDay: 'morning' | 'afternoon' | 'evening'
    specialInstructions?: string
  }
} 