// CSV handling service
import { CSVPreviewData, UploadFieldMapping } from '../upload/types';

/**
 * Parse a CSV file into readable data structure
 */
export const parseCSV = async (file: File): Promise<CSVPreviewData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        
        // Get preview rows (up to 5)
        const previewRows = [];
        const maxPreviewRows = Math.min(5, lines.length - 1);
        
        for (let i = 1; i <= maxPreviewRows; i++) {
          if (lines[i].trim() === '') continue;
          previewRows.push(lines[i].split(',').map(cell => cell.trim()));
        }
        
        // Count total rows (excluding header and empty lines)
        const totalRows = lines
          .slice(1)
          .filter(line => line.trim() !== '')
          .length;
        
        resolve({
          headers,
          previewRows,
          totalRows
        });
      } catch (error) {
        reject(new Error('Failed to parse CSV file. Please ensure it is a valid CSV format.'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading the file. Please try again.'));
    };
    
    reader.readAsText(file);
  });
};

/**
 * Make a best guess at matching CSV headers to application fields
 */
export const suggestFieldMappings = (
  headers: string[],
  appFields: { name: string; label: string }[]
): Record<string, string> => {
  const mappings: Record<string, string> = {};
  
  headers.forEach(header => {
    const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    // Try to find a matching field name (case insensitive)
    const matchingField = appFields.find(field => 
      field.name.toLowerCase() === normalizedHeader || 
      field.label.toLowerCase() === normalizedHeader || 
      field.name.toLowerCase().includes(normalizedHeader) ||
      field.label.toLowerCase().includes(normalizedHeader)
    );
    
    mappings[header] = matchingField ? matchingField.name : '';
  });
  
  return mappings;
};

/**
 * Validate the mapped fields to ensure all required fields are present
 */
export const validateFieldMappings = (
  mappings: Record<string, string>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } => {
  const mappedFields = Object.values(mappings).filter(Boolean);
  const missingFields = requiredFields.filter(field => !mappedFields.includes(field));
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
};

/**
 * Transform CSV data using the field mappings
 */
export const transformCSVData = (
  csvData: string[][],
  headers: string[],
  fieldMappings: Record<string, string>
): Record<string, any>[] => {
  return csvData.map(row => {
    const transformedRow: Record<string, any> = {};
    
    headers.forEach((header, index) => {
      const appField = fieldMappings[header];
      if (appField) { // Only include mapped fields
        transformedRow[appField] = row[index];
      }
    });
    
    return transformedRow;
  });
}; 