import { useState, useEffect, useCallback } from 'react';
import { Call } from './types';
import {
  getCalls as supabaseGetCalls,
  getCallById as supabaseGetCallById,
  createCall as supabaseCreateCall,
  updateCall as supabaseUpdateCall,
  deleteCall as supabaseDeleteCall,
} from '../services/supabaseCallService';

export const useCallApi = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all calls
  const getCalls = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await supabaseGetCalls();
      setCalls(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch calls');
      setCalls([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch a single call by ID
  const getCallById = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const call = await supabaseGetCallById(id);
      return call;
    } catch (err: any) {
      setError(err.message || 'Failed to fetch call details');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update local state when a new call is added or updated
  const updateCallInState = useCallback((updatedCall: Call) => {
    setCalls(prevCalls => {
      const index = prevCalls.findIndex(call => call.id === updatedCall.id);
      if (index !== -1) {
        // Update existing call
        const updatedCalls = [...prevCalls];
        updatedCalls[index] = updatedCall;
        return updatedCalls;
      } else {
        // Add new call
        return [updatedCall, ...prevCalls];
      }
    });
  }, []);

  // Load calls automatically on first render
  useEffect(() => {
    getCalls();
  }, [getCalls]);

  return {
    calls,
    isLoading,
    error,
    getCalls,
    getCallById,
    updateCallInState,
  };
}; 