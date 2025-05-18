import { Property } from '../properties/types';
import { getProperties } from './localStorageService';
import { supabase } from './supabaseClient';

/**
 * Format properties for AI agent context
 * We want to create a concise representation that still contains all relevant details
 */
export function formatPropertiesForAIContext(properties: Property[]): string {
  return properties.map((property, index) => {
    // Format the price with commas
    const formattedPrice = property.price.toLocaleString('en-US');
    
    // Format features as a readable list
    const featuresList = property.features
      .filter(f => f.value === true || f.value === 'true')
      .map(f => f.name)
      .join(', ');
    
    // Create a concise property description
    return `Property ${index + 1}: ${property.reference}
Title: ${property.title}
Type: ${property.type}
Market: ${property.property_type}
Status: ${property.status}
Location: ${property.address}
Price: ${formattedPrice} AED
Size: ${property.size_sqm} sqm
Bedrooms: ${property.bedrooms}
Bathrooms: ${property.bathrooms}
Parking: ${property.parking_spots}
Year Built: ${property.year_built}
Features: ${featuresList}
Description: ${property.description}
`;
  }).join('\n---\n\n');
}

/**
 * Recherche les propriétés dans Supabase selon les critères
 */
export async function searchProperties(criteria: {
  type?: string;
  bedrooms?: number;
  bathrooms?: number;
  maxPrice?: number;
  minPrice?: number;
  location?: string;
  features?: string[];
  marketType?: string;
  status?: string;
}): Promise<Property[]> {
  // Récupérer toutes les propriétés depuis Supabase
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  if (error) {
    console.error('Erreur Supabase properties:', error);
    return [];
  }
  const properties = data as Property[];

  // Filtrer côté JS (pour garder la logique existante)
  return properties.filter(property => {
    // Match property type (fuzzy match)
    if (criteria.type && !property.type.toLowerCase().includes(criteria.type.toLowerCase())) {
      return false;
    }
    // Match bedrooms (exact match)
    if (criteria.bedrooms !== undefined && property.bedrooms < criteria.bedrooms) {
      return false;
    }
    // Match bathrooms (exact match)
    if (criteria.bathrooms !== undefined && property.bathrooms < criteria.bathrooms) {
      return false;
    }
    // Match price range
    if (criteria.maxPrice !== undefined && property.price > criteria.maxPrice) {
      return false;
    }
    if (criteria.minPrice !== undefined && property.price < criteria.minPrice) {
      return false;
    }
    // Match location (fuzzy match)
    if (criteria.location && !property.address.toLowerCase().includes(criteria.location.toLowerCase())) {
      return false;
    }
    // Match features
    if (criteria.features && criteria.features.length > 0) {
      const propertyFeatureNames = property.features
        .filter(f => f.value === true || f.value === 'true')
        .map(f => f.name.toLowerCase());
      const missingRequiredFeatures = criteria.features.some(
        requiredFeature => !propertyFeatureNames.some(
          featureName => featureName.includes(requiredFeature.toLowerCase())
        )
      );
      if (missingRequiredFeatures) {
        return false;
      }
    }
    // Match market type (offplan/second market)
    if (criteria.marketType && property.property_type.toLowerCase() !== criteria.marketType.toLowerCase()) {
      return false;
    }
    // Match status (available, sold, etc.)
    if (criteria.status && property.status.toLowerCase() !== criteria.status.toLowerCase()) {
      return false;
    }
    return true;
  });
}

/**
 * Generate a string response for the AI agent based on search results
 */
export function generatePropertyResponseForAI(
  matchingProperties: Property[], 
  criteria: Record<string, any>
): string {
  if (matchingProperties.length === 0) {
    return `I couldn't find any properties matching your criteria. Would you like me to broaden the search?`;
  }
  
  if (matchingProperties.length === 1) {
    const property = matchingProperties[0];
    return `I found one property that matches your criteria: ${property.title}. It's a ${property.bedrooms}-bedroom ${property.type.toLowerCase()} in ${property.address}, priced at ${property.price.toLocaleString()} AED. It's ${property.size_sqm} square meters and includes ${property.features.filter(f => f.value === true || f.value === 'true').map(f => f.name.toLowerCase()).join(', ')}. Would you like more details about this property?`;
  }
  
  return `I found ${matchingProperties.length} properties that match your criteria. Here are a few options:
${matchingProperties.slice(0, 3).map((property, index) => 
  `Option ${index + 1}: ${property.title} - a ${property.bedrooms}-bedroom ${property.type.toLowerCase()} in ${property.address}, priced at ${property.price.toLocaleString()} AED.`
).join('\n')}

Would you like more details about any of these properties?`;
}

/**
 * Parse natural language request for property search
 * This uses simple keyword matching but could be enhanced with more sophisticated NLP
 */
export function parsePropertySearchRequest(text: string): Record<string, any> {
  const criteria: Record<string, any> = {};
  
  // Extract property type
  const typeMatches = text.match(/apartment|villa|penthouse|duplex|townhouse/gi);
  if (typeMatches) {
    const type = typeMatches[0];
    criteria.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
  
  // Extract bedrooms
  const bedroomMatches = text.match(/(\d+)\s*(?:bed|bedroom|br)/i);
  if (bedroomMatches) {
    criteria.bedrooms = parseInt(bedroomMatches[1], 10);
  }
  
  // Extract bathrooms
  const bathroomMatches = text.match(/(\d+)\s*(?:bath|bathroom)/i);
  if (bathroomMatches) {
    criteria.bathrooms = parseInt(bathroomMatches[1], 10);
  }
  
  // Extract price
  const priceMatches = text.match(/(\d[\d,]*)\s*(?:k|aed|dirhams?)/i);
  if (priceMatches) {
    let price = priceMatches[1].replace(/,/g, '');
    if (text.includes('k') || text.includes('K')) {
      price = (parseInt(price, 10) * 1000).toString();
    }
    
    if (text.match(/less than|under|below|max|maximum/i)) {
      criteria.maxPrice = parseInt(price, 10);
    } else if (text.match(/more than|over|above|min|minimum/i)) {
      criteria.minPrice = parseInt(price, 10);
    } else {
      // If no qualifier, assume it's a target price with some flexibility
      const targetPrice = parseInt(price, 10);
      criteria.minPrice = targetPrice * 0.9; // 10% below target
      criteria.maxPrice = targetPrice * 1.1; // 10% above target
    }
  }
  
  // Extract location
  const locationKeywords = [
    'Dubai Marina', 'Downtown Dubai', 'Palm Jumeirah', 'Arabian Ranches',
    'Jumeirah Beach Residence', 'JBR', 'Business Bay', 'DIFC', 'JLT',
    'Jumeirah Lakes Towers', 'Jumeirah Village Circle', 'JVC',
    'Dubai Hills Estate', 'Damac Hills', 'Meydan', 'Al Barsha',
    'Dubai Silicon Oasis', 'DSO', 'Dubai Sports City', 'Dubai Land',
    'Dubai Creek Harbour', 'Dubai South', 'Azizi Riviera', 'Emaar'
  ];
  
  for (const location of locationKeywords) {
    if (text.toLowerCase().includes(location.toLowerCase())) {
      criteria.location = location;
      break;
    }
  }
  
  // Extract features
  const featureKeywords = ['balcony', 'garden', 'pool', 'gym', 'parking', 'garage', 'sea view', 'furnished'];
  criteria.features = featureKeywords.filter(feature => 
    text.toLowerCase().includes(feature.toLowerCase())
  );
  
  // Extract market type
  if (text.match(/off[\s-]plan|offplan/i)) {
    criteria.marketType = 'offplan';
  } else if (text.match(/second market|resale|ready/i)) {
    criteria.marketType = 'second market';
  }
  
  // Extract status (only if explicitly mentioned)
  if (text.match(/available|for sale|selling/i)) {
    criteria.status = 'available';
  }
  
  return criteria;
} 