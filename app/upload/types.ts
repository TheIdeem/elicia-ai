// Upload feature types

export interface UploadResponse {
  success: boolean;
  message: string;
  totalProcessed?: number;
  totalImported?: number;
  totalErrors?: number;
  errors?: string[];
}

export interface UploadFieldMapping {
  csvHeader: string;
  appField: string;
}

export interface UploadConfig {
  dataType: 'leads' | 'calls' | 'meetings';
  fieldMappings: UploadFieldMapping[];
  fileName: string;
}

export interface CSVPreviewData {
  headers: string[];
  previewRows: string[][];
  totalRows: number;
} 