'use client'

import { useState } from 'react'
import { RequestUpdateForm } from './RequestUpdateForm'
import { RequestUpdatesList } from './RequestUpdatesList'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface RequestUpdate {
  id: string
  type: string
  content: string
  createdAt: Date
  createdBy: {
    id: string
    name: string
  }
}

interface RequestUpdatesProps {
  requestId: string
  updates: RequestUpdate[]
  className?: string
}

export function RequestUpdates({ requestId, updates, className }: RequestUpdatesProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleUpdateSubmit = async (type: string, content: string) => {
    try {
      // TODO: Implement update submission to Supabase
      console.log('Submitting update:', { requestId, type, content })
      setIsFormOpen(false)
    } catch (error) {
      console.error('Error submitting update:', error)
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Updates</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? 'Cancel' : 'Add Update'}
        </Button>
      </div>

      {isFormOpen && (
        <RequestUpdateForm
          onSubmit={handleUpdateSubmit}
          className="mb-6"
        />
      )}

      <RequestUpdatesList
        updates={updates}
        className="mt-6"
      />
    </div>
  )
} 