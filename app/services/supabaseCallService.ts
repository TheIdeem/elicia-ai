import { supabase } from './supabaseClient';
import { Call } from '../calls/types';

async function getLeadInfo(lead_id: string): Promise<{ firstName?: string; lastName?: string }> {
  if (!lead_id) return {};
  const { data, error } = await supabase
    .from('leads')
    .select('firstName, lastName')
    .eq('id', lead_id)
    .single();
  if (error) return {};
  return { firstName: data.firstName, lastName: data.lastName };
}

function buildDisplayName(firstName?: string, lastName?: string): string | undefined {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  if (firstName) return firstName;
  if (lastName) return lastName;
  return undefined;
}

async function mapSupabaseCallToCall(row: any): Promise<Call> {
  let firstName = undefined;
  let lastName = undefined;
  let displayName = undefined;
  if (row.lead_id) {
    const leadInfo = await getLeadInfo(row.lead_id);
    firstName = leadInfo.firstName;
    lastName = leadInfo.lastName;
    displayName = buildDisplayName(firstName, lastName);
  }
  return {
    id: row.id,
    contact: {
      id: row.lead_id || 'unknown',
      phone: row.phone_number || 'Not available',
      email: undefined,
      avatar: undefined,
      displayName: row.lead_name || undefined,
    },
    type: row.call_direction || 'outbound',
    status: row.status || 'scheduled',
    date: row.start_time ? new Date(row.start_time).toLocaleDateString() : '',
    time: row.start_time ? new Date(row.start_time).toLocaleTimeString() : '',
    duration: typeof row.duration_seconds === 'number' ? `${Math.floor(row.duration_seconds / 60)}:${(row.duration_seconds % 60).toString().padStart(2, '0')}` : '0:00',
    recording_url: row.recording_url || undefined,
    transcript: row.transcript ? [{ speaker: 'ai', text: row.transcript, timestamp: '' }] : undefined,
    notes: row.notes || '',
    purpose: '',
    outcome: row.call_outcome || '',
    followup_required: false,
    followup_date: row.callback_datetime ? new Date(row.callback_datetime).toLocaleDateString() : undefined,
    fullTranscript: row.transcript || undefined,
    callStatusOriginal: row.status || undefined,
    callSuccessful: row.status === 'completed',
    disconnectionReason: undefined,
    userSentiment: row.ai_sentiment !== undefined ? String(row.ai_sentiment) : undefined,
    callSummary: row.ai_summary || undefined,
  };
}

const TABLE = 'calls_unified';

// Récupérer tous les appels
export async function getCalls(): Promise<Call[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  const calls = await Promise.all((data as any[]).map(mapSupabaseCallToCall));
  return calls;
}

// Récupérer un appel par ID
export async function getCallById(id: string): Promise<Call | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data ? await mapSupabaseCallToCall(data) : null;
}

// Créer un nouvel appel
export async function createCall(call: Partial<Call>): Promise<Call> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([call])
    .select()
    .single();
  if (error) throw error;
  return await mapSupabaseCallToCall(data);
}

// Mettre à jour un appel
export async function updateCall(id: string, call: Partial<Call>): Promise<Call> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(call)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return await mapSupabaseCallToCall(data);
}

// Supprimer un appel
export async function deleteCall(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 