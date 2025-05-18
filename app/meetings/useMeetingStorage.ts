import { useState } from 'react';
import { Meeting, MeetingFormData } from './types';
import {
  getMeetings as supabaseGetMeetings,
  getMeetingById as supabaseGetMeetingById,
  createMeeting as supabaseCreateMeeting,
  updateMeeting as supabaseUpdateMeeting,
  deleteMeeting as supabaseDeleteMeeting,
  SupabaseMeeting
} from '../services/supabaseMeetingService';

// Mapping brut SupabaseMeeting -> Meeting (à adapter selon besoins UI)
function mapSupabaseMeetingToMeeting(s: SupabaseMeeting): Meeting {
  return {
    id: s.id,
    title: s.subject || '',
    description: s.description || '',
    status: (s.status as any) || 'scheduled',
    type: (s.meeting_type as any) || 'in-person',
    startDate: s.meeting_date || '',
    startTime: s.meeting_time || '',
    endTime: s.end_time ? new Date(s.end_time).toLocaleTimeString() : '',
    duration: s.duration_minutes ? `${s.duration_minutes} min` : '',
    location: s.location_address || '',
    organizer: s.agent_id || '',
    attendees: Array.isArray(s.additional_participants) ? s.additional_participants : [],
    agenda: [],
    notes: s.pre_meeting_notes || '',
    followUpActions: [],
    documents: [],
    recordingUrl: '',
    recurrence: '',
    tags: [],
  };
}

export function useMeetingStorage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch all meetings
   */
  const fetchMeetings = async (): Promise<Meeting[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await supabaseGetMeetings();
      return data.map(mapSupabaseMeetingToMeeting);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch a single meeting by ID
   */
  const fetchMeetingById = async (id: string): Promise<Meeting | null> => {
    setLoading(true);
    setError(null);
    try {
      const meeting = await supabaseGetMeetingById(id);
      return meeting ? mapSupabaseMeetingToMeeting(meeting) : null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new meeting
   */
  const createNewMeeting = async (meetingData: Partial<MeetingFormData>): Promise<Meeting | null> => {
    setLoading(true);
    setError(null);
    try {
      // Mapping MeetingFormData -> SupabaseMeeting (à adapter selon besoins)
      const supabaseData: Partial<SupabaseMeeting> = {
        subject: meetingData.title,
        description: meetingData.description,
        status: meetingData.status,
        meeting_type: meetingData.type,
        meeting_date: meetingData.startDate,
        meeting_time: meetingData.startTime,
        end_time: meetingData.endTime,
        duration_minutes: meetingData.duration ? parseInt(meetingData.duration) : undefined,
        location_address: meetingData.location,
        agent_id: meetingData.organizer,
        additional_participants: meetingData.attendees,
        pre_meeting_notes: meetingData.notes,
      };
      const created = await supabaseCreateMeeting(supabaseData);
      return mapSupabaseMeetingToMeeting(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update an existing meeting
   */
  const updateExistingMeeting = async (id: string, meetingData: Partial<MeetingFormData>): Promise<Meeting | null> => {
    setLoading(true);
    setError(null);
    try {
      const supabaseData: Partial<SupabaseMeeting> = {
        subject: meetingData.title,
        description: meetingData.description,
        status: meetingData.status,
        meeting_type: meetingData.type,
        meeting_date: meetingData.startDate,
        meeting_time: meetingData.startTime,
        end_time: meetingData.endTime,
        duration_minutes: meetingData.duration ? parseInt(meetingData.duration) : undefined,
        location_address: meetingData.location,
        agent_id: meetingData.organizer,
        additional_participants: meetingData.attendees,
        pre_meeting_notes: meetingData.notes,
      };
      const updated = await supabaseUpdateMeeting(id, supabaseData);
      return mapSupabaseMeetingToMeeting(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a meeting
   */
  const deleteExistingMeeting = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const success = await supabaseDeleteMeeting(id);
      return success;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchMeetings,
    fetchMeetingById,
    createMeeting: createNewMeeting,
    updateMeeting: updateExistingMeeting,
    deleteMeeting: deleteExistingMeeting,
  };
} 