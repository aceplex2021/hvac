'use client';

import { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Wrench, 
  MessageSquare,
  Edit,
  ChevronLeft,
  Clock,
  DollarSign,
  FileText
} from 'lucide-react';
import Link from 'next/link';

// Mock data for demonstration
const mockCustomer = {
  id: 1,
  name: 'John Smith',
  email: 'john@example.com',
  phone: '(555) 123-4567',
  address: '123 Main St, City, State',
  status: 'Active',
  joinDate: '2023-01-15',
  totalServices: 5,
  totalSpent: 2500,
  lastService: '2024-03-10'
};

const mockRecentServices = [
  {
    id: 1,
    date: '2024-03-10',
    service: 'AC Repair',
    technician: 'Mike Brown',
    status: 'Completed',
    amount: 299,
    notes: 'Replaced faulty capacitor'
  },
  {
    id: 2,
    date: '2024-02-15',
    service: 'Maintenance Check',
    technician: 'Lisa Davis',
    status: 'Completed',
    amount: 99,
    notes: 'Regular maintenance performed'
  }
];

const mockRecentCommunications = [
  {
    id: 1,
    date: '2024-03-10',
    type: 'Email',
    subject: 'Service Confirmation',
    status: 'Sent',
    content: 'Your service appointment has been confirmed'
  },
  {
    id: 2,
    date: '2024-03-09',
    type: 'Phone',
    subject: 'Appointment Reminder',
    status: 'Completed',
    content: 'Called to confirm appointment'
  }
];

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <Link 
              href="/dashboard/customers"
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Customer Profile</h1>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Edit className="h-4 w-4 mr-2" />
            Edit Profile
          </button>
        </div>

        {/* Customer Info Card */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <User className="h-12 w-12 text-gray-400" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold text-gray-900">{mockCustomer.name}</h2>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    mockCustomer.status === 'Active' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {mockCustomer.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{mockCustomer.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{mockCustomer.email}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">{mockCustomer.address}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Member since {mockCustomer.joinDate}</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Wrench className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Total Services</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{mockCustomer.totalServices}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Total Spent</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">${mockCustomer.totalSpent}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="ml-2 text-sm font-medium text-gray-900">Last Service</span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-gray-900">{mockCustomer.lastService}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <FileText className={`${
                activeTab === 'overview' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              } -ml-0.5 mr-2 h-5 w-5`} />
              Overview
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`${
                activeTab === 'services'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <Wrench className={`${
                activeTab === 'services' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              } -ml-0.5 mr-2 h-5 w-5`} />
              Services
            </button>
            <button
              onClick={() => setActiveTab('communications')}
              className={`${
                activeTab === 'communications'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
            >
              <MessageSquare className={`${
                activeTab === 'communications' ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
              } -ml-0.5 mr-2 h-5 w-5`} />
              Communications
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {mockRecentServices.map((service) => (
                    <div key={service.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Wrench className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 font-medium text-gray-900">{service.service}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>Technician: {service.technician}</p>
                        <p>Amount: ${service.amount}</p>
                        <p>Notes: {service.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Service History</h3>
                <div className="space-y-4">
                  {mockRecentServices.map((service) => (
                    <div key={service.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">{service.date}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'Completed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-900">{service.service}</h4>
                        <p className="text-sm text-gray-500">Technician: {service.technician}</p>
                        <p className="text-sm text-gray-500">Amount: ${service.amount}</p>
                        <p className="text-sm text-gray-500 mt-1">{service.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'communications' && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Communication History</h3>
                <div className="space-y-4">
                  {mockRecentCommunications.map((comm) => (
                    <div key={comm.id} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">{comm.date}</span>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comm.status === 'Sent' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {comm.status}
                        </span>
                      </div>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-900">{comm.subject}</h4>
                        <p className="text-sm text-gray-500">{comm.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 