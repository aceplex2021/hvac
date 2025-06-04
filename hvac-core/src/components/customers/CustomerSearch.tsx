'use client'

import { useState } from 'react'
import { Customer } from '@/types/customer'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface CustomerSearchProps {
  onSelect: (customer: Customer) => void
  className?: string
}

export function CustomerSearch({ onSelect, className }: CustomerSearchProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // TODO: Implement actual search with Supabase
      // This is a placeholder for demonstration
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .or(`firstName.ilike.%${searchTerm}%,lastName.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
        .limit(10)

      if (error) throw error
      setResults(data || [])
    } catch (error) {
      console.error('Error searching customers:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('space-y-4', className)}>
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or phone..."
          className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </form>

      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {results.map((customer) => (
              <li
                key={customer.id}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                onClick={() => onSelect(customer)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">
                      {customer.firstName} {customer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{customer.email}</p>
                  </div>
                  <p className="text-sm text-gray-600">{customer.phone}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {results.length === 0 && searchTerm && !isLoading && (
        <p className="text-center text-gray-500">No customers found</p>
      )}
    </div>
  )
} 