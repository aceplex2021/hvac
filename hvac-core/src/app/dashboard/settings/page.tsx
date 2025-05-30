'use client';

import { useState } from 'react';
import { 
  Building2,
  Wrench,
  Bell,
  Shield,
  Save,
  Plus,
  Trash2,
  Edit2,
  Clock,
  MapPin,
  Phone,
  Mail,
  Globe,
  CreditCard,
  Users,
  Key
} from 'lucide-react';

// Mock data for demonstration
const mockBusinessProfile = {
  name: 'AC Pro Services',
  address: '123 Main St, City, State 12345',
  phone: '(555) 123-4567',
  email: 'contact@acproservices.com',
  website: 'www.acproservices.com',
  businessHours: {
    monday: '8:00 AM - 5:00 PM',
    tuesday: '8:00 AM - 5:00 PM',
    wednesday: '8:00 AM - 5:00 PM',
    thursday: '8:00 AM - 5:00 PM',
    friday: '8:00 AM - 5:00 PM',
    saturday: 'Closed',
    sunday: 'Closed'
  },
  serviceArea: '50 miles radius',
  paymentMethods: ['Credit Card', 'Cash', 'Check']
};

const mockServiceConfig = {
  defaultServiceDuration: '1 hour',
  bufferTime: '15 minutes',
  maxDailyAppointments: 8,
  cancellationPolicy: '24 hours notice required',
  serviceTypes: [
    { id: 1, name: 'AC Repair', duration: '1-2 hours', price: '$99' },
    { id: 2, name: 'Maintenance', duration: '1 hour', price: '$79' },
    { id: 3, name: 'Installation', duration: '4-6 hours', price: 'Varies' }
  ]
};

const mockNotificationSettings = {
  emailNotifications: {
    newBooking: true,
    cancellation: true,
    paymentReceived: true,
    serviceReminder: true
  },
  smsNotifications: {
    newBooking: true,
    cancellation: true,
    serviceReminder: true
  },
  pushNotifications: {
    newBooking: true,
    cancellation: true,
    paymentReceived: true
  }
};

const mockSecuritySettings = {
  twoFactorAuth: true,
  sessionTimeout: '30 minutes',
  passwordPolicy: {
    minLength: 8,
    requireNumbers: true,
    requireSpecialChars: true,
    expireAfter: '90 days'
  },
  teamAccess: [
    { id: 1, name: 'John Smith', role: 'Admin', lastActive: '2 hours ago' },
    { id: 2, name: 'Sarah Johnson', role: 'Technician', lastActive: '1 day ago' }
  ]
};

const TABS = [
  { id: 'profile', name: 'Business Profile', icon: Building2 },
  { id: 'service', name: 'Service Configuration', icon: Wrench },
  { id: 'notifications', name: 'Notifications', icon: Bell },
  { id: 'security', name: 'Security', icon: Shield }
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);

  const renderBusinessProfile = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Business Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="flex items-center">
              <Building2 className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Business Information</h3>
                <p className="mt-1 text-sm text-gray-500">Update your business details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="business-name" className="block text-sm font-medium text-gray-700">
                  Business Name
                </label>
                <input
                  type="text"
                  name="business-name"
                  id="business-name"
                  defaultValue={mockBusinessProfile.name}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  defaultValue={mockBusinessProfile.address}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  defaultValue={mockBusinessProfile.phone}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  defaultValue={mockBusinessProfile.email}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                  Website
                </label>
                <input
                  type="url"
                  name="website"
                  id="website"
                  defaultValue={mockBusinessProfile.website}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="service-area" className="block text-sm font-medium text-gray-700">
                  Service Area
                </label>
                <input
                  type="text"
                  name="service-area"
                  id="service-area"
                  defaultValue={mockBusinessProfile.serviceArea}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Business Hours</h3>
              <div className="space-y-4">
                {Object.entries(mockBusinessProfile.businessHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                    <input
                      type="text"
                      defaultValue={hours}
                      disabled={!isEditing}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-48 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Methods</h3>
              <div className="space-y-4">
                {mockBusinessProfile.paymentMethods.map((method) => (
                  <div key={method} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{method}</span>
                    {isEditing && (
                      <button className="text-red-600 hover:text-red-800">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Method
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderServiceConfig = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Service Configuration</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Configuration
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="default-duration" className="block text-sm font-medium text-gray-700">
                  Default Service Duration
                </label>
                <input
                  type="text"
                  name="default-duration"
                  id="default-duration"
                  defaultValue={mockServiceConfig.defaultServiceDuration}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="buffer-time" className="block text-sm font-medium text-gray-700">
                  Buffer Time Between Appointments
                </label>
                <input
                  type="text"
                  name="buffer-time"
                  id="buffer-time"
                  defaultValue={mockServiceConfig.bufferTime}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="max-appointments" className="block text-sm font-medium text-gray-700">
                  Maximum Daily Appointments
                </label>
                <input
                  type="number"
                  name="max-appointments"
                  id="max-appointments"
                  defaultValue={mockServiceConfig.maxDailyAppointments}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="cancellation-policy" className="block text-sm font-medium text-gray-700">
                  Cancellation Policy
                </label>
                <input
                  type="text"
                  name="cancellation-policy"
                  id="cancellation-policy"
                  defaultValue={mockServiceConfig.cancellationPolicy}
                  disabled={!isEditing}
                  className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Service Types</h3>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Service Type
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {mockServiceConfig.serviceTypes.map((service) => (
                  <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                      <p className="text-sm text-gray-500">
                        Duration: {service.duration} • Price: {service.price}
                      </p>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Settings
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
              <div className="space-y-4">
                {Object.entries(mockNotificationSettings.emailNotifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        disabled={!isEditing}
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">SMS Notifications</h3>
              <div className="space-y-4">
                {Object.entries(mockNotificationSettings.smsNotifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        disabled={!isEditing}
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
              <div className="space-y-4">
                {Object.entries(mockNotificationSettings.pushNotifications).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {type.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={enabled}
                        disabled={!isEditing}
                        onChange={() => {}}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {isEditing ? (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          ) : (
            <>
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Settings
            </>
          )}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={mockSecuritySettings.twoFactorAuth}
                    disabled={!isEditing}
                    onChange={() => {}}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Session Timeout</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Automatically log out after period of inactivity
                  </p>
                </div>
                <select
                  disabled={!isEditing}
                  className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  defaultValue={mockSecuritySettings.sessionTimeout}
                >
                  <option>15 minutes</option>
                  <option>30 minutes</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Password Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Minimum Length</span>
                  <input
                    type="number"
                    className="mt-1 block w-20 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue={mockSecuritySettings.passwordPolicy.minLength}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Require Numbers</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={mockSecuritySettings.passwordPolicy.requireNumbers}
                      disabled={!isEditing}
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Require Special Characters</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={mockSecuritySettings.passwordPolicy.requireSpecialChars}
                      disabled={!isEditing}
                      onChange={() => {}}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Password Expiration</span>
                  <select
                    disabled={!isEditing}
                    className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                    defaultValue={mockSecuritySettings.passwordPolicy.expireAfter}
                  >
                    <option>30 days</option>
                    <option>60 days</option>
                    <option>90 days</option>
                    <option>Never</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Team Access</h3>
                {isEditing && (
                  <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Team Member
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {mockSecuritySettings.teamAccess.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{member.name}</h4>
                      <p className="text-sm text-gray-500">
                        {member.role} • Last active: {member.lastActive}
                      </p>
                    </div>
                    {isEditing && (
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
          {activeTab === 'profile' && renderBusinessProfile()}
          {activeTab === 'service' && renderServiceConfig()}
          {activeTab === 'notifications' && renderNotificationSettings()}
          {activeTab === 'security' && renderSecuritySettings()}
        </div>
      </div>
    </div>
  );
} 