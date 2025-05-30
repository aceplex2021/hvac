'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export function PushNotificationManager() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)

  useEffect(() => {
    checkSubscription()
  }, [])

  async function checkSubscription() {
    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.getSubscription()
    setSubscription(subscription)
    setIsSubscribed(!!subscription)
  }

  async function subscribeToPushNotifications() {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      })

      // Store subscription in Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .insert([
          {
            subscription: subscription.toJSON(),
            user_id: (await supabase.auth.getUser()).data.user?.id
          }
        ])

      if (error) throw error

      setSubscription(subscription)
      setIsSubscribed(true)
    } catch (error) {
      console.error('Error subscribing to push notifications:', error)
    }
  }

  async function unsubscribeFromPushNotifications() {
    try {
      if (!subscription) return

      await subscription.unsubscribe()

      // Remove subscription from Supabase
      const { error } = await supabase
        .from('push_subscriptions')
        .delete()
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      setSubscription(null)
      setIsSubscribed(false)
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error)
    }
  }

  return (
    <div className="p-4">
      <h2 className="text-lg font-medium mb-4">Push Notifications</h2>
      <p className="mb-4">
        {isSubscribed
          ? 'You are currently subscribed to push notifications.'
          : 'You are not subscribed to push notifications.'}
      </p>
      <button
        onClick={isSubscribed ? unsubscribeFromPushNotifications : subscribeToPushNotifications}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </button>
    </div>
  )
} 