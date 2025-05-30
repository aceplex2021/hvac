import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { withApiAuth } from '@/middleware/api-auth';

export const GET = withApiAuth(async (request: Request) => {
  try {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');
    const businessId = searchParams.get('businessId');
    const type = searchParams.get('type');
    
    if (!customerId || !businessId) {
      return NextResponse.json(
        { error: 'Customer ID and Business ID are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    let query = supabase
      .from('communications')
      .select(`
        *,
        customers:customer_id(name, email),
        businesses:business_id(name, email),
        documents:documents(
          id,
          name,
          type,
          url,
          created_at
        )
      `)
      .eq('customer_id', customerId)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    const { data: communications, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      success: true,
      communications
    });
  } catch (error) {
    console.error('Error fetching communications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch communications' },
      { status: 500 }
    );
  }
});

export const POST = withApiAuth(async (request: Request) => {
  try {
    const { customerId, businessId, type, content, attachments } = await request.json();
    
    if (!customerId || !businessId || !type || !content) {
      return NextResponse.json(
        { error: 'Customer ID, Business ID, type, and content are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Create communication
    const { data: communication, error: communicationError } = await supabase
      .from('communications')
      .insert([{
        customer_id: customerId,
        business_id: businessId,
        type,
        content,
        status: 'sent',
        created_at: new Date()
      }])
      .select()
      .single();

    if (communicationError) throw communicationError;

    // Handle attachments if present
    if (attachments && attachments.length > 0) {
      const { error: documentError } = await supabase
        .from('documents')
        .insert(
          attachments.map((attachment: any) => ({
            communication_id: communication.id,
            name: attachment.name,
            type: attachment.type,
            url: attachment.url,
            created_at: new Date()
          }))
        );

      if (documentError) throw documentError;
    }

    return NextResponse.json({
      success: true,
      communication
    });
  } catch (error) {
    console.error('Error creating communication:', error);
    return NextResponse.json(
      { error: 'Failed to create communication' },
      { status: 500 }
    );
  }
});

export const PUT = withApiAuth(async (request: Request) => {
  try {
    const { communicationId, updates } = await request.json();
    
    if (!communicationId || !updates) {
      return NextResponse.json(
        { error: 'Communication ID and updates are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Update communication
    const { data: communication, error } = await supabase
      .from('communications')
      .update({
        ...updates,
        updated_at: new Date()
      })
      .eq('id', communicationId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      communication
    });
  } catch (error) {
    console.error('Error updating communication:', error);
    return NextResponse.json(
      { error: 'Failed to update communication' },
      { status: 500 }
    );
  }
}); 