'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Users, 
  DollarSign, 
  Settings, 
  Users2, 
  Package, 
  BarChart2,
  // Bell,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: Home, href: '/dashboard' },
  { name: 'Service Management', icon: Calendar, href: '/dashboard/services' },
  { name: 'Customer Management', icon: Users, href: '/dashboard/customers' },
  { name: 'Financials', icon: DollarSign, href: '/dashboard/financials' },
  { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
];

const GOLD_NAV_ITEMS = [
  { name: 'Team', icon: Users2, href: '/dashboard/team' },
  { name: 'Inventory', icon: Package, href: '/dashboard/inventory' },
  { name: 'Reports', icon: BarChart2, href: '/dashboard/reports' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const router = useRouter();
  const params = useParams();
  const slug = params.slug;

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar for desktop, overlay for mobile */}
        {/* Hamburger button for mobile */}
        <div className="md:hidden fixed top-0 left-0 z-40 w-full flex items-center bg-white shadow-sm h-16 px-4">
          <h1 className="text-xl font-bold text-gray-900 flex-1">HVAC.app</h1>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-gray-700 focus:outline-none">
            <Menu className="h-6 w-6" />
          </button>
        </div>
        {/* Sidebar overlay for mobile */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex">
            <div className="w-64 bg-white shadow-lg h-full flex flex-col">
              <div className="flex items-center justify-between px-4 py-4 border-b">
                <h1 className="text-xl font-bold text-gray-900">HVAC.app</h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-700 focus:outline-none">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="flex-1 px-2 py-4 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${slug}${item.href}`}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === item.name.toLowerCase()
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveSection(item.name.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        activeSection === item.name.toLowerCase()
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
                <div className="pt-4">
                  <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gold Features
                  </div>
                </div>
                {GOLD_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${slug}${item.href}`}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === item.name.toLowerCase()
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => {
                      setActiveSection(item.name.toLowerCase());
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        activeSection === item.name.toLowerCase()
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {item.name}
                  </Link>
                ))}
              </nav>
              <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
                <button
                  onClick={handleLogout}
                  className="flex-shrink-0 w-full group"
                >
                  <div className="flex items-center">
                    <LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Logout
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            <div className="flex-1" onClick={() => setIsMobileMenuOpen(false)} />
          </div>
        )}
        {/* Sidebar for desktop */}
        <div className="hidden md:flex">
          <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-sm transition-all duration-300 min-h-screen flex flex-col`}>
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4 mb-5">
                <h1 className="text-xl font-bold text-gray-900">HVAC.app</h1>
              </div>
              <nav className="flex-1 px-2 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${slug}${item.href}`}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === item.name.toLowerCase()
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveSection(item.name.toLowerCase())}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        activeSection === item.name.toLowerCase()
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {isSidebarOpen && item.name}
                  </Link>
                ))}
                <div className="pt-4">
                  <div className="px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gold Features
                  </div>
                </div>
                {GOLD_NAV_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${slug}${item.href}`}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      activeSection === item.name.toLowerCase()
                        ? 'bg-blue-100 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setActiveSection(item.name.toLowerCase())}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 ${
                        activeSection === item.name.toLowerCase()
                          ? 'text-blue-600'
                          : 'text-gray-400 group-hover:text-gray-500'
                      }`}
                    />
                    {isSidebarOpen && item.name}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <button
                onClick={handleLogout}
                className="flex-shrink-0 w-full group"
              >
                <div className="flex items-center">
                  <LogOut className="h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                  {isSidebarOpen && (
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        Logout
                      </p>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1">
          <main className="py-6">
            <div className="w-full px-2 sm:px-4 md:max-w-7xl md:mx-auto md:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
} 