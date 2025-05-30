'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface RequestUpdateFormProps {
  onSubmit: (type: string, content: string) => void
  className?: string
}

export function RequestUpdateForm({ onSubmit, className }: RequestUpdateFormProps) {
  const [type, setType] = useState('general')
  const [content, setContent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    onSubmit(type, content.trim())
    setContent('')
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700">
            Update Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="general">General Update</option>
            <option value="technician">Technician Note</option>
            <option value="customer">Customer Communication</option>
            <option value="parts">Parts Update</option>
            <option value="scheduling">Scheduling Update</option>
          </select>
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Update Content
          </label>
          <textarea
            id="content"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter your update here..."
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="default">
            Add Update
          </Button>
        </div>
      </div>
    </form>
  )
} 