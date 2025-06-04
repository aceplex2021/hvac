'use client';

import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  CreditCard, 
  User, 
  Phone, 
  Mail,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import React from 'react';
import { createBrowserClient } from '@supabase/ssr';

type Service = {
  id: number;
  name: string;
  price: string;
  duration: string;
  description?: string;
};

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  });
  const [services, setServices] = useState<any[]>([]);
  const [businessId, setBusinessId] = useState<string | null>(null);
  const [loadingServices, setLoadingServices] = useState(true);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<{ id: string; time: string; available: boolean }[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);

  useEffect(() => {
    async function fetchBusinessAndServices() {
      setLoadingServices(true);
      // 1. Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', params.slug)
        .single();
      if (bizError || !business) {
        setServices([]);
        setBusinessId(null);
        setLoadingServices(false);
        return;
      }
      setBusinessId(business.id);
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
        setServices(dbServices.map(s => ({
          id: s.id,
          name: s.name,
          price: s.base_price ? `$${parseFloat(s.base_price).toLocaleString()}` : '',
          duration: s.duration_minutes ? `${s.duration_minutes} min` : '',
          description: s.description || '',
        })));
      }
      setLoadingServices(false);
    }
    if (params.slug) fetchBusinessAndServices();
  }, [supabase, params.slug]);

  useEffect(() => {
    // If service ID is provided in URL, set it as selected
    const serviceId = searchParams.get('service');
    if (serviceId && services.length > 0) {
      const service = services.find(s => String(s.id) === String(serviceId));
      if (service) {
        setSelectedService(service);
        setStep(2); // Skip to date selection
      }
    }
  }, [supabase, searchParams, services]);

  useEffect(() => {
    async function fetchTimeSlots() {
      if (!businessId || !selectedService || !selectedDate) return;
      setLoadingTimeSlots(true);
      // Example: fetch from API or DB (replace with your real endpoint if needed)
      // For now, simulate with static slots (but in real app, fetch from DB)
      // const { data, error } = await supabase.rpc('get_available_time_slots', { business_id: businessId, service_id: selectedService.id, date: selectedDate });
      // if (error) { setTimeSlots([]); setLoadingTimeSlots(false); return; }
      // setTimeSlots(data);
      // --- DEMO fallback ---
      setTimeout(() => {
        setTimeSlots([
          { id: '1', time: '9:00 AM', available: true },
          { id: '2', time: '10:00 AM', available: true },
          { id: '3', time: '11:00 AM', available: false },
          { id: '4', time: '1:00 PM', available: true },
          { id: '5', time: '2:00 PM', available: true },
          { id: '6', time: '3:00 PM', available: true },
          { id: '7', time: '4:00 PM', available: false },
        ]);
        setLoadingTimeSlots(false);
      }, 500);
    }
    if (selectedService && selectedDate) fetchTimeSlots();
  }, [supabase, businessId, selectedService, selectedDate]);

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!selectedService || !selectedDate || !selectedTime) {
      setErrorMsg('Please complete all steps.');
      return;
    }

    try {
      // 1. Look up business by slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', params.slug)
        .single();
      if (bizError || !business) {
        setErrorMsg('Business not found.');
        return;
      }
      const business_id = business.id;

      // 2. Look up service by name and business_id (for demo, match by name)
      const { data: service, error: svcError } = await supabase
        .from('hvac_services')
        .select('id')
        .eq('business_id', business_id)
        .eq('name', selectedService.name)
        .single();
      if (svcError || !service) {
        setErrorMsg('Service not found.');
        return;
      }
      const service_id = service.id;

      // 3. Look up or create client by email and business_id
      let client_id: string | null = null;
      const { data: existingClient } = await supabase
        .from('hvac_clients')
        .select('id')
        .eq('business_id', business_id)
        .eq('email', customerInfo.email)
        .single();
      if (existingClient && existingClient.id) {
        client_id = existingClient.id;
      } else {
        // Create client
        const { data: newClient, error: clientError } = await supabase
          .from('hvac_clients')
          .insert([
            {
              business_id,
              name: customerInfo.name,
              email: customerInfo.email,
              phone: customerInfo.phone,
              address: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              zip_code: customerInfo.zip,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          ])
          .select('id')
          .single();
        if (clientError || !newClient) {
          setErrorMsg('Failed to create customer.');
          return;
        }
        client_id = newClient.id;
      }

      // 4. Combine date and time into scheduled_date (ISO string)
      const scheduled_date = new Date(
        `${selectedDate}T${selectedTime.replace(/(AM|PM)/, '').trim()}:00${selectedTime.includes('PM') && !selectedTime.startsWith('12') ? ' PM' : ''}`
      );
      if (isNaN(scheduled_date.getTime())) {
        setErrorMsg('Invalid date or time.');
        return;
      }

      // 5. Insert booking
      const { error: bookingError } = await supabase.from('hvac_bookings').insert([
        {
          business_id,
          service_id,
          client_id,
          scheduled_date: scheduled_date.toISOString(),
          status: 'pending',
          priority: 'medium',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      if (bookingError) {
        setErrorMsg('Booking failed: ' + bookingError.message);
        return;
      }
      setStep(5); // Show confirmation
    } catch (err: any) {
      setErrorMsg('Booking failed: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2">Service</span>
            </div>
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2">Date</span>
            </div>
            <div className={`flex items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2">Time</span>
            </div>
            <div className={`flex items-center ${step >= 4 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                4
              </div>
              <span className="ml-2">Details</span>
            </div>
          </div>
        </div>

        {/* Service Selection */}
        {step === 1 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Service</h2>
            {loadingServices ? (
              <div>Loading services...</div>
            ) : (
              <div className="space-y-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => handleServiceSelect(service)}
                    className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <p className="text-gray-600">{service.price}</p>
                        {service.description && <p className="text-gray-500 text-sm">{service.description}</p>}
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Date Selection */}
        {step === 2 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Date</h2>
            <div className="grid grid-cols-7 gap-2">
              {/* Calendar days would go here */}
              {/* For now, using a simple date picker */}
              <input
                type="date"
                className="w-full p-2 border rounded-lg"
                onChange={(e) => handleDateSelect(e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Time Selection */}
        {step === 3 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Select a Time</h2>
            {loadingTimeSlots ? (
              <div>Loading available times...</div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-4 border rounded-lg text-center ${
                      slot.available
                        ? 'hover:border-blue-500 hover:bg-blue-50'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Customer Information */}
        {step === 4 && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleCustomerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleCustomerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleCustomerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={customerInfo.address}
                  onChange={handleCustomerInfoChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={customerInfo.city}
                    onChange={handleCustomerInfoChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={customerInfo.state}
                    onChange={handleCustomerInfoChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Zip</label>
                  <input
                    type="text"
                    name="zip"
                    value={customerInfo.zip}
                    onChange={handleCustomerInfoChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              {errorMsg && (
                <div className="mb-4 text-red-600 font-semibold">{errorMsg}</div>
              )}
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Confirm Booking
              </button>
            </form>
          </div>
        )}

        {/* Confirmation */}
        {step === 5 && (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your {selectedService?.name} appointment is scheduled for {selectedDate} at {selectedTime}.
            </p>
            <p className="text-gray-600 mb-6">
              We&apos;ve sent a confirmation email to {customerInfo.email} with all the details.
            </p>
            <a
              href={`/${params.slug}`}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
} 