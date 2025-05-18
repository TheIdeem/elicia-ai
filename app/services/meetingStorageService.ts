import { Meeting, MeetingFormData } from '../meetings/types';
import { v4 as uuidv4 } from 'uuid';

const MEETINGS_STORAGE_KEY = 'elicia_meetings';

// Server-side cache for when localStorage is not available
let SERVER_CACHE: Meeting[] | null = null;

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
 * Get all meetings from localStorage
 */
export function getMeetings(filters?: Partial<Meeting>): Meeting[] {
  try {
    const meetingsJson = safeLocalStorage.getItem(MEETINGS_STORAGE_KEY);
    let meetings: Meeting[];
    
    if (meetingsJson) {
      const parsedMeetings = JSON.parse(meetingsJson);
      
      // Migrate older meeting format to new format if needed
      meetings = parsedMeetings.map((meeting: any) => {
        // If this is already the new format, just return it
        if (meeting.startDate && Array.isArray(meeting.attendees)) {
          return meeting;
        }
        
        // Handle migration from old format (if any older data exists)
        return {
          ...meeting,
          startDate: meeting.startDate || meeting.date || new Date().toLocaleDateString('en-US'),
          startTime: meeting.startTime || '09:00',
          endTime: meeting.endTime || '10:00',
          organizer: meeting.organizer || meeting.contactName || 'Unknown',
          attendees: meeting.attendees || [{
            id: 'att_' + Date.now(),
            name: meeting.contactName || 'Unknown Contact',
            email: meeting.contactEmail || 'unknown@example.com'
          }]
        };
      });
      
      // Update server cache if we're on the client
      if (typeof window !== 'undefined') {
        SERVER_CACHE = meetings;
      }
    } else if (SERVER_CACHE) {
      // Use server cache if localStorage is empty or we're on the server
      meetings = SERVER_CACHE;
    } else {
      meetings = [];
    }
    
    // Sort by date in descending order
    const sortedMeetings = meetings.sort((a, b) => {
      // Handle both date formats (startDate and legacy date)
      const dateA = a.startDate || a.date || '';
      const dateB = b.startDate || b.date || '';
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      return sortedMeetings.filter(meeting => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          return meeting[key as keyof Meeting] === value;
        });
      });
    }
    
    return sortedMeetings;
  } catch (error) {
    console.error('Error retrieving meetings from localStorage:', error);
    return [];
  }
}

/**
 * Get a single meeting by ID
 */
export function getMeetingById(id: string): Meeting | null {
  try {
    const meetings = getMeetings();
    const meeting = meetings.find(meeting => meeting.id === id);
    
    if (!meeting) {
      console.error(`Meeting with id ${id} not found`);
      return null;
    }
    
    return meeting;
  } catch (error) {
    console.error(`Error retrieving meeting with id ${id}:`, error);
    return null;
  }
}

// Fonction utilitaire pour nettoyer les champs avant envoi à Supabase ou localStorage
function cleanMeetingFormData(meeting: Partial<MeetingFormData>): MeetingFormData {
  const cleaned: any = {};
  Object.entries(meeting).forEach(([key, value]) => {
    if (key === 'attendees') {
      if (Array.isArray(value)) {
        cleaned.attendees = value.length > 0 ? value : null;
      } else {
        cleaned.attendees = null;
      }
    } else if (value === '') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned as MeetingFormData;
}

/**
 * Create a new meeting
 */
export function createMeeting(meetingData: Partial<Meeting> | MeetingFormData): Meeting {
  try {
    // Validate required fields
    if (!meetingData.title) {
      throw new Error('Meeting title is required');
    }
    
    if (!meetingData.status) {
      meetingData.status = 'scheduled';
    }
    
    if (!meetingData.type) {
      meetingData.type = 'in-person';
    }
    
    if (!meetingData.organizer) {
      meetingData.organizer = 'Default Organizer';
    }
    
    if (!meetingData.attendees) {
      meetingData.attendees = [];
    }
    
    if (!meetingData.startDate) {
      throw new Error('Start date is required');
    }
    
    // Generate UUID for new meeting
    const cleanedMeeting = cleanMeetingFormData(meetingData as MeetingFormData);
    const newMeeting: Meeting = {
      ...cleanedMeeting,
      id: uuidv4(),
    };
    
    // Get existing meetings and add the new one
    const meetings = getMeetings();
    meetings.unshift(newMeeting);
    
    // Save back to localStorage
    safeLocalStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = meetings;
    }
    
    return newMeeting;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
}

/**
 * Update an existing meeting
 */
export function updateMeeting(id: string, meetingData: Partial<MeetingFormData>): Meeting {
  try {
    // Get existing meetings
    const meetings = getMeetings();
    const meetingIndex = meetings.findIndex(meeting => meeting.id === id);
    
    if (meetingIndex === -1) {
      throw new Error(`Meeting with id ${id} not found`);
    }
    
    // Update the meeting
    const cleanedMeeting = cleanMeetingFormData(meetingData as MeetingFormData);
    const updatedMeeting: Meeting = {
      ...meetings[meetingIndex],
      ...cleanedMeeting,
    };
    
    meetings[meetingIndex] = updatedMeeting;
    
    // Save back to localStorage
    safeLocalStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(meetings));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = meetings;
    }
    
    return updatedMeeting;
  } catch (error) {
    console.error(`Error updating meeting with id ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a meeting
 */
export function deleteMeeting(id: string): boolean {
  try {
    // Get existing meetings
    const meetings = getMeetings();
    const updatedMeetings = meetings.filter(meeting => meeting.id !== id);
    
    if (updatedMeetings.length === meetings.length) {
      throw new Error(`Meeting with id ${id} not found`);
    }
    
    // Save updated list back to localStorage
    safeLocalStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(updatedMeetings));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = updatedMeetings;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting meeting with id ${id}:`, error);
    throw error;
  }
}

/**
 * Initialize with sample data if none exists
 */
export function initializeMeetingsData(): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check if we already have meetings in localStorage
  const meetingsJson = safeLocalStorage.getItem(MEETINGS_STORAGE_KEY);
  
  // If no meetings exist, add some sample data
  if (!meetingsJson || JSON.parse(meetingsJson).length === 0) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const sampleMeetings: Meeting[] = [
      {
        id: uuidv4(),
        title: 'Property Viewing',
        type: 'in-person',
        status: 'scheduled',
        startDate: tomorrow.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        startTime: '10:00',
        endTime: '11:00',
        duration: '1 hour',
        location: '123 Ocean Drive, Miami, FL',
        organizer: 'John Smith',
        attendees: [
          {
            id: uuidv4(),
            name: 'Mike Johnson',
            email: 'mike.j@example.com',
            confirmed: true
          },
          {
            id: uuidv4(),
            name: 'Sarah Williams',
            email: 'sarah.w@example.com',
            confirmed: false
          }
        ],
        description: 'Client is interested in viewing the property before making an offer.',
        notes: 'Prepare property details and comparable listings in the area.'
      },
      {
        id: uuidv4(),
        title: 'Contract Discussion',
        type: 'video',
        status: 'scheduled',
        startDate: nextWeek.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        startTime: '14:00',
        endTime: '14:45',
        duration: '45 minutes',
        location: 'Zoom Meeting',
        organizer: 'Sarah Johnson',
        attendees: [
          {
            id: uuidv4(),
            name: 'Robert Davis',
            email: 'robert.d@example.com',
            confirmed: true
          }
        ],
        description: 'Discuss contract terms and closing timeline.',
        agenda: ['Review contract clauses', 'Discuss closing timeline', 'Address any concerns']
      },
      {
        id: uuidv4(),
        title: 'Initial Consultation',
        type: 'in-person',
        status: 'completed',
        startDate: today.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'short', 
          day: 'numeric' 
        }),
        startTime: '09:00',
        endTime: '09:30',
        duration: '30 minutes',
        location: 'Office - Meeting Room 3',
        organizer: 'Michael Brown',
        attendees: [
          {
            id: uuidv4(),
            name: 'Jennifer Smith',
            email: 'jennifer.s@example.com',
            confirmed: true
          },
          {
            id: uuidv4(),
            name: 'David Wilson',
            email: 'david.w@example.com',
            confirmed: true
          }
        ],
        description: 'Initial meeting to understand client requirements and budget.',
        notes: 'Client is looking for a 3-bedroom property in the downtown area.',
        tags: ['New Client', 'High Priority']
      }
    ];
    
    safeLocalStorage.setItem(MEETINGS_STORAGE_KEY, JSON.stringify(sampleMeetings));
    SERVER_CACHE = sampleMeetings;
  }
} 