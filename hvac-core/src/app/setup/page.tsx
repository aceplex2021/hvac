'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { BusinessProfileForm } from '@/components/business/BusinessProfileForm'
import { LoadingState } from '@/components/ui/LoadingState'

export default function SetupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [hasBusiness, setHasBusiness] = useState(false)

  useEffect(() => {
    async function checkBusiness() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth')
          return
        }

        const { data: business } = await supabase
          .from('businesses')
          .select('id')
          .eq('owner_id', user.id)
          .single()

        if (business) {
          setHasBusiness(true)
          router.push('/dashboard')
        }
      } catch (error) {
        console.error('Error checking business:', error)
      } finally {
        setIsLoading(false)
      }
    }

    checkBusiness()
  }, [router])

  if (isLoading) {
    return <LoadingState message="Checking your account..." />
  }

  if (hasBusiness) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Set Up Your Business Profile
          </h1>
          <p className="mt-2 text-gray-600">
            Complete your business profile to start using the HVAC service management system.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <BusinessProfileForm />
        </div>
      </div>
    </div>
  )
} 