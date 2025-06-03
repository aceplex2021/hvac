'use client'

import { useState, useEffect, useRef } from 'react'
import { useRealtime } from '@/contexts/RealtimeContext'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'

interface Message {
  id: string
  content: string
  sender_id: string
  sender_name: string
  created_at: string
}

interface ChatWindowProps {
  chatId: string
  userId: string
  userName: string
}

export function ChatWindow({ chatId, userId, userName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { subscribeToChatMessages } = useRealtime()

  useEffect(() => {
    loadMessages()
  }, [chatId])

  useEffect(() => {
    const channel = subscribeToChatMessages((payload) => {
      if (payload.new.chat_id === chatId) {
        setMessages(prev => [...prev, payload.new])
      }
    })
    return () => channel.unsubscribe()
  }, [chatId, subscribeToChatMessages])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  async function loadMessages() {
    try {
      setIsLoading(true)
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('chat_id', chatId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setMessages(data || [])
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSendMessage() {
    if (!newMessage.trim()) return

    try {
      const { error } = await supabase
        .from('chat_messages')
        .insert([
          {
            chat_id: chatId,
            content: newMessage,
            sender_id: userId,
            sender_name: userName
          }
        ])

      if (error) throw error
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  function scrollToBottom() {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="text-center text-gray-500">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500">No messages yet</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs rounded-lg px-4 py-2 ${
                  message.sender_id === userId
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <div className="text-sm font-medium">
                  {message.sender_id === userId ? 'You' : message.sender_name}
                </div>
                <p className="mt-1">{message.content}</p>
                <div className="mt-1 text-xs opacity-75">
                  {new Date(message.created_at).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </div>
    </div>
  )
} 