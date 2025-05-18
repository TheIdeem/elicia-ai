import { supabase } from './supabaseClient';
import { Lead, LeadFormData } from '../leads/types';

const TABLE = 'leads';

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Lead[];
}

export async function getLeadById(id: string): Promise<Lead | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function createLead(lead: LeadFormData): Promise<Lead> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([lead])
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function updateLead(id: string, lead: Partial<LeadFormData>): Promise<Lead> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(lead)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Lead;
}

export async function deleteLead(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 