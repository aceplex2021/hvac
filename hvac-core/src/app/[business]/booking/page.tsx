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

// Mock data - will be replaced with API calls
const mockServices = [
  { id: 1, name: 'AC Installation', price: 'Starting at $2,500', duration: '4-6 hours' },
  { id: 2, name: 'AC Repair', price: 'Starting at $99', duration: '1-2 hours' },
  { id: 3, name: 'Maintenance', price: 'Starting at $79', duration: '1 hour' },
];

const mockTimeSlots = [
  { id: 1, time: '9:00 AM', available: true },
  { id: 2, time: '10:00 AM', available: true },
  { id: 3, time: '11:00 AM', available: false },
  { id: 4, time: '1:00 PM', available: true },
  { id: 5, time: '2:00 PM', available: true },
  { id: 6, time: '3:00 PM', available: true },
  { id: 7, time: '4:00 PM', available: false },
];

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    // If service ID is provided in URL, set it as selected
    const serviceId = searchParams.get('service');
    if (serviceId) {
      const service = mockServices.find(s => s.id === parseInt(serviceId));
      if (service) {
        setSelectedService(service);
        setStep(2); // Skip to date selection
      }
    }
  }, [searchParams]);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(3);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
    setStep(4);
  };

  const handleCustomerInfoChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Submit booking to API
    console.log('Booking submitted:', {
      service: selectedService,
      date: selectedDate,
      time: selectedTime,
      customer: customerInfo,
    });
    setStep(5); // Show confirmation
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
            <div className="space-y-4">
              {mockServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="p-4 border rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-gray-600">{service.price}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
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
            <div className="grid grid-cols-2 gap-4">
              {mockTimeSlots.map((slot) => (
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
              Your {selectedService.name} appointment is scheduled for {selectedDate} at {selectedTime}.
            </p>
            <p className="text-gray-600 mb-6">
              We've sent a confirmation email to {customerInfo.email} with all the details.
            </p>
            <a
              href={`/${params.business}`}
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