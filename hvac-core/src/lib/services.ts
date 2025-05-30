import { supabase } from './supabase'
import { ServiceType } from '@/types/services'

export async function getServiceTypes() {
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as ServiceType[]
}

export async function getServiceType(id: string) {
  const { data, error } = await supabase
    .from('service_types')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data as ServiceType
}

export async function createServiceType(serviceType: Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('service_types')
    .insert([serviceType])
    .select()
    .single()

  if (error) throw error
  return data as ServiceType
}

export async function updateServiceType(
  id: string,
  serviceType: Partial<Omit<ServiceType, 'id' | 'createdAt' | 'updatedAt'>>
) {
  const { data, error } = await supabase
    .from('service_types')
    .update(serviceType)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ServiceType
}

export async function deleteServiceType(id: string) {
  const { error } = await supabase
    .from('service_types')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function toggleServiceTypeActive(id: string, isActive: boolean) {
  const { data, error } = await supabase
    .from('service_types')
    .update({ is_active: isActive })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as ServiceType
} 