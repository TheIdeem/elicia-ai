import { NextRequest, NextResponse } from 'next/server';
import Retell from 'retell-sdk';
import { 
  searchProperties, 
  parsePropertySearchRequest, 
  generatePropertyResponseForAI 
} from '../../../services/propertyContextService';

// Define type for our mock client
type MockRetellClient = {
  call: {
    list: (params: any) => Promise<{ data: any[] }>;
    retrieve: (id: string) => Promise<any>;
    create: (params: any) => Promise<any>;
    update: (id: string, params: any) => Promise<any>;
  };
};

// Helper function to initialize Retell client
const getRetellClient = (): any => {
  // Check if API key is available
  const apiKey = process.env.RETELL_API_KEY;
  
  // Always create a mock client in development mode for consistent behavior
  if (process.env.NODE_ENV === 'development' || process.env.USE_MOCK_DATA === 'true') {
    console.log('Using mock Retell client for development in [id] route');
    return createMockRetellClient();
  }
  
  if (!apiKey) {
    console.warn('RETELL_API_KEY is not defined in environment variables');
    return createMockRetellClient();
  }

  try {
    // Initialize with Retell SDK
    return new Retell({ apiKey });
  } catch (error) {
    console.error('Error initializing Retell client:', error);
    return createMockRetellClient();
  }
};

// Create a mock Retell client for development/testing
const createMockRetellClient = (): any => {
  return {
    call: {
      retrieve: async (id: string) => {
        console.log('Mock retrieve call for ID:', id);
        // Return a mock call object
        return {
          id: id,
          customer_name: 'John Doe',
          customer_phone_number: '+1234567890',
          status: 'completed',
          direction: 'outbound',
          created_at: new Date().toISOString(),
          duration: 180,
          agent_id: 'agent-123',
          _isMockData: true
        };
      },
      update: async (id: string, data: any) => {
        return {
          id,
          ...data,
          _isMockData: true
        };
      }
    }
  };
};

// GET: Get a specific call by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Extract the id from params using proper async/await pattern
    const { params } = context;
    
    // Validate params
    if (!params || !params.id) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    // Clean up the ID - some IDs might come with a suffix we added
    // for uniqueness in the list view (like call_123-0)
    const cleanId = id.split('-')[0];
    
    // Initialize Retell client with server-side API key
    const client = getRetellClient();
    
    // Get the call details from Retell
    let callResponse;
    try {
      callResponse = await client.call.retrieve(cleanId);
      
      // Validate the response
      if (!callResponse) {
        throw new Error('Empty response from Retell API');
      }
      
      // Return the call data directly without wrapping
      return NextResponse.json(callResponse);
    } catch (retellError: any) {
      console.error(`Error from Retell API for call ${cleanId}:`, retellError);
      
      // If we can't fetch from Retell, return a valid call object with error information
      // This way the UI can still display something useful
      return NextResponse.json({
        id: id,
        status: 'failed',
        type: 'outbound', // Changed from 'unknown' to valid CallType
        contact: {
          id: 'unknown',
          name: 'Unknown Contact',
          phone: 'Not available'
        },
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        duration: '0:00',
        notes: `Unable to retrieve call details: API returned ${retellError.status || 'error'}.`,
        agent_id: 'unknown',
        error: `Could not fetch call details: ${retellError.message || 'Unknown error'}`
      });
    }
  } catch (error: any) {
    console.error(`Error fetching call details:`, error);
    
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch call details', 
        status: 'failed',
        contact: {
          id: 'unknown',
          name: 'Unknown Contact',
          phone: 'Not available'
        },
        type: 'outbound', // Added to match CallType
      },
      { status: 500 }
    );
  }
}

// POST: Property search functionality for ongoing calls
export async function POST(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    // Extract the id from params using proper async/await pattern
    const { params } = context;
    
    // Validate params
    if (!params || !params.id) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }
    
    const id = params.id;
    
    const cleanId = id.split('-')[0];
    const body = await request.json();
    const { userText } = body;
    
    if (!userText) {
      return NextResponse.json(
        { error: 'User text is required for property search' },
        { status: 400 }
      );
    }
    
    // Parse property search criteria from user text
    const searchCriteria = parsePropertySearchRequest(userText);
    
    // Search for matching properties (asynchrone)
    const matchingProperties = await searchProperties(searchCriteria);
    
    // Generate response for the AI
    const aiResponse = generatePropertyResponseForAI(matchingProperties, searchCriteria);
    
    // Get Retell client
    const client = getRetellClient();
    
    // Send the property search results to the ongoing call
    // This assumes Retell has an API to send messages to ongoing calls
    // If not, we'll just return the data for the frontend to handle
    try {
      await client.call.update(cleanId, {
        metadata: {
          property_search_results: JSON.stringify({
            criteria: searchCriteria,
            matches: matchingProperties.map(p => p.id),
            response: aiResponse
          })
        }
      });
    } catch (retellError) {
      console.warn('Could not update call metadata in Retell:', retellError);
      // Continue anyway - we'll return the data to the frontend
    }
    
    return NextResponse.json({
      criteria: searchCriteria,
      matches: matchingProperties,
      response: aiResponse
    });
  } catch (error: any) {
    console.error(`Error processing property search:`, error);
    
    return NextResponse.json(
      { error: error.message || 'Failed to process property search' },
      { status: 500 }
    );
  }
} 