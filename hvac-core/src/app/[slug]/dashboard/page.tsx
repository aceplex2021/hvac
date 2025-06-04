'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Calendar, Users, DollarSign, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DashboardPage() {
  const params = useParams();
  const slug = params.slug;
  const [business, setBusiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    activeRequests: 0,
    pendingAppointments: 0,
    monthlyRevenue: 0,
    customerCount: 0,
  });
  const [revenueMonth, setRevenueMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    async function fetchBusiness() {
      setLoading(true);
      setError(null);
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const { data, error } = await supabase
          .from('hvac_businesses')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) {
          setError(error.message);
          setBusiness(null);
        } else {
          setBusiness(data);
        }
      } catch (e: any) {
        setError(e.message || 'Error loading business');
        setBusiness(null);
      }
      setLoading(false);
    }
    if (slug) fetchBusiness();
  }, [slug]);

  useEffect(() => {
    async function fetchStats(businessId: string) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        // Active Bookings (pending or confirmed)
        let activeRequests = 0;
        let pendingAppointments = 0;
        try {
          const { data, count } = await supabase
            .from('hvac_bookings')
            .select('id, status', { count: 'exact' })
            .eq('business_id', businessId);
          activeRequests = (data || []).filter((b: any) => ['pending', 'confirmed'].includes((b.status || '').toLowerCase())).length;
          pendingAppointments = (data || []).filter((b: any) => (b.status || '').toLowerCase() === 'pending').length;
        } catch {
          activeRequests = 0;
          pendingAppointments = 0;
        }
        // Revenue for selected month (match financials page logic)
        let monthlyRevenue = 0;
        try {
          const { data: invoices, error: invError } = await supabase
            .from('hvac_invoices')
            .select('*')
            .eq('business_id', businessId);
          if (invError || !invoices) {
            monthlyRevenue = 0;
          } else {
            const paidInvoices = invoices.filter((inv: any) => (inv.status || '').toLowerCase() === 'paid');
            const month = revenueMonth.getMonth();
            const year = revenueMonth.getFullYear();
            monthlyRevenue = paidInvoices.filter((inv: any) => {
              const d = new Date(inv.issue_date);
              return d.getMonth() === month && d.getFullYear() === year;
            }).reduce((sum: number, inv: any) => sum + (parseFloat(inv.total_amount) || 0), 0);
          }
        } catch {
          monthlyRevenue = 0;
        }
        // Customer Count
        let customerCount = 0;
        try {
          const { count } = await supabase
            .from('hvac_clients')
            .select('id', { count: 'exact' })
            .eq('business_id', businessId);
          customerCount = count || 0;
        } catch {
          customerCount = 0;
        }
        setStats({
          activeRequests,
          pendingAppointments,
          monthlyRevenue,
          customerCount,
        });
      } catch (e) {
        setStats({ activeRequests: 0, pendingAppointments: 0, monthlyRevenue: 0, customerCount: 0 });
      }
    }
    if (business && business.id) {
      fetchStats(business.id);
    }
  }, [business, revenueMonth]);

  return (
    <>
      {/* Business Profile Summary */}
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        {loading ? (
          <div className="text-gray-500">Loading business info...</div>
        ) : error ? (
          <div className="text-red-600">{error}</div>
        ) : business ? (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{business.name}</h2>
                <div className="mt-1 flex items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {business.package_tier}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {/* You can add subscription status if you have it */}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Your unique URL:</p>
                <a
                  href={`http://localhost:3000/${business.slug}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`http://localhost:3000/${business.slug}`}
                </a>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-gray-500">Business Hours</p>
                <p className="text-sm font-medium text-gray-900">
                  {/* Display business hours in a readable format */}
                  {business.is24_7
                    ? '24/7'
                    : business.business_hours
                      ? Object.entries(business.business_hours)
                          .map(([day, hours]: any) =>
                            hours.open && hours.close
                              ? `${day.charAt(0).toUpperCase() + day.slice(1)}: ${hours.open} - ${hours.close}`
                              : null
                          )
                          .filter(Boolean)
                          .join(', ')
                      : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Service Areas</p>
                <p className="text-sm font-medium text-gray-900">
                  {business.service_areas && business.service_areas.length > 0
                    ? business.service_areas.join(', ')
                    : 'N/A'}
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="text-gray-500">No business info found.</div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Service Requests
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.activeRequests}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Pending Appointments
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.pendingAppointments}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    <div className="flex items-center justify-center gap-2 w-full">
                      <button
                        type="button"
                        aria-label="Previous Month"
                        className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                        onClick={() => setRevenueMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <span className="text-center w-full truncate" style={{ minWidth: 0 }}>
                        {revenueMonth.toLocaleString('default', { month: 'long', year: 'numeric' })} Revenue
                      </span>
                      <button
                        type="button"
                        aria-label="Next Month"
                        className="p-1 rounded hover:bg-gray-100 flex-shrink-0"
                        onClick={() => setRevenueMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      ${stats.monthlyRevenue.toLocaleString()}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Customers
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stats.customerCount}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Schedule Service
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Add Customer
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Create Invoice
          </button>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            Dispatch Technician
          </button>
        </div>
      </div>
    </>
  );
} 