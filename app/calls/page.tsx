'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Table, { Column } from '../components/ui/Table';
import { Call, CallStatus, CallType, Contact, CallTranscript } from './types';
import {
  PhoneIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon,
  EyeIcon,
  PlusIcon,
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { useCallApi } from './useCallApi';

export default function CallsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const callTypeFilter = searchParams.get('type') as CallType | null;
  
  // Use our custom hook for API calls
  const { calls, isLoading, error, getCalls, getCallById } = useCallApi();
  const [showDebugInfo, setShowDebugInfo] = useState(false);
  
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<Call | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<{
    status?: CallStatus[];
    type?: CallType[];
    dateRange?: { start?: string; end?: string };
  }>({
    type: callTypeFilter ? [callTypeFilter] : undefined
  });

  // Update filters when URL params change
  useEffect(() => {
    if (callTypeFilter) {
      setFilters(prevFilters => ({
        ...prevFilters,
        type: [callTypeFilter]
      }));
    } else {
      setFilters(prevFilters => {
        const { type, ...restFilters } = prevFilters;
        return restFilters;
      });
    }
  }, [callTypeFilter]);

  // Handle refreshing the call list
  const handleRefresh = () => {
    getCalls();
  };

  // Show/hide debug info (for development mode only)
  const toggleDebugInfo = () => {
    setShowDebugInfo(prev => !prev);
  };

  // Handle viewing a call
  const handleViewCall = async (call: Call) => {
    try {
      // Set the initial call data first so the modal isn't empty
      setSelectedCall(call);
      // Then open the modal
      setIsViewModalOpen(true);
      
      try {
        // Then attempt to fetch detailed call info
        const detailedCall = await getCallById(call.id);
        
        // Only update if we got valid data and if modal is still open
        if (detailedCall && isViewModalOpen) {
          setSelectedCall({
            ...detailedCall,
            // Ensure we don't lose the original contact info if the API doesn't return it
            contact: detailedCall.contact ? detailedCall.contact : call.contact
          });
        }
      } catch (error) {
        console.error('Error fetching call details:', error);
        // Keep using the original call data, just add an error note
        setSelectedCall({
          ...call,
          notes: `Unable to retrieve additional call details: ${error instanceof Error ? error.message : 'API error'}.`
        });
      }
    } catch (error) {
      console.error('Error in handleViewCall:', error);
    }
  };

  // Open filter modal
  const handleOpenFilter = () => {
    setIsFilterModalOpen(true);
  };

  // Apply filters
  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setIsFilterModalOpen(false);
    
    // Update URL if type filter is changed
    if (newFilters.type && newFilters.type.length === 1) {
      router.push(`${pathname}?type=${newFilters.type[0]}`);
    } else if (callTypeFilter) {
      router.push(pathname);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
    setIsFilterModalOpen(false);
    if (callTypeFilter) {
      router.push(pathname);
    }
  };

  // Set specific call type filter
  const setCallTypeFilter = (type: CallType | null) => {
    if (type) {
      router.push(`${pathname}?type=${type}`);
    } else {
      router.push(pathname);
    }
  };

  // Compute the filtered calls list
  const filteredCalls = calls.filter(call => {
    // Apply text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        (call.contact?.phone?.toLowerCase().includes(searchLower) || false) ||
        (call.contact?.email?.toLowerCase().includes(searchLower) || false) ||
        (call.purpose?.toLowerCase().includes(searchLower) || false) ||
        (call.notes?.toLowerCase().includes(searchLower) || false);
      
      if (!matchesSearch) return false;
    }
    
    // Apply status filter
    if (filters.status && filters.status.length > 0) {
      if (!call.status || !filters.status.includes(call.status)) {
        return false;
      }
    }
    
    // Apply type filter
    if (filters.type && filters.type.length > 0) {
      if (!call.type || !filters.type.includes(call.type)) {
        return false;
      }
    }
    
    // Apply date range filter
    if (filters.dateRange) {
      const callDateStr = call.date || '';
      const callDate = new Date(callDateStr);
      
      if (filters.dateRange.start && filters.dateRange.start.trim() !== '') {
        const startDate = new Date(filters.dateRange.start);
        if (callDate < startDate) return false;
      }
      
      if (filters.dateRange.end && filters.dateRange.end.trim() !== '') {
        const endDate = new Date(filters.dateRange.end);
        if (callDate > endDate) return false;
      }
    }
    
    return true;
  });

  // Get page title
  const getPageTitle = () => {
    return 'Calls';
  };

  // Function to get call type icon
  const getCallTypeIcon = (type: CallType) => {
    switch (type) {
      case 'outbound':
        return <PhoneArrowUpRightIcon className="h-5 w-5 text-blue-500" />;
      case 'inbound':
        return <PhoneArrowDownLeftIcon className="h-5 w-5 text-purple-500" />;
      default:
        return <PhoneIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Function to get status badge color
  const getStatusBadgeColor = (status: CallStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render contact avatar/initials
  const renderAvatar = (contact: Contact) => {
    if (contact.avatar) {
      return <img src={contact.avatar} alt={contact.id} className="h-10 w-10 rounded-full" />;
    }
    // Générer des initiales à partir de l'id (2 premiers caractères)
    const initials = (contact.id?.slice(0, 2) || '??').toUpperCase();
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
        {initials}
      </div>
    );
  };

  // Table columns configuration
  const columns: Column<Call>[] = [
    {
      header: 'Contact',
      accessor: (call) => (
        <div className="flex flex-col">
          <div className="text-sm font-medium text-gray-900">{call.contact?.displayName || call.contact?.phone || call.contact?.id || 'Unknown Contact'}</div>
          <div className="text-sm text-gray-600">{call.contact?.email || ''}</div>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Type',
      accessor: (call) => (
        <div className="flex items-center">
          {getCallTypeIcon(call.type)}
          <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-medium ${
            call.type === 'outbound' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {call.type ? call.type.charAt(0).toUpperCase() + call.type.slice(1) : 'Unknown'}
          </span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Date & Time',
      accessor: (call) => (
        <span className="text-sm text-gray-600">
          {call.date} • {call.time}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Duration',
      accessor: (call) => (
        <div className="flex items-center">
          <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
          <span className="text-sm text-gray-600">{call.duration}</span>
        </div>
      ),
      sortable: true
    },
    {
      header: 'Status',
      accessor: (call) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(call.status)}`}>
          {call.status ? call.status.charAt(0).toUpperCase() + call.status.slice(1).replace('-', ' ') : 'Unknown'}
        </span>
      ),
      sortable: true
    },
    {
      header: 'Actions',
      accessor: (call) => (
        <div className="flex justify-end">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewCall(call);
            }}
            variant="secondary"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            aria-label="View"
          >
            View
          </Button>
        </div>
      )
    }
  ];

  // Empty state for table
  const emptyState = (
    <div className="py-8 text-center">
      <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No calls</h3>
      <p className="mt-1 text-sm text-gray-600">
        Your AI agents haven't made any calls yet.
      </p>
    </div>
  );

  // Calculate total duration of calls
  const calculateTotalDuration = (calls: Call[]): string => {
    // Parse duration strings like "3:45" to get total minutes and seconds
    let totalSeconds = 0;
    
    calls.forEach(call => {
      if (!call.duration) return;
      
      const parts = call.duration.split(':');
      if (parts.length !== 2) return;
      
      const minutes = parseInt(parts[0], 10);
      const seconds = parseInt(parts[1], 10);
      
      if (isNaN(minutes) || isNaN(seconds)) return;
      
      totalSeconds += (minutes * 60) + seconds;
    });
    
    // Convert back to MM:SS format
    const totalMinutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${totalMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Call Detail Component
  const CallDetail = ({ call, onClose }: { call: Call, onClose: () => void }) => {
    return (
      <div className="space-y-6">
        {/* Call header info */}
        <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{call.contact?.displayName || call.contact?.phone || call.contact?.id || 'Unknown Contact'}</h3>
              <p className="text-sm text-gray-600">{call.contact?.phone || 'No phone number'}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                call.type === 'outbound' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
              }`}>
                {call.type ? call.type.charAt(0).toUpperCase() + call.type.slice(1) : 'Unknown'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(call.status)}`}>
                {call.status ? call.status.charAt(0).toUpperCase() + call.status.slice(1).replace('-', ' ') : 'Unknown'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Call details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Call Information</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Date:</dt>
                  <dd className="text-sm text-gray-900">{call.date}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Time:</dt>
                  <dd className="text-sm text-gray-900">{call.time}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Duration:</dt>
                  <dd className="text-sm text-gray-900">{call.duration}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Purpose:</dt>
                  <dd className="text-sm text-gray-900">{call.purpose || 'N/A'}</dd>
                </div>
                {call.outcome && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Outcome:</dt>
                    <dd className="text-sm text-gray-900">{call.outcome}</dd>
                  </div>
                )}
                {call.followup_required && (
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Follow-up:</dt>
                    <dd className="text-sm text-gray-900">{call.followup_date || 'Required'}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
            <div className="bg-gray-50 p-4 rounded-md h-full">
              <p className="text-sm text-gray-800">{call.notes || 'No notes recorded for this call.'}</p>
            </div>
          </div>
        </div>
        
        {/* Call transcript */}
        {call.transcript && call.transcript.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript</h4>
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <div className="max-h-60 overflow-y-auto p-4">
                {call.transcript.map((item, index) => (
                  <div key={index} className="mb-3">
                    <div className="flex items-center">
                      <span className={`inline-block w-20 text-xs font-medium ${
                        item.speaker === 'ai' ? 'text-blue-700' : 'text-gray-700'
                      }`}>
                        {item.speaker === 'ai' ? 'AI Agent' : 'Contact'}
                      </span>
                      <span className="text-xs text-gray-500">{item.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-800 mt-1">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Call recording */}
        {call.recording_url && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Recording</h4>
            <div className="bg-gray-50 p-4 rounded-md">
              <audio controls className="w-full">
                <source src={call.recording_url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        )}
        
        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          <Button
            type="button"
            variant="primary"
            icon={<PhoneIcon className="h-5 w-5" />}
          >
            Call Again
          </Button>
        </div>
      </div>
    );
  };

  // Call Filters Component
  const CallFilters = ({
    filters,
    onApplyFilters,
    onClearFilters
  }: {
    filters: {
      status?: CallStatus[];
      type?: CallType[];
      dateRange?: { start?: string; end?: string };
    },
    onApplyFilters: (filters: any) => void;
    onClearFilters: () => void;
  }) => {
    // Create a local copy of filters to work with
    const [localFilters, setLocalFilters] = useState(filters);
    
    // Update local filters when props change
    useEffect(() => {
      setLocalFilters(filters);
    }, [filters]);
    
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <div className="grid grid-cols-2 gap-2">
            {(['completed', 'in-progress', 'failed', 'scheduled'] as const).map((status) => (
              <div key={status} className="flex items-center">
                <input
                  type="checkbox"
                  id={`status-${status}`}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={localFilters.status?.includes(status) || false}
                  onChange={(e) => {
                    const newStatus = [...(localFilters.status || [])];
                    if (e.target.checked) {
                      newStatus.push(status);
                    } else {
                      const index = newStatus.indexOf(status);
                      if (index !== -1) newStatus.splice(index, 1);
                    }
                    setLocalFilters({ ...localFilters, status: newStatus.length ? newStatus : undefined });
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
          <label className="block text-sm font-medium text-gray-700 mb-2">Call Type</label>
          <div className="grid grid-cols-2 gap-2">
            {(['inbound', 'outbound'] as const).map((type) => (
              <div key={type} className="flex items-center">
                <input
                  type="checkbox"
                  id={`type-${type}`}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={localFilters.type?.includes(type) || false}
                  onChange={(e) => {
                    const newType = [...(localFilters.type || [])];
                    if (e.target.checked) {
                      newType.push(type);
                    } else {
                      const index = newType.indexOf(type);
                      if (index !== -1) newType.splice(index, 1);
                    }
                    setLocalFilters({ ...localFilters, type: newType.length ? newType : undefined });
                  }}
                />
                <label htmlFor={`type-${type}`} className="ml-2 block text-sm text-gray-900 capitalize">
                  {type}
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
                value={localFilters.dateRange?.start || ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  dateRange: {
                    ...localFilters.dateRange,
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
                value={localFilters.dateRange?.end || ''}
                onChange={(e) => setLocalFilters({
                  ...localFilters,
                  dateRange: {
                    ...localFilters.dateRange,
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
            onClick={onClearFilters}
          >
            Clear Filters
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={() => onApplyFilters(localFilters)}
            icon={<FunnelIcon className="h-5 w-5" />}
          >
            Apply Filters
          </Button>
        </div>
      </div>
    );
  };

  // Render the main view based on the filtered calls
  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h2>
            <p className="text-gray-600 mt-1">View and manage all your call activities</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <a href="/demo">
              <Button
                variant="primary"
                icon={<PhoneIcon className="h-5 w-5" />}
              >
                Make a Call
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <PhoneIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Total Calls</h3>
              <p className="text-2xl font-semibold text-gray-900">{calls.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <PhoneArrowDownLeftIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Inbound</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {calls.filter(call => call.type === 'inbound').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <PhoneArrowUpRightIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Outbound</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {calls.filter(call => call.type === 'outbound').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <ClockIcon className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Duration</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {calculateTotalDuration(calls)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Development Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-6">
          <button 
            onClick={toggleDebugInfo}
            className="text-sm text-gray-500 underline"
          >
            {showDebugInfo ? 'Hide' : 'Show'} Debug Info
          </button>
          
          {showDebugInfo && (
            <div className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto max-h-48 text-xs font-mono">
              <div>Environment: {process.env.NODE_ENV}</div>
              <div>API Error: {error || 'None'}</div>
              <div>Calls count: {calls.length}</div>
              <div>API data loaded: {calls.length > 0 ? 'Yes' : 'No'}</div>
              <div>Filters: {JSON.stringify(filters)}</div>
              <div>Search term: {searchTerm || 'None'}</div>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading calls</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
                <p className="mt-1">Using fallback data. Try refreshing the page.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table actions bar */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search calls..."
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
                {Object.keys(filters).length > 0 ? `Filters (${
                  Object.values(filters).reduce((count, value) => {
                    if (Array.isArray(value)) {
                      return count + value.length;
                    }
                    return count + (value ? 1 : 0);
                  }, 0)
                })` : 'Filter'}
              </Button>
              <Button
                variant="secondary" 
                size="sm"
                icon={<ArrowPathIcon className="h-5 w-5" />}
                onClick={handleRefresh}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>

        {/* Calls table */}
        <Table<Call>
          data={filteredCalls}
          columns={columns}
          keyExtractor={(call) => call.id}
          sortField="date"
          sortDirection="desc"
          emptyState={
            <div className="py-8 text-center">
              <PhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No calls</h3>
              <p className="mt-1 text-sm text-gray-600">
                {searchTerm || Object.keys(filters).length > 0 
                  ? "No calls match your filters. Try adjusting your search."
                  : "Get started by making your first call."}
              </p>
              <div className="mt-6">
                <a href="/demo">
                  <Button
                    variant="primary"
                    icon={<PhoneIcon className="h-5 w-5" />}
                  >
                    Make a Call
                  </Button>
                </a>
              </div>
            </div>
          }
          isLoading={isLoading}
          onRowClick={handleViewCall}
        />
      </div>

      {/* Call Detail Modal */}
      {selectedCall && (
        <Modal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          title="Call Details"
          size="lg"
        >
          <CallDetail 
            call={selectedCall} 
            onClose={() => setIsViewModalOpen(false)} 
          />
        </Modal>
      )}

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Calls"
        size="md"
      >
        <CallFilters
          filters={filters}
          onApplyFilters={applyFilters}
          onClearFilters={clearFilters}
        />
      </Modal>
    </DashboardLayout>
  );
} 