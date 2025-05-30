import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const date = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');
    
    if (!businessId || !date || !serviceId) {
      return NextResponse.json(
        { error: 'Business ID, date, and service ID are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get business hours
    const { data: businessHours, error: hoursError } = await supabase
      .from('business_hours')
      .select('*')
      .eq('business_id', businessId)
      .eq('day_of_week', new Date(date).getDay())
      .single();

    if (hoursError) {
      throw hoursError;
    }

    if (!businessHours) {
      return NextResponse.json(
        { error: 'Business is closed on this day' },
        { status: 400 }
      );
    }

    // Get existing bookings for the date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*')
      .eq('business_id', businessId)
      .eq('date', date);

    if (bookingsError) {
      throw bookingsError;
    }

    // Get service duration
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('duration')
      .eq('id', serviceId)
      .single();

    if (serviceError) {
      throw serviceError;
    }

    // Generate available time slots
    const availableSlots = generateAvailableSlots(
      businessHours,
      bookings,
      service.duration
    );

    return NextResponse.json({ availableSlots });
  } catch (error) {
    console.error('Error checking availability:', error);
    return NextResponse.json(
      { error: 'Failed to check availability' },
      { status: 500 }
    );
  }
}

function generateAvailableSlots(
  businessHours: any,
  bookings: any[],
  serviceDuration: number
) {
  const slots: string[] = [];
  const startTime = new Date(`1970-01-01T${businessHours.open_time}`);
  const endTime = new Date(`1970-01-01T${businessHours.close_time}`);
  const duration = serviceDuration * 60 * 1000; // Convert to milliseconds

  let currentTime = startTime;
  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + duration);
    if (slotEnd <= endTime) {
      const isBooked = bookings.some(booking => {
        const bookingStart = new Date(`1970-01-01T${booking.start_time}`);
        const bookingEnd = new Date(`1970-01-01T${booking.end_time}`);
        return (
          (currentTime >= bookingStart && currentTime < bookingEnd) ||
          (slotEnd > bookingStart && slotEnd <= bookingEnd)
        );
      });

      if (!isBooked) {
        slots.push(currentTime.toTimeString().slice(0, 5));
      }
    }
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000); // 30-minute intervals
  }

  return slots;
} 