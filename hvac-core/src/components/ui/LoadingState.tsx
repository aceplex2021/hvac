import { LoadingSpinner } from './LoadingSpinner'

interface LoadingStateProps {
  variant?: 'page' | 'section' | 'inline'
  message?: string
  className?: string
}

export function LoadingState({ variant = 'page', message, className = '' }: LoadingStateProps) {
  const baseStyles = 'flex items-center justify-center'
  const variantStyles = {
    page: 'min-h-screen',
    section: 'min-h-[200px]',
    inline: 'min-h-[50px]'
  }

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size={variant === 'page' ? 'lg' : 'md'} />
        {message && <p className="text-gray-600">{message}</p>}
      </div>
    </div>
  )
} 