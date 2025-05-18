export type MeetingStatus = 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
export type MeetingType = 'in-person' | 'video' | 'phone';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  confirmed?: boolean;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  status: MeetingStatus;
  type: MeetingType;
  startDate: string;
  startTime: string;
  endTime?: string;
  duration?: string;
  location?: string;
  organizer: string;
  attendees: Attendee[];
  agenda?: string[];
  notes?: string;
  followUpActions?: string[];
  documents?: string[];
  recordingUrl?: string;
  recurrence?: string;
  tags?: string[];
}

// Form data type for creating/updating meetings
export type MeetingFormData = Omit<Meeting, 'id'>; 