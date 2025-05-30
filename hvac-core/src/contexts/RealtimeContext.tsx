'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface RealtimeContextType {
  subscribeToServiceRequests: (callback: (payload: any) => void) => RealtimeChannel
  subscribeToTechnicianLocations: (callback: (payload: any) => void) => RealtimeChannel
  subscribeToChatMessages: (callback: (payload: any) => void) => RealtimeChannel
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [channels, setChannels] = useState<RealtimeChannel[]>([])

  useEffect(() => {
    return () => {
      // Cleanup all subscriptions when component unmounts
      channels.forEach(channel => {
        channel.unsubscribe()
      })
    }
  }, [channels])

  const subscribeToServiceRequests = (callback: (payload: any) => void) => {
    const channel = supabase
      .channel('service_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests'
        },
        callback
      )
      .subscribe()

    setChannels(prev => [...prev, channel])
    return channel
  }

  const subscribeToTechnicianLocations = (callback: (payload: any) => void) => {
    const channel = supabase
      .channel('technician_locations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'technician_locations'
        },
        callback
      )
      .subscribe()

    setChannels(prev => [...prev, channel])
    return channel
  }

  const subscribeToChatMessages = (callback: (payload: any) => void) => {
    const channel = supabase
      .channel('chat_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_messages'
        },
        callback
      )
      .subscribe()

    setChannels(prev => [...prev, channel])
    return channel
  }

  return (
    <RealtimeContext.Provider
      value={{
        subscribeToServiceRequests,
        subscribeToTechnicianLocations,
        subscribeToChatMessages
      }}
    >
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
} 