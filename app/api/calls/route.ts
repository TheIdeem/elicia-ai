import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Call } from '../../calls/types';
import Retell from 'retell-sdk';
import { searchProperties } from '../../services/propertyContextService';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// GET: List all calls from Supabase
export async function GET(request: NextRequest) {
  try {
    // Fetch from Supabase
    const { data, error } = await supabase
      .from('calls_unified')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    if (!data) return NextResponse.json([]);

    // Map Supabase rows to Call type
    const calls: Call[] = data.map((row: any) => ({
      id: row.id,
      contact: {
        id: row.lead_id || 'unknown',
        phone: row.phone_number || 'Not available',
        email: undefined,
        avatar: undefined,
      },
      type: row.call_direction || 'outbound',
      status: row.status || 'scheduled',
      date: row.start_time ? new Date(row.start_time).toLocaleDateString() : '',
      time: row.start_time ? new Date(row.start_time).toLocaleTimeString() : '',
      duration: row.duration_seconds ? `${Math.floor(row.duration_seconds / 60)}:${(row.duration_seconds % 60).toString().padStart(2, '0')}` : '0:00',
      recording_url: row.recording_url || undefined,
      transcript: undefined, // Optionally parse row.transcript
      notes: row.notes || '',
      purpose: undefined,
      outcome: row.call_outcome || undefined,
      followup_required: undefined,
      followup_date: undefined,
      agent_id: row.agent_id || '',
    }));
    return NextResponse.json(calls);
  } catch (error: any) {
    console.error('Error fetching calls from Supabase:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch calls' }, { status: 500 });
  }
}

// POST: Create a new call via Retell
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { phoneNumber, leadId } = data;

    if (!phoneNumber && !leadId) {
      return NextResponse.json(
        { error: 'Phone number or lead ID is required' },
        { status: 400 }
      );
    }

    // Préparer les infos du contact
    let customerName = 'Unknown Contact';
    let customerPhone = phoneNumber;

    // Si leadId fourni, récupérer les infos du lead depuis Supabase
    if (leadId) {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId);
      if (leadError) {
        console.error('Supabase error:', leadError);
        return NextResponse.json({ error: leadError.message }, { status: 500 });
      }
      if (leadData && leadData.length > 0) {
        const lead = leadData[0];
        customerName = `${lead.firstName} ${lead.lastName}`.trim();
        customerPhone = lead.phone || phoneNumber;
      }
    }

    if (!customerPhone) {
      return NextResponse.json(
        { error: 'Valid phone number is required' },
        { status: 400 }
      );
    }

    // Récupérer toutes les propriétés depuis Supabase pour le contexte Retell
    const allProperties = await searchProperties({});
    // Filtrer les champs inutiles pour le contexte agent
    const properties = allProperties.map(({ id, reference, type, status, market_type, title, description, address, price, size_sqm, bedrooms, bathrooms, parking_spots, year_built, features }) => ({
      id, reference, type, status, market_type, title, description, address, price, size_sqm, bedrooms, bathrooms, parking_spots, year_built, features
    }));

    // Appeler l'API Retell pour créer l'appel
    const retellApiKey = process.env.RETELL_API_KEY;
    if (!retellApiKey) {
      return NextResponse.json({ error: 'RETELL_API_KEY not configured' }, { status: 500 });
    }
    const retell = new Retell({ apiKey: retellApiKey });
    const callParams: any = {
      from_number: process.env.RETELL_FROM_NUMBER, // doit être défini dans .env
      to_number: customerPhone,
      agent_id: process.env.RETELL_AGENT_ID, // utilisé uniquement pour l'API Retell
      metadata: {
        lead_id: leadId,
        customer_name: customerName,
        properties_context: JSON.stringify(properties),
      }
    };
    let newCall: any;
    try {
      if (retell.call && typeof (retell.call as any).createPhoneCall === 'function') {
        newCall = await (retell.call as any).createPhoneCall(callParams);
      } else {
        throw new Error('No call creation method found in Retell SDK');
      }
    } catch (apiError) {
      console.error('Error creating call with Retell API:', apiError);
      return NextResponse.json({ error: apiError instanceof Error ? apiError.message : String(apiError) }, { status: 500 });
    }
    return NextResponse.json(newCall);
  } catch (error: any) {
    console.error('Error creating call with Retell:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create call' },
      { status: 500 }
    );
  }
}

// POST handler for creating a phone call
export async function POSTPhoneCall(request: NextRequest) {
  try {
    const data = await request.json();
    const { phoneNumber, leadId } = data;
    
    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }
    
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Créer un objet any pour l'insertion
    const callParamsAny: any = {
      phone_number: phoneNumber,
      lead_id: leadId,
    };
    // Add lead information to metadata if a leadId is provided
    if (leadId) {
      const { data: leadData, error: leadError } = await supabase
        .from('leads')
        .select('*')
        .eq('id', leadId);
      if (leadError) {
        console.error('Supabase error:', leadError);
        throw leadError;
      }
      if (leadData && leadData.length > 0) {
        const lead = leadData[0];
        callParamsAny.metadata = {
          contact_name: `${lead.firstName} ${lead.lastName}`,
          contact_email: lead.email,
          company: '',
          lead_status: lead.status
        };
      }
    }
    let phoneCallResponse: any;
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('calls_unified')
        .insert([callParamsAny]);
      if (insertError) {
        console.error('Supabase error:', insertError);
        throw insertError;
      }
      let insertedId = undefined;
      const insertedArr = insertData as unknown as any[];
      if (insertedArr && Array.isArray(insertedArr) && insertedArr.length > 0 && 'id' in insertedArr[0]) {
        insertedId = insertedArr[0].id;
      }
      phoneCallResponse = { ...callParamsAny, id: insertedId };
    } catch (error) {
      console.error('Error creating phone call in Supabase:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : String(error) },
        { status: 500 }
      );
    }
    return NextResponse.json(phoneCallResponse);
  } catch (error: any) {
    console.error('Error creating phone call in Supabase (global catch):', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create phone call' },
      { status: 500 }
    );
  }
}

// GET handler for listing phone calls
export async function GETPhoneCalls(request: NextRequest) {
  try {
    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    let callResponses: any;
    
    // Get the call history from Supabase using appropriate method
    try {
      const { data: callData, error: callError } = await supabase
        .from('calls_unified')
        .select('*')
        .order('created_at', { ascending: false });
      if (callError) {
        console.error('Supabase error:', callError);
        throw callError;
      }
      callResponses = callData;
    } catch (apiError) {
      console.error('Error listing calls with Supabase API:', apiError);
      throw apiError;
    }
    
    return NextResponse.json(callResponses);
  } catch (error: any) {
    console.error('Error fetching call history:', error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch call history' },
      { status: 500 }
    );
  }
}

// Function to create a phone call
export async function createPhoneCall(req: NextRequest) {
  try {
    const data = await req.json();
    const supabase = createClient(supabaseUrl, supabaseKey);
    const callParams = data;
    
    let phoneCallResponse;
    
    // Try different methods to create a phone call based on SDK version
    try {
      const { data: insertData, error: insertError } = await supabase
        .from('calls_unified')
        .insert([callParams]);
      if (insertError) {
        console.error('Supabase error:', insertError);
        throw insertError;
      }
      let insertedId = undefined;
      const insertedArr = insertData as unknown as any[];
      if (insertedArr && Array.isArray(insertedArr) && insertedArr.length > 0 && 'id' in insertedArr[0]) {
        insertedId = insertedArr[0].id;
      }
      phoneCallResponse = { ...callParams, id: insertedId };
    } catch (error) {
      console.error('Error creating phone call in Supabase:', error);
      throw error;
    }
    
    return NextResponse.json(phoneCallResponse);
  } catch (error: any) {
    console.error('Error in createPhoneCall:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create phone call' },
      { status: 500 }
    );
  }
}

// Function to list all calls
export async function listCalls() {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    let callResponses: any;
    
    try {
      const { data: callData, error: callError } = await supabase
        .from('calls_unified')
        .select('*')
        .order('created_at', { ascending: false });
      if (callError) {
        console.error('Supabase error:', callError);
        throw callError;
      }
      callResponses = callData;
    } catch (error) {
      console.error('Error listing calls:', error);
      throw error;
    }
    
    return callResponses;
  } catch (error) {
    console.error('Error in listCalls:', error);
    throw error;
  }
} 