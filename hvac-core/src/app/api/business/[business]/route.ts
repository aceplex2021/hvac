import { NextResponse } from 'next/server';

// Mock database - will be replaced with actual database

type Business = {
  id: string;
  name: string;
  logo: string;
  tagline: string;
  services: { id: number; name: string; price: string; duration: string }[];
  contact: { phone: string; email: string; address: string; hours: string };
  reviews: { id: number; rating: number; comment: string; author: string }[];
};

const mockBusinesses: Record<string, Business> = {
  'acme-hvac': {
    id: 'acme-hvac',
    name: 'ACME HVAC Services',
    logo: '/images/logo-placeholder.png',
    tagline: 'Your Trusted HVAC Experts',
    services: [
      { id: 1, name: 'AC Installation', price: 'Starting at $2,500', duration: '4-6 hours' },
      { id: 2, name: 'AC Repair', price: 'Starting at $99', duration: '1-2 hours' },
      { id: 3, name: 'Maintenance', price: 'Starting at $79', duration: '1 hour' },
    ],
    contact: {
      phone: '(555) 123-4567',
      email: 'contact@acmehvac.com',
      address: '123 Main St, Anytown, USA',
      hours: 'Mon-Fri: 8am-6pm, Sat: 9am-2pm',
    },
    reviews: [
      { id: 1, rating: 5, comment: 'Great service!', author: 'John D.' },
      { id: 2, rating: 5, comment: 'Professional and efficient', author: 'Sarah M.' },
    ],
  },
};

export async function GET(
  request: Request,
  context: { params: Promise<{ business: string }> }
) {
  const params = await context.params;
  const business = mockBusinesses[params.business];

  if (!business) {
    return NextResponse.json(
      { error: 'Business not found' },
      { status: 404 }
    );
  }

  return NextResponse.json(business);
} 