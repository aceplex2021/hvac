'use client'

import { Suspense, lazy, ComponentType, ReactNode } from 'react'
// import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface LazyLoadProps {
  component: () => Promise<{ default: ComponentType<any> }>
  fallback?: ReactNode
}

export function LazyLoad({ component, fallback }: LazyLoadProps) {
  const LazyComponent = lazy(component)

  return (
    <Suspense fallback={fallback || null}>
      <LazyComponent />
    </Suspense>
  )
} 