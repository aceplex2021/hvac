'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Clock4 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

interface Service {
  id: string;
  status: string;
  notes?: string;
  photos?: string[];
  bookings: {
    date: string;
    start_time: string;
    services: {
      name: string;
    };
    businesses: {
      name: string;
      address: string;
    };
  };
}

export function ServiceTracking() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data, error } = await supabase
        .from('service_tracking')
        .select(`
          *,
          bookings:booking_id(
            date,
            start_time,
            services:service_id(name),
            businesses:business_id(name, address)
          )
        `)
        .eq('customer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'in_progress':
        return <Clock4 className="w-5 h-5 text-blue-500" />;
      case 'scheduled':
        return <Calendar className="w-5 h-5 text-yellow-500" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h2 className="text-2xl font-semibold">Service Tracking</h2>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No active services
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service.id}
              className="p-6 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{service.bookings.services.name}</h3>
                  <p className="text-gray-600">{service.bookings.businesses.name}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(service.status)}
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(service.status)}`}>
                    {service.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(service.bookings.date), 'MMM dd, yyyy')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span>{format(new Date(service.bookings.start_time), 'hh:mm a')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{service.bookings.businesses.address}</span>
                </div>
              </div>

              {service.notes && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Service Notes</h4>
                  <p className="text-gray-600">{service.notes}</p>
                </div>
              )}

              {service.photos && service.photos.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Service Photos</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {service.photos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Service photo ${index + 1}`}
                        className="w-full h-24 object-cover rounded-md"
                      />
                    ))}
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