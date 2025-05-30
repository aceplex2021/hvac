import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const POST = withApiAuth(async (request: Request) => {
  try {
    const { businessId, name, email, phone, address } = await request.json();
    
    if (!businessId || !name || !email || !phone) {
      return NextResponse.json(
        { error: 'Business ID, name, email, and phone are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id')
      .eq('email', email)
      .eq('business_id', businessId)
      .single();

    if (existingCustomer) {
      return NextResponse.json(
        { error: 'Customer already exists' },
        { status: 409 }
      );
    }

    // Create customer
    const { data: customer, error } = await supabase
      .from('customers')
      .insert([{
        business_id: businessId,
        name,
        email,
        phone,
        address,
        status: 'active',
        created_at: new Date()
      }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { error: 'Failed to create customer' },
      { status: 500 }
    );
  }
});

export const GET = withApiAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const customerId = searchParams.get('customerId');
    const email = searchParams.get('email');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('customers')
      .select(`
        *,
        bookings:bookings(
          id,
          service_id,
          date,
          start_time,
          status,
          services:service_id(name, price)
        )
      `)
      .eq('business_id', businessId);

    if (customerId) {
      query = query.eq('id', customerId);
    } else if (email) {
      query = query.eq('email', email);
    }

    const { data: customers, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      customers
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request) => {
  try {
    const { customerId, updates } = await request.json();
    
    if (!customerId || !updates) {
      return NextResponse.json(
        { error: 'Customer ID and updates are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Update customer
    const { data: customer, error } = await supabase
      .from('customers')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', customerId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      customer
    });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer' },
      { status: 500 }
    );
  }
}); 