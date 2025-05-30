import { AlertCircle } from 'lucide-react'

interface ErrorStateProps {
  variant?: 'page' | 'section' | 'inline'
  message?: string
  className?: string
}

export function ErrorState({ 
  variant = 'section', 
  message = 'Something went wrong. Please try again.',
  className = ''
}: ErrorStateProps) {
  const variantStyles = {
    page: 'min-h-screen flex items-center justify-center',
    section: 'py-8 flex items-center justify-center',
    inline: 'flex items-center'
  }

  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      <div className="flex items-center gap-2 text-red-600">
        <AlertCircle className="w-5 h-5" />
        <span>{message}</span>
      </div>
    </div>
  )
} 