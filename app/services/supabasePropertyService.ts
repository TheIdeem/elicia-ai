import { supabase } from './supabaseClient';
import { Property, PropertyFormData } from '../properties/types';

const TABLE = 'properties';

export async function getProperties(): Promise<Property[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as Property[];
}

export async function getPropertyById(id: string): Promise<Property | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Property;
}

export async function createProperty(property: PropertyFormData): Promise<Property> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert([property])
    .select()
    .single();
  if (error) throw error;
  return data as Property;
}

export async function updateProperty(id: string, property: Partial<PropertyFormData>): Promise<Property> {
  const { data, error } = await supabase
    .from(TABLE)
    .update(property)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
} 