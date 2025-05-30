'use client'

import { ReactNode } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

interface ResponsiveLayoutProps {
  children: ReactNode
  mobileView?: ReactNode
  desktopView?: ReactNode
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl'
}

export function ResponsiveLayout({
  children,
  mobileView,
  desktopView,
  breakpoint = 'md'
}: ResponsiveLayoutProps) {
  const isMobile = useMediaQuery(`(max-width: ${getBreakpointWidth(breakpoint)}px)`)

  if (mobileView && desktopView) {
    return isMobile ? mobileView : desktopView
  }

  return (
    <div className={`container mx-auto px-4 ${isMobile ? 'max-w-full' : 'max-w-7xl'}`}>
      {children}
    </div>
  )
}

function getBreakpointWidth(breakpoint: string): number {
  switch (breakpoint) {
    case 'sm':
      return 640
    case 'md':
      return 768
    case 'lg':
      return 1024
    case 'xl':
      return 1280
    default:
      return 768
  }
} 