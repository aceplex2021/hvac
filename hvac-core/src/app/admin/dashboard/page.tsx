"use client";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading) {
      const isAdmin = user && (user.app_metadata?.role === 'admin' || user.email === 'admin@4voice.ai');
      if (!isAdmin) {
        router.replace('/');
      }
    }
  }, [user, loading, router]);
  if (loading || !user) return <div className="p-8">Loading...</div>;
  const isAdmin = user && (user.app_metadata?.role === 'admin' || user.email === 'admin@4voice.ai');
  if (!isAdmin) return null;
  return <>{children}</>;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function AdminDashboardPageContent() {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBusinesses() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('hvac_businesses')
        .select('id, name, contact_email, contact_phone, package_tier, tax_rate');
      if (error) {
        setError(error.message);
        setBusinesses([]);
      } else {
        setBusinesses(data || []);
      }
      setLoading(false);
    }
    fetchBusinesses();
  }, []);

  if (loading) {
    return <div className="p-8">Loading businesses...</div>;
  }
  if (error) {
    return <div className="p-8 text-red-600">Error loading businesses: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Platform Admin: Service Providers & Billings</h1>
          <p className="mt-2 text-lg text-gray-500">View all registered service providers and their billing status.</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Email</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Phone</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package Tier</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tax Rate</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {businesses && businesses.length > 0 ? (
                businesses.map((biz: any) => (
                  <tr key={biz.id}>
                    <td className="px-4 py-3 text-gray-900 font-medium">{biz.name}</td>
                    <td className="px-4 py-3">{biz.contact_email}</td>
                    <td className="px-4 py-3">{biz.contact_phone}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {biz.package_tier}
                      </span>
                    </td>
                    <td className="px-4 py-3">{biz.tax_rate}</td>
                    <td className="px-4 py-3 text-gray-500">(billing info)</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">No service providers found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminRoute>
      <AdminDashboardPageContent />
    </AdminRoute>
  );
} 