import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const POST = withApiAuth(async (request: Request) => {
  try {
    const { businessId, bookingId, type } = await request.json();
    
    if (!businessId || !bookingId) {
      return NextResponse.json(
        { error: 'Business ID and booking ID are required' },
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
        businesses:business_id(name, email, phone, address),
        customers:customer_id(name, email, phone)
      `)
      .eq('id', bookingId)
      .single();

    if (bookingError) throw bookingError;

    // Generate invoice number
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Create invoice
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .insert([{
        business_id: businessId,
        booking_id: bookingId,
        invoice_number: invoiceNumber,
        amount: booking.services.price,
        status: 'pending',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        items: [{
          description: booking.services.name,
          quantity: 1,
          unit_price: booking.services.price,
          total: booking.services.price
        }],
        customer_details: {
          name: booking.customers.name,
          email: booking.customers.email,
          phone: booking.customers.phone
        },
        business_details: {
          name: booking.businesses.name,
          email: booking.businesses.email,
          phone: booking.businesses.phone,
          address: booking.businesses.address
        }
      }])
      .select()
      .single();

    if (invoiceError) throw invoiceError;

    return NextResponse.json({
      success: true,
      invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to create invoice' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request) => {
  try {
    const { invoiceId, action, amount, reason } = await request.json();
    
    if (!invoiceId || !action) {
      return NextResponse.json(
        { error: 'Invoice ID and action are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Get invoice details
    const { data: invoice, error: invoiceError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId)
      .single();

    if (invoiceError) throw invoiceError;

    let updateData: any = {};
    let refundData: any = null;

    switch (action) {
      case 'mark_paid':
        updateData = { status: 'paid', paid_at: new Date() };
        break;

      case 'issue_refund':
        if (!amount || !reason) {
          return NextResponse.json(
            { error: 'Amount and reason are required for refunds' },
            { status: 400 }
          );
        }
        updateData = { status: 'refunded' };
        refundData = {
          invoice_id: invoiceId,
          amount,
          reason,
          status: 'pending',
          processed_at: new Date()
        };
        break;

      case 'cancel':
        updateData = { status: 'cancelled' };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    // Update invoice
    const { data: updatedInvoice, error: updateError } = await supabase
      .from('invoices')
      .update(updateData)
      .eq('id', invoiceId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Create refund record if applicable
    if (refundData) {
      const { error: refundError } = await supabase
        .from('refunds')
        .insert([refundData]);

      if (refundError) throw refundError;
    }

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to update invoice' },
      { status: 500 }
    );
  }
}); 