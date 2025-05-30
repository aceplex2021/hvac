import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';
import { Resend } from 'resend';
import twilio from 'twilio';

const resend = new Resend(process.env.RESEND_API_KEY);
const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const POST = withApiAuth(async (request: Request) => {
  try {
    const { businessId, bookingId, type } = await request.json();
    
    if (!businessId || !bookingId || !type) {
      return NextResponse.json(
        { error: 'Business ID, booking ID, and notification type are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get booking details
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        services:service_id(name, price, duration),
        businesses:business_id(name, email, phone)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    // Get business notification settings
    const { data: settings, error: settingsError } = await supabase
      .from('notification_settings')
      .select('*')
      .eq('business_id', businessId)
      .single();

    if (settingsError) throw settingsError;

    let notificationResult;

    switch (type) {
      case 'email':
        if (settings.email_notifications) {
          notificationResult = await sendEmailNotification(booking);
        }
        break;

      case 'sms':
        if (settings.sms_notifications) {
          notificationResult = await sendSMSNotification(booking);
        }
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid notification type' },
          { status: 400 }
        );
    }

    // Record notification
    await supabase
      .from('notifications')
      .insert([{
        business_id: businessId,
        booking_id: bookingId,
        type,
        status: 'sent',
        recipient: type === 'email' ? booking.customer_email : booking.customer_phone
      }]);

    return NextResponse.json({
      success: true,
      notification: notificationResult
    });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json(
      { error: 'Failed to send notification' },
      { status: 500 }
    );
  }
});

async function sendEmailNotification(booking: any) {
  const { data, error } = await resend.emails.send({
    from: 'HVAC Booking <bookings@hvacapp.com>',
    to: [booking.customer_email, booking.businesses.email],
    subject: `Booking Confirmation - ${booking.services.name}`,
    html: `
      <h1>Booking Confirmation</h1>
      <p>Hello ${booking.customer_name},</p>
      <p>Your booking has been confirmed with ${booking.businesses.name}.</p>
      <h2>Booking Details:</h2>
      <ul>
        <li>Service: ${booking.services.name}</li>
        <li>Date: ${booking.date}</li>
        <li>Time: ${booking.start_time}</li>
        <li>Duration: ${booking.services.duration}</li>
        <li>Price: ${booking.services.price}</li>
      </ul>
      <p>Thank you for choosing our services!</p>
    `
  });

  if (error) throw error;
  return data;
}

async function sendSMSNotification(booking: any) {
  const message = await twilioClient.messages.create({
    body: `
      Booking Confirmation
      Service: ${booking.services.name}
      Date: ${booking.date}
      Time: ${booking.start_time}
      Thank you for choosing ${booking.businesses.name}!
    `,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: booking.customer_phone
  });

  return message;
} 