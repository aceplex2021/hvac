import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const GET = withApiAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get('bookingId');
    const customerId = searchParams.get('customerId');
    
    if (!bookingId && !customerId) {
      return NextResponse.json(
        { error: 'Either booking ID or customer ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('service_tracking')
      .select(`
        *,
        bookings:booking_id(
          id,
          date,
          start_time,
          end_time,
          status,
          services:service_id(name, description),
          technicians:technician_id(name, phone)
        )
      `);

    if (bookingId) {
      query = query.eq('booking_id', bookingId);
    } else if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data: tracking, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tracking
    });
  } catch (error) {
    console.error('Error fetching service tracking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service tracking' },
      { status: 500 }
    );
  }
});

export const POST = withApiAuth(async (request: Request) => {
  try {
    const { bookingId, status, progress, notes, photos } = await request.json();
    
    if (!bookingId || !status) {
      return NextResponse.json(
        { error: 'Booking ID and status are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Create tracking update
    const { data: tracking, error: trackingError } = await supabase
      .from('service_tracking')
      .insert([{
        booking_id: bookingId,
        status,
        progress,
        notes,
        photos,
        updated_at: new Date()
      }])
      .select()
      .single();

    if (trackingError) throw trackingError;

    // Update booking status if service is completed
    if (status === 'completed') {
      const { error: bookingError } = await supabase
        .from('bookings')
        .update({ status: 'completed' })
        .eq('id', bookingId);

      if (bookingError) throw bookingError;
    }

    return NextResponse.json({
      success: true,
      tracking
    });
  } catch (error) {
    console.error('Error creating service tracking update:', error);
    return NextResponse.json(
      { error: 'Failed to create service tracking update' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request) => {
  try {
    const { trackingId, updates } = await request.json();
    
    if (!trackingId || !updates) {
      return NextResponse.json(
        { error: 'Tracking ID and updates are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Update tracking
    const { data: tracking, error } = await supabase
      .from('service_tracking')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', trackingId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      tracking
    });
  } catch (error) {
    console.error('Error updating service tracking:', error);
    return NextResponse.json(
      { error: 'Failed to update service tracking' },
      { status: 500 }
    );
  }
}); 