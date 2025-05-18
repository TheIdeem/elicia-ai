import { Call, CallStatus, CallType, CallTranscript } from '../calls/types';

/**
 * Maps Retell API response to our app's Call type
 */
export function mapRetellCallToAppCall(retellCall: any): Call {
  // Ensure we have a valid object to map from
  if (!retellCall) {
    return createFallbackCall();
  }
  
  // Extract call direction (inbound/outbound)
  let callType: CallType = 'outbound';
  if (retellCall.direction && ['inbound', 'outbound'].includes(retellCall.direction)) {
    callType = retellCall.direction as CallType;
  }
  
  // Map Retell status to our app's status
  const status = mapRetellStatusToAppStatus(retellCall.status);
  
  // Format date/time
  const createdAt = retellCall.created_at ? new Date(retellCall.created_at) : new Date();
  const date = createdAt.toLocaleDateString();
  const time = createdAt.toLocaleTimeString();
  
  // Format duration
  const duration = formatDuration(retellCall.duration);
  
  return {
    id: retellCall.id || 'unknown-id',
    contact: {
      id: retellCall.customer_id || 'unknown',
      phone: retellCall.customer_phone_number || 'Not available',
    },
    type: callType,
    status: status,
    date: date,
    time: time,
    duration: duration,
    purpose: retellCall.purpose || 'Not specified',
    // Additional fields from Retell
    fullTranscript: retellCall.transcript,
    callStatusOriginal: retellCall.status,
    callSuccessful: retellCall.successful === true,
    disconnectionReason: retellCall.disconnection_reason,
    userSentiment: retellCall.user_sentiment,
    callSummary: retellCall.summary
  };
}

/**
 * Maps an array of Retell calls to our app's Call type
 */
export function mapRetellCallsToAppCalls(retellCalls: any): Call[] {
  // Ensure we have an array to work with
  const callsToMap = Array.isArray(retellCalls) ? retellCalls : [];
  
  if (callsToMap.length === 0) {
    console.warn('No calls data to map');
    return [];
  }
  
  // Map each call in the array
  return callsToMap.map((retellCall: any, index: number) => {
    try {
      if (!retellCall) {
        console.warn(`Empty call object at index ${index}`);
        return createFallbackCall();
      }
      
      const mappedCall = mapRetellCallToAppCall(retellCall);
      
      // Add index to ID to ensure uniqueness in case of duplicates
      return {
        ...mappedCall,
        id: `${mappedCall.id || 'unknown'}-${index}`
      };
    } catch (error) {
      console.error(`Error mapping call at index ${index}:`, error);
      return createFallbackCall();
    }
  }).filter(Boolean); // Remove any undefined entries
}

/**
 * Maps Retell status to our app's status
 */
function mapRetellStatusToAppStatus(retellStatus: string): CallStatus {
  const statusMap: Record<string, CallStatus> = {
    'in-progress': 'in-progress',
    'completed': 'completed',
    'failed': 'failed',
    'scheduled': 'scheduled',
    'pending': 'scheduled',
    'ringing': 'in-progress',
    'connecting': 'in-progress',
    'started': 'in-progress',
    'ended': 'completed'
  };
  
  return statusMap[retellStatus || ''] || 'scheduled';
}

/**
 * Formats seconds into MM:SS format
 */
function formatDuration(seconds?: number): string {
  if (!seconds) return '0:00';
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Creates a fallback call object for error cases
 */
function createFallbackCall(): Call {
  return {
    id: 'unknown-id',
    contact: {
      id: 'unknown',
      phone: 'Not available',
    },
    type: 'outbound',
    status: 'failed',
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    duration: '0:00',
    notes: 'Unable to retrieve call details.',
  };
} 