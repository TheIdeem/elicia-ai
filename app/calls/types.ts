export type CallType = 'inbound' | 'outbound';
export type CallStatus = 'completed' | 'in-progress' | 'failed' | 'scheduled';

export interface Contact {
  id: string;
  phone: string;
  email?: string;
  avatar?: string;
  displayName?: string;
}

export interface CallTranscript {
  speaker: 'ai' | 'contact';
  text: string;
  timestamp: string;
}

export interface Call {
  id: string;
  contact: Contact;
  type: CallType;
  status: CallStatus;
  date: string;
  time: string;
  duration: string;
  recording_url?: string;
  transcript?: CallTranscript[];
  notes?: string;
  purpose?: string;
  outcome?: string;
  followup_required?: boolean;
  followup_date?: string;
  // Additional Retell-specific fields
  fullTranscript?: string;
  callStatusOriginal?: string;
  callSuccessful?: boolean;
  disconnectionReason?: string;
  userSentiment?: string;
  callSummary?: string;
}

// Form data type for creating/updating calls
export type CallFormData = Omit<Call, 'id'>; 