import { createLead } from './leadStorageService';
import { createProperty } from './localStorageService'; 
import { v4 as uuidv4 } from 'uuid';

type ImportDataType = 'leads' | 'calls' | 'meetings' | 'properties';

interface ImportResult {
  success: boolean;
  successCount: number;
  errorCount: number;
  errors?: any[];
}

/**
 * Import data from CSV with appropriate transforms for each data type
 */
export const importData = async (
  dataType: ImportDataType, 
  data: Record<string, any>[]
): Promise<ImportResult> => {
  const result: ImportResult = {
    success: true,
    successCount: 0,
    errorCount: 0,
    errors: []
  };

  try {
    // Process each row according to the data type
    for (const item of data) {
      try {
        switch (dataType) {
          case 'leads':
            // Add required fields if missing
            const leadData = {
              id: uuidv4(),
              firstName: item.firstName || '', 
              lastName: item.lastName || '',
              email: item.email || '',
              phone: item.phone || '',
              company: item.company || '',
              jobTitle: item.jobTitle || '',
              status: item.status || 'new',
              source: item.source || 'import',
              dateAdded: item.dateAdded || new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }),
              lastContactDate: item.lastContactDate || '',
              notes: item.notes || '',
              estimatedValue: item.estimatedValue ? parseFloat(item.estimatedValue) : 0,
              ...item
            };
            createLead(leadData);
            break;

          case 'properties':
            // Add required fields if missing
            const propertyData = {
              id: uuidv4(),
              reference: item.reference || `PROP-${Math.floor(Math.random() * 10000)}`,
              type: item.type || 'residential',
              status: item.status || 'available',
              title: item.title || item.address || 'Unnamed Property',
              description: item.description || '',
              address: item.address || '',
              price: item.price ? parseFloat(item.price) : 0,
              size_sqm: item.size_sqm ? parseFloat(item.size_sqm) : 0,
              bedrooms: item.bedrooms ? parseInt(item.bedrooms) : 0,
              bathrooms: item.bathrooms ? parseInt(item.bathrooms) : 0,
              parking_spots: item.parking_spots ? parseInt(item.parking_spots) : 0,
              year_built: item.year_built ? parseInt(item.year_built) : null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
              ...item
            };
            createProperty(propertyData);
            break;

          // For now, we'll skip calls and meetings as they're not fully implemented
          case 'calls':
          case 'meetings':
            // Just log that these are not implemented for the MVP
            console.log(`Import for ${dataType} not fully implemented yet`);
            break;
        }
        result.successCount++;
      } catch (error) {
        console.error('Error importing item:', error);
        result.errorCount++;
        if (error instanceof Error) {
          result.errors?.push(error.message);
        } else {
          result.errors?.push('Unknown error');
        }
      }
    }

    // If we had any errors, mark success as false
    if (result.errorCount > 0) {
      result.success = false;
    }

    return result;
  } catch (error) {
    console.error('Import operation failed:', error);
    return {
      success: false,
      successCount: result.successCount,
      errorCount: result.errorCount + 1,
      errors: result.errors?.concat(error instanceof Error ? error.message : 'Unknown error')
    };
  }
}; 