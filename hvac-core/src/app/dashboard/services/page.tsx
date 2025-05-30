'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Wrench, 
  ClipboardList, 
  Plus, 
  Search, 
  Filter,
  ChevronDown,
  Clock,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// Mock data for demonstration
const mockServices = [
  {
    id: 1,
    name: 'AC Installation',
    description: 'Professional AC unit installation',
    price: 2999,
    duration: '4-6 hours',
    category: 'Installation'
  },
  {
    id: 2,
    name: 'AC Repair',
    description: 'Diagnosis and repair of AC issues',
    price: 199,
    duration: '1-2 hours',
    category: 'Repair'
  },
  {
    id: 3,
    name: 'Maintenance Check',
    description: 'Regular maintenance service',
    price: 99,
    duration: '1 hour',
    category: 'Maintenance'
  }
];

const mockAppointments = [
  {
    id: 1,
    customer: 'John Smith',
    service: 'AC Repair',
    date: '2024-03-15',
    time: '09:00',
    status: 'Confirmed',
    address: '123 Main St, City, State',
    phone: '(555) 123-4567',
    email: 'john@example.com'
  },
  {
    id: 2,
    customer: 'Sarah Johnson',
    service: 'Maintenance Check',
    date: '2024-03-15',
    time: '14:00',
    status: 'Pending',
    address: '456 Oak Ave, City, State',
    phone: '(555) 987-6543',
    email: 'sarah@example.com'
  }
];

const mockServiceRequests = [
  {
    id: 1,
    customer: 'Mike Brown',
    service: 'AC Installation',
    date: '2024-03-14',
    status: 'New',
    priority: 'High',
    description: 'Need new AC unit installed in 2-bedroom apartment'
  },
  {
    id: 2,
    customer: 'Lisa Davis',
    service: 'AC Repair',
    date: '2024-03-14',
    status: 'In Progress',
    priority: 'Medium',
    description: 'AC not cooling properly, needs inspection'
  }
];

const TABS = [
  { id: 'services', name: 'Services', icon: Wrench },
  { id: 'appointments', name: 'Appointments', icon: Calendar },
  { id: 'requests', name: 'Service Requests', icon: ClipboardList }
];

export default function ServiceManagementPage() {
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');

  const renderServicesTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service Catalog</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((service) => (
          <div key={service.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
            <p className="mt-1 text-sm text-gray-500">{service.description}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-2xl font-bold text-gray-900">${service.price}</span>
              <span className="text-sm text-gray-500">{service.duration}</span>
            </div>
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {service.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAppointmentsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Upcoming Appointments</h2>
        <div className="flex space-x-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search appointments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockAppointments.map((appointment) => (
            <li key={appointment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{appointment.customer}</h3>
                      <p className="text-sm text-gray-500">{appointment.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                      {appointment.address}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {appointment.phone}
                    <Mail className="ml-4 flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {appointment.email}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderServiceRequestsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service Requests</h2>
        <div className="flex space-x-4">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockServiceRequests.map((request) => (
            <li key={request.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{request.customer}</h3>
                      <p className="text-sm text-gray-500">{request.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.priority === 'High' 
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.priority}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      request.status === 'New' 
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{request.description}</p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                  Requested on {request.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } -ml-0.5 mr-2 h-5 w-5`}
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'services' && renderServicesTab()}
          {activeTab === 'appointments' && renderAppointmentsTab()}
          {activeTab === 'requests' && renderServiceRequestsTab()}
        </div>
      </div>
    </div>
  );
} 