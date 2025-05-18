// Property types based on database schema
export type PropertyType = 'Villa' | 'Penthouse' | 'Apartment' | 'Duplex' | 'Townhouses';
export type PropertyStatus = 'available' | 'sold' | 'pending' | 'rented';
export type PropertyMarketType = 'offplan' | 'second market';

export interface Coordinates {
  x: number;
  y: number;
}

export interface PropertyFeature {
  name: string;
  value: string | boolean;
}

export interface Property {
  id: string; // uuid
  reference: string; // text
  type: PropertyType; // USER-DEFINED property_type
  status: PropertyStatus; // USER-DEFINED property_status
  market_type: PropertyMarketType; // Market type: offplan or second market
  title: string; // text
  description: string; // text
  address: string; // text
  location_coordinates: string; // point (format '(x, y)')
  price: number; // numeric
  size_sqm: number; // numeric
  bedrooms: number; // smallint
  bathrooms: number; // smallint
  parking_spots: string; // text (ex: 'Covered Parking')
  year_built: number; // smallint
  features: PropertyFeature[]; // jsonb
  images: string[]; // ARRAY text
  documents: string[]; // ARRAY text
  created_at?: string; // timestamptz
  updated_at?: string; // timestamptz
  created_by?: string; // uuid
  last_modified_by?: string; // uuid
  source_url?: string; // Ajouté pour l'import externe
}

// Form data type for creating/updating properties
export type PropertyFormData = Omit<Property, 'id' | 'created_at' | 'updated_at'>; 