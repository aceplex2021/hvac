import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import crypto from 'crypto';

export async function withApiAuth(handler: Function) {
  return async (request: Request) => {
    try {
      const apiKey = request.headers.get('x-api-key');
      
      if (!apiKey) {
        return NextResponse.json(
          { error: 'API key is required' },
          { status: 401 }
        );
      }

      const supabase = createRouteHandlerClient({ cookies });

      // Hash the provided API key
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

      // Find the API key record
      const { data: apiKeyRecord, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_hash', hashedKey)
        .eq('is_active', true)
        .single();

      if (error || !apiKeyRecord) {
        return NextResponse.json(
          { error: 'Invalid API key' },
          { status: 401 }
        );
      }

      // Update last used timestamp
      await supabase
        .from('api_keys')
        .update({ last_used: new Date().toISOString() })
        .eq('id', apiKeyRecord.id);

      // Check rate limits
      const { data: usage, error: usageError } = await supabase
        .from('api_usage')
        .select('*')
        .eq('key_id', apiKeyRecord.id)
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

      if (usageError) {
        throw usageError;
      }

      // Check if usage is within limits
      if (usage.length >= apiKeyRecord.rate_limit) {
        return NextResponse.json(
          { error: 'Rate limit exceeded' },
          { status: 429 }
        );
      }

      // Record the API call
      await supabase
        .from('api_usage')
        .insert([{
          key_id: apiKeyRecord.id,
          endpoint: request.url,
          method: request.method
        }]);

      // Add business ID and permissions to request
      const enhancedRequest = {
        ...request,
        businessId: apiKeyRecord.business_id,
        permissions: apiKeyRecord.permissions
      };

      return handler(enhancedRequest);
    } catch (error) {
      console.error('API authentication error:', error);
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: 500 }
      );
    }
  };
} 