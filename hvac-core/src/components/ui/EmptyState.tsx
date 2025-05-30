import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

interface EmptyStateProps {
  variant?: 'page' | 'section' | 'inline'
  title?: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  className?: string
}

export function EmptyState({ 
  variant = 'section', 
  title = 'No items found',
  description = 'There are no items to display at this time.',
  action,
  className = ''
}: EmptyStateProps) {
  const variantStyles = {
    page: 'min-h-screen flex flex-col items-center justify-center',
    section: 'py-8 flex flex-col items-center justify-center',
    inline: 'flex flex-col items-center'
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <div className="flex flex-col items-center gap-2 text-gray-500">
        <AlertCircle className="w-8 h-8" />
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm">{description}</p>
        {action && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={action.onClick}
            className="mt-4"
          >
            {action.label}
          </Button>
        )}
      </div>
    </div>
  )
} 