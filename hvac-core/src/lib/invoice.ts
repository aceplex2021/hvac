// import { supabase } from './supabase'

export interface InvoiceItem {
  id?: string
  description: string
  quantity: number
  unitPrice: number
  taxRate?: number
  total: number
}

export interface Invoice {
  id: string
  businessId: string
  customerId: string
  serviceRequestId?: string
  number: string
  date: string
  dueDate: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  items: InvoiceItem[]
  subtotal: number
  tax: number
  total: number
  notes?: string
  createdAt: string
  updatedAt: string
}

export async function createInvoice(invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Promise<Invoice> {
  // const { data, error } = await supabase
  //   .from('invoices')
  //   .insert([{
  //     ...invoice,
  //     createdAt: new Date().toISOString(),
  //     updatedAt: new Date().toISOString()
  //   }])
  //   .select()
  //   .single()

  // if (error) throw error
  // return data
  throw new Error('Supabase not imported')
}

export async function getInvoice(id: string): Promise<Invoice> {
  // const { data, error } = await supabase
  //   .from('invoices')
  //   .select('*')
  //   .eq('id', id)
  //   .single()

  // if (error) throw error
  // return data
  throw new Error('Supabase not imported')
}

export async function getInvoicesByBusiness(businessId: string): Promise<Invoice[]> {
  // const { data, error } = await supabase
  //   .from('invoices')
  //   .select('*')
  //   .eq('businessId', businessId)
  //   .order('createdAt', { ascending: false })

  // if (error) throw error
  // return data
  throw new Error('Supabase not imported')
}

export async function updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice> {
  // const { data, error } = await supabase
  //   .from('invoices')
  //   .update({ 
  //     status,
  //     updatedAt: new Date().toISOString()
  //   })
  //   .eq('id', id)
  //   .select()
  //   .single()

  // if (error) throw error
  // return data
  throw new Error('Supabase not imported')
}

export function calculateInvoiceTotals(items: InvoiceItem[], taxRate: number): {
  subtotal: number
  tax: number
  total: number
} {
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)
  const tax = subtotal * (taxRate / 100)
  const total = subtotal + tax

  return { subtotal, tax, total }
}

export function generateInvoiceNumber(businessId: string): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 1000)
  return `INV-${businessId.slice(0, 4)}-${timestamp}-${random}`
} 