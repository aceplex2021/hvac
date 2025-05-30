import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export function rateLimiter(config: RateLimitConfig) {
  return function middleware(request: NextRequest) {
    const ip = request.ip || 'anonymous'
    const now = Date.now()
    
    // Get or initialize rate limit data for this IP
    const rateLimitData = rateLimitStore.get(ip) || { count: 0, resetTime: now + config.windowMs }
    
    // Reset if window has passed
    if (now > rateLimitData.resetTime) {
      rateLimitData.count = 0
      rateLimitData.resetTime = now + config.windowMs
    }
    
    // Check if limit exceeded
    if (rateLimitData.count >= config.maxRequests) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many requests' }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': config.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitData.resetTime.toString()
          }
        }
      )
    }
    
    // Increment count
    rateLimitData.count++
    rateLimitStore.set(ip, rateLimitData)
    
    // Add rate limit headers to response
    const response = NextResponse.next()
    response.headers.set('X-RateLimit-Limit', config.maxRequests.toString())
    response.headers.set('X-RateLimit-Remaining', (config.maxRequests - rateLimitData.count).toString())
    response.headers.set('X-RateLimit-Reset', rateLimitData.resetTime.toString())
    
    return response
  }
} 