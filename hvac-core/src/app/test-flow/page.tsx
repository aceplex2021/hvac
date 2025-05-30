'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

type FlowStep = 'register' | 'dashboard' | 'booking' | 'dispatch' | 'progress' | 'complete' | 'invoice' | 'payment'

export default function TestFlowPage() {
  const [currentStep, setCurrentStep] = useState<FlowStep>('register')
  const [businessName, setBusinessName] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [serviceType, setServiceType] = useState('')
  const [bookingDate, setBookingDate] = useState('')
  const [progress, setProgress] = useState(0)
  const [invoiceAmount, setInvoiceAmount] = useState(0)

  const steps = [
    { id: 'register', title: 'Business Registration', description: 'Set up your HVAC business profile' },
    { id: 'dashboard', title: 'Business Dashboard', description: 'Manage your business operations' },
    { id: 'booking', title: 'Customer Booking', description: 'Customer books a service appointment' },
    { id: 'dispatch', title: 'Technician Dispatch', description: 'Assign technician to the job' },
    { id: 'progress', title: 'Work Progress', description: 'Track service progress' },
    { id: 'complete', title: 'Service Completion', description: 'Mark service as completed' },
    { id: 'invoice', title: 'Invoice Generation', description: 'Create and send invoice' },
    { id: 'payment', title: 'Payment Processing', description: 'Customer makes payment' }
  ]

  const renderStep = () => {
    switch (currentStep) {
      case 'register':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Welcome to HVAC Service Manager</h2>
            <p className="text-gray-600">Let's set up your business profile</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Business Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter your business name"
                />
              </div>
              <Button
                onClick={() => setCurrentStep('dashboard')}
                className="w-full"
              >
                Create Business Profile
              </Button>
            </div>
          </div>
        )

      case 'dashboard':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Business Dashboard</h2>
            <p className="text-gray-600">Welcome, {businessName}</p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Quick Actions</h3>
                <div className="mt-2 space-y-2">
                  <Button onClick={() => setCurrentStep('booking')} className="w-full">
                    View Bookings
                  </Button>
                  <Button onClick={() => setCurrentStep('dispatch')} className="w-full">
                    Manage Technicians
                  </Button>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Recent Activity</h3>
                <p className="mt-2 text-sm text-gray-600">No recent activity</p>
              </div>
            </div>
          </div>
        )

      case 'booking':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">New Service Booking</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter customer name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select service type</option>
                  <option value="repair">Repair</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="installation">Installation</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Booking Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <Button
                onClick={() => setCurrentStep('dispatch')}
                className="w-full"
              >
                Confirm Booking
              </Button>
            </div>
          </div>
        )

      case 'dispatch':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Dispatch Technician</h2>
            <p className="text-gray-600">Assign a technician to the service request</p>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Service Details</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Customer: {customerName}<br />
                  Service: {serviceType}<br />
                  Date: {bookingDate}
                </p>
              </div>
              <Button
                onClick={() => setCurrentStep('progress')}
                className="w-full"
              >
                Assign Technician
              </Button>
            </div>
          </div>
        )

      case 'progress':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Service Progress</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Progress Update</h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Progress (%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={progress}
                    onChange={(e) => setProgress(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="mt-2 text-sm text-gray-600">{progress}% complete</p>
                </div>
              </div>
              <Button
                onClick={() => setCurrentStep('complete')}
                className="w-full"
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Service Completed</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Service Summary</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Customer: {customerName}<br />
                  Service: {serviceType}<br />
                  Date: {bookingDate}<br />
                  Status: Completed
                </p>
              </div>
              <Button
                onClick={() => setCurrentStep('invoice')}
                className="w-full"
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        )

      case 'invoice':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Invoice Generation</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Invoice Details</h3>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Invoice Amount ($)</label>
                  <input
                    type="number"
                    value={invoiceAmount}
                    onChange={(e) => setInvoiceAmount(parseFloat(e.target.value))}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <Button
                onClick={() => setCurrentStep('payment')}
                className="w-full"
              >
                Send Invoice
              </Button>
            </div>
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Payment Processing</h2>
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-lg shadow">
                <h3 className="font-medium">Payment Details</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Amount: ${invoiceAmount.toFixed(2)}<br />
                  Status: Pending
                </p>
              </div>
              <Button
                onClick={() => setCurrentStep('dashboard')}
                className="w-full"
              >
                Complete Payment
              </Button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Flow Test</h1>
          <p className="mt-2 text-gray-600">Test the complete service process from booking to payment</p>
        </div>

        <div className="mb-8">
          <nav className="flex space-x-4" aria-label="Progress">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.id as FlowStep)}
                  className={cn(
                    'px-3 py-2 text-sm font-medium rounded-md',
                    currentStep === step.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-500 hover:text-gray-700'
                  )}
                >
                  {step.title}
                </button>
                {index < steps.length - 1 && (
                  <div className="ml-4 h-0.5 w-8 bg-gray-300" />
                )}
              </div>
            ))}
          </nav>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          {renderStep()}
        </div>
      </div>
    </div>
  )
} 