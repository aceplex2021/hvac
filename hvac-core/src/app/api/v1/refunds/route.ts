import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const GET = withApiAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    const status = searchParams.get('status');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('refunds')
      .select(`
        *,
        invoices:invoice_id(
          invoice_number,
          amount,
          customer_details,
          business_details
        )
      `)
      .eq('business_id', businessId);

    if (status) {
      query = query.eq('status', status);
    }

    const { data: refunds, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      refunds
    });
  } catch (error) {
    console.error('Error fetching refunds:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refunds' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request) => {
  try {
    const { refundId, status, notes } = await request.json();
    
    if (!refundId || !status) {
      return NextResponse.json(
        { error: 'Refund ID and status are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Update refund status
    const { data: refund, error: refundError } = await supabase
      .from('refunds')
      .update({
        status,
        notes,
        processed_at: status === 'completed' ? new Date() : null
      })
      .eq('id', refundId)
      .select()
      .single();

    if (refundError) throw refundError;

    // If refund is completed, update invoice status
    if (status === 'completed') {
      const { error: invoiceError } = await supabase
        .from('invoices')
        .update({ status: 'refunded' })
        .eq('id', refund.invoice_id);

      if (invoiceError) throw invoiceError;
    }

    return NextResponse.json({
      success: true,
      refund
    });
  } catch (error) {
    console.error('Error updating refund:', error);
    return NextResponse.json(
      { error: 'Failed to update refund' },
      { status: 500 }
    );
  }
}); 