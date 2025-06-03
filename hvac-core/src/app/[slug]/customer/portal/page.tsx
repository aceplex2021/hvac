'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookingHistory } from '@/components/customer/BookingHistory';
import { ServiceTracking } from '@/components/customer/ServiceTracking';
import { CommunicationHub } from '@/components/customer/CommunicationHub';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Calendar, 
  MessageSquare, 
  Settings, 
  User, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Home,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/${slug}`);
    }
  }, [user, loading, router, slug]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${slug}`); // Redirect to SP landing page
  };

  // Mock data for dashboard overview
  const dashboardStats = {
    upcomingBookings: 2,
    activeServices: 1,
    unreadMessages: 3,
    totalSpent: 1250
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">Customer Portal</h1>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'bookings' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar className="w-5 h-5 mr-3" />
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'tracking' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Clock className="w-5 h-5 mr-3" />
              Service Tracking
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'messages' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5 mr-3" />
              Messages
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-2 rounded-lg ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <User className="w-5 h-5 mr-3" />
              Profile
            </button>
            <div className="pt-4 mt-4 border-t">
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Logout
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Upcoming Bookings</p>
                    <p className="text-2xl font-semibold">{dashboardStats.upcomingBookings}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Active Services</p>
                    <p className="text-2xl font-semibold">{dashboardStats.activeServices}</p>
                  </div>
                  <Clock className="w-8 h-8 text-green-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Unread Messages</p>
                    <p className="text-2xl font-semibold">{dashboardStats.unreadMessages}</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total Spent</p>
                    <p className="text-2xl font-semibold">${dashboardStats.totalSpent}</p>
                  </div>
                  <CheckCircle2 className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book New Service
                </button>
                <button className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Contact Support
                </button>
                <button className="flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50">
                  <Settings className="w-5 h-5 mr-2" />
                  Update Profile
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mr-3" />
                  <div>
                    <p className="font-medium">Service Completed</p>
                    <p className="text-sm text-gray-500">AC Maintenance - Yesterday</p>
                  </div>
                </div>
                <div className="flex items-center p-4 border rounded-lg">
                  <AlertCircle className="w-5 h-5 text-yellow-500 mr-3" />
                  <div>
                    <p className="font-medium">Upcoming Service</p>
                    <p className="text-sm text-gray-500">HVAC Inspection - Tomorrow</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">My Bookings</h2>
          <BookingHistory />
          </div>
        )}
        
        {activeTab === 'tracking' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Service Tracking</h2>
          <ServiceTracking />
          </div>
        )}
        
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <CommunicationHub />
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Your phone number"
                  />
                </div>
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 