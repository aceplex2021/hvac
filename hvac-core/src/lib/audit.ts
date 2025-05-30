import { supabase } from './supabase'

export type AuditAction = 
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'error'
  | 'security'

export type AuditResource = 
  | 'service_request'
  | 'customer'
  | 'technician'
  | 'appointment'
  | 'user'
  | 'system'

export interface AuditLog {
  id: string
  user_id: string
  action: AuditAction
  resource: AuditResource
  resource_id: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  created_at: string
}

export async function logAuditEvent(
  user_id: string,
  action: AuditAction,
  resource: AuditResource,
  resource_id: string,
  details: Record<string, any>,
  ip_address: string,
  user_agent: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from('audit_logs')
      .insert([
        {
          user_id,
          action,
          resource,
          resource_id,
          details,
          ip_address,
          user_agent,
          created_at: new Date().toISOString()
        }
      ])

    if (error) throw error
  } catch (error) {
    console.error('Failed to log audit event:', error)
    // Fallback to console logging if database logging fails
    console.log('Audit Event:', {
      user_id,
      action,
      resource,
      resource_id,
      details,
      ip_address,
      user_agent,
      timestamp: new Date().toISOString()
    })
  }
}

export async function getAuditLogs(
  filters?: {
    user_id?: string
    action?: AuditAction
    resource?: AuditResource
    resource_id?: string
    start_date?: string
    end_date?: string
  },
  limit: number = 100,
  offset: number = 0
): Promise<AuditLog[]> {
  try {
    let query = supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)
      .range(offset, offset + limit - 1)

    if (filters) {
      if (filters.user_id) query = query.eq('user_id', filters.user_id)
      if (filters.action) query = query.eq('action', filters.action)
      if (filters.resource) query = query.eq('resource', filters.resource)
      if (filters.resource_id) query = query.eq('resource_id', filters.resource_id)
      if (filters.start_date) query = query.gte('created_at', filters.start_date)
      if (filters.end_date) query = query.lte('created_at', filters.end_date)
    }

    const { data, error } = await query

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Failed to fetch audit logs:', error)
    return []
  }
} 