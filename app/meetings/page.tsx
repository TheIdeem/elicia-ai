'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table, { Column } from '../components/ui/Table';
import { Meeting, MeetingStatus, MeetingType, Attendee } from './types';
import { useMeetingStorage } from './useMeetingStorage';
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  UserGroupIcon,
  MapPinIcon,
  VideoCameraIcon,
  PhoneIcon,
  ClockIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon as XIcon,
  ArrowPathIcon as RefreshIcon,
  DocumentTextIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';


export default function MeetingsPage() {
  const { 
    loading: apiLoading, 
    error: apiError, 
    fetchMeetings, 
    fetchMeetingById, 
    createMeeting, 
    updateMeeting, 
    deleteMeeting 
  } = useMeetingStorage();
  
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);
  const [filters, setFilters] = useState<{
    status?: MeetingStatus[];
    type?: MeetingType[];
    organizer?: string[];
    dateRange?: { start?: string; end?: string };
  }>({});
  
  // New meeting form state
  const [newMeeting, setNewMeeting] = useState<Partial<Meeting>>({
    status: 'scheduled',
    type: 'in-person',
    organizer: 'John Smith', // Default organizer
    attendees: [],
    startDate: new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }),
  });
  
  // State for attendee input
  const [attendeeInput, setAttendeeInput] = useState('');
  
  // State for agenda item input
  const [agendaItemInput, setAgendaItemInput] = useState('');
  
  // Check if we're on client side
  useEffect(() => {
    setIsClientSide(true);
  }, []);
  
  // Load meetings on component mount
  useEffect(() => {
    if (isClientSide) {
      loadMeetings();
    }
  }, [isClientSide]);
  
  // Function to load meetings
  const loadMeetings = async () => {
    setIsLoading(true);
    try {
      const data = await fetchMeetings();
      setMeetings(data);
    } catch (error) {
      console.error("Failed to load meetings:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate meeting statistics
  const totalMeetings = meetings.length;
  const upcomingMeetings = meetings.filter(meeting => meeting.status === 'scheduled').length;
  const completedMeetings = meetings.filter(meeting => meeting.status === 'completed').length;
  const cancelledMeetings = meetings.filter(meeting => meeting.status === 'cancelled').length;
  
  // Handle viewing a meeting
  const handleViewMeeting = (meeting: Meeting) => {
    // Make sure we have a valid meeting object with all required fields
    if (!meeting) {
      console.error('Attempted to view undefined meeting');
      return;
    }
    
    // Ensure attendees is always an array
    const safeAttendees = meeting.attendees || [];
    const safeMeeting = {
      ...meeting,
      attendees: safeAttendees,
    };
    
    setSelectedMeeting(safeMeeting);
    setIsViewModalOpen(true);
  };
  
  // Open add meeting modal
  const handleAddMeeting = () => {
    // Reset form state
    setNewMeeting({
      status: 'scheduled',
      type: 'in-person',
      organizer: 'John Smith', // Default organizer
      attendees: [],
      startDate: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
    });
    setAttendeeInput('');
    setAgendaItemInput('');
    setIsAddModalOpen(true);
  };

  // Generate a unique ID (simple implementation for demo)
  const generateId = () => {
    return 'meeting_' + Date.now().toString();
  };

  // Handle saving a new meeting
  const handleSaveMeeting = async () => {
    setIsLoading(true);
    
    try {
      // Add validation
      if (!newMeeting.title || !newMeeting.startDate || !newMeeting.startTime || !newMeeting.endTime) {
        throw new Error("Please fill in all required fields");
      }
      
      if (newMeeting.type === 'in-person' && !newMeeting.location) {
        throw new Error("Location is required for in-person meetings");
      }
      
      if (!newMeeting.attendees || newMeeting.attendees.length === 0) {
        throw new Error("Please add at least one attendee");
      }
      
      // Create duration string
      let duration = '';
      if (newMeeting.startTime && newMeeting.endTime) {
        const start = new Date(`2023-01-01T${newMeeting.startTime}`);
        const end = new Date(`2023-01-01T${newMeeting.endTime}`);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60); // difference in minutes
        
        if (diff < 60) {
          duration = `${diff} minutes`;
        } else {
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          duration = `${hours} hour${hours !== 1 ? 's' : ''}${minutes > 0 ? ` ${minutes} minutes` : ''}`;
        }
      }
      
      // Set duration in the meeting data
      const meetingToCreate = {
        ...newMeeting,
        id: generateId(),
        duration: duration
      };
      
      // Create meeting in localStorage
      const createdMeeting = await createMeeting(meetingToCreate);
      
      if (createdMeeting) {
        // Add to meetings list
        setMeetings([createdMeeting, ...meetings]);
        setIsAddModalOpen(false);
        
        // Show success notification (you could add a toast component here)
        console.log(`Meeting "${createdMeeting.title}" successfully added`);
      }
    } catch (error) {
      console.error("Failed to create meeting:", error);
      alert(error instanceof Error ? error.message : "Failed to create meeting");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle adding an attendee
  const handleAddAttendee = () => {
    if (!attendeeInput.trim()) return;
    
    // Parse the input - could be a name or email
    const isEmail = attendeeInput.includes('@');
    const newAttendee: Attendee = {
      id: 'att_' + Date.now(),
      name: isEmail ? attendeeInput.split('@')[0] : attendeeInput,
      email: isEmail ? attendeeInput : `${attendeeInput.toLowerCase().replace(/\s+/g, '.')}@example.com`,
      confirmed: false,
    };
    
    setNewMeeting({
      ...newMeeting,
      attendees: [...(newMeeting.attendees || []), newAttendee]
    });
    
    setAttendeeInput('');
  };
  
  // Handle removing an attendee
  const handleRemoveAttendee = (id: string) => {
    setNewMeeting({
      ...newMeeting,
      attendees: newMeeting.attendees?.filter(att => att.id !== id) || []
    });
  };
  
  // Handle adding an agenda item
  const handleAddAgendaItem = () => {
    if (!agendaItemInput.trim()) return;
    
    setNewMeeting({
      ...newMeeting,
      agenda: [...(newMeeting.agenda || []), agendaItemInput]
    });
    
    setAgendaItemInput('');
  };
  
  // Handle removing an agenda item
  const handleRemoveAgendaItem = (index: number) => {
    const updatedAgenda = [...(newMeeting.agenda || [])];
    updatedAgenda.splice(index, 1);
    
    setNewMeeting({
      ...newMeeting,
      agenda: updatedAgenda
    });
  };

  // Handle deleting a meeting
  const handleDeleteMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDeleteModalOpen(true);
  };
  
  // Handle confirming meeting deletion
  const handleConfirmDeleteMeeting = async () => {
    if (!selectedMeeting) return;
    
    setIsLoading(true);
    
    try {
      // Delete from localStorage
      const success = await deleteMeeting(selectedMeeting.id);
      
      if (success) {
        // Remove from meetings list
        setMeetings(meetings.filter(meeting => meeting.id !== selectedMeeting.id));
        setIsDeleteModalOpen(false);
        
        // Show success notification (you could add a toast component here)
        console.log(`Meeting "${selectedMeeting.title}" successfully deleted`);
      }
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      alert("Failed to delete meeting");
    } finally {
      setIsLoading(false);
    }
  };

  // Open filter modal
  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  // Apply filters
  const applyFilters = async (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
    
    setIsLoading(true);
    try {
      // Convert to API filters
      const apiFilters: Record<string, any> = {};
      
      // Handle status filter (use first one)
      if (newFilters.status && newFilters.status.length > 0) {
        apiFilters.status = newFilters.status[0];
      }
      
      // Handle type filter (use first one)
      if (newFilters.type && newFilters.type.length > 0) {
        apiFilters.type = newFilters.type[0];
      }
      
      // Handle organizer filter (use first one)
      if (newFilters.organizer && newFilters.organizer.length > 0) {
        apiFilters.organizer = newFilters.organizer[0];
      }
      
      const data = await fetchMeetings(apiFilters);
      
      // Apply client-side filtering for date range (not handled by our simple storage service)
      let filteredData = [...data];
      
      if (newFilters.dateRange) {
        if (newFilters.dateRange.start) {
          const startDate = new Date(newFilters.dateRange.start);
          filteredData = filteredData.filter(meeting => {
            const meetingDate = new Date(meeting.startDate);
            return meetingDate >= startDate;
          });
        }
        
        if (newFilters.dateRange.end) {
          const endDate = new Date(newFilters.dateRange.end);
          filteredData = filteredData.filter(meeting => {
            const meetingDate = new Date(meeting.startDate);
            return meetingDate <= endDate;
          });
        }
      }
      
      setMeetings(filteredData);
    } catch (error) {
      console.error("Failed to apply filters:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear all filters
  const clearFilters = async () => {
    setFilters({});
    setIsFilterModalOpen(false);
    await loadMeetings();
  };

  // Filter meetings based on search term and filters
  const filteredMeetings = meetings.filter(
    (meeting) => {
      // First apply search term
      const matchesSearch = 
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.attendees.some(attendee => 
          attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          attendee.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

      if (!matchesSearch) return false;

      // Then apply filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(meeting.status)) {
        return false;
      }

      if (filters.type && filters.type.length > 0 && !filters.type.includes(meeting.type)) {
        return false;
      }

      if (filters.organizer && filters.organizer.length > 0 && !filters.organizer.includes(meeting.organizer)) {
        return false;
      }

      if (filters.dateRange) {
        const meetingDate = new Date(meeting.startDate);
        
        if (filters.dateRange.start) {
          const startDate = new Date(filters.dateRange.start);
          if (meetingDate < startDate) return false;
        }
        
        if (filters.dateRange.end) {
          const endDate = new Date(filters.dateRange.end);
          if (meetingDate > endDate) return false;
        }
      }

      return true;
    }
  );
  
  // Function to get meeting type icon
  const getMeetingTypeIcon = (type: MeetingType) => {
    switch (type) {
      case 'in-person':
        return <MapPinIcon className="h-5 w-5 text-indigo-500" />;
      case 'video':
        return <VideoCameraIcon className="h-5 w-5 text-blue-500" />;
      case 'phone':
        return <PhoneIcon className="h-5 w-5 text-green-500" />;
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: MeetingStatus) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'rescheduled':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Render attendee avatars
  const renderAttendeeAvatars = (attendees: Attendee[] = []) => {
    // Add a safety check to ensure attendees is an array
    if (!attendees || !Array.isArray(attendees)) {
      return <div className="text-sm text-gray-500">No attendees</div>;
    }
    
    const maxDisplay = 3;
    const hasMore = attendees.length > maxDisplay;
    
    return (
      <div className="flex -space-x-2 overflow-hidden">
        {attendees.slice(0, maxDisplay).map((attendee, index) => (
          <div key={attendee.id} className={`relative rounded-full border-2 border-white ${attendee.confirmed === false ? 'opacity-50' : ''}`}>
            {attendee.avatar ? (
              <img
                src={attendee.avatar}
                alt={attendee.name}
                className="h-8 w-8 rounded-full"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
              </div>
            )}
            {attendee.confirmed === false && (
              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-yellow-400 border border-white"></div>
            )}
          </div>
        ))}
        {hasMore && (
          <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white">
            +{attendees.length - maxDisplay}
          </div>
        )}
      </div>
    );
  };

  // Table columns configuration
  const columns: Column<Meeting>[] = [
    {
      header: 'Meeting',
      accessor: (meeting) => (
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
            {getMeetingTypeIcon(meeting.type)}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900 truncate">{meeting.title}</div>
            <div className="text-sm text-gray-600 truncate">{meeting.organizer}</div>
          </div>
        </div>
      ),
      sortable: true,
      width: "w-[30%]"
    },
    {
      header: 'Date & Time',
      accessor: (meeting) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-900">{meeting.startDate}</span>
          <span className="text-sm text-gray-600">
            {meeting.startTime} {meeting.endTime ? `- ${meeting.endTime}` : ''}
          </span>
          {meeting.recurrence && (
            <span className="text-xs text-gray-500 mt-1">
              <RefreshIcon className="inline-block h-3 w-3 mr-1" />
              {meeting.recurrence}
            </span>
          )}
        </div>
      ),
      sortable: true,
      width: "w-[20%]"
    },
    {
      header: 'Attendees',
      accessor: (meeting) => (
        <div className="flex items-center">
          {renderAttendeeAvatars(meeting.attendees || [])}
          <span className="ml-2 text-sm text-gray-600">
            {meeting.attendees?.length || 0} attendee{(meeting.attendees?.length || 0) !== 1 ? 's' : ''}
          </span>
        </div>
      ),
      width: "w-[15%]"
    },
    {
      header: 'Status',
      accessor: (meeting) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(meeting.status)}`}>
          {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
        </span>
      ),
      sortable: true,
      width: "w-[10%]"
    },
    {
      header: 'Location',
      accessor: (meeting) => {
        let icon;
        let text;
        
        switch (meeting.type) {
          case 'in-person':
            icon = <MapPinIcon className="h-4 w-4 text-gray-500" />;
            text = meeting.location || 'No location specified';
            break;
          case 'video':
            icon = <VideoCameraIcon className="h-4 w-4 text-gray-500" />;
            text = 'Video Conference';
            break;
          case 'phone':
            icon = <PhoneIcon className="h-4 w-4 text-gray-500" />;
            text = 'Phone Call';
            break;
          default:
            icon = <CalendarIcon className="h-4 w-4 text-gray-500" />;
            text = 'Not specified';
        }
        
        return (
          <div className="flex items-center">
            {icon}
            <span className="ml-1.5 text-sm text-gray-600 truncate max-w-[120px]">{text}</span>
          </div>
        );
      },
      width: "w-[15%]"
    },
    {
      header: 'Actions',
      accessor: (meeting) => (
        <div className="flex justify-end space-x-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewMeeting(meeting);
            }}
            variant="secondary"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            aria-label="View"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              // Handle edit functionality
            }}
            variant="outline"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            aria-label="Edit"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteMeeting(meeting);
            }}
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            aria-label="Delete"
          />
        </div>
      ),
      width: "w-[10%]"
    }
  ];

  // Empty state for table
  const emptyState = (
    <div className="py-8 text-center">
      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No meetings</h3>
      <p className="mt-1 text-sm text-gray-600">
        Get started by creating a new meeting.
      </p>
      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleAddMeeting}
          icon={<CalendarIcon className="h-5 w-5" />}
        >
          Add New Meeting
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Meetings</h2>
            <p className="text-gray-600 mt-1">Schedule and manage your meetings</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              onClick={handleAddMeeting}
              icon={<CalendarIcon className="h-5 w-5" />}
            >
              Add New Meeting
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <CalendarIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Meetings</h3>
              <p className="text-2xl font-semibold text-gray-900">{totalMeetings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <CheckIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Completed</h3>
              <p className="text-2xl font-semibold text-gray-900">{completedMeetings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Upcoming</h3>
              <p className="text-2xl font-semibold text-gray-900">{upcomingMeetings}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 text-red-600">
              <XIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Cancelled</h3>
              <p className="text-2xl font-semibold text-gray-900">{cancelledMeetings}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search meetings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
                rightIcon={
                  searchTerm ? (
                    <XMarkIcon
                      className="h-5 w-5 cursor-pointer"
                      onClick={() => setSearchTerm('')}
                    />
                  ) : null
                }
              />
            </div>
            <div className="flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                icon={<FunnelIcon className="h-5 w-5" />}
                onClick={handleOpenFilter}
              >
                {Object.keys(filters).length > 0 ? `Filters (${Object.keys(filters).length})` : 'Filter'}
              </Button>
              <Button
                variant="secondary" 
                size="sm"
                icon={<ArrowPathIcon className="h-5 w-5" />}
                onClick={() => {
                  setIsLoading(true);
                  // Simulate loading refresh
                  setTimeout(() => setIsLoading(false), 800);
                }}
              >
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Table<Meeting>
          data={filteredMeetings}
          columns={columns}
          keyExtractor={(meeting) => meeting.id}
          sortField="startDate"
          sortDirection="desc"
          emptyState={emptyState}
          isLoading={isLoading}
          onRowClick={handleViewMeeting}
        />
      </div>

      {/* Meeting Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Meeting Details"
        size="lg"
        closeOnOutsideClick={false}
      >
        {selectedMeeting && (
          <div className="space-y-6">
            {/* Meeting header info */}
            <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0 rounded-md bg-gray-100 flex items-center justify-center">
                    {getMeetingTypeIcon(selectedMeeting.type)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{selectedMeeting.title}</h3>
                    <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <ClockIcon className="h-4 w-4 mr-1" /> 
                        {selectedMeeting.startTime} {selectedMeeting.endTime ? `- ${selectedMeeting.endTime}` : ''}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" /> 
                        {selectedMeeting.startDate}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedMeeting.status)}`}>
                    {selectedMeeting.status.charAt(0).toUpperCase() + selectedMeeting.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Meeting details grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Meeting Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3">
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Type:</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        {selectedMeeting.type === 'in-person' ? (
                          <>
                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            In-person
                          </>
                        ) : selectedMeeting.type === 'video' ? (
                          <>
                            <VideoCameraIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            Video Conference
                          </>
                        ) : (
                          <>
                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                            Phone Call
                          </>
                        )}
                      </dd>
                    </div>
                    
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Organizer:</dt>
                      <dd className="text-sm text-gray-900">{selectedMeeting.organizer}</dd>
                    </div>
                    
                    {selectedMeeting.location && (
                      <div className="flex items-start">
                        <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0 mt-0.5">Location:</dt>
                        <dd className="text-sm text-gray-900">{selectedMeeting.location}</dd>
                      </div>
                    )}
                    
                    {selectedMeeting.duration && (
                      <div className="flex items-center">
                        <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Duration:</dt>
                        <dd className="text-sm text-gray-900">{selectedMeeting.duration}</dd>
                      </div>
                    )}
                    
                    {selectedMeeting.recurrence && (
                      <div className="flex items-center">
                        <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Recurrence:</dt>
                        <dd className="text-sm text-gray-900 flex items-center">
                          <RefreshIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                          {selectedMeeting.recurrence}
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <div className="bg-gray-50 p-4 rounded-md h-full">
                  <p className="text-sm text-gray-800">
                    {selectedMeeting.description || 'No description provided for this meeting.'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Attendees */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Attendees ({selectedMeeting.attendees.length})
              </h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <ul className="divide-y divide-gray-200">
                  {selectedMeeting.attendees.map((attendee) => (
                    <li key={attendee.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {attendee.avatar ? (
                            <img
                              src={attendee.avatar}
                              alt={attendee.name}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-700">
                              {attendee.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                            </div>
                          )}
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-gray-500">{attendee.email}</span>
                              {attendee.role && (
                                <span className="text-xs text-gray-500">• {attendee.role}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`text-xs py-0.5 px-2 rounded-full ${
                          attendee.confirmed === true 
                            ? 'bg-green-100 text-green-800' 
                            : attendee.confirmed === false 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {attendee.confirmed === true 
                            ? 'Confirmed' 
                            : attendee.confirmed === false 
                              ? 'Pending'
                              : 'No response'}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Agenda */}
            {selectedMeeting.agenda && selectedMeeting.agenda.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Agenda</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ol className="list-decimal list-inside space-y-1">
                    {selectedMeeting.agenda.map((item, index) => (
                      <li key={index} className="text-sm text-gray-800">{item}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            
            {/* Notes */}
            {selectedMeeting.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <p className="text-sm text-gray-800">
                    {selectedMeeting.notes}
                  </p>
                </div>
              </div>
            )}
            
            {/* Documents */}
            {selectedMeeting.documents && selectedMeeting.documents.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Documents</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <ul className="space-y-2">
                    {selectedMeeting.documents.map((doc, index) => (
                      <li key={index} className="flex items-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2" />
                        <a href="#" className="text-sm text-blue-600 hover:underline">{doc}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            {/* Recording */}
            {selectedMeeting.recordingUrl && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Recording</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <video 
                    controls
                    className="w-full rounded"
                    src={selectedMeeting.recordingUrl}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            )}
            
            {/* Meeting tags */}
            {selectedMeeting.tags && selectedMeeting.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedMeeting.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsViewModalOpen(false)}
              >
                Close
              </Button>
              <Button
                type="button"
                variant="secondary"
                icon={<PencilIcon className="h-5 w-5" />}
              >
                Edit Meeting
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<VideoCameraIcon className="h-5 w-5" />}
              >
                Join Meeting
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Meeting Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Meeting"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Title*
              </label>
              <Input
                id="title"
                placeholder="Enter meeting title"
                value={newMeeting.title || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                required
              />
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date*
              </label>
              <Input
                id="date"
                type="date"
                value={newMeeting.startDate ? new Date(newMeeting.startDate).toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  const formattedDate = date.toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  });
                  setNewMeeting({ ...newMeeting, startDate: formattedDate });
                }}
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time*
                </label>
                <Input
                  id="startTime"
                  type="time"
                  value={newMeeting.startTime || ''}
                  onChange={(e) => setNewMeeting({ ...newMeeting, startTime: e.target.value })}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
                  End Time*
                </label>
                <Input
                  id="endTime"
                  type="time"
                  value={newMeeting.endTime || ''}
                  onChange={(e) => setNewMeeting({ ...newMeeting, endTime: e.target.value })}
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                Meeting Type*
              </label>
              <Select
                id="type"
                value={newMeeting.type || 'in-person'}
                onChange={(e) => setNewMeeting({ ...newMeeting, type: e.target.value as MeetingType })}
                required
                options={[
                  { value: "in-person", label: "In-person" },
                  { value: "video", label: "Video Conference" },
                  { value: "phone", label: "Phone Call" }
                ]}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status*
              </label>
              <Select
                id="status"
                value={newMeeting.status || 'scheduled'}
                onChange={(e) => setNewMeeting({ ...newMeeting, status: e.target.value as MeetingStatus })}
                required
                options={[
                  { value: "scheduled", label: "Scheduled" },
                  { value: "rescheduled", label: "Rescheduled" }
                ]}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input
                id="location"
                placeholder="Enter meeting location"
                value={newMeeting.location || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                leftIcon={<MapPinIcon className="h-5 w-5" />}
              />
              <p className="mt-1 text-xs text-gray-500">Required for in-person meetings</p>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Describe the purpose of this meeting"
                value={newMeeting.description || ''}
                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
              />
            </div>
            
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attendees*
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Search contacts or enter email address"
                    leftIcon={<UserGroupIcon className="h-5 w-5" />}
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAttendee();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddAttendee}
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {newMeeting.attendees?.map((attendee) => (
                    <div key={attendee.id} className="bg-blue-100 text-blue-800 text-sm rounded-full py-1 pl-2 pr-1 flex items-center">
                      <span>{attendee.name} {attendee.email && `<${attendee.email}>`}</span>
                      <button 
                        type="button" 
                        className="ml-1 rounded-full p-1 hover:bg-blue-200"
                        onClick={() => handleRemoveAttendee(attendee.id)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="sm:col-span-2">
              <label htmlFor="agenda" className="block text-sm font-medium text-gray-700 mb-1">
                Agenda Items
              </label>
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <Input 
                    placeholder="Add agenda item" 
                    value={agendaItemInput}
                    onChange={(e) => setAgendaItemInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAgendaItem();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={handleAddAgendaItem}
                  >
                    Add
                  </Button>
                </div>
                <ul className="space-y-2">
                  {newMeeting.agenda?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                      <span className="text-sm">{item}</span>
                      <button 
                        type="button" 
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => handleRemoveAgendaItem(index)}
                      >
                        <XMarkIcon className="h-4 w-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              icon={<CalendarIcon className="h-5 w-5" />}
              onClick={handleSaveMeeting}
              disabled={!newMeeting.title || !newMeeting.startDate || !newMeeting.startTime || !newMeeting.endTime || !newMeeting.attendees?.length}
            >
              Schedule Meeting
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Meetings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(['scheduled', 'completed', 'cancelled', 'rescheduled'] as const).map((status) => (
                <div key={status} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`status-${status}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.status?.includes(status) || false}
                    onChange={(e) => {
                      const newStatus = [...(filters.status || [])];
                      if (e.target.checked) {
                        newStatus.push(status);
                      } else {
                        const index = newStatus.indexOf(status);
                        if (index !== -1) newStatus.splice(index, 1);
                      }
                      setFilters({ ...filters, status: newStatus.length ? newStatus : undefined });
                    }}
                  />
                  <label htmlFor={`status-${status}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {status}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['in-person', 'video', 'phone'] as const).map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`type-${type}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.type?.includes(type) || false}
                    onChange={(e) => {
                      const newType = [...(filters.type || [])];
                      if (e.target.checked) {
                        newType.push(type);
                      } else {
                        const index = newType.indexOf(type);
                        if (index !== -1) newType.splice(index, 1);
                      }
                      setFilters({ ...filters, type: newType.length ? newType : undefined });
                    }}
                  />
                  <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {type === 'in-person' ? 'In-person' : 
                     type === 'video' ? 'Video Conference' : 'Phone Call'}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organizer</label>
            <div className="grid grid-cols-1 gap-2">
              {Array.from(new Set(meetings.map(m => m.organizer))).map((organizer) => (
                <div key={organizer} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`organizer-${organizer}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.organizer?.includes(organizer) || false}
                    onChange={(e) => {
                      const newOrganizer = [...(filters.organizer || [])];
                      if (e.target.checked) {
                        newOrganizer.push(organizer);
                      } else {
                        const index = newOrganizer.indexOf(organizer);
                        if (index !== -1) newOrganizer.splice(index, 1);
                      }
                      setFilters({ ...filters, organizer: newOrganizer.length ? newOrganizer : undefined });
                    }}
                  />
                  <label htmlFor={`organizer-${organizer}`} className="ml-2 block text-sm text-gray-900">
                    {organizer}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="start-date" className="block text-sm text-gray-600 mb-1">Start Date</label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: {
                      ...filters.dateRange,
                      start: e.target.value
                    }
                  })}
                />
              </div>
              <div>
                <label htmlFor="end-date" className="block text-sm text-gray-600 mb-1">End Date</label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e) => setFilters({
                    ...filters,
                    dateRange: {
                      ...filters.dateRange,
                      end: e.target.value
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={() => applyFilters(filters)}
              icon={<FunnelIcon className="h-5 w-5" />}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Meeting"
        size="sm"
      >
        {selectedMeeting && (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-red-600">
              <TrashIcon className="h-12 w-12" />
            </div>
            <p className="text-center text-gray-700">
              Are you sure you want to delete the meeting <strong>{selectedMeeting.title}</strong>? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={handleConfirmDeleteMeeting}
                icon={<TrashIcon className="h-5 w-5" />}
              >
                Delete Meeting
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
} 