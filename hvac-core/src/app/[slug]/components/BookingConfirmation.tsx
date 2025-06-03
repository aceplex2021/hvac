'use client';

import { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  MapPin,
  CheckCircle2
} from 'lucide-react';

interface BookingDetails {
  service: {
    id: number;
    name: string;
    price: string;
    duration: string;
  };
  date: string;
  time: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface BookingConfirmationProps {
  booking: BookingDetails;
  onClose: () => void;
}

export default function BookingConfirmation({ booking, onClose }: BookingConfirmationProps) {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const handleSendEmail = async () => {
    try {
      // TODO: Replace with actual email sending logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEmailSent(true);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600">Your appointment has been successfully scheduled.</p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-start">
            <Calendar className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="text-gray-900">{booking.date}</p>
            </div>
          </div>

          <div className="flex items-start">
            <Clock className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Time</p>
              <p className="text-gray-900">{booking.time}</p>
            </div>
          </div>

          <div className="flex items-start">
            <User className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="text-gray-900">{booking.service.name}</p>
            </div>
          </div>

          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 mt-1 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="text-gray-900">{booking.customer.address}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Customer Information</h3>
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{booking.customer.name}</span>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{booking.customer.email}</span>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-600">{booking.customer.phone}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Close
          </button>
          <button
            onClick={handleSendEmail}
            disabled={isEmailSent}
            className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
              isEmailSent ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEmailSent ? 'Email Sent' : 'Send Confirmation Email'}
          </button>
        </div>
      </div>
    </div>
  );
} 