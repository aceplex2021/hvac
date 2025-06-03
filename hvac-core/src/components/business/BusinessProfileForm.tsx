'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { generateUniqueSlug } from '@/lib/business'

interface BusinessProfileFormProps {
  className?: string
  onComplete?: () => void
}

export function BusinessProfileForm({ className = '', onComplete }: BusinessProfileFormProps) {
  // const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isGeneratingSlug, setIsGeneratingSlug] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    timezone: 'UTC',
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { closed: true },
      sunday: { closed: true }
    },
    serviceAreas: [],
    paymentMethods: ['cash', 'credit_card'],
    taxRate: 0.00
  })

  // Generate slug when business name changes
  useEffect(() => {
    const generateSlug = async () => {
      if (formData.name && !formData.slug) {
        setIsGeneratingSlug(true)
        try {
          const slug = await generateUniqueSlug(formData.name)
          setFormData(prev => ({ ...prev, slug }))
        } catch (error) {
          console.error('Error generating slug:', error)
        } finally {
          setIsGeneratingSlug(false)
        }
      }
    }

    generateSlug()
  }, [formData.name, formData.slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // Create business profile
      const { data: business, error: businessError } = await supabase
        .from('businesses')
        .insert([{
          owner_id: user.id,
          name: formData.name,
          slug: formData.slug,
          contact_email: formData.contactEmail,
          contact_phone: formData.contactPhone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          country: formData.country,
          timezone: formData.timezone,
          business_hours: formData.businessHours,
          service_areas: formData.serviceAreas,
          payment_methods: formData.paymentMethods,
          tax_rate: formData.taxRate
        }])
        .select()
        .single()

      if (businessError) throw businessError

      if (onComplete) {
        onComplete()
      } else {
        // router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create business profile')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn('space-y-6', className)}>
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Business URL
          </label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
              hvac.app/
            </span>
            <input
              type="text"
              id="slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              disabled={isGeneratingSlug}
            />
          </div>
          {isGeneratingSlug && (
            <p className="mt-1 text-sm text-gray-500">Generating unique URL...</p>
          )}
        </div>

        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
            Contact Email
          </label>
          <input
            type="email"
            id="contactEmail"
            required
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700">
            Contact Phone
          </label>
          <input
            type="tel"
            id="contactPhone"
            required
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            required
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            type="text"
            id="city"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            required
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
            ZIP Code
          </label>
          <input
            type="text"
            id="zipCode"
            required
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
            Tax Rate (%)
          </label>
          <input
            type="number"
            id="taxRate"
            min="0"
            max="100"
            step="0.01"
            value={formData.taxRate}
            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLoading ? 'Creating Profile...' : 'Create Business Profile'}
        </Button>
      </div>
    </form>
  )
} 