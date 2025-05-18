import { Property, PropertyFormData } from '../properties/types';
import { v4 as uuidv4 } from 'uuid';

const PROPERTIES_STORAGE_KEY = 'elicia_properties';

// Server-side cache for when localStorage is not available
let SERVER_CACHE: Property[] | null = null;

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
 * Get all properties from localStorage
 */
export function getProperties(filters?: Partial<Property>): Property[] {
  try {
    const propertiesJson = safeLocalStorage.getItem(PROPERTIES_STORAGE_KEY);
    let properties: Property[];
    
    if (propertiesJson) {
      properties = JSON.parse(propertiesJson);
      // Update server cache if we're on the client
      if (typeof window !== 'undefined') {
        SERVER_CACHE = properties;
      }
    } else if (SERVER_CACHE) {
      // Use server cache if localStorage is empty or we're on the server
      properties = SERVER_CACHE;
    } else {
      properties = [];
    }
    
    // Sort by created_at in descending order
    const sortedProperties = properties.sort((a, b) => {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    });
    
    // Apply filters if provided
    if (filters && Object.keys(filters).length > 0) {
      return sortedProperties.filter(prop => {
        return Object.entries(filters).every(([key, value]) => {
          if (value === undefined || value === null) return true;
          return prop[key as keyof Property] === value;
        });
      });
    }
    
    return sortedProperties;
  } catch (error) {
    console.error('Error retrieving properties from localStorage:', error);
    return [];
  }
}

/**
 * Get a single property by ID
 */
export function getPropertyById(id: string): Property | null {
  try {
    const properties = getProperties();
    const property = properties.find(prop => prop.id === id);
    
    if (!property) {
      console.error(`Property with id ${id} not found`);
      return null;
    }
    
    return property;
  } catch (error) {
    console.error(`Error retrieving property with id ${id}:`, error);
    return null;
  }
}

/**
 * Create a new property
 */
export function createProperty(propertyData: PropertyFormData): Property {
  try {
    // Generate UUID for new property
    const newProperty: Property = {
      ...propertyData,
      id: uuidv4(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Generate UUID for agent_id if not provided
      agent_id: propertyData.agent_id || uuidv4()
    };
    
    // Get existing properties and add the new one
    const properties = getProperties();
    properties.unshift(newProperty);
    
    // Save back to localStorage
    safeLocalStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = properties;
    }
    
    return newProperty;
  } catch (error) {
    console.error('Error creating property:', error);
    throw error;
  }
}

/**
 * Update an existing property
 */
export function updateProperty(id: string, propertyData: Partial<PropertyFormData>): Property {
  try {
    // Get existing properties
    const properties = getProperties();
    const propertyIndex = properties.findIndex(prop => prop.id === id);
    
    if (propertyIndex === -1) {
      throw new Error(`Property with id ${id} not found`);
    }
    
    // Update the property
    const updatedProperty: Property = {
      ...properties[propertyIndex],
      ...propertyData,
      updated_at: new Date().toISOString()
    };
    
    properties[propertyIndex] = updatedProperty;
    
    // Save back to localStorage
    safeLocalStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(properties));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = properties;
    }
    
    return updatedProperty;
  } catch (error) {
    console.error(`Error updating property with id ${id}:`, error);
    throw error;
  }
}

/**
 * Delete a property
 */
export function deleteProperty(id: string): boolean {
  try {
    // Get existing properties
    const properties = getProperties();
    const updatedProperties = properties.filter(prop => prop.id !== id);
    
    if (updatedProperties.length === properties.length) {
      throw new Error(`Property with id ${id} not found`);
    }
    
    // Save updated list back to localStorage
    safeLocalStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(updatedProperties));
    
    // Update server cache
    if (typeof window === 'undefined') {
      SERVER_CACHE = updatedProperties;
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting property with id ${id}:`, error);
    throw error;
  }
}

/**
 * Initialize with sample data if none exists
 */
export function initializePropertiesData(): void {
  // Only run on client side
  if (typeof window === 'undefined') {
    return;
  }
  
  // Check if we already have properties in localStorage
  const propertiesJson = safeLocalStorage.getItem(PROPERTIES_STORAGE_KEY);
  
  // If no properties exist, add some sample data
  if (!propertiesJson || JSON.parse(propertiesJson).length === 0) {
    const sampleProperties: Property[] = [
      {
        id: uuidv4(),
        reference: 'PROP-001',
        type: 'Villa',
        status: 'available',
        property_type: 'second market',
        title: 'Modern Villa with Pool in Palm Jumeirah',
        description: 'Beautiful modern villa with swimming pool and garden in one of Dubai\'s most prestigious areas',
        address: '123 Palm Jumeirah, Dubai, UAE, P.O. Box 12345',
        location_coordinates: { x: 25.1164, y: 55.1352 },
        price: 12500000,
        size_sqm: 350,
        bedrooms: 4,
        bathrooms: 3,
        parking_spots: 2,
        year_built: 2019,
        features: [
          { name: 'Air Conditioning', value: true },
          { name: 'Heating', value: true },
          { name: 'Pool', value: true },
          { name: 'Garden', value: true },
          { name: 'Security System', value: false },
          { name: 'Garage', value: true },
        ],
        images: ['/sample-property-1.jpg'],
        documents: [],
        agent_id: 'agent-123',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: uuidv4(),
        last_modified_by: uuidv4()
      },
      {
        id: uuidv4(),
        reference: 'PROP-002',
        type: 'Apartment',
        status: 'available',
        property_type: 'offplan',
        title: 'Luxury Apartment in Downtown Dubai',
        description: 'Prime location apartment in Downtown Dubai with stunning Burj Khalifa views',
        address: '456 Sheikh Mohammed bin Rashid Blvd, Downtown Dubai, Dubai, UAE, P.O. Box 54321',
        location_coordinates: { x: 25.2048, y: 55.2708 },
        price: 3950000,
        size_sqm: 120,
        bedrooms: 2,
        bathrooms: 2,
        parking_spots: 1,
        year_built: 2023,
        features: [
          { name: 'Air Conditioning', value: true },
          { name: 'Heating', value: true },
          { name: 'Pool', value: false },
          { name: 'Garden', value: false },
          { name: 'Security System', value: true },
          { name: 'Garage', value: true },
        ],
        images: ['/sample-property-2.jpg'],
        documents: [],
        agent_id: 'agent-456',
        created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        updated_at: new Date(Date.now() - 86400000).toISOString(),
        created_by: uuidv4(),
        last_modified_by: uuidv4()
      },
      {
        id: uuidv4(),
        reference: 'PROP-003',
        type: 'Penthouse',
        status: 'sold',
        property_type: 'second market',
        title: 'Luxury Penthouse in Abu Dhabi',
        description: 'Stunning penthouse with panoramic sea views in Abu Dhabi\'s exclusive Al Reem Island',
        address: '789 Al Reem Island, Abu Dhabi, UAE, P.O. Box 98765',
        location_coordinates: { x: 24.4539, y: 54.3773 },
        price: 7750000,
        size_sqm: 280,
        bedrooms: 3,
        bathrooms: 2,
        parking_spots: 2,
        year_built: 2018,
        features: [
          { name: 'Air Conditioning', value: true },
          { name: 'Heating', value: true },
          { name: 'Pool', value: false },
          { name: 'Garden', value: false },
          { name: 'Security System', value: true },
          { name: 'Garage', value: true },
        ],
        images: ['/sample-property-3.jpg'],
        documents: [],
        agent_id: 'agent-789',
        created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        updated_at: new Date(Date.now() - 172800000).toISOString(),
        created_by: uuidv4(),
        last_modified_by: uuidv4()
      }
    ];
    
    safeLocalStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(sampleProperties));
    SERVER_CACHE = sampleProperties;
  }
} 