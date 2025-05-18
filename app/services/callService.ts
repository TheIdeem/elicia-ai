/**
 * Service for interacting with Retell API calls
 */

import { Call } from '../calls/types';

// Base URL for API calls
const API_BASE_URL = '/api/calls';

/**
 * Fetch all calls
 */
export async function fetchCalls(): Promise<any[]> {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error: ${response.status}` }));
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    const data = await response.json().catch(err => {
      console.error('Error parsing JSON response:', err);
      return {};
    });
    
    console.log('API response in fetchCalls:', data);
    
    // Ensure we always return an array, even if the API returns unexpected format
    if (Array.isArray(data)) {
      return data;
    } else if (data.data && Array.isArray(data.data)) {
      return data.data;
    } else if (data.data) {
      console.warn('API returned data.data, but it is not an array:', data.data);
      return [];
    } else {
      console.warn('API did not return expected data format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching calls:', error);
    // Return empty array instead of re-throwing to prevent cascading errors
    return [];
  }
}

/**
 * Fetch a call by ID
 */
export async function fetchCallById(id: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    console.log(`API response status for call ${id}:`, response.status);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: `HTTP error: ${response.status}` }));
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API response data for call ${id}:`, data);
    return data;
  } catch (error) {
    console.error(`Error fetching call ${id}:`, error);
    // Re-throw for the component to handle
    throw error;
  }
}

/**
 * Create a new call
 */
export async function createCall(phoneNumber: string, leadId?: string, agentId?: string): Promise<any> {
  try {
    console.log('Creating call:', { phoneNumber, leadId, agentId });
    
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        leadId,
        agentId
      }),
    });
    
    // Parse response even if status is not OK, as it might contain useful error information
    const data = await response.json().catch(err => {
      console.error('Error parsing JSON response:', err);
      return { error: 'Failed to parse response' };
    });
    
    console.log('Call API response:', data);
    
    // If there's an error property in the response, log it but still return the data
    // as it might contain useful mock data in development
    if (data.error) {
      console.warn('API returned error:', data.error);
    }
    
    // If the response was not OK and there's no useful mock data, throw an error
    if (!response.ok && !data.id) {
      throw new Error(data.error || `Error: ${response.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error('Error creating call:', error);
    
    // Check if we're in development mode - return a mock response
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true') {
      console.warn('Returning mock call object due to error');
      return {
        id: `mock-error-call-${Date.now()}`,
        status: 'scheduled',
        created_at: new Date().toISOString(),
        direction: 'outbound',
        customer_phone_number: phoneNumber,
        error: error.message,
        _isMockCall: true
      };
    }
    
    // Re-throw for the component to handle
    throw error;
  }
}

/**
 * Search properties based on user text during a call
 */
export async function searchPropertiesDuringCall(callId: string, userText: string): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/${callId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userText
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error searching properties during call ${callId}:`, error);
    // Re-throw for the component to handle
    throw error;
  }
} 