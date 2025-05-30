'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Package, Building, MapPin, Clock, CreditCard, Link as LinkIcon } from 'lucide-react';

// Define the steps in the registration process
const REGISTRATION_STEPS = [
  { id: 'package', title: 'Select Package', icon: Package },
  { id: 'business', title: 'Business Details', icon: Building },
  { id: 'service', title: 'Service Areas', icon: MapPin },
  { id: 'hours', title: 'Business Hours', icon: Clock },
  { id: 'payment', title: 'Payment Setup', icon: CreditCard },
  { id: 'complete', title: 'Complete', icon: Check },
];

// Package options
const PACKAGES = [
  {
    id: 'basic',
    name: 'Basic',
    price: 99,
    description: 'Perfect for small HVAC businesses',
    features: [
      'Service booking',
      'Basic invoicing',
      'Payment processing',
      'Customer management',
      'Service history',
      'Email notifications',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 249,
    description: 'For growing HVAC businesses',
    features: [
      'All Basic features',
      'Technician dispatch',
      'Work progress tracking',
      'Customer chatbot',
      'Advanced reporting',
      'Priority support',
      'Custom branding',
      'API access',
      'Multi-location support',
      'Inventory management',
      'Advanced scheduling',
      'Team management',
    ],
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPackage = searchParams.get('plan') || 'basic';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    serviceAreas: [],
    businessHours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '13:00' },
      sunday: { open: '', close: '' },
    },
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const handleNext = () => {
    if (currentStep < REGISTRATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePackageSelect = (packageId) => {
    setSelectedPackage(packageId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here we would submit the data to our backend
    console.log('Form submitted:', { selectedPackage, ...formData });
    
    // For now, just move to the next step
    handleNext();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Select Your Package</h2>
            <p className="text-gray-600">Choose the plan that works best for your business.</p>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  className={`border rounded-lg p-6 cursor-pointer transition-all ${
                    selectedPackage === pkg.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handlePackageSelect(pkg.id)}
                >
                  <h3 className="text-xl font-semibold text-gray-900">{pkg.name}</h3>
                  <p className="mt-1 text-gray-500">{pkg.description}</p>
                  <p className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">${pkg.price}</span>
                    <span className="text-gray-500">/month</span>
                  </p>
                  <ul className="mt-6 space-y-3">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Details</h2>
            <p className="text-gray-600">Tell us about your HVAC business.</p>
            
            <form className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Service Areas</h2>
            <p className="text-gray-600">Define the areas you serve.</p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                For now, we'll use your business address as the center point. In the future, you'll be able to define specific service areas.
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Your Business Location</h3>
              <p className="mt-1 text-gray-600">
                {formData.address || 'No address provided'}, {formData.city || ''}, {formData.state || ''} {formData.zip || ''}
              </p>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Business Hours</h2>
            <p className="text-gray-600">Set your standard business hours.</p>
            
            <div className="space-y-4">
              {Object.entries(formData.businessHours).map(([day, hours]) => (
                <div key={day} className="flex items-center">
                  <div className="w-32">
                    <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                  </div>
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="time"
                      value={hours.open}
                      onChange={(e) => {
                        const newHours = { ...formData.businessHours };
                        newHours[day].open = e.target.value;
                        setFormData({ ...formData, businessHours: newHours });
                      }}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={(e) => {
                        const newHours = { ...formData.businessHours };
                        newHours[day].close = e.target.value;
                        setFormData({ ...formData, businessHours: newHours });
                      }}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Setup</h2>
            <p className="text-gray-600">Set up your payment method for the {PACKAGES.find(p => p.id === selectedPackage)?.name} package.</p>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                For demonstration purposes, we're not collecting actual payment information. In a real implementation, this would connect to a payment processor.
              </p>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Selected Package: {PACKAGES.find(p => p.id === selectedPackage)?.name}</h3>
              <p className="mt-1 text-gray-600">
                ${PACKAGES.find(p => p.id === selectedPackage)?.price}/month
              </p>
            </div>
          </div>
        );
      
      case 5:
        return (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900">Registration Complete!</h2>
            <p className="text-gray-600">
              Thank you for registering with HVAC.app. Your business profile has been created.
            </p>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-700 font-medium">Your unique URL:</span>
              </div>
              <p className="mt-2 text-blue-600 font-mono">
                https://hvac.app/{formData.businessName.toLowerCase().replace(/\s+/g, '-')}
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Home
            </Link>
          </div>
          
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              {/* Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  {REGISTRATION_STEPS.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center">
                      <div 
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        <step.icon className="h-4 w-4" />
                      </div>
                      <span className="mt-2 text-xs font-medium text-gray-500">{step.title}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-2 relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-between">
                    {REGISTRATION_STEPS.map((_, index) => (
                      <div 
                        key={index} 
                        className={`w-2 h-2 rounded-full ${
                          index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Step Content */}
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              {currentStep < REGISTRATION_STEPS.length - 1 && (
                <div className="mt-8 flex justify-between">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    disabled={currentStep === 0}
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {currentStep === REGISTRATION_STEPS.length - 2 ? 'Complete' : 'Next'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 