'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import Select from '../components/ui/Select';
import Table, { Column } from '../components/ui/Table';
import { Lead, LeadStatus, LeadSource, LeadFormData } from './types';
import { useLeadStorage } from './useLeadStorage';
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TagIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

// Sample data for demonstration
const sampleLeads: Lead[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    status: 'new',
    source: 'website',
    notes: 'Interested in our premium plan',
  },
  {
    id: '2',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    status: 'contacted',
    source: 'referral',
    notes: 'Follow up on technical requirements',
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 345-6789',
    status: 'qualified',
    source: 'social',
    notes: 'Interested in our premium plan',
  },
  {
    id: '4',
    firstName: 'Emma',
    lastName: 'Davis',
    email: 'emma.davis@example.com',
    phone: '+1 (555) 234-5678',
    status: 'unqualified',
    source: 'email',
    notes: 'Budget too low for our services',
  },
  {
    id: '5',
    firstName: 'Robert',
    lastName: 'Wilson',
    email: 'robert.wilson@example.com',
    phone: '+1 (555) 876-5432',
    status: 'new',
    source: 'phone',
  },
];

// Ajoute la fonction utilitaire pour générer un lead demo :
function generateDemoLeadData(): Partial<LeadFormData> {
  const firstNames = ['John', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Lucas', 'Sophia'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Martin', 'Lee', 'Garcia'];
  const genders = ['Male', 'Female', 'Other'];
  const locations = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Paris', 'London', 'New York'];
  const propertyInterests = ['Off-plan', 'Secondary', 'Both', 'Unknown'];
  const investmentTypes = ['Investment', 'Personal Use'];
  const priorities = ['High', 'Medium', 'Low'];
  const sources = ['website', 'referral', 'social', 'email', 'phone', 'other'];
  const statuses = ['New', 'Follow-up', 'Interested', 'Not Interested', 'No Answer', 'Callback'];
  const budgets = ['500k-1M', '1M-2M', '2M-5M', '5M+'];
  const areas = ['Dubai Marina', 'Downtown', 'Palm Jumeirah', 'Business Bay', 'JVC', 'JLT'];
  const crmIds = ['CRM-001', 'CRM-002', 'CRM-003', 'CRM-004'];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const gender = genders[Math.floor(Math.random() * genders.length)];
  const location = locations[Math.floor(Math.random() * locations.length)];
  const property_interest = propertyInterests[Math.floor(Math.random() * propertyInterests.length)];
  const investment_type = investmentTypes[Math.floor(Math.random() * investmentTypes.length)];
  const priority = priorities[Math.floor(Math.random() * priorities.length)];
  const source = sources[Math.floor(Math.random() * sources.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const budget_range = budgets[Math.floor(Math.random() * budgets.length)];
  const preferred_areas = [areas[Math.floor(Math.random() * areas.length)], areas[Math.floor(Math.random() * areas.length)]];
  const crm_id = crmIds[Math.floor(Math.random() * crmIds.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
  const phone = `+9715${Math.floor(10000000 + Math.random() * 89999999)}`;
  const notes = 'Demo notes for this lead.';
  const ai_notes = 'AI analysis: positive sentiment, interested in luxury properties.';
  const ai_sentiment = Math.round((Math.random() * 100)) / 100; // 0 to 1
  const rating = Math.floor(Math.random() * 6); // 0 to 5

  return {
    firstName,
    lastName,
    email,
    phone,
    gender,
    status,
    source,
    notes,
    ai_notes,
    ai_sentiment,
    rating,
    location,
    property_interest,
    investment_type,
    budget_range,
    preferred_areas,
    priority,
    crm_id,
  };
}

// Fonction utilitaire pour nettoyer les champs avant envoi à Supabase
function cleanLeadFormData(lead: Partial<LeadFormData>): LeadFormData {
  const cleaned: any = {};
  const allowedGenders = ['Male', 'Female', 'Other'];
  const allowedInvestmentTypes = ['Investment', 'Personal Use'];
  const allowedPriorities = ['High', 'Medium', 'Low'];
  const allowedPropertyInterests = ['Off-plan', 'Secondary', 'Both', 'Unknown'];
  const allowedStatuses = ['New', 'Follow-up', 'Interested', 'Not Interested', 'No Answer', 'Callback'];
  Object.entries(lead).forEach(([key, value]) => {
    if (key === 'preferred_areas') {
      if (Array.isArray(value)) {
        cleaned.preferred_areas = value.length > 0 ? value : null;
      } else if (typeof value === 'string' && value.trim() !== '') {
        cleaned.preferred_areas = value.split(',').map((s: string) => s.trim()).filter(Boolean);
      } else {
        cleaned.preferred_areas = null;
      }
    } else if (key === 'gender') {
      cleaned.gender = allowedGenders.includes(value as string) ? value : null;
    } else if (key === 'investment_type') {
      cleaned.investment_type = allowedInvestmentTypes.includes(value as string) ? value : null;
    } else if (key === 'priority') {
      cleaned.priority = allowedPriorities.includes(value as string) ? value : null;
    } else if (key === 'property_interest') {
      cleaned.property_interest = allowedPropertyInterests.includes(value as string) ? value : null;
    } else if (key === 'status') {
      cleaned.status = allowedStatuses.includes(value as string) ? value : null;
    } else if (key === 'rating') {
      const num = Number(value);
      cleaned.rating = !isNaN(num) && num >= 0 && num <= 5 ? num : null;
    } else if (key === 'ai_sentiment') {
      const num = Number(value);
      cleaned.ai_sentiment = !isNaN(num) && num >= 0 && num <= 1 ? num : null;
    } else if (value === '') {
      cleaned[key] = null;
    } else {
      cleaned[key] = value;
    }
  });
  return cleaned as LeadFormData;
}

export default function LeadsPage() {
  const { loading: apiLoading, error: apiError, fetchLeads, fetchLeadById, createLead, updateLead, deleteLead } = useLeadStorage();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isClientSide, setIsClientSide] = useState(false);
  const [filters, setFilters] = useState<{
    status?: LeadStatus[];
    source?: LeadSource[];
  }>({});
  const [newLead, setNewLead] = useState<Partial<LeadFormData>>({
    status: 'new',
    source: '',
  });
  const [preferredAreasInput, setPreferredAreasInput] = useState('');
  
  // Check if we're on client side
  useEffect(() => {
    setIsClientSide(true);
  }, []);
  
  // Load leads on component mount
  useEffect(() => {
    if (isClientSide) {
      loadLeads();
    }
  }, [isClientSide]);
  
  // Function to load leads
  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLeads();
      setLeads(data);
    } catch (error) {
      console.error("Failed to load leads:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle viewing a lead
  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewModalOpen(true);
  };
  
  // Handle editing a lead
  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead);
    setNewLead(lead);
    setIsEditModalOpen(true);
  };
  
  // Handle deleting a lead
  const handleDeleteLead = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  // Open add lead modal
  const handleAddLead = () => {
    setNewLead({
      status: 'new',
      source: '',
    });
    setIsAddModalOpen(true);
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
      if (newFilters.status && newFilters.status.length > 0) {
        apiFilters.status = newFilters.status[0];
      }
      if (newFilters.source && newFilters.source.length > 0) {
        apiFilters.source = newFilters.source[0] as LeadSource;
      }
      const data = await fetchLeads();
      setLeads(data);
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
    await loadLeads();
  };

  // Initialiser preferredAreasInput lors de l'ouverture du formulaire
  useEffect(() => {
    setPreferredAreasInput(newLead.preferred_areas ? newLead.preferred_areas.join(', ') : '');
  }, [isAddModalOpen, isEditModalOpen, newLead.preferred_areas]);

  // Handle saving a new lead
  const handleSaveLead = async () => {
    setIsLoading(true);
    try {
      if (!newLead.firstName || !newLead.lastName || !newLead.email || !newLead.phone || !newLead.source) {
        throw new Error("Please fill in all required fields");
      }
      // Convertir la string en tableau
      const preferred_areas = preferredAreasInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const cleanedLead = cleanLeadFormData({ ...newLead, preferred_areas });
      const createdLead = await createLead(cleanedLead);
      if (createdLead) {
        setLeads([createdLead, ...leads]);
        setIsAddModalOpen(false);
        setNewLead({ status: 'new', source: '' });
      }
    } catch (error) {
      console.error("Failed to create lead:", error);
      alert(error instanceof Error ? error.message : "Failed to create lead");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle updating a lead
  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    setIsLoading(true);
    try {
      if (!newLead.firstName || !newLead.lastName || !newLead.email || !newLead.phone || !newLead.source) {
        throw new Error("Please fill in all required fields");
      }
      // Convertir la string en tableau
      const preferred_areas = preferredAreasInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const cleanedLead = cleanLeadFormData({ ...newLead, preferred_areas });
      const updatedLead = await updateLead(selectedLead.id, cleanedLead);
      if (updatedLead) {
        setLeads(leads.map(lead => lead.id === updatedLead.id ? updatedLead : lead));
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to update lead:", error);
      alert(error instanceof Error ? error.message : "Failed to update lead");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle confirming lead deletion
  const handleConfirmDeleteLead = async () => {
    if (!selectedLead) return;
    
    setIsLoading(true);
    
    try {
      const success = await deleteLead(selectedLead.id);
      
      if (success) {
        // Remove from leads list
        setLeads(leads.filter(lead => lead.id !== selectedLead.id));
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Failed to delete lead:", error);
      alert(error instanceof Error ? error.message : "Failed to delete lead");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter leads based on search term and filters
  const filteredLeads = leads.filter(
    (lead) => {
      // First apply search term
      const matchesSearch = 
        `${lead.firstName ?? ''} ${lead.lastName ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.email ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.phone ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.status ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.source ?? '').toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Then apply filters
      if (filters.status && filters.status.length > 0 && !filters.status.includes(lead.status ?? '')) {
        return false;
      }

      if (filters.source && filters.source.length > 0 && !filters.source.includes(lead.source as LeadSource)) {
        return false;
      }

      return true;
    }
  );

  // Function to get status badge color
  const getStatusBadgeColor = (status: LeadStatus | undefined) => {
    switch (status ?? 'new') {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'qualified':
        return 'bg-green-100 text-green-800';
      case 'unqualified':
        return 'bg-red-100 text-red-800';
      case 'converted':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to get source badge color
  const getSourceBadgeColor = (source: LeadSource | undefined) => {
    switch (source ?? 'other') {
      case 'website':
        return 'bg-indigo-100 text-indigo-800';
      case 'referral':
        return 'bg-green-100 text-green-800';
      case 'social':
        return 'bg-blue-100 text-blue-800';
      case 'email':
        return 'bg-yellow-100 text-yellow-800';
      case 'phone':
        return 'bg-purple-100 text-purple-800';
      case 'other':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render lead avatar/initials
  const renderAvatar = (lead: Lead) => {
    // Generate initials
    const initials = `${lead.firstName?.charAt(0) ?? ''}${lead.lastName?.charAt(0) ?? ''}`.toUpperCase();
    return (
      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-medium">
        {initials}
      </div>
    );
  };

  // Table columns configuration
  const columns: Column<Lead>[] = [
    {
      header: 'Contact',
      accessor: (lead) => (
        <div>
          <div className="text-sm font-medium text-gray-900 truncate">{`${lead.firstName} ${lead.lastName}`}</div>
          <div className="text-sm text-gray-600 truncate">{lead.email}</div>
        </div>
      ),
      sortable: true,
      width: "w-[25%]"
    },
    {
      header: 'Status',
      accessor: (lead) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(lead.status)}`}>
          {(lead.status ?? '').charAt(0).toUpperCase() + (lead.status ?? '').slice(1)}
        </span>
      ),
      sortable: true,
      width: "w-[12%]"
    },
    {
      header: 'Source',
      accessor: (lead) => (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(lead.source as LeadSource | undefined)}`}>
          {(lead.source ?? '').charAt(0).toUpperCase() + (lead.source ?? '').slice(1)}
        </span>
      ),
      sortable: true,
      width: "w-[12%]"
    },
    {
      header: 'Actions',
      accessor: (lead) => (
        <div className="flex justify-end space-x-1">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleViewLead(lead);
            }}
            variant="secondary"
            size="sm"
            icon={<EyeIcon className="h-4 w-4" />}
            aria-label="View"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleEditLead(lead);
            }}
            variant="outline"
            size="sm"
            icon={<PencilIcon className="h-4 w-4" />}
            aria-label="Edit"
          />
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteLead(lead);
            }}
            variant="danger"
            size="sm"
            icon={<TrashIcon className="h-4 w-4" />}
            aria-label="Delete"
          />
        </div>
      ),
      width: "w-[16%]"
    }
  ];

  // Empty state for table
  const emptyState = (
    <div className="py-8 text-center">
      <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No leads</h3>
      <p className="mt-1 text-sm text-gray-600">
        Get started by creating a new lead.
      </p>
      <div className="mt-6">
        <Button
          variant="primary"
          onClick={handleAddLead}
          icon={<UserPlusIcon className="h-5 w-5" />}
        >
          Add New Lead
        </Button>
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leads</h2>
            <p className="text-gray-600 mt-1">Manage your sales leads and track conversion progress.</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button
              variant="primary"
              onClick={handleAddLead}
              icon={<UserPlusIcon className="h-5 w-5" />}
            >
              Add New Lead
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search leads..."
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

        <Table<Lead>
          data={filteredLeads}
          columns={columns}
          keyExtractor={(lead) => lead.id}
          sortField={undefined}
          sortDirection="desc"
          emptyState={emptyState}
          isLoading={isLoading}
          onRowClick={handleViewLead}
        />
      </div>

      {/* Lead Detail Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Lead Details"
        size="lg"
        closeOnOutsideClick={false}
      >
        {selectedLead && (
          <div className="space-y-6">
            {/* Lead header info */}
            <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-12 w-12 flex-shrink-0">
                    {renderAvatar(selectedLead)}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{`${selectedLead.firstName} ${selectedLead.lastName}`}</h3>
                    <div className="flex items-center mt-1 space-x-3 text-sm text-gray-600">
                      <span className="flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" /> {(selectedLead as any)?.numberOfCalls ?? 0} calls
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedLead.status)}`}>
                    {(selectedLead.status ?? '').charAt(0).toUpperCase() + (selectedLead.status ?? '').slice(1)}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getSourceBadgeColor(selectedLead.source as LeadSource | undefined)}`}>
                    {(selectedLead.source ?? '').charAt(0).toUpperCase() + (selectedLead.source ?? '').slice(1)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lead details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Contact Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3">
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Email:</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <a href={`mailto:${selectedLead.email}`} className="text-blue-600 hover:underline">{selectedLead.email}</a>
                      </dd>
                    </div>
                    <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Phone:</dt>
                      <dd className="text-sm text-gray-900 flex items-center">
                        <PhoneIcon className="h-4 w-4 text-gray-400 mr-1.5" />
                        <a href={`tel:${selectedLead.phone}`} className="text-blue-600 hover:underline">{selectedLead.phone}</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Lead Information</h4>
                <div className="bg-gray-50 p-4 rounded-md">
                  <dl className="space-y-3">
                    {/* <div className="flex items-center">
                      <dt className="text-sm font-medium text-gray-500 w-24 flex-shrink-0">Added:</dt>
                      <dd className="text-sm text-gray-900">{selectedLead.dateAdded}</dd>
                    </div> */}
                  </dl>
                </div>
              </div>
            </div>
            
            {/* Lead notes */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Notes</h4>
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-sm text-gray-800">
                  {selectedLead.notes || 'No notes have been added for this lead.'}
                </p>
              </div>
            </div>
            
            {/* Lead tags */}
            {/* {selectedLead.tags && selectedLead.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedLead.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      <TagIcon className="h-3 w-3 mr-1.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )} */}
            
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
                Edit Lead
              </Button>
              <Button
                type="button"
                variant="primary"
                icon={<PhoneIcon className="h-5 w-5" />}
              >
                Contact Lead
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Lead Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
        size="xl"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name*
              </label>
              <Input
                id="firstName"
                value={newLead.firstName ?? ''}
                onChange={(e) => setNewLead({ ...newLead, firstName: e.target.value })}
                placeholder="Enter first name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name*
              </label>
              <Input
                id="lastName"
                value={newLead.lastName ?? ''}
                onChange={(e) => setNewLead({ ...newLead, lastName: e.target.value })}
                placeholder="Enter last name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email*
              </label>
              <Input
                id="email"
                type="email"
                value={newLead.email ?? ''}
                onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                placeholder="Enter email address"
                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                required
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone*
              </label>
              <Input
                id="phone"
                type="tel"
                value={newLead.phone ?? ''}
                onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                placeholder="Enter phone number"
                leftIcon={<PhoneIcon className="h-5 w-5" />}
                required
              />
            </div>
            
            <div>
              <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1">
                Source*
              </label>
              <Select
                id="source"
                value={newLead.source ?? ''}
                onChange={(e) => setNewLead({ ...newLead, source: e.target.value as LeadSource })}
                required
                options={[
                  { value: '', label: 'Select a source' },
                  { value: 'website', label: 'Website' },
                  { value: 'referral', label: 'Referral' },
                  { value: 'social', label: 'Social Media' },
                  { value: 'email', label: 'Email Campaign' },
                  { value: 'phone', label: 'Phone Call' },
                  { value: 'other', label: 'Other' }
                ]}
              />
            </div>
            
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Status*
              </label>
              <Select
                id="status"
                value={newLead.status ?? ''}
                onChange={(e) => setNewLead({ ...newLead, status: e.target.value })}
                required
                options={[
                  { value: '', label: 'Select status' },
                  { value: 'New', label: 'New' },
                  { value: 'Follow-up', label: 'Follow-up' },
                  { value: 'Interested', label: 'Interested' },
                  { value: 'Not Interested', label: 'Not Interested' },
                  { value: 'No Answer', label: 'No Answer' },
                  { value: 'Callback', label: 'Callback' },
                ]}
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Select
                id="gender"
                value={newLead.gender ?? ''}
                onChange={(e) => setNewLead({ ...newLead, gender: e.target.value })}
                options={[
                  { value: '', label: 'Select gender' },
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ]}
                required={false}
              />
            </div>
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <Input
                id="location"
                value={newLead.location ?? ''}
                onChange={(e) => setNewLead({ ...newLead, location: e.target.value })}
                placeholder="Enter location"
              />
            </div>
            <div>
              <label htmlFor="property_interest" className="block text-sm font-medium text-gray-700 mb-1">Property Interest</label>
              <Select
                id="property_interest"
                value={newLead.property_interest ?? ''}
                onChange={(e) => setNewLead({ ...newLead, property_interest: e.target.value })}
                options={[
                  { value: '', label: 'Select property interest' },
                  { value: 'Off-plan', label: 'Off-plan' },
                  { value: 'Secondary', label: 'Secondary' },
                  { value: 'Both', label: 'Both' },
                  { value: 'Unknown', label: 'Unknown' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="investment_type" className="block text-sm font-medium text-gray-700 mb-1">Investment Type</label>
              <Select
                id="investment_type"
                value={newLead.investment_type ?? ''}
                onChange={(e) => setNewLead({ ...newLead, investment_type: e.target.value })}
                options={[
                  { value: '', label: 'Select investment type' },
                  { value: 'Investment', label: 'Investment' },
                  { value: 'Personal Use', label: 'Personal Use' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="budget_range" className="block text-sm font-medium text-gray-700 mb-1">Budget Range</label>
              <Input
                id="budget_range"
                value={newLead.budget_range ?? ''}
                onChange={(e) => setNewLead({ ...newLead, budget_range: e.target.value })}
                placeholder="Enter budget range"
              />
            </div>
            <div>
              <label htmlFor="preferred_areas" className="block text-sm font-medium text-gray-700 mb-1">Preferred Areas (comma separated)</label>
              <Input
                id="preferred_areas"
                value={preferredAreasInput}
                onChange={(e) => setPreferredAreasInput(e.target.value)}
                placeholder="e.g. Dubai Marina, Downtown"
              />
            </div>
            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <Select
                id="priority"
                value={newLead.priority ?? ''}
                onChange={(e) => setNewLead({ ...newLead, priority: e.target.value })}
                options={[
                  { value: '', label: 'Select priority' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ]}
              />
            </div>
            <div>
              <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <Input
                id="rating"
                type="number"
                value={newLead.rating ?? ''}
                onChange={(e) => setNewLead({ ...newLead, rating: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="Enter rating (1-5)"
                min={1}
                max={5}
              />
            </div>
            <div>
              <label htmlFor="ai_sentiment" className="block text-sm font-medium text-gray-700 mb-1">AI Sentiment</label>
              <Input
                id="ai_sentiment"
                type="number"
                value={newLead.ai_sentiment ?? ''}
                onChange={(e) => setNewLead({ ...newLead, ai_sentiment: e.target.value ? Number(e.target.value) : undefined })}
                placeholder="AI sentiment score"
                step="0.01"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="ai_notes" className="block text-sm font-medium text-gray-700 mb-1">AI Notes</label>
              <textarea
                id="ai_notes"
                rows={2}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="AI notes about this lead"
                value={newLead.ai_notes ?? ''}
                onChange={(e) => setNewLead({ ...newLead, ai_notes: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="crm_id" className="block text-sm font-medium text-gray-700 mb-1">CRM ID</label>
              <Input
                id="crm_id"
                value={newLead.crm_id ?? ''}
                onChange={(e) => setNewLead({ ...newLead, crm_id: e.target.value })}
                placeholder="CRM ID"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Add any notes about this lead"
                value={newLead.notes ?? ''}
                onChange={(e) => setNewLead({ ...newLead, notes: e.target.value })}
              />
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
              variant="secondary"
              onClick={() => setNewLead(generateDemoLeadData())}
            >
              Demo
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleSaveLead}
              disabled={!newLead.firstName || !newLead.lastName || !newLead.email || !newLead.phone || !newLead.source}
            >
              Add Lead
            </Button>
          </div>
        </div>
      </Modal>

      {/* Filter Modal */}
      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Leads"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="grid grid-cols-2 gap-2">
              {(['new', 'contacted', 'qualified', 'unqualified', 'converted'] as const).map((status) => (
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
            <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
            <div className="grid grid-cols-2 gap-2">
              {(['website', 'referral', 'social', 'email', 'phone', 'other'] as const).map((source) => (
                <div key={source} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`source-${source}`}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    checked={filters.source?.includes(source) || false}
                    onChange={(e) => {
                      const newSource = [...(filters.source || [])];
                      if (e.target.checked) {
                        newSource.push(source);
                      } else {
                        const index = newSource.indexOf(source);
                        if (index !== -1) newSource.splice(index, 1);
                      }
                      setFilters({ ...filters, source: newSource.length ? newSource : undefined });
                    }}
                  />
                  <label htmlFor={`source-${source}`} className="ml-2 block text-sm text-gray-900 capitalize">
                    {source}
                  </label>
                </div>
              ))}
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
        title="Delete Lead"
        size="sm"
      >
        {selectedLead && (
          <div className="space-y-4">
            <div className="flex items-center justify-center text-red-600">
              <TrashIcon className="h-12 w-12" />
            </div>
            <p className="text-center text-gray-700">
              Are you sure you want to delete the lead for <strong>{selectedLead.firstName} {selectedLead.lastName}</strong>? This action cannot be undone.
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
                onClick={handleConfirmDeleteLead}
                icon={<TrashIcon className="h-5 w-5" />}
              >
                Delete Lead
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
} 