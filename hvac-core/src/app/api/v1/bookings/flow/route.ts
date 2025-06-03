import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

const handler = async (request: Request) => {
  try {
    const { businessId, step, data } = await request.json();
    
    if (!businessId || !step || !data) {
      return NextResponse.json(
        { error: 'Business ID, step, and data are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Handle different booking steps
    switch (step) {
      case 'init':
        // Initialize booking session
        const { data: session, error: sessionError } = await supabase
          .from('booking_sessions')
          .insert([{
            business_id: businessId,
            status: 'in_progress',
            step: 'service_selection',
            data: { service: null, date: null, time: null, customer: null }
          }])
          .select()
          .single();

        if (sessionError) throw sessionError;
        return NextResponse.json(session);

      case 'service':
        // Update service selection
        const { data: serviceUpdate, error: serviceError } = await supabase
          .from('booking_sessions')
          .update({
            step: 'date_selection',
            data: { ...data, service: data.service }
          })
          .eq('id', data.sessionId)
          .select()
          .single();

        if (serviceError) throw serviceError;
        return NextResponse.json(serviceUpdate);

      case 'date':
        // Update date selection
        const { data: dateUpdate, error: dateError } = await supabase
          .from('booking_sessions')
          .update({
            step: 'time_selection',
            data: { ...data, date: data.date }
          })
          .eq('id', data.sessionId)
          .select()
          .single();

        if (dateError) throw dateError;
        return NextResponse.json(dateUpdate);

      case 'time':
        // Update time selection
        const { data: timeUpdate, error: timeError } = await supabase
          .from('booking_sessions')
          .update({
            step: 'customer_info',
            data: { ...data, time: data.time }
          })
          .eq('id', data.sessionId)
          .select()
          .single();

        if (timeError) throw timeError;
        return NextResponse.json(timeUpdate);

      case 'customer':
        // Update customer information and complete booking
        const { data: customerUpdate, error: customerError } = await supabase
          .from('booking_sessions')
          .update({
            step: 'confirmation',
            data: { ...data, customer: data.customer }
          })
          .eq('id', data.sessionId)
          .select()
          .single();

        if (customerError) throw customerError;

        // Create the actual booking
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert([{
            business_id: businessId,
            service_id: data.service.id,
            date: data.date,
            start_time: data.time,
            customer_name: data.customer.name,
            customer_email: data.customer.email,
            customer_phone: data.customer.phone,
            status: 'confirmed'
          }])
          .select()
          .single();

        if (bookingError) throw bookingError;

        // TODO: Send confirmation emails
        // TODO: Send SMS notifications
        // TODO: Update calendar

        return NextResponse.json({
          session: customerUpdate,
          booking,
          message: 'Booking completed successfully'
        });

      default:
        return NextResponse.json(
          { error: 'Invalid booking step' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in booking flow:', error);
    return NextResponse.json(
      { error: 'Failed to process booking step' },
      { status: 500 }
    );
  }
};

export const POST = withApiAuth(handler); 