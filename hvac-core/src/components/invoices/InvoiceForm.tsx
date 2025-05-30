'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { 
  Invoice, 
  InvoiceItem, 
  createInvoice, 
  calculateInvoiceTotals 
} from '@/lib/invoice'

interface InvoiceFormProps {
  businessId: string
  customerId: string
  serviceRequestId?: string
  className?: string
  onComplete?: () => void
}

export function InvoiceForm({ 
  businessId, 
  customerId, 
  serviceRequestId,
  className = '',
  onComplete 
}: InvoiceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>>({
    businessId,
    customerId,
    serviceRequestId,
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'draft',
    items: [],
    subtotal: 0,
    tax: 0,
    total: 0,
    notes: ''
  })

  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      description: '',
      quantity: 1,
      unitPrice: 0,
      total: 0
    }
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }))
  }

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    setFormData(prev => {
      const newItems = [...prev.items]
      const item = { ...newItems[index] }
      
      if (field === 'quantity' || field === 'unitPrice') {
        const quantity = field === 'quantity' ? value : item.quantity
        const unitPrice = field === 'unitPrice' ? value : item.unitPrice
        item.total = quantity * unitPrice
      }
      
      item[field] = value
      newItems[index] = item
      
      const { subtotal, tax, total } = calculateInvoiceTotals(newItems, 0)
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      }
    })
  }

  const handleRemoveItem = (index: number) => {
    setFormData(prev => {
      const newItems = prev.items.filter((_, i) => i !== index)
      const { subtotal, tax, total } = calculateInvoiceTotals(newItems, 0)
      
      return {
        ...prev,
        items: newItems,
        subtotal,
        tax,
        total
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      await createInvoice(formData)
      
      if (onComplete) {
        onComplete()
      } else {
        router.push('/invoices')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create invoice')
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">
            Invoice Date
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            id="dueDate"
            required
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Items</h3>
          <Button
            type="button"
            onClick={handleAddItem}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            Add Item
          </Button>
        </div>

        {formData.items.map((item, index) => (
          <div key={index} className="grid grid-cols-1 gap-4 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <input
                type="text"
                placeholder="Description"
                value={item.description}
                onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Quantity"
                value={item.quantity}
                onChange={(e) => handleUpdateItem(index, 'quantity', parseInt(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <input
                type="number"
                placeholder="Unit Price"
                value={item.unitPrice}
                onChange={(e) => handleUpdateItem(index, 'unitPrice', parseFloat(e.target.value))}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-900">${item.total.toFixed(2)}</span>
              <Button
                type="button"
                onClick={() => handleRemoveItem(index)}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="text-gray-900">${formData.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-medium">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">${formData.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          id="notes"
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          {isLoading ? 'Creating Invoice...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  )
} 