import { Call, CallFormData } from '../calls/types';
import { v4 as uuidv4 } from 'uuid';

const CALLS_STORAGE_KEY = 'elicia_calls';

// Server-side cache for when localStorage is not available
let SERVER_CACHE: Call[] | null = null;

// Safe localStorage access
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === 'undefined') {
      return null;
    }
    return localStorage.getItem(key);
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === 'undefined') {
      return;
    }
    localStorage.setItem(key, value);
  }
};

/**
 * Get all calls from localStorage
 */
export function getCalls(filters?: Partial<Call>): Call[] {
  try {
    const callsJson = safeLocalStorage.getItem(CALLS_STORAGE_KEY);
    let calls: Call[];
    
    if (callsJson) {
      calls = JSON.parse(callsJson);
      // Update server cache if we're on the client
      if (typeof window !== 'undefined') {
        SERVER_CACHE = calls;
      }
    } else if (SERVER_CACHE) {
      // Use server cache if localStorage is empty or we're on the server
      calls = SERVER_CACHE;
    } else {
      calls = [];
    }
    
    // Sort by date in descending order
    const sortedCalls = calls.sort((a, b) => {
      return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
    });
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      return sortedCalls.filter(call => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          return call[key as keyof Call] === value;
        });
      });
    }
    
    return sortedCalls;
  } catch (error) {
    console.error('Error retrieving calls from localStorage:', error);
    return [];
  }
}

/**
 * Get a single call by ID
 */
export function getCallById(id: string): Call | null {
  try {
    const calls = getCalls();
    const call = calls.find(call => call.id === id);
    
    if (!call) {
      console.error(`Call with id ${id} not found`);
      return null;
    }
    
    return call;
  } catch (error) {
    console.error(`Error retrieving call with id ${id}:`, error);
    return null;
  }
}

// Fonction utilitaire pour nettoyer les champs avant envoi à Supabase ou localStorage
function cleanCallFormData(call: Partial<CallFormData>): CallFormData {
  const cleaned: any = {};
  Object.entries(call).forEach(([key, value]) => {
    if (key === 'transcript') {
      if (Array.isArray(value)) {
        cleaned.transcript = value.length > 0 ? value : null;
      } else {
        cleaned.transcript = null;
      }
    } else if (value === '') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned as CallFormData;
}

/**
 * Create a new call
 */
export function createCall(callData: CallFormData): Call {
  try {
    const cleanedCall = cleanCallFormData(callData as CallFormData);
    const newCall: Call = {
      ...cleanedCall,
      id: uuidv4(),
      date: callData.date || new Date().toISOString(),
    };
    
    // Get existing calls and add the new one
    const calls = getCalls();
    calls.unshift(newCall);
    
    // Save back to localStorage
    safeLocalStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = calls;
    }
    
    return newCall;
  } catch (error) {
    console.error('Error creating call:', error);
    throw error;
  }
}

/**
 * Update an existing call
 */
export function updateCall(id: string, callData: Partial<CallFormData>): Call {
  try {
    // Get existing calls
    const calls = getCalls();
    const callIndex = calls.findIndex(call => call.id === id);
    
    if (callIndex === -1) {
      throw new Error(`Call with id ${id} not found`);
    }
    
    const cleanedCall = cleanCallFormData(callData as CallFormData);
    const updatedCall: Call = {
      ...calls[callIndex],
      ...cleanedCall,
    };
    
    calls[callIndex] = updatedCall;
    
    // Save back to localStorage
    safeLocalStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = calls;
    }
    
    return updatedCall;
  } catch (error) {
    console.error(`Error updating call with id ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a call
 */
export function deleteCall(id: string): boolean {
  try {
    // Get existing calls
    const calls = getCalls();
    const updatedCalls = calls.filter(call => call.id !== id);
    
    if (updatedCalls.length === calls.length) {
      throw new Error(`Call with id ${id} not found`);
    }
    
    // Save updated list back to localStorage
    safeLocalStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(updatedCalls));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = updatedCalls;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting call with id ${id}:`, error);
    throw error;
  }
}

/**
 * Initialize with sample data if none exists
 */
export function initializeCallsData(): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check if we already have calls in localStorage
  const callsJson = safeLocalStorage.getItem(CALLS_STORAGE_KEY);
  
  // If no calls exist, add some sample data
  if (!callsJson || JSON.parse(callsJson).length === 0) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
    const sampleCalls: Call[] = [
      {
        id: uuidv4(),
        type: 'inbound',
        status: 'completed',
        contact: {
          id: 'c1',
          phone: '+1 (555) 123-4567',
          email: 'john@example.com',
        },
        duration: '0:08',
        date: now.toISOString(),
        time: now.toLocaleTimeString(),
        notes: 'Discussed property requirements and budget constraints.',
      },
      {
        id: uuidv4(),
        type: 'outbound',
        status: 'completed',
        contact: {
          id: 'c2',
          phone: '+1 (555) 987-6543',
          email: 'sarah@example.com',
        },
        duration: '0:12',
        date: yesterday.toISOString(),
        time: yesterday.toLocaleTimeString(),
        notes: 'Follow-up call after initial meeting. Client is interested in viewing properties next week.',
      },
      {
        id: uuidv4(),
        type: 'inbound',
        status: 'failed',
        contact: {
          id: 'c3',
          phone: '+1 (555) 456-7890',
          email: 'michael@example.com',
        },
        duration: '0:00',
        date: twoDaysAgo.toISOString(),
        time: twoDaysAgo.toLocaleTimeString(),
        notes: 'Missed call, need to follow up.',
      }
    ];
    
    safeLocalStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(sampleCalls));
    SERVER_CACHE = sampleCalls;
  }
}

// Save all calls to localStorage
export const saveCalls = (calls: Call[]): void => {
  if (typeof window === 'undefined') {
    return; // Do nothing if running on server
  }
  
  try {
    localStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
  } catch (error) {
    console.error('Error saving calls to localStorage:', error);
  }
};

// Add a new call to localStorage
export const addCall = (call: Call): void => {
  const calls = getCalls();
  saveCalls([call, ...calls]);
};

/**
 * Update call details from webhook data
 * This function is designed to work on both client and server
 */
export const updateCallDetails = async (callData: any): Promise<void> => {
  try {
    // Check if we're on the server
    if (typeof window === 'undefined') {
      console.log('Storing call data on server:', callData.id);
      
      // Update SERVER_CACHE since we don't have localStorage on the server
      if (SERVER_CACHE) {
        const index = SERVER_CACHE.findIndex(call => call.id === callData.id);
        
        if (index !== -1) {
          // Update existing call in server cache
          SERVER_CACHE[index] = {
            ...SERVER_CACHE[index],
            ...callData,
            // If we have transcript data, format it for our UI
            ...(callData.transcript_object ? {
              transcript: callData.transcript_object.map((item: any) => ({
                speaker: item.speaker === 'agent' ? 'ai' : 'contact',
                text: item.text,
                timestamp: formatTimestamp(item.timestamp || 0)
              }))
            } : {})
          };
        } else {
          // Log that we received data for an unknown call
          console.log(`Received data for unknown call: ${callData.id}`);
          // In a production app, you would store this in a database
        }
      }
      return;
    }
    
    // Client-side: use localStorage
    const calls = getCalls();
    const index = calls.findIndex(call => call.id === callData.id);
    
    if (index !== -1) {
      // Update existing call
      calls[index] = {
        ...calls[index],
        ...callData,
        // If we have transcript data, format it for our UI
        ...(callData.transcript_object ? {
          transcript: callData.transcript_object.map((item: any) => ({
            speaker: item.speaker === 'agent' ? 'ai' : 'contact',
            text: item.text,
            timestamp: formatTimestamp(item.timestamp || 0)
          }))
        } : {})
      };
      
      // Save to localStorage
      safeLocalStorage.setItem(CALLS_STORAGE_KEY, JSON.stringify(calls));
    } else {
      // For now, we'll just log that we received data for an unknown call
      console.log(`Received data for unknown call: ${callData.id}`);
      // In a production app, you might want to store this data anyway
    }
  } catch (error) {
    console.error('Error updating call details:', error);
  }
};

/**
 * Format timestamp from milliseconds to MM:SS format
 */
const formatTimestamp = (ms: number): string => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}; 