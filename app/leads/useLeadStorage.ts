import { useState } from 'react';
import { Lead, LeadFormData } from './types';
import {
  getLeads as supabaseGetLeads,
  getLeadById as supabaseGetLeadById,
  createLead as supabaseCreateLead,
  updateLead as supabaseUpdateLead,
  deleteLead as supabaseDeleteLead,
} from '../services/supabaseLeadService';

export function useLeadStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all leads with optional filters
   */
  const fetchLeads = async (): Promise<Lead[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseGetLeads();
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single lead by ID
   */
  const fetchLeadById = async (id: string): Promise<Lead | null> => {
    setLoading(true);
    setError(null);
    try {
      const lead = await supabaseGetLeadById(id);
      return lead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new lead
   */
  const createNewLead = async (leadData: LeadFormData): Promise<Lead | null> => {
    setLoading(true);
    setError(null);
    try {
      const newLead = await supabaseCreateLead(leadData);
      return newLead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing lead
   */
  const updateExistingLead = async (id: string, leadData: Partial<LeadFormData>): Promise<Lead | null> => {
    setLoading(true);
    setError(null);
    try {
      const updatedLead = await supabaseUpdateLead(id, leadData);
      return updatedLead;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a lead
   */
  const deleteExistingLead = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await supabaseDeleteLead(id);
      return success;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchLeads,
    fetchLeadById,
    createLead: createNewLead,
    updateLead: updateExistingLead,
    deleteLead: deleteExistingLead,
  };
} 