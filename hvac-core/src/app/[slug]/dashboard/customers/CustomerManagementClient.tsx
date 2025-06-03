'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Users, 
  User, 
  MessageSquare, 
  History, 
  Filter,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Wrench,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  last_service: string;
  total_services: number;
  status: string;
}

interface ServiceHistory {
  id: string;
  customer_id: string;
  service: string;
  date: string;
  technician: string;
  status: string;
  notes: string;
}

interface Communication {
  id: string;
  customer_id: string;
  type: string;
  date: string;
  subject: string;
  status: string;
  content: string;
}

interface CustomerManagementClientProps {
  initialCustomers: Customer[];
  initialServiceHistory: ServiceHistory[];
  initialCommunications: Communication[];
}

const TABS = [
  { id: 'list', name: 'Customer List', icon: Users },
  { id: 'history', name: 'Service History', icon: History },
  { id: 'communications', name: 'Communications', icon: MessageSquare }
];

// Mock data for demonstration (add at the top, after imports)
const mockCustomers = [
  { id: '1', name: 'John Smith' },
  { id: '2', name: 'Sarah Johnson' },
  { id: '3', name: 'Mike Brown' },
  { id: '4', name: 'Lisa Davis' },
];

export function CustomerManagementClient({
  initialCustomers,
  initialServiceHistory,
  initialCommunications
}: CustomerManagementClientProps) {
  const [activeTab, setActiveTab] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const customerInputRef = useRef<HTMLInputElement>(null);
  const customerDropdownRef = useRef<HTMLUListElement>(null);

  const params = useParams();
  const slug = params.slug;

  useEffect(() => {
    if (!showCustomerDropdown) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target as Node) &&
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target as Node)
      ) {
        setShowCustomerDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCustomerDropdown]);

  const filteredCustomers = customerSearch
    ? mockCustomers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
    : mockCustomers;

  const handleCustomerSelect = (name: string) => {
    setSearchQuery(name);
    setCustomerSearch(name);
    setShowCustomerDropdown(false);
  };

  const renderCustomerList = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Customer List</h2>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            ref={customerInputRef}
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-900 border rounded-md text-gray-900"
            placeholder="Search customers..."
            value={customerSearch}
            onChange={(e) => {
              setCustomerSearch(e.target.value);
              setSearchQuery(e.target.value);
              setShowCustomerDropdown(true);
            }}
            onFocus={() => setShowCustomerDropdown(true)}
          />
          {showCustomerDropdown && filteredCustomers.length > 0 && (
            <ul
              ref={customerDropdownRef}
              className="absolute z-10 bg-white border border-gray-200 w-full mt-1 rounded shadow max-h-40 overflow-auto"
            >
              {filteredCustomers.map((c) => (
                <li
                  key={c.id}
                  className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-gray-900"
                  onClick={() => handleCustomerSelect(c.name)}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {initialCustomers
            .filter((customer) =>
              customer.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((customer) => (
              <li key={customer.id}>
                <Link href={`/${slug}/dashboard/customers/${customer.id}`}>
                  <div className="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <User className="h-8 w-8 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{customer.name}</h3>
                          <p className="text-sm text-gray-900">{customer.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Active' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {customer.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-900">
                          <Phone className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {customer.phone}
                        </p>
                        <p className="mt-2 flex items-center text-sm text-gray-900 sm:mt-0 sm:ml-6">
                          <MapPin className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {customer.address}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-900 sm:mt-0">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        Last service: {format(new Date(customer.last_service), 'MMM dd, yyyy')}
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );

  const renderServiceHistory = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service History</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-900 border rounded-md text-gray-900"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {initialServiceHistory
            .filter((service) =>
              service.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
              service.technician.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((service) => (
              <li key={service.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <Wrench className="h-8 w-8 text-gray-400" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{service.service}</h3>
                        <p className="text-sm text-gray-900">Technician: {service.technician}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        service.status === 'Completed' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-900">{service.notes}</p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-900">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {format(new Date(service.date), 'MMM dd, yyyy')}
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );

  const renderCommunications = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Communications</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <input
              type="text"
              className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-gray-900 border rounded-md text-gray-900"
              placeholder="Search communications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {initialCommunications
            .filter((communication) =>
              communication.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
              communication.content.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((communication) => (
              <li key={communication.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {communication.type === 'Email' ? (
                          <Mail className="h-8 w-8 text-gray-400" />
                        ) : (
                          <Phone className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{communication.subject}</h3>
                        <p className="text-sm text-gray-900">{communication.content}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        communication.status === 'Sent' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {communication.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-900">
                    <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                    {format(new Date(communication.date), 'MMM dd, yyyy')}
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
          {activeTab === 'list' && renderCustomerList()}
          {activeTab === 'history' && renderServiceHistory()}
          {activeTab === 'communications' && renderCommunications()}
        </div>
      </div>
    </div>
  );
} 