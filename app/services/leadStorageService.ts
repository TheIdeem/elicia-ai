import { Lead, LeadFormData } from '../leads/types';
import { v4 as uuidv4 } from 'uuid';
import { createCall } from './callService';

const LEADS_STORAGE_KEY = 'elicia_leads';
const SETTINGS_STORAGE_KEY = 'elicia_settings';

// Server-side cache for when localStorage is not available
let SERVER_CACHE: Lead[] | null = null;

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
 * Get all leads from localStorage
 */
export function getLeads(filters?: Partial<Lead>): Lead[] {
  try {
    const leadsJson = safeLocalStorage.getItem(LEADS_STORAGE_KEY);
    let leads: Lead[];
    
    if (leadsJson) {
      leads = JSON.parse(leadsJson);
      // Update server cache if we're on the client
      if (typeof window !== 'undefined') {
        SERVER_CACHE = leads;
      }
    } else if (SERVER_CACHE) {
      // Use server cache if localStorage is empty or we're on the server
      leads = SERVER_CACHE;
    } else {
      leads = [];
    }
    
    // Parse dates to compare them properly
    const parseDateString = (dateStr: string | undefined) => {
      if (!dateStr) return new Date(0);
      
      // Handle different date formats
      if (dateStr.includes(',')) {
        // Format like "Oct 12, 2023"
        return new Date(dateStr);
      }
      
      return new Date(dateStr);
    };
    
    // Sort by dateAdded in descending order
    const sortedLeads = leads.sort((a, b) => {
      return parseDateString(b.dateAdded).getTime() - parseDateString(a.dateAdded).getTime();
    });
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      return sortedLeads.filter(lead => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          return lead[key as keyof Lead] === value;
        });
      });
    }
    
    return sortedLeads;
  } catch (error) {
    console.error('Error retrieving leads from localStorage:', error);
    return [];
  }
}

/**
 * Get a single lead by ID
 */
export function getLeadById(id: string): Lead | null {
  try {
    const leads = getLeads();
    const lead = leads.find(lead => lead.id === id);
    
    if (!lead) {
      console.error(`Lead with id ${id} not found`);
      return null;
    }
    
    return lead;
  } catch (error) {
    console.error(`Error retrieving lead with id ${id}:`, error);
    return null;
  }
}

/**
 * Get automated calling settings from localStorage
 */
function getAutomatedCallSettings() {
  try {
    const settingsJson = safeLocalStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!settingsJson) return null;
    
    const settings = JSON.parse(settingsJson);
    return {
      enabled: settings.autoCallEnabled || false,
      delay: settings.autoCallDelay || 5,
      retries: settings.autoCallRetries || 2,
      agentId: settings.autoCallAgent || '',
    };
  } catch (error) {
    console.error('Error retrieving automated call settings:', error);
    return null;
  }
}

/**
 * Schedule an automated call to a lead, with retry logic
 */
function scheduleAutomatedCall(lead: Lead): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }

  const settings = getAutomatedCallSettings();
  if (!settings || !settings.enabled) {
    return;
  }

  const maxRetries = settings.retries || 0;
  const delayMinutes = settings.delay || 5;
  const agentId = settings.agentId || undefined;

  // Helper to attempt a call with retries
  const attemptCall = async (retryCount: number) => {
    try {
      console.log(`Attempting automated call to ${lead.firstName} ${lead.lastName}, try #${retryCount + 1}`);
      // Format phone number
      const phoneNumber = lead.phone.replace(/\D/g, '');
      const finalNumber = !phoneNumber.startsWith('+') 
        ? (phoneNumber.startsWith('1') ? `+${phoneNumber}` : `+1${phoneNumber}`)
        : lead.phone;

      // Create the call
      const callResponse = await createCall(
        finalNumber, 
        lead.id, 
        agentId
      );

      console.log('Automated call response:', callResponse);

      // Check if call was successful (status 'scheduled', 'in-progress', or 'completed')
      const status = callResponse.status;
      const isSuccess = status === 'scheduled' || status === 'in-progress' || status === 'completed';
      if (isSuccess && !callResponse.error) {
        // Update the lead with call information
        updateLead(lead.id, {
          lastContactDate: new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }),
          numberOfCalls: (lead.numberOfCalls || 0) + 1
        });
        return; // Success, stop retrying
      } else {
        // If failed and retries remain, try again after delay
        if (retryCount < maxRetries) {
          console.warn(`Call attempt #${retryCount + 1} failed for lead ${lead.firstName} ${lead.lastName}. Retrying in ${delayMinutes} minutes...`);
          setTimeout(() => {
            attemptCall(retryCount + 1);
          }, delayMinutes * 60 * 1000);
        } else {
          console.error(`Automated call failed after ${retryCount + 1} attempts for lead ${lead.firstName} ${lead.lastName}. Giving up.`);
        }
      }
    } catch (error) {
      // If error and retries remain, try again after delay
      if (retryCount < maxRetries) {
        console.error(`Error during call attempt #${retryCount + 1} for lead ${lead.firstName} ${lead.lastName}:`, error);
        setTimeout(() => {
          attemptCall(retryCount + 1);
        }, delayMinutes * 60 * 1000);
      } else {
        console.error(`Automated call failed after ${retryCount + 1} attempts for lead ${lead.firstName} ${lead.lastName}. Giving up.`);
      }
    }
  };

  // Schedule the first call after the configured delay
  setTimeout(() => {
    attemptCall(0);
  }, delayMinutes * 60 * 1000);
}

/**
 * Create a new lead
 */
export function createLead(leadData: LeadFormData): Lead {
  try {
    // Ensure dateAdded is set
    if (!leadData.dateAdded) {
      leadData.dateAdded = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    // Generate UUID for new lead
    const newLead: Lead = {
      ...leadData,
      id: uuidv4()
    };
    
    // Get existing leads and add the new one
    const leads = getLeads();
    leads.unshift(newLead);
    
    // Save back to localStorage
    safeLocalStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = leads;
    }
    
    // Schedule automated call if enabled
    scheduleAutomatedCall(newLead);
    
    return newLead;
  } catch (error) {
    console.error('Error creating lead:', error);
    throw error;
  }
}

/**
 * Update an existing lead
 */
export function updateLead(id: string, leadData: Partial<LeadFormData>): Lead {
  try {
    // Get existing leads
    const leads = getLeads();
    const leadIndex = leads.findIndex(lead => lead.id === id);
    
    if (leadIndex === -1) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    // Update the lead
    const updatedLead: Lead = {
      ...leads[leadIndex],
      ...leadData,
    };
    
    leads[leadIndex] = updatedLead;
    
    // Save back to localStorage
    safeLocalStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = leads;
    }
    
    return updatedLead;
  } catch (error) {
    console.error(`Error updating lead with id ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a lead
 */
export function deleteLead(id: string): boolean {
  try {
    // Get existing leads
    const leads = getLeads();
    const updatedLeads = leads.filter(lead => lead.id !== id);
    
    if (updatedLeads.length === leads.length) {
      throw new Error(`Lead with id ${id} not found`);
    }
    
    // Save updated list back to localStorage
    safeLocalStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(updatedLeads));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = updatedLeads;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting lead with id ${id}:`, error);
    throw error;
  }
}

/**
 * Initialize with sample data if none exists
 */
export function initializeLeadsData(): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check if we already have leads in localStorage
  const leadsJson = safeLocalStorage.getItem(LEADS_STORAGE_KEY);
  
  // If no leads exist, add sample data
  if (!leadsJson || JSON.parse(leadsJson).length === 0) {
    const sampleLeads: Lead[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@example.com',
        phone: '+1 (555) 123-4567',
        company: 'Acme Corporation',
        jobTitle: 'Marketing Director',
        status: 'new',
        source: 'website',
        dateAdded: 'Oct 12, 2023',
        lastContactDate: 'Oct 14, 2023',
        notes: 'Interested in our premium plan',
        tags: ['marketing', 'high-value'],
        numberOfCalls: 3
      },
      {
        id: '2',
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        company: 'Tech Solutions',
        jobTitle: 'CTO',
        status: 'contacted',
        source: 'referral',
        dateAdded: 'Oct 10, 2023',
        lastContactDate: 'Oct 15, 2023',
        notes: 'Follow up on technical requirements',
        tags: ['technical', 'decision-maker'],
        numberOfCalls: 5
      },
      {
        id: '3',
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.brown@example.com',
        phone: '+1 (555) 345-6789',
        company: 'Brown Enterprises',
        jobTitle: 'CEO',
        status: 'qualified',
        source: 'social',
        dateAdded: 'Oct 5, 2023',
        lastContactDate: 'Oct 13, 2023',
        tags: ['executive', 'high-value'],
        numberOfCalls: 7
      },
      {
        id: '4',
        firstName: 'Emma',
        lastName: 'Davis',
        email: 'emma.davis@example.com',
        phone: '+1 (555) 234-5678',
        jobTitle: 'Office Manager',
        status: 'unqualified',
        source: 'email',
        dateAdded: 'Oct 8, 2023',
        notes: 'Budget too low for our services',
        numberOfCalls: 1
      },
      {
        id: '5',
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.wilson@example.com',
        phone: '+1 (555) 876-5432',
        company: 'Wilson & Co',
        jobTitle: 'Procurement Manager',
        status: 'new',
        source: 'phone',
        dateAdded: 'Oct 16, 2023',
        numberOfCalls: 2
      },
    ];
    
    safeLocalStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(sampleLeads));
    SERVER_CACHE = sampleLeads;
  }
}

/**
 * Import multiple leads from an array
 * Supports automated calling with configurable delay between calls
 */
export function importLeads(leadsData: LeadFormData[]): Lead[] {
  try {
    if (!leadsData || !Array.isArray(leadsData) || leadsData.length === 0) {
      throw new Error('No valid leads data provided for import');
    }
    
    // Get existing leads
    const existingLeads = getLeads();
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    // Process new leads
    const newLeads: Lead[] = leadsData.map(leadData => {
      // Ensure required fields
      if (!leadData.dateAdded) {
        leadData.dateAdded = currentDate;
      }
      
      // Generate UUID for new lead
      return {
        ...leadData,
        id: uuidv4(),
        // Initialize call tracking
        numberOfCalls: 0
      };
    });
    
    // Combine with existing leads
    const allLeads = [...newLeads, ...existingLeads];
    
    // Save to localStorage
    safeLocalStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(allLeads));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = allLeads;
    }
    
    // Check if automated calling is enabled
    const settings = getAutomatedCallSettings();
    if (settings && settings.enabled && typeof window !== 'undefined') {
      // Schedule calls with staggered delays to avoid overwhelming the system
      newLeads.forEach((lead, index) => {
        // Add extra delay between each lead based on its position
        const staggeredDelay = (settings.delay + (index * 2)) * 60 * 1000;
        
        setTimeout(() => {
          scheduleAutomatedCall(lead);
        }, staggeredDelay);
      });
      
      console.log(`Scheduled automated calls for ${newLeads.length} imported leads`);
    }
    
    return newLeads;
  } catch (error) {
    console.error('Error importing leads:', error);
    throw error;
  }
}

/**
 * Import leads from CSV content
 */
export function importLeadsFromCSV(csvContent: string): Lead[] {
  try {
    // Basic CSV parsing (can be enhanced with a proper CSV parser library)
    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      throw new Error('CSV file must contain headers and at least one lead');
    }
    
    // Get header row and convert to lowercase for reliable mapping
    const headers = lines[0].split(',').map(header => 
      header.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
    );
    
    // Required field indices
    const firstNameIndex = headers.indexOf('firstname');
    const lastNameIndex = headers.indexOf('lastname');
    const phoneIndex = headers.indexOf('phone');
    
    if (firstNameIndex === -1 || lastNameIndex === -1 || phoneIndex === -1) {
      throw new Error('CSV file must contain firstName, lastName, and phone columns');
    }
    
    // Map CSV data to lead objects
    const leadsData: LeadFormData[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines
      
      const values = line.split(',').map(val => val.trim());
      if (values.length < headers.length) continue; // Skip incomplete lines
      
      const leadData: any = {
        firstName: values[firstNameIndex],
        lastName: values[lastNameIndex],
        phone: values[phoneIndex],
        status: 'new',
        source: 'import'
      };
      
      // Add other fields if they exist in the CSV
      headers.forEach((header, index) => {
        if (
          header !== 'firstname' && 
          header !== 'lastname' && 
          header !== 'phone' &&
          header !== 'id' &&
          values[index]
        ) {
          // Map CSV headers to lead properties
          const mappedField = mapCSVHeaderToLeadField(header);
          if (mappedField) {
            leadData[mappedField] = values[index];
          }
        }
      });
      
      leadsData.push(leadData as LeadFormData);
    }
    
    // Import the processed leads
    return importLeads(leadsData);
  } catch (error) {
    console.error('Error importing leads from CSV:', error);
    throw error;
  }
}

/**
 * Map CSV headers to lead fields
 */
function mapCSVHeaderToLeadField(header: string): string | null {
  const headerMappings: Record<string, string> = {
    email: 'email',
    emailaddress: 'email',
    company: 'company',
    companyname: 'company',
    jobtitle: 'jobTitle',
    title: 'jobTitle',
    position: 'jobTitle',
    status: 'status',
    leadstatus: 'status',
    source: 'source',
    leadsource: 'source',
    notes: 'notes',
    note: 'notes',
    comments: 'notes',
    tags: 'tags',
    tag: 'tags'
  };
  
  return headerMappings[header] || null;
} 