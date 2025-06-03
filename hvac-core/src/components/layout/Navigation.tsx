"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  User,
  Bell,
  LogIn
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { AuthForm } from '@/components/auth/AuthForm';

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  const [showLoginModal, setShowLoginModal] = useState(false);

  // Close login modal when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      setShowLoginModal(false);
    }
  }, [isAuthenticated]);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    // For now, just redirect to home page
    router.push('/');
  };

  return (
    <>
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href={isAuthenticated ? '/dashboard' : '/'} className="text-xl font-bold text-blue-600">
                  HVAC.app
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              {pathname === '/' ? (
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                  >
                    Login
                  </button>
                  <Link
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Get Started
                  </Link>
                </div>
              ) : isAuthenticated && !pathname.includes('/customer/portal') ? (
                <div className="ml-3 relative">
                  <div className="flex items-center">
                    <button
                      onClick={handleLogout}
                      className="text-gray-500 hover:text-gray-700 flex items-center"
                    >
                      <LogOut className="h-5 w-5 mr-1" />
                      Logout
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-4 relative w-full max-w-md mx-auto flex flex-col items-center" style={{ maxHeight: '90vh' }}>
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-2xl font-bold"
              aria-label="Close login modal"
            >
              ×
            </button>
            <div className="w-full">
              <AuthForm compact onLoginSuccess={() => setShowLoginModal(false)} />
            </div>
          </div>
        </div>
      )}
    </>
  );
} 