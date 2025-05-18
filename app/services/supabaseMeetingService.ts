import { supabase } from './supabaseClient';

// Types bruts pour correspondre à la table Supabase
export interface SupabaseMeeting {
  id: string;
  crm_id?: string;
  call_id?: string;
  lead_id?: string;
  meeting_type?: string;
  status?: string;
  subject?: string;
  description?: string;
  meeting_date?: string;
  meeting_time?: string;
  duration_minutes?: number;
  timezone?: string;
  start_time?: string;
  end_time?: string;
  location_type?: string;
  location_address?: string;
  location_coordinates?: any;
  property_id?: string;
  property_reference?: string;
  property_type?: string;
  participant_name?: string;
  participant_phone?: string;
  additional_participants?: any;
  reminder_sent?: boolean;
  confirmation_status?: string;
  cancellation_reason?: string;
  reschedule_count?: number;
  pre_meeting_notes?: string;
  post_meeting_notes?: string;
  outcome_summary?: string;
  next_steps?: string;
  ai_success_probability?: number;
  ai_engagement_score?: number;
  ai_notes?: any;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  last_modified_by?: string;
}

const TABLE = 'meetings';

export async function getMeetings(): Promise<SupabaseMeeting[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('meeting_date', { ascending: false });
  if (error) throw error;
  return data as SupabaseMeeting[];
}

export async function getMeetingById(id: string): Promise<SupabaseMeeting | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as SupabaseMeeting;
}

export async function createMeeting(meeting: Partial<SupabaseMeeting>): Promise<SupabaseMeeting> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([meeting])
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseMeeting;
}

export async function updateMeeting(id: string, meeting: Partial<SupabaseMeeting>): Promise<SupabaseMeeting> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(meeting)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as SupabaseMeeting;
}

export async function deleteMeeting(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 