import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function securityHeaders(request: NextRequest) {
  const response = NextResponse.next()
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: blob:; " +
    "font-src 'self'; " +
    "connect-src 'self' https://*.supabase.co; " +
    "frame-ancestors 'none';"
  )
  
  // X-Frame-Options
  response.headers.set('X-Frame-Options', 'DENY')
  
  // X-Content-Type-Options
  response.headers.set('X-Content-Type-Options', 'nosniff')
  
  // Referrer-Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  // Permissions-Policy
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  )
  
  // Strict-Transport-Security
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  
  // X-XSS-Protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  
  return response
} 