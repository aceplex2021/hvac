'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';
// import { Calendar, Clock, User, Phone, Mail, CheckCircle2 } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  price: string;
  duration: string;
}

interface BookingData {
  serviceId: number;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
}

interface BookingWidgetProps {
  config: {
    primaryColor: string;
    secondaryColor: string;
    textColor: string;
    backgroundColor: string;
    services: Service[];
  };
}

export default function BookingWidget({ config }: BookingWidgetProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    serviceId: 0,
    date: '',
    time: '',
    customerName: '',
    customerPhone: '',
    customerEmail: '',
  });

  const [availableTimes] = useState([
    '9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM'
  ]);

  const handleServiceSelect = (serviceId: number) => {
    setBookingData({ ...bookingData, serviceId });
    setStep(2);
  };

  const handleDateSelect = (date: string) => {
    setBookingData({ ...bookingData, date });
    setStep(3);
  };

  const handleTimeSelect = (time: string) => {
    setBookingData({ ...bookingData, time });
    setStep(4);
  };

  const handleCustomerInfoChange = (field: keyof BookingData, value: string) => {
    setBookingData({ ...bookingData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to submit booking
    setStep(5);
  };

  return (
    <div 
      className="p-6 rounded-lg shadow-lg"
      style={{ 
        backgroundColor: config.backgroundColor,
        color: config.textColor
      }}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Book a Service</h2>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                s === step
                  ? 'bg-blue-500 text-white'
                  : s < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select a Service</h3>
          {config.services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service.id)}
              className="w-full p-4 border rounded-lg hover:border-blue-500 transition-colors"
              style={{ borderColor: config.primaryColor }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{service.name}</span>
                <span>{service.price}</span>
              </div>
              <div className="text-sm text-gray-500 mt-1">
                Duration: {service.duration}
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select a Date</h3>
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 14 }, (_, i) => {
              const date = new Date();
              date.setDate(date.getDate() + i);
              return (
                <button
                  key={i}
                  onClick={() => handleDateSelect(date.toISOString().split('T')[0])}
                  className={`p-2 rounded-lg ${
                    bookingData.date === date.toISOString().split('T')[0]
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  <br />
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Select a Time</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableTimes.map((time) => (
              <button
                key={time}
                onClick={() => handleTimeSelect(time)}
                className={`p-3 rounded-lg ${
                  bookingData.time === time
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-xl font-semibold">Your Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={bookingData.customerName}
                onChange={(e) => handleCustomerInfoChange('customerName', e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                type="tel"
                value={bookingData.customerPhone}
                onChange={(e) => handleCustomerInfoChange('customerPhone', e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={bookingData.customerEmail}
                onChange={(e) => handleCustomerInfoChange('customerEmail', e.target.value)}
                className="w-full p-2 border rounded-lg"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-white font-medium"
            style={{ backgroundColor: config.primaryColor }}
          >
            Confirm Booking
          </button>
        </form>
      )}

      {step === 5 && (
        <div className="text-center py-8">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Booking Confirmed!</h3>
          <p className="text-gray-600">We&apos;ve sent a confirmation email with your booking details.</p>
        </div>
      )}
    </div>
  );
} 