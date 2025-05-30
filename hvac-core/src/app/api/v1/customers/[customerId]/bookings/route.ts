import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const GET = withApiAuth(async (request: Request, { params }: { params: { customerId: string } }) => {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('bookings')
      .select(`
        *,
        services:service_id(name, price, duration),
        businesses:business_id(name, email, phone),
        invoices:invoices(
          invoice_number,
          amount,
          status,
          paid_at
        )
      `)
      .eq('customer_id', params.customerId)
      .order('date', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    if (startDate && endDate) {
      query = query
        .gte('date', startDate)
        .lte('date', endDate);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer bookings' },
      { status: 500 }
    );
  }
});

export const POST = withApiAuth(async (request: Request, { params }: { params: { customerId: string } }) => {
  try {
    const { serviceId, date, startTime, notes } = await request.json();
    
    if (!serviceId || !date || !startTime) {
      return NextResponse.json(
        { error: 'Service ID, date, and start time are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get service details
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError) throw serviceError;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([{
        customer_id: params.customerId,
        service_id: serviceId,
        date,
        start_time: startTime,
        end_time: new Date(new Date(startTime).getTime() + service.duration * 60 * 1000),
        status: 'pending',
        notes,
        created_at: new Date()
      }])
      .select()
      .single();

    if (bookingError) throw bookingError;

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request, { params }: { params: { customerId: string } }) => {
  try {
    const { bookingId, updates } = await request.json();
    
    if (!bookingId || !updates) {
      return NextResponse.json(
        { error: 'Booking ID and updates are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Update booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', bookingId)
      .eq('customer_id', params.customerId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}); 