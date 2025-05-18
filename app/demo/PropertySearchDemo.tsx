import React, { useState } from 'react';
import {
  parsePropertySearchRequest,
  searchProperties,
  generatePropertyResponseForAI
} from '../services/propertyContextService';
import { getProperties } from '../services/localStorageService';
import { Property } from '../properties/types';

export default function PropertySearchDemo() {
  const [userQuery, setUserQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    criteria: Record<string, any>;
    matches: Property[];
    response: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!userQuery.trim()) return;
    
    setLoading(true);
    try {
      // Parse the user query to extract search criteria
      const criteria = parsePropertySearchRequest(userQuery);
      
      // Search for matching properties
      const matches = searchProperties(criteria);
      
      // Generate AI response
      const response = generatePropertyResponseForAI(matches, criteria);
      
      setSearchResults({ criteria, matches, response });
    } catch (error) {
      console.error('Error searching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">AI Agent Property Search Demo</h2>
      
      <div className="mb-8">
        <p className="text-gray-700 mb-4">
          This demo shows how the AI agent can search for properties based on natural language queries.
          When a customer asks about properties during a call, the AI agent will have access to all your
          properties and can provide relevant matches.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-blue-700">
            Try asking for properties with specific features like:
          </p>
          <ul className="list-disc pl-5 mt-2 text-blue-600">
            <li>I'm looking for a 2 bedroom apartment in Dubai Marina with a balcony under 3 million AED</li>
            <li>Do you have any offplan villas with a garden?</li>
            <li>I need a 3 bedroom property in Downtown Dubai with parking</li>
          </ul>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={userQuery}
          onChange={(e) => setUserQuery(e.target.value)}
          placeholder="Ask about properties..."
          className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>
      
      {searchResults && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">AI Agent Response:</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="text-gray-800">{searchResults.response}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Matching Properties ({searchResults.matches.length}):</h3>
            
            {searchResults.matches.length === 0 ? (
              <p className="text-gray-600 italic">No properties match these criteria</p>
            ) : (
              <div className="space-y-4">
                {searchResults.matches.slice(0, 3).map((property) => (
                  <div key={property.id} className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium text-lg">{property.title}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Type:</span> {property.type} ({property.property_type})
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Price:</span> {property.price.toLocaleString()} AED
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Location:</span> {property.address}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium">Bedrooms:</span> {property.bedrooms} | <span className="font-medium">Bathrooms:</span> {property.bathrooms}
                      </p>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-medium">Features:</span> {property.features.filter(f => f.value === true || f.value === 'true').map(f => f.name).join(', ')}
                    </p>
                  </div>
                ))}
                
                {searchResults.matches.length > 3 && (
                  <p className="text-gray-600 text-sm">
                    + {searchResults.matches.length - 3} more properties match these criteria
                  </p>
                )}
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Extracted Search Criteria:</h3>
            <div className="bg-gray-100 p-4 rounded-md">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(searchResults.criteria, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 