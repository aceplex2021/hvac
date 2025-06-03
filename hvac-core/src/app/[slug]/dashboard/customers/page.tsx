'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';
import { CustomerManagementClient } from './CustomerManagementClient';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  last_service: string;
  total_services: number;
  status: string;
  city?: string;
  state?: string;
  zip_code?: string;
  country?: string;
  created_at?: string;
  updated_at?: string;
}

export default function CustomerManagementPage() {
  const params = useParams();
  const slug = params.slug;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      // 1. Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setCustomers([]);
        setError('Business not found.');
        setLoading(false);
        return;
      }
      // 2. Fetch customers for this business
      const { data: dbCustomers, error: custError } = await supabase
        .from('hvac_clients')
        .select('id, name, email, phone, address, city, state, zip_code, country, created_at, updated_at')
        .eq('business_id', business.id)
        .order('name', { ascending: true });
      if (custError || !dbCustomers) {
        setCustomers([]);
        setError('Failed to fetch customers.');
      } else {
        setCustomers(dbCustomers.map((c: any) => ({
          ...c,
          address: [c.address, c.city, c.state, c.zip_code, c.country].filter(Boolean).join(', '),
          last_service: c.updated_at || c.created_at,
          total_services: 0, // Placeholder
          status: 'Active', // Placeholder
        })));
      }
      setLoading(false);
    }
    if (slug) fetchCustomers();
  }, [slug]);

  const serviceHistory: any[] = [];
  const communications: any[] = [];

  if (loading) return <div>Loading customers...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <CustomerManagementClient
      initialCustomers={customers}
      initialServiceHistory={serviceHistory}
      initialCommunications={communications}
    />
  );
} 