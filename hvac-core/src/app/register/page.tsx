'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Check, Package, Building, MapPin, Clock, CreditCard, Link as LinkIcon } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import React from 'react';

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

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function RegisterPage() {
  // const router = useRouter();
  // const searchParams = useSearchParams();
  const initialPackage = 'basic';
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPackage, setSelectedPackage] = useState(initialPackage);
  const [formData, setFormData] = useState<{
    businessName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    serviceAreas: any[];
    businessHours: { [key: string]: { open: string; close: string } };
    is24_7: boolean;
    paymentMethod: string;
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    taxRate: number;
    timezone: string;
  }>({
    businessName: '',
    email: '',
    password: '',
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
    is24_7: false,
    paymentMethod: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    taxRate: 8.25,
    timezone: 'UTC',
  });
  const [slug, setSlug] = useState('');

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

  const handlePackageSelect = (packageId: string) => {
    setSelectedPackage(packageId);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Generate slug from businessName
    const generatedSlug = formData.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(generatedSlug);
    const slug = generatedSlug;

    // Set defaults
    const timezone = formData.timezone || 'UTC';
    const payment_methods = formData.paymentMethod ? [formData.paymentMethod] : [];
    const service_areas = formData.serviceAreas && formData.serviceAreas.length > 0 ? formData.serviceAreas : [];
    const business_hours = formData.businessHours || {};
    const tax_rate = formData.taxRate !== undefined ? Number(formData.taxRate) : 8.25;

    // 1. Create user in Supabase Auth
    if (!formData.password || formData.password.length < 8) {
      alert('Password must be at least 8 characters.');
      return;
    }
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
    });
    if (signUpError) {
      alert('Error creating user: ' + signUpError.message);
      return;
    }
    const owner_id = signUpData?.user?.id;
    if (!owner_id) {
      alert('User creation failed.');
      return;
    }

    // Insert all registration info into hvac_businesses
    const { data, error } = await supabase
      .from('hvac_businesses')
      .insert([
        {
          name: formData.businessName,
          slug,
          logo_url: null,
          owner_id,
          contact_email: formData.email,
          contact_phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip,
          timezone,
          business_hours,
          is24_7: formData.is24_7,
          service_areas,
          payment_methods,
          tax_rate,
          package_tier: selectedPackage,
          // Do NOT store cardNumber, expiryDate, or cvv
        }
      ]);
    if (error) {
      alert('Error saving business: ' + error.message);
      return;
    }

    // Assign SP role via API
    try {
      const resp = await fetch('/api/v1/assign-sp-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: owner_id }),
      });
      const result = await resp.json();
      if (!result.success) {
        alert('Warning: User created, but failed to assign SP role. ' + (result.error || ''));
      }
    } catch (err) {
      alert('Warning: User created, but failed to assign SP role.');
    }

    // Move to the next step (complete)
    handleNext();
  };

  // Add a wrapper for handleSubmit to use as a MouseEvent handler
  const handleSubmitClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Create a fake FormEvent to call handleSubmit
    const form = e.currentTarget.closest('form');
    if (form) {
      const event = new Event('submit', { bubbles: true, cancelable: true });
      form.dispatchEvent(event);
    }
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
            <h2 className="text-2xl font-bold text-black">Business Details</h2>
            <p className="text-black">Tell us about your HVAC business.</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-black">
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-black">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 flex items-center">Password
                  <span className="ml-2 text-xs text-gray-500">(min 8 characters)</span>
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  minLength={8}
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-black">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-black">
                  Address
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-black">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-black">
                    State
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="zip" className="block text-sm font-medium text-black">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="taxRate" className="block text-sm font-medium text-black">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  id="taxRate"
                  name="taxRate"
                  value={formData.taxRate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  step="0.01"
                  min="0"
                  max="100"
                  required
                />
              </div>
              <div>
                <label htmlFor="timezone" className="block text-sm font-medium text-black">
                  Timezone
                </label>
                <select
                  id="timezone"
                  name="timezone"
                  value={formData.timezone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern (America/New_York)</option>
                  <option value="America/Chicago">Central (America/Chicago)</option>
                  <option value="America/Denver">Mountain (America/Denver)</option>
                  <option value="America/Phoenix">Arizona (America/Phoenix)</option>
                  <option value="America/Los_Angeles">Pacific (America/Los_Angeles)</option>
                  <option value="America/Anchorage">Alaska (America/Anchorage)</option>
                  <option value="America/Honolulu">Hawaii (America/Honolulu)</option>
                </select>
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
                For now, we&apos;ll use your business address as the center point. In the future, you&apos;ll be able to define specific service areas.
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
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="is24_7"
                name="is24_7"
                checked={formData.is24_7}
                onChange={e => {
                  const checked = e.target.checked;
                  setFormData(formData => {
                    const newHours = { ...formData.businessHours };
                    if (checked) {
                      Object.keys(newHours).forEach(day => {
                        newHours[day] = { open: '00:00', close: '23:59' };
                      });
                    }
                    return {
                      ...formData,
                      is24_7: checked,
                      businessHours: newHours,
                    };
                  });
                }}
                className="mr-2"
              />
              <label htmlFor="is24_7" className="text-black font-medium">24/7 Service</label>
            </div>
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
                      onChange={e => {
                        const newHours = { ...formData.businessHours };
                        newHours[day].open = e.target.value;
                        setFormData({ ...formData, businessHours: newHours });
                      }}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={formData.is24_7}
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="time"
                      value={hours.close}
                      onChange={e => {
                        const newHours = { ...formData.businessHours };
                        newHours[day].close = e.target.value;
                        setFormData({ ...formData, businessHours: newHours });
                      }}
                      className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      disabled={formData.is24_7}
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
                For demonstration purposes, we&apos;re not collecting actual payment information. In a real implementation, this would connect to a payment processor.
              </p>
            </div>
            <form className="space-y-4">
              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-black">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                  required
                >
                  <option value="">Select a payment method</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="ACH">ACH</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              {formData.paymentMethod === 'Credit Card' && (
                <>
                  <div>
                    <label htmlFor="cardNumber" className="block text-sm font-medium text-black">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={e => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, cardNumber: value });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                      maxLength={16}
                      minLength={16}
                      required
                      pattern="\d{16}"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiryDate" className="block text-sm font-medium text-black">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        id="expiryDate"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={e => {
                          // Only allow MM/YY format
                          let value = e.target.value.replace(/[^\d/]/g, '');
                          if (value.length === 2 && !value.includes('/')) value += '/';
                          setFormData({ ...formData, expiryDate: value });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        maxLength={5}
                        minLength={5}
                        required
                        pattern="(0[1-9]|1[0-2])\/\d{2}"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-medium text-black">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        name="cvv"
                        value={formData.cvv}
                        onChange={e => {
                          // Only allow numbers
                          const value = e.target.value.replace(/\D/g, '');
                          setFormData({ ...formData, cvv: value });
                        }}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black"
                        maxLength={4}
                        minLength={3}
                        required
                        pattern="\d{3,4}"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              )}
            </form>
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
            
            <div className="mt-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-md p-4 text-sm flex items-center justify-center">
              <span className="font-semibold mr-2">Next step:</span>
              Please check your email and click the verification link to activate your account before logging in.
            </div>
            
            <div className="mt-6 bg-blue-50 p-4 rounded-md">
              <div className="flex items-center">
                <LinkIcon className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-blue-700 font-medium">Your unique URL:</span>
              </div>
              <p className="mt-2 text-blue-600 font-mono">
                https://hvac.app/{slug}
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                href={`/${slug}/dashboard`}
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
                  {currentStep === REGISTRATION_STEPS.length - 2 ? (
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Complete
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Next
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 