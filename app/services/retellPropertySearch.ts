/**
 * This file provides utilities to help integrate property search functionality
 * with Retell AI's decision tree. You can copy and adapt these code samples
 * to use in your Retell agent configuration.
 */

// === RETELL DECISION TREE CODE SAMPLES ===

/**
 * EXAMPLE 1: Property Search Function
 * 
 * Copy this code into the Retell decision tree custom function area
 * This function can be called when detecting property search intent
 */

/*
function searchProperties(userMessage) {
  // Parse property search criteria from user message
  const criteria = {};
  
  // Extract property type
  const typeMatches = userMessage.match(/apartment|villa|penthouse|duplex|townhouse/gi);
  if (typeMatches) {
    const type = typeMatches[0];
    criteria.type = type.charAt(0).toUpperCase() + type.slice(1).toLowerCase();
  }
  
  // Extract bedrooms
  const bedroomMatches = userMessage.match(/(\d+)\s*(?:bed|bedroom|br)/i);
  if (bedroomMatches) {
    criteria.bedrooms = parseInt(bedroomMatches[1], 10);
  }
  
  // Extract bathrooms
  const bathroomMatches = userMessage.match(/(\d+)\s*(?:bath|bathroom)/i);
  if (bathroomMatches) {
    criteria.bathrooms = parseInt(bathroomMatches[1], 10);
  }
  
  // Extract price
  const priceMatches = userMessage.match(/(\d[\d,]*)\s*(?:k|aed|dirhams?)/i);
  if (priceMatches) {
    let price = priceMatches[1].replace(/,/g, '');
    if (userMessage.includes('k') || userMessage.includes('K')) {
      price = (parseInt(price, 10) * 1000).toString();
    }
    
    if (userMessage.match(/less than|under|below|max|maximum/i)) {
      criteria.maxPrice = parseInt(price, 10);
    } else if (userMessage.match(/more than|over|above|min|minimum/i)) {
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
    if (userMessage.toLowerCase().includes(location.toLowerCase())) {
      criteria.location = location;
      break;
    }
  }
  
  // Extract features
  const featureKeywords = ['balcony', 'garden', 'pool', 'gym', 'parking', 'garage', 'sea view', 'furnished'];
  criteria.features = featureKeywords.filter(feature => 
    userMessage.toLowerCase().includes(feature.toLowerCase())
  );
  
  // Extract market type
  if (userMessage.match(/off[\s-]plan|offplan/i)) {
    criteria.marketType = 'offplan';
  } else if (userMessage.match(/second market|resale|ready/i)) {
    criteria.marketType = 'second market';
  }
  
  // Extract status (only if explicitly mentioned)
  if (userMessage.match(/available|for sale|selling/i)) {
    criteria.status = 'available';
  }
  
  // Search the properties in metadata (assumes properties have been loaded into metadata)
  const propertiesData = metadata.properties || [];
  
  // Filter properties based on criteria
  const matchingProperties = propertiesData.filter(property => {
    // Match property type (fuzzy match)
    if (criteria.type && !property.type.toLowerCase().includes(criteria.type.toLowerCase())) {
      return false;
    }
    
    // Match bedrooms (exact match)
    if (criteria.bedrooms !== undefined && property.bedrooms !== criteria.bedrooms) {
      return false;
    }
    
    // Match bathrooms (exact match)
    if (criteria.bathrooms !== undefined && property.bathrooms !== criteria.bathrooms) {
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
  
  // Generate a response based on the number of matches
  if (matchingProperties.length === 0) {
    return "I couldn't find any properties matching your criteria. Would you like me to broaden the search?";
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
*/

/**
 * EXAMPLE 2: Decision Tree Structure
 * 
 * Here's an example of how to structure the decision tree to handle property search intents
 */

/*
// Sample decision tree structure
const decisionTree = {
  intents: {
    // When user is looking for a property
    propertySearch: {
      examples: [
        "I'm looking for a property",
        "Do you have any apartments in Dubai Marina?",
        "I need a 3 bedroom villa",
        "Are there any properties with a pool?",
        "Show me properties under 2 million AED",
        "I'm interested in buying an apartment"
      ],
      handler: (message) => {
        return {
          response: searchProperties(message),
          // Store last intent for context
          state: { lastIntent: "propertySearch" }
        };
      }
    },
    
    // When user provides more details/criteria after initial search
    refinePropertySearch: {
      examples: [
        "I need it to have a balcony",
        "What about in Palm Jumeirah?",
        "I'm looking for something cheaper",
        "Do you have anything with 4 bedrooms?",
        "I'm only interested in off-plan properties",
        "Something with a garden would be nice"
      ],
      // Only match this intent if previous intent was propertySearch
      condition: (state) => state.lastIntent === "propertySearch",
      handler: (message, state) => {
        // Combine previous criteria with new criteria
        return {
          response: searchProperties(message),
          state: { ...state, lastIntent: "propertySearch" }
        };
      }
    },
    
    // When user wants details about a specific property
    propertyDetails: {
      examples: [
        "Tell me more about option 1",
        "Can I get more details on the first property?",
        "What are the features of the Palm Jumeirah villa?",
        "Is there a floor plan for that property?",
        "When was it built?",
        "Tell me more about that one"
      ],
      condition: (state) => state.lastIntent === "propertySearch",
      handler: (message, state) => {
        return {
          response: "I'd be happy to provide more details about that property. [Property details would go here]",
          state: { ...state, lastIntent: "propertyDetails" }
        };
      }
    }
  }
};
*/

/**
 * EXAMPLE 3: Property Intent Detection Function
 * 
 * This function helps detect when a user is asking about properties
 */

/*
function detectPropertyIntent(message) {
  // Keywords that indicate property interest
  const propertyKeywords = [
    'property', 'properties', 'apartment', 'villa', 'penthouse', 'duplex',
    'townhouse', 'buy', 'rent', 'purchase', 'bedrooms', 'bathrooms',
    'price', 'location', 'area', 'square meters', 'sqm'
  ];
  
  // Check if any keywords are in the message
  const hasPropertyKeywords = propertyKeywords.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
  
  // Patterns that indicate property search intent
  const propertyPatterns = [
    /looking for a\s+(?:property|home|apartment|villa|penthouse|house)/i,
    /(?:do you have|are there|is there)\s+a(?:ny)?\s+(?:property|properties|apartment|villa|penthouse)/i,
    /(?:i need|i want|i'm looking for|i am looking for)\s+a\s+(?:\d+\s*bed|property|home)/i,
    /(?:show me|find me|searching for)\s+(?:a\s+)?(?:property|properties|apartment|villa)/i
  ];
  
  // Check if any patterns match
  const matchesPropertyPattern = propertyPatterns.some(pattern => 
    pattern.test(message)
  );
  
  return hasPropertyKeywords || matchesPropertyPattern;
}
*/

/**
 * EXAMPLE 4: Loading Properties into Context
 * 
 * This shows how to load properties into the Retell context at the start of a call
 */

/*
// This function would be called at the beginning of the call
function initializeCall(callData) {
  // Access properties from call metadata if available
  if (callData.metadata && callData.metadata.properties_context) {
    // Parse the properties context
    try {
      // Store the properties in the agent's memory for the duration of the call
      metadata.properties = JSON.parse(callData.metadata.properties_context);
      return true;
    } catch (e) {
      console.error("Error parsing properties context:", e);
      return false;
    }
  }
  
  return false;
}
*/

/**
 * Instructions for Retell Decision Tree Configuration:
 * 
 * 1. Create a function to handle property searches (see Example 1)
 * 2. Set up intents for property search, refinement, and details (see Example 2)
 * 3. Add a function to detect property intent (see Example 3)
 * 4. Initialize the call with properties data (see Example 4)
 * 5. Connect these components in your decision tree flow
 */

// This file is for reference only and doesn't export anything
// You should copy the relevant code snippets into your Retell config
export {}; 