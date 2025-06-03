'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  Wrench, 
  ClipboardList, 
  Plus, 
  Search, 
  Filter,
  // ChevronDown,
  Clock,
  User,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';

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

const mockTechnicians = [
  { id: 1, name: 'Mike Brown' },
  { id: 2, name: 'Lisa Davis' },
  { id: 3, name: 'Alex Kim' },
];

const mockCustomers = [
  { id: 1, name: 'John Smith' },
  { id: 2, name: 'Sarah Johnson' },
  { id: 3, name: 'Mike Brown' },
  { id: 4, name: 'Lisa Davis' },
];

const TABS = [
  { id: 'services', name: 'Services', icon: Wrench },
  { id: 'appointments', name: 'Appointments', icon: Calendar },
  { id: 'requests', name: 'Service Requests', icon: ClipboardList }
];

// Service categories and their services
const SERVICE_CATEGORIES = [
  { key: 'heating', label: 'Heating' },
  { key: 'air_conditioning', label: 'Air Conditioning' },
];
const SERVICES_BY_CATEGORY = {
  heating: [
    'Furnace Installation',
    'Furnace Repair',
    'Furnace Maintenance',
    'Boiler Installation',
    'Boiler Repair',
    'Boiler Maintenance',
    'Heat Pump Installation',
    'Heat Pump Repair',
    'Heat Pump Maintenance',
  ],
  air_conditioning: [
    'AC Installation',
    'AC Repair',
    'AC Maintenance',
    'Ductless Mini-Split Installation',
    'Ductless Mini-Split Repair',
    'Ductless Mini-Split Maintenance',
    'Thermostat Installation',
    'Thermostat Repair',
  ],
};

export default function ServiceManagementPage() {
  const params = useParams();
  const slug = params.slug;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [activeTab, setActiveTab] = useState('services');
  const [searchQuery, setSearchQuery] = useState('');
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [workOrderForm, setWorkOrderForm] = useState({
    customer: '',
    service: '',
    date: '',
    priority: 'Medium',
    description: '',
    technician: '',
  });
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);
  const [services, setServices] = useState<any[]>([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [addServiceForm, setAddServiceForm] = useState({
    category: 'heating',
    service: '',
    description: '',
    base_price: '',
    duration_minutes: '',
  });
  const [addServiceLoading, setAddServiceLoading] = useState(false);
  const [addServiceError, setAddServiceError] = useState<string | null>(null);

  const customerInputRef = useRef(null);
  const customerDropdownRef = useRef(null);

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [appointmentsError, setAppointmentsError] = useState<string | null>(null);
  const [serviceRequests, setServiceRequests] = useState<any[]>([]);
  const [loadingServiceRequests, setLoadingServiceRequests] = useState(true);
  const [serviceRequestsError, setServiceRequestsError] = useState<string | null>(null);

  const [showEditAppointmentModal, setShowEditAppointmentModal] = useState(false);
  const [editAppointment, setEditAppointment] = useState<any>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [clientEquipment, setClientEquipment] = useState<any[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Business-wide service config fields
  const [businessConfig, setBusinessConfig] = useState({
    default_service_duration: '',
    buffer_time_minutes: '',
    max_daily_appointments: '',
    cancellation_policy: '',
  });
  const [businessConfigLoading, setBusinessConfigLoading] = useState(true);
  const [businessConfigError, setBusinessConfigError] = useState<string | null>(null);
  const [businessConfigEditing, setBusinessConfigEditing] = useState(false);
  const [businessId, setBusinessId] = useState<string | null>(null);

  useEffect(() => {
    if (!showCustomerDropdown) return;
    function handleClickOutside(event) {
      if (
        customerInputRef.current &&
        !customerInputRef.current.contains(event.target) &&
        customerDropdownRef.current &&
        !customerDropdownRef.current.contains(event.target)
      ) {
        setShowCustomerDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCustomerDropdown]);

  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      // 1. Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setServices([]);
        setLoadingServices(false);
        return;
      }
      // 2. Fetch services for this business
      const { data: dbServices, error: svcError } = await supabase
        .from('hvac_services')
        .select('id, name, base_price, duration_minutes, description')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('name', { ascending: true });
      if (svcError || !dbServices) {
        setServices([]);
      } else {
        setServices(dbServices);
      }
      setLoadingServices(false);
    }
    if (slug) fetchServices();
  }, [slug]);

  useEffect(() => {
    async function fetchAppointments() {
      setLoadingAppointments(true);
      setAppointmentsError(null);
      // 1. Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setAppointments([]);
        setLoadingAppointments(false);
        setAppointmentsError('Business not found.');
        return;
      }
      // 2. Fetch bookings for this business, join clients/services
      const { data: bookings, error: bookingsError } = await supabase
        .from('hvac_bookings')
        .select(`id, scheduled_date, status, priority, hvac_clients(name, address, phone, email), hvac_services(name)`) // join
        .eq('business_id', business.id)
        .order('scheduled_date', { ascending: true });
      if (bookingsError || !bookings) {
        setAppointments([]);
        setAppointmentsError('Failed to fetch appointments.');
      } else {
        setAppointments(
          bookings.map((b: any) => {
            const dateObj = new Date(b.scheduled_date);
            return {
              id: b.id,
              customer: b.hvac_clients?.name || '',
              service: b.hvac_services?.name || '',
              date: dateObj.toLocaleDateString(),
              time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
              address: b.hvac_clients?.address || '',
              phone: b.hvac_clients?.phone || '',
              email: b.hvac_clients?.email || '',
            };
          })
        );
      }
      setLoadingAppointments(false);
    }
    if (slug && activeTab === 'appointments') fetchAppointments();
  }, [slug, activeTab]);

  useEffect(() => {
    async function fetchServiceRequests() {
      setLoadingServiceRequests(true);
      setServiceRequestsError(null);
      // 1. Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setServiceRequests([]);
        setLoadingServiceRequests(false);
        setServiceRequestsError('Business not found.');
        return;
      }
      // 2. Fetch work orders for this business, join clients/services
      const { data: workOrders, error: workOrdersError } = await supabase
        .from('hvac_work_orders')
        .select(`id, status, priority, type, description, start_time, hvac_clients(name), hvac_services(name)`) // join
        .eq('business_id', business.id)
        .order('start_time', { ascending: false });
      if (workOrdersError || !workOrders) {
        setServiceRequests([]);
        setServiceRequestsError('Failed to fetch service requests.');
      } else {
        setServiceRequests(
          workOrders.map((w: any) => {
            const dateObj = w.start_time ? new Date(w.start_time) : null;
            return {
              id: w.id,
              customer: w.hvac_clients?.name || '',
              service: w.hvac_services?.name || '',
              date: dateObj ? dateObj.toLocaleDateString() : '',
              status: w.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
              priority: w.priority.charAt(0).toUpperCase() + w.priority.slice(1),
              description: w.description || '',
            };
          })
        );
      }
      setLoadingServiceRequests(false);
    }
    if (slug && activeTab === 'requests') fetchServiceRequests();
  }, [slug, activeTab]);

  useEffect(() => {
    async function fetchTechnicians() {
      if (!slug) return;
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) return;
      const { data: techs } = await supabase
        .from('hvac_technicians')
        .select('id, name')
        .eq('business_id', business.id)
        .eq('is_active', true)
        .order('name', { ascending: true });
      setTechnicians(techs || []);
    }
    fetchTechnicians();
  }, [slug]);

  useEffect(() => {
    async function fetchEquipment() {
      if (!editAppointment || !editAppointment.client_id) return;
      const { data: equipment } = await supabase
        .from('hvac_client_equipment')
        .select('id, serial_number, installation_date')
        .eq('client_id', editAppointment.client_id);
      setClientEquipment(equipment || []);
    }
    fetchEquipment();
  }, [editAppointment]);

  // Fetch business config fields
  useEffect(() => {
    async function fetchBusinessConfig() {
      setBusinessConfigLoading(true);
      setBusinessConfigError(null);
      const { data, error } = await supabase
        .from('hvac_businesses')
        .select('id, default_service_duration, buffer_time_minutes, max_daily_appointments, cancellation_policy')
        .eq('slug', slug)
        .single();
      if (error || !data) {
        setBusinessConfigError('Failed to load business configuration.');
        setBusinessConfig({
          default_service_duration: '',
          buffer_time_minutes: '',
          max_daily_appointments: '',
          cancellation_policy: '',
        });
        setBusinessId(null);
      } else {
        setBusinessConfig({
          default_service_duration: data.default_service_duration || '',
          buffer_time_minutes: data.buffer_time_minutes?.toString() || '',
          max_daily_appointments: data.max_daily_appointments?.toString() || '',
          cancellation_policy: data.cancellation_policy || '',
        });
        setBusinessId(data.id);
      }
      setBusinessConfigLoading(false);
    }
    if (slug) fetchBusinessConfig();
  }, [slug]);

  const filteredCustomers = customerSearch
    ? mockCustomers.filter((c) => c.name.toLowerCase().includes(customerSearch.toLowerCase()))
    : mockCustomers;

  const handleCustomerSelect = (name) => {
    setWorkOrderForm({ ...workOrderForm, customer: name });
    setCustomerSearch(name);
    setShowCustomerDropdown(false);
  };

  const handleWorkOrderChange = (e) => {
    setWorkOrderForm({
      ...workOrderForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleWorkOrderSubmit = (e) => {
    e.preventDefault();
    // Here you would send the work order to the backend
    setShowWorkOrderModal(false);
    setWorkOrderForm({
      customer: '',
      service: '',
      date: '',
      priority: 'Medium',
      description: '',
      technician: '',
    });
  };

  const handleAddServiceChange = (e) => {
    setAddServiceForm({
      ...addServiceForm,
      [e.target.name]: e.target.value,
      // Reset service if category changes
      ...(e.target.name === 'category' ? { service: '' } : {}),
    });
  };

  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    setAddServiceLoading(true);
    setAddServiceError(null);
    // Get business_id from slug
    const { data: business, error: bizError } = await supabase
      .from('hvac_businesses')
      .select('id')
      .eq('slug', slug)
      .single();
    if (bizError || !business) {
      setAddServiceError('Business not found.');
      setAddServiceLoading(false);
      return;
    }
    // Insert new service (use selected service as name)
    const { error: svcError } = await supabase
      .from('hvac_services')
      .insert([
        {
          business_id: business.id,
          name: addServiceForm.service,
          description: addServiceForm.description,
          base_price: parseFloat(addServiceForm.base_price),
          duration_minutes: parseInt(addServiceForm.duration_minutes, 10),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
    if (svcError) {
      setAddServiceError('Failed to add service: ' + svcError.message);
      setAddServiceLoading(false);
      return;
    }
    setShowAddServiceModal(false);
    setAddServiceForm({ category: 'heating', service: '', description: '', base_price: '', duration_minutes: '' });
    setAddServiceLoading(false);
    // Refresh services
    if (slug) {
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (business) {
        const { data: dbServices } = await supabase
          .from('hvac_services')
          .select('id, name, base_price, duration_minutes, description')
          .eq('business_id', business.id)
          .eq('is_active', true)
          .order('name', { ascending: true });
        setServices(dbServices || []);
      }
    }
  };

  // Handler for editing config fields
  const handleBusinessConfigChange = (e) => {
    const { name, value } = e.target;
    setBusinessConfig((prev) => ({ ...prev, [name]: value }));
  };

  // Handler for saving config fields
  const handleSaveBusinessConfig = async () => {
    if (!businessId) return;
    setBusinessConfigLoading(true);
    setBusinessConfigError(null);
    const { error } = await supabase
      .from('hvac_businesses')
      .update({
        default_service_duration: businessConfig.default_service_duration,
        buffer_time_minutes: businessConfig.buffer_time_minutes ? parseInt(businessConfig.buffer_time_minutes, 10) : null,
        max_daily_appointments: businessConfig.max_daily_appointments ? parseInt(businessConfig.max_daily_appointments, 10) : null,
        cancellation_policy: businessConfig.cancellation_policy,
      })
      .eq('id', businessId);
    if (error) {
      setBusinessConfigError('Failed to save configuration: ' + error.message);
    } else {
      setBusinessConfigEditing(false);
    }
    setBusinessConfigLoading(false);
  };

  const renderServicesTab = () => (
    <div className="space-y-6">
      {/* Business-wide Service Config Section */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Service Configuration</h2>
          {businessConfigEditing ? (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={handleSaveBusinessConfig}
              disabled={businessConfigLoading}
            >
              Save
            </button>
          ) : (
            <button
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              onClick={() => setBusinessConfigEditing(true)}
            >
              Edit
            </button>
          )}
        </div>
        {businessConfigError && <div className="text-red-600 mb-2">{businessConfigError}</div>}
        {businessConfigLoading ? (
          <div>Loading configuration...</div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Default Service Duration</label>
              <input
                type="text"
                name="default_service_duration"
                value={businessConfig.default_service_duration}
                onChange={handleBusinessConfigChange}
                disabled={!businessConfigEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="e.g. 1 hour"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Buffer Time Between Jobs (minutes)</label>
              <input
                type="number"
                name="buffer_time_minutes"
                value={businessConfig.buffer_time_minutes}
                onChange={handleBusinessConfigChange}
                disabled={!businessConfigEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="e.g. 15"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Max Daily Appointments</label>
              <input
                type="number"
                name="max_daily_appointments"
                value={businessConfig.max_daily_appointments}
                onChange={handleBusinessConfigChange}
                disabled={!businessConfigEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="e.g. 8"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cancellation Policy</label>
              <input
                type="text"
                name="cancellation_policy"
                value={businessConfig.cancellation_policy}
                onChange={handleBusinessConfigChange}
                disabled={!businessConfigEditing}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                placeholder="e.g. 24 hours notice required"
              />
            </div>
          </div>
        )}
      </div>
      {/* End Service Config Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service Catalog</h2>
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          onClick={() => setShowAddServiceModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Service
        </button>
      </div>
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowAddServiceModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Add New Service</h3>
            <form onSubmit={handleAddServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  name="category"
                  value={addServiceForm.category}
                  onChange={handleAddServiceChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  name="service"
                  value={addServiceForm.service}
                  onChange={handleAddServiceChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select service</option>
                  {SERVICES_BY_CATEGORY[addServiceForm.category].map((svc) => (
                    <option key={svc} value={svc}>{svc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={addServiceForm.description}
                  onChange={handleAddServiceChange}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                <input
                  type="number"
                  name="base_price"
                  value={addServiceForm.base_price}
                  onChange={handleAddServiceChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input
                  type="number"
                  name="duration_minutes"
                  value={addServiceForm.duration_minutes}
                  onChange={handleAddServiceChange}
                  required
                  min="1"
                  step="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {addServiceError && (
                <div className="text-red-600 text-sm">{addServiceError}</div>
              )}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={addServiceLoading}
                >
                  {addServiceLoading ? 'Adding...' : 'Add Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {loadingServices ? (
        <div>Loading services...</div>
      ) : (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
          <div key={service.id} className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
              {service.description && <p className="text-gray-600 mt-2">{service.description}</p>}
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {service.base_price ? `$${parseFloat(service.base_price).toLocaleString()}` : 'N/A'}
              </span>
                {service.duration_minutes && (
                  <span className="ml-2 text-xs text-gray-500">{service.duration_minutes} min</span>
                )}
              </div>
          </div>
        ))}
      </div>
      )}
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
      {loadingAppointments ? (
        <div>Loading appointments...</div>
      ) : appointmentsError ? (
        <div className="text-red-600">{appointmentsError}</div>
      ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
            {appointments
              .filter((appointment) =>
                appointment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                appointment.service.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((appointment) => (
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
                      <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      appointment.status === 'Confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {appointment.status}
                    </span>
                        {appointment.status === 'Pending' && (
                          <button
                            className="ml-2 px-3 py-1 text-xs rounded bg-blue-100 text-blue-800 hover:bg-blue-200"
                            onClick={() => {
                              setEditAppointment(appointment);
                              setEditForm({ ...appointment });
                              setShowEditAppointmentModal(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
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
      )}
    </div>
  );

  const renderServiceRequestsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service Requests</h2>
        <div className="flex space-x-4">
          <button
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={() => setShowWorkOrderModal(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Work Order
          </button>
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
      {loadingServiceRequests ? (
        <div>Loading service requests...</div>
      ) : serviceRequestsError ? (
        <div className="text-red-600">{serviceRequestsError}</div>
      ) : (
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
            {serviceRequests
              .filter((request) =>
                request.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                request.service.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((request) => (
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
      )}
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
      {showEditAppointmentModal && editForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative flex flex-col" style={{ maxHeight: '80vh' }}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowEditAppointmentModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-900">Edit Appointment</h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setEditLoading(true);
                setEditError(null);
                try {
                  // 1. Update booking
                  const { error: bookingError } = await supabase
                    .from('hvac_bookings')
                    .update({
                      service_id: editForm.service_id,
                      scheduled_date: new Date(`${editForm.date}T${editForm.time}`).toISOString(),
                      status: editForm.status.toLowerCase(),
                      priority: editForm.priority.toLowerCase(),
                      notes: editForm.notes,
                      special_instructions: editForm.special_instructions,
                      client_equipment_id: editForm.client_equipment_id || null,
                      updated_at: new Date().toISOString(),
                    })
                    .eq('id', editAppointment.id);
                  if (bookingError) throw bookingError;
                  // 2. Upsert work order (assign technician, etc.)
                  if (editForm.technician_id) {
                    // Try to find existing work order for this booking
                    const { data: existingWO } = await supabase
                      .from('hvac_work_orders')
                      .select('id')
                      .eq('booking_id', editAppointment.id)
                      .single();
                    if (existingWO && existingWO.id) {
                      // Update
                      const { error: woError } = await supabase
                        .from('hvac_work_orders')
                        .update({
                          technician_id: editForm.technician_id,
                          status: 'scheduled',
                          priority: editForm.priority.toLowerCase(),
                          type: editForm.work_order_type,
                          description: editForm.work_order_description,
                          diagnosis: editForm.diagnosis,
                          solution: editForm.solution,
                          notes: editForm.work_order_notes,
                          labor_hours: editForm.labor_hours ? parseFloat(editForm.labor_hours) : null,
                          labor_rate: editForm.labor_rate ? parseFloat(editForm.labor_rate) : null,
                          total_cost: editForm.total_cost ? parseFloat(editForm.total_cost) : null,
                          payment_status: editForm.payment_status,
                          warranty_covered: editForm.warranty_covered,
                          updated_at: new Date().toISOString(),
                        })
                        .eq('id', existingWO.id);
                      if (woError) throw woError;
                    } else {
                      // Insert
                      const { error: woError } = await supabase
                        .from('hvac_work_orders')
                        .insert([
                          {
                            booking_id: editAppointment.id,
                            business_id: editAppointment.business_id,
                            technician_id: editForm.technician_id,
                            client_id: editAppointment.client_id,
                            client_equipment_id: editForm.client_equipment_id || null,
                            status: 'scheduled',
                            priority: editForm.priority.toLowerCase(),
                            type: editForm.work_order_type,
                            description: editForm.work_order_description,
                            diagnosis: editForm.diagnosis,
                            solution: editForm.solution,
                            notes: editForm.work_order_notes,
                            labor_hours: editForm.labor_hours ? parseFloat(editForm.labor_hours) : null,
                            labor_rate: editForm.labor_rate ? parseFloat(editForm.labor_rate) : null,
                            total_cost: editForm.total_cost ? parseFloat(editForm.total_cost) : null,
                            payment_status: editForm.payment_status,
                            warranty_covered: editForm.warranty_covered,
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                          },
                        ]);
                      if (woError) throw woError;
                    }
                  }
                  setShowEditAppointmentModal(false);
                  setEditAppointment(null);
                  setEditForm(null);
                  // Refresh appointments
                  if (slug && activeTab === 'appointments') {
                    const { data: business } = await supabase
                      .from('hvac_businesses')
                      .select('id')
                      .eq('slug', slug)
                      .single();
                    if (business) {
                      const { data: bookings } = await supabase
                        .from('hvac_bookings')
                        .select(`id, scheduled_date, status, priority, hvac_clients(name, address, phone, email), hvac_services(name)`)
                        .eq('business_id', business.id)
                        .order('scheduled_date', { ascending: true });
                      setAppointments(
                        (bookings || []).map((b: any) => {
                          const dateObj = new Date(b.scheduled_date);
                          return {
                            id: b.id,
                            customer: b.hvac_clients?.name || '',
                            service: b.hvac_services?.name || '',
                            date: dateObj.toLocaleDateString(),
                            time: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                            status: b.status.charAt(0).toUpperCase() + b.status.slice(1),
                            address: b.hvac_clients?.address || '',
                            phone: b.hvac_clients?.phone || '',
                            email: b.hvac_clients?.email || '',
                          };
                        })
                      );
                    }
                  }
                } catch (err: any) {
                  setEditError(err.message || 'Failed to update appointment.');
                } finally {
                  setEditLoading(false);
                }
              }}
              className="space-y-4 overflow-y-auto flex-1"
              style={{ maxHeight: 'calc(80vh - 3rem)' }}
            >
              {/* Service */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Service</label>
                <select
                  name="service_id"
                  value={editForm.service_id || ''}
                  onChange={e => setEditForm({ ...editForm, service_id: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select service</option>
                  {services.map((svc) => (
                    <option key={svc.id} value={svc.id}>{svc.name}</option>
                  ))}
                </select>
              </div>
              {/* Scheduled Date/Time */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Date</label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date || ''}
                    onChange={e => setEditForm({ ...editForm, date: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={editForm.time || ''}
                    onChange={e => setEditForm({ ...editForm, time: e.target.value })}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  name="status"
                  value={editForm.status || ''}
                  onChange={e => setEditForm({ ...editForm, status: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  name="priority"
                  value={editForm.priority || ''}
                  onChange={e => setEditForm({ ...editForm, priority: e.target.value })}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  name="notes"
                  value={editForm.notes || ''}
                  onChange={e => setEditForm({ ...editForm, notes: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Special Instructions */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Special Instructions</label>
                <textarea
                  name="special_instructions"
                  value={editForm.special_instructions || ''}
                  onChange={e => setEditForm({ ...editForm, special_instructions: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Client Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Client Equipment</label>
                <select
                  name="client_equipment_id"
                  value={editForm.client_equipment_id || ''}
                  onChange={e => setEditForm({ ...editForm, client_equipment_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">None</option>
                  {clientEquipment.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.serial_number} {eq.installation_date ? `(Installed: ${new Date(eq.installation_date).toLocaleDateString()})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              {/* Technician Assignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Technician</label>
                <select
                  name="technician_id"
                  value={editForm.technician_id || ''}
                  onChange={e => setEditForm({ ...editForm, technician_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Unassigned</option>
                  {technicians.map(tech => (
                    <option key={tech.id} value={tech.id}>{tech.name}</option>
                  ))}
                </select>
              </div>
              {/* Work Order Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Order Type</label>
                <select
                  name="work_order_type"
                  value={editForm.work_order_type || ''}
                  onChange={e => setEditForm({ ...editForm, work_order_type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select type</option>
                  <option value="installation">Installation</option>
                  <option value="repair">Repair</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              {/* Work Order Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Order Description</label>
                <textarea
                  name="work_order_description"
                  value={editForm.work_order_description || ''}
                  onChange={e => setEditForm({ ...editForm, work_order_description: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Diagnosis */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Diagnosis</label>
                <textarea
                  name="diagnosis"
                  value={editForm.diagnosis || ''}
                  onChange={e => setEditForm({ ...editForm, diagnosis: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Solution */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Solution</label>
                <textarea
                  name="solution"
                  value={editForm.solution || ''}
                  onChange={e => setEditForm({ ...editForm, solution: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Work Order Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Work Order Notes</label>
                <textarea
                  name="work_order_notes"
                  value={editForm.work_order_notes || ''}
                  onChange={e => setEditForm({ ...editForm, work_order_notes: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                />
              </div>
              {/* Labor Rate, Labor Hours, Total Cost */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Labor Hours</label>
                  <input
                    type="number"
                    name="labor_hours"
                    value={editForm.labor_hours || ''}
                    onChange={e => setEditForm({ ...editForm, labor_hours: e.target.value })}
                    min="0"
                    step="0.1"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Labor Rate ($/hr)</label>
                  <input
                    type="number"
                    name="labor_rate"
                    value={editForm.labor_rate || ''}
                    onChange={e => setEditForm({ ...editForm, labor_rate: e.target.value })}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">Total Cost ($)</label>
                  <input
                    type="number"
                    name="total_cost"
                    value={editForm.total_cost || ''}
                    onChange={e => setEditForm({ ...editForm, total_cost: e.target.value })}
                    min="0"
                    step="0.01"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>
              {/* Payment Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <select
                  name="payment_status"
                  value={editForm.payment_status || ''}
                  onChange={e => setEditForm({ ...editForm, payment_status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900"
                >
                  <option value="">Select status</option>
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
              {/* Warranty Covered */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="warranty_covered"
                  checked={!!editForm.warranty_covered}
                  onChange={e => setEditForm({ ...editForm, warranty_covered: e.target.checked })}
                  className="rounded border-gray-300 mr-2"
                />
                <label className="text-sm font-medium">Warranty Covered</label>
              </div>
              {editError && <div className="text-red-600 text-sm">{editError}</div>}
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={editLoading}
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 