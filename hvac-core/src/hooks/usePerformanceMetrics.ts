import { useEffect } from 'react'

interface PerformanceLayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
}

interface PerformanceMetrics {
  fcp: number
  lcp: number
  fid: number
  cls: number
  ttfb: number
}

export function usePerformanceMetrics(onMetrics?: (metrics: PerformanceMetrics) => void) {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.performance) return

    // Track First Contentful Paint (FCP)
    const fcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fcp = entries[0]?.startTime || 0
      
      if (onMetrics) {
        onMetrics({ fcp, lcp: 0, fid: 0, cls: 0, ttfb: 0 })
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // Track Largest Contentful Paint (LCP)
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lcp = entries[entries.length - 1]?.startTime || 0
      
      if (onMetrics) {
        onMetrics({ fcp: 0, lcp, fid: 0, cls: 0, ttfb: 0 })
      }
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // Track First Input Delay (FID)
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const fid = entries[0] ? ((entries[0] as PerformanceEventTiming).processingStart - entries[0].startTime) : 0
      
      if (onMetrics) {
        onMetrics({ fcp: 0, lcp: 0, fid, cls: 0, ttfb: 0 })
      }
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // Track Cumulative Layout Shift (CLS)
    let cls = 0
    const clsObserver = new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!(entry as PerformanceLayoutShift).hadRecentInput) {
          cls += (entry as PerformanceLayoutShift).value
        }
      }
      
      if (onMetrics) {
        onMetrics({ fcp: 0, lcp: 0, fid: 0, cls, ttfb: 0 })
      }
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // Track Time to First Byte (TTFB)
    const ttfb = performance.timing.responseStart - performance.timing.requestStart
    
    if (onMetrics) {
      onMetrics({ fcp: 0, lcp: 0, fid: 0, cls: 0, ttfb })
    }

    return () => {
      fcpObserver.disconnect()
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
    }
  }, [onMetrics])
} 