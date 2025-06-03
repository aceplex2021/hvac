'use client';

import { useParams } from 'next/navigation';
import { 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Calendar,
  ChevronRight
} from 'lucide-react';

// Mock data - will be replaced with API calls
const mockServiceDetails = {
  id: 1,
  name: 'AC Installation',
  description: 'Professional installation of new air conditioning systems with expert technicians.',
  price: 'Starting at $2,500',
  duration: '4-6 hours',
  features: [
    'Professional installation by certified technicians',
    'Complete system setup and testing',
    'Warranty coverage',
    'Free consultation',
    '24/7 support after installation'
  ],
  requirements: [
    'Valid electrical connection',
    'Proper space for unit installation',
    'Access to installation area',
    'Approval from property owner (if applicable)'
  ],
  images: [
    '/images/ac-installation-1.jpg',
    '/images/ac-installation-2.jpg',
    '/images/ac-installation-3.jpg'
  ]
};

export default function ServiceDetailsPage() {
  const params = useParams();
  const service = mockServiceDetails;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Service Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
          <p className="text-xl text-gray-600 mb-6">{service.description}</p>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2" />
              <span>{service.price}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <span>{service.duration}</span>
            </div>
          </div>
          <a 
            href={`/${params.business}/booking?service=${service.id}`}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Book Now
            <ChevronRight className="ml-2 h-5 w-5" />
          </a>
        </div>

        {/* Service Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
            <ul className="space-y-3">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2 mt-1" />
                  <span className="text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Requirements</h2>
            <ul className="space-y-3">
              {service.requirements.map((requirement, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mr-2 mt-1" />
                  <span className="text-gray-600">{requirement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Service Gallery */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {service.images.map((image, index) => (
              <div key={index} className="relative aspect-w-16 aspect-h-9">
                <img
                  src={image}
                  alt={`${service.name} - Image ${index + 1}`}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 