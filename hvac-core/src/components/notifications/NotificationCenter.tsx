'use client'

import { useState, useEffect } from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { BellIcon } from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'service_request' | 'technician' | 'chat'
  title: string
  message: string
  timestamp: Date
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const { subscribeToServiceRequests, subscribeToTechnicianLocations, subscribeToChatMessages } = useRealtime()

  useEffect(() => {
    // Subscribe to service request updates
    const serviceRequestChannel = subscribeToServiceRequests((payload) => {
      const newNotification: Notification = {
        id: payload.new.id,
        type: 'service_request',
        title: 'Service Request Update',
        message: `Service request ${payload.new.id} has been ${payload.eventType}`,
        timestamp: new Date(),
        read: false
      }
      setNotifications(prev => [newNotification, ...prev])
    })

    // Subscribe to technician location updates
    const technicianChannel = subscribeToTechnicianLocations((payload) => {
      const newNotification: Notification = {
        id: payload.new.id,
        type: 'technician',
        title: 'Technician Update',
        message: `Technician ${payload.new.technician_id} has updated their location`,
        timestamp: new Date(),
        read: false
      }
      setNotifications(prev => [newNotification, ...prev])
    })

    // Subscribe to chat messages
    const chatChannel = subscribeToChatMessages((payload) => {
      const newNotification: Notification = {
        id: payload.new.id,
        type: 'chat',
        title: 'New Message',
        message: `New message in chat ${payload.new.chat_id}`,
        timestamp: new Date(),
        read: false
      }
      setNotifications(prev => [newNotification, ...prev])
    })

    return () => {
      serviceRequestChannel.unsubscribe()
      technicianChannel.unsubscribe()
      chatChannel.unsubscribe()
    }
  }, [subscribeToServiceRequests, subscribeToTechnicianLocations, subscribeToChatMessages])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 focus:outline-none"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
            <div className="mt-2 space-y-2">
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No notifications</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <span className="text-xs text-gray-500">
                        {new Date(notification.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {notification.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 