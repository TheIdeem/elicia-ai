import { NextRequest, NextResponse } from 'next/server';
import Retell from 'retell-sdk';
import { getCallById, createCall, updateCall } from '../../services/supabaseCallService';

// Helper function to verify webhook signature
const verifyRetellSignature = (
  payload: string,
  signature: string | null
): boolean => {
  if (!signature) {
    console.warn('Missing Retell signature header');
    return false;
  }

  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    console.warn('Missing RETELL_API_KEY for signature verification');
    return false;
  }

  try {
    // Verify using the Retell SDK
    return Retell.verify(payload, apiKey, signature);
  } catch (error) {
    console.error('Error verifying webhook signature:', error);
    return false;
  }
};

// POST handler for webhook events from Retell
export async function POST(request: NextRequest) {
  try {
    // Get the signature from headers
    const signature = request.headers.get('x-retell-signature');
    
    // Parse the JSON body
    const rawBody = await request.text();
    
    // For development, allow skipping signature verification
    if (process.env.NODE_ENV !== 'development' && !process.env.SKIP_WEBHOOK_VERIFICATION) {
      // Verify the signature
      const isValid = verifyRetellSignature(rawBody, signature);
      if (!isValid) {
        console.error('Invalid webhook signature');
        return new Response('Invalid signature', { status: 401 });
      }
    }
    
    const body = JSON.parse(rawBody);
    const { event, call } = body;
    
    console.log(`Received Retell webhook event: ${event}`);
    console.log('Webhook body:', JSON.stringify(body, null, 2));

    // On traite call_ended et call_analyzed (call_started = log seulement)
    if (event === 'call_ended' || event === 'call_analyzed') {
      // Mapping strict vers les colonnes Supabase
      const filteredCall = {
        id: call.call_id || call.id,
        crm_id: call.crm_id || null,
        lead_id: call.lead_id || null,
        call_direction: call.direction || null,
        status: call.status || (event === 'call_ended' ? 'completed' : null),
        call_outcome: call.outcome || null,
        start_time: call.start_timestamp ? new Date(call.start_timestamp).toISOString() : null,
        end_time: call.end_timestamp ? new Date(call.end_timestamp).toISOString() : null,
        duration_seconds: call.end_timestamp && call.start_timestamp
          ? Math.floor((call.end_timestamp - call.start_timestamp) / 1000)
          : (typeof call.duration === 'number' ? call.duration : null),
        phone_number: call.customer_phone_number || null,
        recording_url: call.recording_url || null,
        transcript: typeof call.transcript === 'string'
          ? call.transcript
          : (Array.isArray(call.transcript_object)
              ? (call.transcript_object as any[]).map((t: any) => `${t.speaker}: ${t.text}`).join('\n')
              : null),
        ai_sentiment: typeof call.user_sentiment === 'number' ? call.user_sentiment : null,
        ai_summary: call.summary || null,
        notes: call.notes || null,
        callback_datetime: call.callback_datetime || null,
        created_at: call.created_at ? new Date(call.created_at).toISOString() : new Date().toISOString(),
        updated_at: new Date().toISOString(),
        retell_agent_id: call.retell_agent_id || null,
        lead_name: call.lead ? `${call.lead.firstName} ${call.lead.lastName}`.trim() : undefined,
      };

      console.log('Mapped call for Supabase:', JSON.stringify(filteredCall, null, 2));

      // On tente d'upserter dans Supabase
      try {
        // Vérifier si l'appel existe déjà
        let existingCall = null;
        try {
          existingCall = await getCallById(filteredCall.id);
        } catch (e) {
          // Not found or error, on continue
        }
        if (existingCall) {
          // Update
          await updateCall(filteredCall.id, filteredCall);
          console.log(`Call updated in Supabase: ${filteredCall.id}`);
        } else {
          // Create
          await createCall(filteredCall);
          console.log(`Call created in Supabase: ${filteredCall.id}`);
        }
      } catch (storageError) {
        console.error('Error storing call data in Supabase:', storageError);
        if (storageError && typeof storageError === 'object') {
          const err = storageError as any;
          console.error('Supabase error message:', err.message);
          if ('details' in err) console.error('Supabase error details:', err.details);
          if ('hint' in err) console.error('Supabase error hint:', err.hint);
          try { console.error('Supabase error full:', JSON.stringify(err, null, 2)); } catch(e) {}
        }
        return new Response('Error storing call data', { status: 500 });
      }
    } else if (event === 'call_started') {
      // Log seulement
      console.log(`Call started: ${call.call_id}`);
    } else {
      console.log(`Received unknown event type: ${event}`);
    }
    // Return success response
    return new Response('Webhook received', { status: 204 });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return new Response(`Webhook error: ${error.message || 'Unknown error'}`, { 
      status: 500 
    });
  }
} 