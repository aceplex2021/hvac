'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, DollarSign, MapPin } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Booking {
  id: string;
  date: string;
  start_time: string;
  status: string;
  services: {
    name: string;
    price: number;
  };
  businesses: {
    name: string;
    address: string;
  };
  invoices?: {
    invoice_number: string;
    amount: number;
    status: string;
    paid_at: string;
  };
}

export function BookingHistory() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchBookings();
  }, [statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      let query = supabase
        .from('bookings')
        .select(`
          *,
          services:service_id(name, price),
          businesses:business_id(name, address),
          invoices:invoices(
            invoice_number,
            amount,
            status,
            paid_at
          )
        `)
        .eq('customer_id', session.user.id)
        .order('date', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (dateFilter) {
        query = query.gte('date', dateFilter);
      }

      const { data, error } = await query;

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Booking History</h2>
        <div className="flex gap-2">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 border rounded-md"
            placeholder="Filter by date"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {bookings.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No bookings found
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{booking.services.name}</h3>
                  <p className="text-gray-600">{booking.businesses.name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                  booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {booking.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(booking.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(booking.start_time), 'hh:mm a')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span>${booking.services.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{booking.businesses.address}</span>
                </div>
              </div>

              {booking.invoices && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Invoice Details</h4>
                  <div className="flex justify-between items-center">
                    <span>Invoice #{booking.invoices.invoice_number}</span>
                    <span className={`${
                      booking.invoices.status === 'paid' ? 'text-green-600' :
                      booking.invoices.status === 'pending' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {booking.invoices.status}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 