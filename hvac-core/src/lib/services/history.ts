import { supabase } from '@/lib/supabase'
import { ServiceHistory, ServiceHistoryFilters, ServiceHistoryAnalytics } from '@/types/service-history'
import { format, subDays } from 'date-fns'

export async function createServiceHistory(history: Omit<ServiceHistory, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('service_history')
    .insert([history])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateServiceHistory(id: string, updates: Partial<ServiceHistory>) {
  const { data, error } = await supabase
    .from('service_history')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getServiceHistory(filters: ServiceHistoryFilters = {}) {
  let query = supabase
    .from('service_history')
    .select(`
      *,
      service_request:service_requests(*),
      technician:technicians(*),
      parts_used:part_usage(*)
    `)

  if (filters.dateRange) {
    query = query
      .gte('start_time', filters.dateRange.start.toISOString())
      .lte('start_time', filters.dateRange.end.toISOString())
  }

  if (filters.status?.length) {
    query = query.in('status', filters.status)
  }

  if (filters.technicianId) {
    query = query.eq('technician_id', filters.technicianId)
  }

  if (filters.customerId) {
    query = query.eq('service_request.customer_id', filters.customerId)
  }

  if (filters.serviceTypeId) {
    query = query.eq('service_request.service_type_id', filters.serviceTypeId)
  }

  const { data, error } = await query.order('start_time', { ascending: false })

  if (error) throw error
  return data
}

export async function getServiceHistoryAnalytics(filters: ServiceHistoryFilters = {}): Promise<ServiceHistoryAnalytics> {
  const history = await getServiceHistory(filters)
  
  const totalServices = history.length
  const completedServices = history.filter(h => h.status === 'completed')
  
  const averageCompletionTime = completedServices.reduce((acc, curr) => {
    if (!curr.end_time) return acc
    const duration = new Date(curr.end_time).getTime() - new Date(curr.start_time).getTime()
    return acc + duration
  }, 0) / (completedServices.length || 1)

  const totalRevenue = history.reduce((acc, curr) => acc + curr.total_cost, 0)

  const statusDistribution = history.reduce((acc, curr) => {
    acc[curr.status] = (acc[curr.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const technicianPerformance = Object.entries(
    history.reduce((acc, curr) => {
      if (!acc[curr.technician_id]) {
        acc[curr.technician_id] = {
          id: curr.technician_id,
          name: curr.technician.name,
          completedServices: 0,
          averageRating: 0
        }
      }
      if (curr.status === 'completed') {
        acc[curr.technician_id].completedServices++
      }
      return acc
    }, {} as Record<string, any>)
  ).map(([_, value]) => value)

  const serviceTypeDistribution = Object.entries(
    history.reduce((acc, curr) => {
      const typeId = curr.service_request.service_type_id
      if (!acc[typeId]) {
        acc[typeId] = {
          id: typeId,
          name: curr.service_request.service_type.name,
          count: 0
        }
      }
      acc[typeId].count++
      return acc
    }, {} as Record<string, any>)
  ).map(([_, value]) => value)

  return {
    totalServices,
    averageCompletionTime,
    totalRevenue,
    statusDistribution,
    technicianPerformance: technicianPerformance as ServiceHistoryAnalytics['technicianPerformance'],
    serviceTypeDistribution: serviceTypeDistribution as ServiceHistoryAnalytics['serviceTypeDistribution']
  }
}

export async function exportServiceHistory(filters: ServiceHistoryFilters = {}) {
  const history = await getServiceHistory(filters)
  
  // Convert to CSV format
  const headers = [
    'ID',
    'Service Request ID',
    'Technician',
    'Status',
    'Start Time',
    'End Time',
    'Notes',
    'Labor Hours',
    'Total Cost'
  ].join(',')

  const rows = history.map(h => [
    h.id,
    h.service_request_id,
    h.technician.name,
    h.status,
    format(new Date(h.start_time), 'yyyy-MM-dd HH:mm'),
    h.end_time ? format(new Date(h.end_time), 'yyyy-MM-dd HH:mm') : '',
    `"${h.notes.replace(/"/g, '""')}"`,
    h.labor_hours,
    h.total_cost
  ].join(','))

  return [headers, ...rows].join('\n')
} 