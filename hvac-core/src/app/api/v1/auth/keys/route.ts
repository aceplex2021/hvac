import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { businessId, name, permissions } = await request.json();
    
    if (!businessId || !name) {
      return NextResponse.json(
        { error: 'Business ID and key name are required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    // Generate API key
    const apiKey = crypto.randomBytes(32).toString('hex');
    const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

    // Create API key record
    const { data, error } = await supabase
      .from('api_keys')
      .insert([{
        business_id: businessId,
        name,
        key_hash: hashedKey,
        permissions: permissions || ['read'],
        is_active: true,
        last_used: null
      }])
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Return the unhashed key only once
    return NextResponse.json({
      ...data,
      key: apiKey,
      message: 'API key generated successfully. Please store it securely.'
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const businessId = searchParams.get('businessId');
    
    if (!businessId) {
      return NextResponse.json(
        { error: 'Business ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { data, error } = await supabase
      .from('api_keys')
      .select('*')
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    // Remove key hashes from response
    const sanitizedData = data.map(({ key_hash, ...rest }) => rest);

    return NextResponse.json(sanitizedData);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const keyId = searchParams.get('keyId');
    
    if (!keyId) {
      return NextResponse.json(
        { error: 'Key ID is required' },
        { status: 400 }
      );
    }

    const supabase = createRouteHandlerClient({ cookies });

    const { error } = await supabase
      .from('api_keys')
      .delete()
      .eq('id', keyId);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json(
      { error: 'Failed to delete API key' },
      { status: 500 }
    );
  }
} 