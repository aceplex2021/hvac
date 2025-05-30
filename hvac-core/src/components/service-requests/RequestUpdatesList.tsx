'use client'

import { format } from 'date-fns'

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

interface RequestUpdatesListProps {
  updates: RequestUpdate[]
  className?: string
}

export function RequestUpdatesList({ updates, className }: RequestUpdatesListProps) {
  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'technician':
        return 'bg-blue-100 text-blue-800'
      case 'customer':
        return 'bg-green-100 text-green-800'
      case 'parts':
        return 'bg-yellow-100 text-yellow-800'
      case 'scheduling':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className={className}>
      <div className="flow-root">
        <ul role="list" className="-mb-8">
          {updates.map((update, index) => (
            <li key={update.id}>
              <div className="relative pb-8">
                {index !== updates.length - 1 && (
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span
                      className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getUpdateTypeColor(
                        update.type
                      )}`}
                    >
                      {update.type.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-500">
                        {update.content}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <time dateTime={update.createdAt.toISOString()}>
                        {format(update.createdAt, 'MMM d, yyyy h:mm a')}
                      </time>
                      <p className="text-xs text-gray-400">
                        by {update.createdBy.name}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 