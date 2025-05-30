'use client'

import { useEffect } from 'react'
import Head from 'next/head'

interface ResourcePreloaderProps {
  resources: {
    type: 'script' | 'style' | 'font' | 'image'
    href: string
    as?: string
    crossOrigin?: string
  }[]
}

export function ResourcePreloader({ resources }: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload critical resources
    resources.forEach((resource) => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.href
      
      if (resource.as) {
        link.as = resource.as
      }
      
      if (resource.crossOrigin) {
        link.crossOrigin = resource.crossOrigin
      }
      
      document.head.appendChild(link)
    })

    return () => {
      // Clean up preloaded resources
      resources.forEach((resource) => {
        const link = document.querySelector(`link[href="${resource.href}"]`)
        if (link) {
          document.head.removeChild(link)
        }
      })
    }
  }, [resources])

  return (
    <Head>
      {resources.map((resource, index) => (
        <link
          key={index}
          rel="preload"
          href={resource.href}
          as={resource.as}
          crossOrigin={resource.crossOrigin}
        />
      ))}
    </Head>
  )
} 