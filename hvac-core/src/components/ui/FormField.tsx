import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './Label'
import { Input, InputProps } from './Input'

export interface FormFieldProps extends InputProps {
  label?: string
  error?: string
  description?: string
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ className, label, error, description, id, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <Label htmlFor={id} className={error ? 'text-red-500' : ''}>
            {label}
          </Label>
        )}
        <Input
          ref={ref}
          id={id}
          className={cn(error && 'border-red-500 focus-visible:ring-red-500', className)}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {description && !error && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    )
  }
)
FormField.displayName = 'FormField'

export { FormField } 