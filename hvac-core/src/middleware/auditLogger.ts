import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { logAuditEvent } from '@/lib/audit'

export async function auditLogger(request: NextRequest) {
  const response = NextResponse.next()
  
  try {
    const user = request.headers.get('x-user-id')
    const action = getActionFromRequest(request)
    const resource = getResourceFromPath(request.nextUrl.pathname)
    const resourceId = request.nextUrl.searchParams.get('id') || 'unknown'
    
    await logAuditEvent(
      user || 'anonymous',
      action,
      resource,
      resourceId,
      {
        method: request.method,
        path: request.nextUrl.pathname,
        query: Object.fromEntries(request.nextUrl.searchParams),
        status: response.status
      },
      request.ip || 'unknown',
      request.headers.get('user-agent') || 'unknown'
    )
  } catch (error) {
    console.error('Failed to log audit event:', error)
  }
  
  return response
}

function getActionFromRequest(request: NextRequest): 'create' | 'update' | 'delete' | 'view' | 'error' {
  switch (request.method) {
    case 'POST':
      return 'create'
    case 'PUT':
    case 'PATCH':
      return 'update'
    case 'DELETE':
      return 'delete'
    case 'GET':
      return 'view'
    default:
      return 'error'
  }
}

function getResourceFromPath(path: string): 'service_request' | 'customer' | 'technician' | 'appointment' | 'user' | 'system' {
  if (path.includes('/api/service-requests')) return 'service_request'
  if (path.includes('/api/customers')) return 'customer'
  if (path.includes('/api/technicians')) return 'technician'
  if (path.includes('/api/appointments')) return 'appointment'
  if (path.includes('/api/users')) return 'user'
  return 'system'
} 