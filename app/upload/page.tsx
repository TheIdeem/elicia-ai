'use client';

import { useState, useRef, ChangeEvent, useEffect } from 'react';
import { ArrowUpTrayIcon, ChevronDoubleRightIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { parseCSV, suggestFieldMappings, validateFieldMappings, transformCSVData } from '../services/csvService';
import { importData } from '../services/csvImportService';
import { CSVPreviewData } from './types';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import UploadProgress from '../components/UploadProgress';

// Define the possible data types for upload
type DataType = 'leads' | 'calls' | 'meetings' | 'properties' | '';

// Define field structures for each data type
interface Field {
  name: string;
  label: string;
  required: boolean;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dataType, setDataType] = useState<DataType>('');
  const [csvData, setCSVData] = useState<CSVPreviewData | null>(null);
  const [fieldMappings, setFieldMappings] = useState<Record<string, string>>({});
  const [uploadStep, setUploadStep] = useState<number>(1);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define fields for each data type
  const dataTypeFields: Record<DataType, Field[]> = {
    '': [],
    leads: [
      { name: 'firstName', label: 'First Name', required: true },
      { name: 'lastName', label: 'Last Name', required: true },
      { name: 'email', label: 'Email', required: true },
      { name: 'phone', label: 'Phone', required: true },
      { name: 'company', label: 'Company', required: false },
      { name: 'jobTitle', label: 'Job Title', required: false },
      { name: 'status', label: 'Status', required: false },
      { name: 'source', label: 'Source', required: false },
      { name: 'dateAdded', label: 'Date Added', required: false },
      { name: 'lastContactDate', label: 'Last Contact Date', required: false },
      { name: 'notes', label: 'Notes', required: false },
      { name: 'estimatedValue', label: 'Estimated Value', required: false },
    ],
    calls: [
      { name: 'contactName', label: 'Contact Name', required: true },
      { name: 'contactPhone', label: 'Contact Phone', required: true },
      { name: 'contactEmail', label: 'Contact Email', required: false },
      { name: 'type', label: 'Call Type', required: true },
      { name: 'status', label: 'Status', required: true },
      { name: 'date', label: 'Date', required: true },
      { name: 'time', label: 'Time', required: true },
      { name: 'duration', label: 'Duration', required: true },
      { name: 'purpose', label: 'Purpose', required: false },
      { name: 'outcome', label: 'Outcome', required: false },
      { name: 'notes', label: 'Notes', required: false },
      { name: 'agent_id', label: 'Agent ID', required: true },
    ],
    meetings: [
      { name: 'title', label: 'Title', required: true },
      { name: 'description', label: 'Description', required: false },
      { name: 'status', label: 'Status', required: true },
      { name: 'type', label: 'Meeting Type', required: true },
      { name: 'startDate', label: 'Start Date', required: true },
      { name: 'startTime', label: 'Start Time', required: true },
      { name: 'endTime', label: 'End Time', required: false },
      { name: 'duration', label: 'Duration', required: false },
      { name: 'location', label: 'Location', required: false },
      { name: 'organizer', label: 'Organizer', required: true },
      { name: 'attendees', label: 'Attendees', required: false },
      { name: 'agenda', label: 'Agenda', required: false },
    ],
    properties: [
      { name: 'address', label: 'Address', required: true },
      { name: 'city', label: 'City', required: true },
      { name: 'state', label: 'State', required: true },
      { name: 'zipCode', label: 'Zip Code', required: true },
      { name: 'country', label: 'Country', required: true },
      { name: 'propertyType', label: 'Property Type', required: true },
      { name: 'bedrooms', label: 'Bedrooms', required: true },
      { name: 'bathrooms', label: 'Bathrooms', required: true },
      { name: 'squareFeet', label: 'Square Feet', required: true },
      { name: 'price', label: 'Price', required: true },
      { name: 'status', label: 'Status', required: true },
      { name: 'dateAdded', label: 'Date Added', required: true },
    ],
  };

  // Handle file selection
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      try {
        setFile(selectedFile);
        const parsedData = await parseCSV(selectedFile);
        setCSVData(parsedData);
        
        // If data type is already selected, try to suggest mappings
        if (dataType) {
          const suggested = suggestFieldMappings(
            parsedData.headers,
            dataTypeFields[dataType].map(f => ({ name: f.name, label: f.label }))
          );
          setFieldMappings(suggested);
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : 'Failed to parse CSV file');
      }
    }
  };

  // Handle data type selection
  const handleDataTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newDataType = e.target.value as DataType;
    setDataType(newDataType);
    
    // Reset field mappings when data type changes
    if (csvData) {
      const suggested = suggestFieldMappings(
        csvData.headers,
        dataTypeFields[newDataType].map(f => ({ name: f.name, label: f.label }))
      );
      setFieldMappings(suggested);
    }
  };

  // Handle field mapping change
  const handleMappingChange = (csvHeader: string, appField: string) => {
    setFieldMappings(prev => ({
      ...prev,
      [csvHeader]: appField
    }));
  };

  // Check if all required fields are mapped
  const checkRequiredFieldsMapped = () => {
    if (!dataType) return false;
    
    const requiredFields = dataTypeFields[dataType]
      .filter(field => field.required)
      .map(field => field.name);
    
    const validation = validateFieldMappings(fieldMappings, requiredFields);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsUploading(true);
    setUploadStatus('processing');
    setErrorMessage('');
    
    try {
      // Get all rows from CSV file, not just the preview rows
      const reader = new FileReader();
      
      const processCsvData = () => {
        return new Promise<void>((resolve, reject) => {
          reader.onload = async (e) => {
            try {
              if (!e.target?.result) {
                throw new Error('Failed to read CSV file');
              }
              
              const text = e.target.result as string;
              const lines = text.split('\n').filter(line => line.trim() !== '');
              const headers = lines[0].split(',').map(header => header.trim());
              
              // Get all data rows (excluding header)
              const allRows = lines.slice(1).map(line => line.split(',').map(cell => cell.trim()));
              
              // Transform data using mappings
              const transformedData = transformCSVData(allRows, headers, fieldMappings);
              
              // Show initial progress
              setUploadProgress(25);
              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Use our import service to process the data
              if (
                dataType === 'leads' || 
                dataType === 'calls' || 
                dataType === 'meetings' || 
                dataType === 'properties'
              ) {
                const importResult = await importData(
                  dataType, 
                  transformedData
                );
                
                // Set progress based on result
                setUploadProgress(100);
                
                if (importResult.success) {
                  console.log(`Import complete: ${importResult.successCount} items imported successfully`);
                  setUploadStatus('success');
                } else {
                  console.error(`Import partially complete: ${importResult.successCount} imported, ${importResult.errorCount} failed`);
                  if (importResult.errorCount > 0 && importResult.successCount === 0) {
                    setUploadStatus('error');
                    setErrorMessage(`Failed to import data: ${importResult.errors?.[0] || 'Unknown error'}`);
                  } else {
                    // Some success but some errors
                    setUploadStatus('success');
                  }
                }
              } else {
                throw new Error('No data type selected');
              }
              
              resolve();
            } catch (error) {
              console.error('Error processing CSV:', error);
              reject(error);
            }
          };
          
          reader.onerror = () => {
            reject(new Error('Error reading the file. Please try again.'));
          };
          
          reader.readAsText(file as File);
        });
      };
      
      await processCsvData();
    } catch (error) {
      setUploadStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred during upload. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle clicking the file input button
  const handleClickFileInput = () => {
    fileInputRef.current?.click();
  };

  // Reset the form
  const handleReset = () => {
    setFile(null);
    setDataType('');
    setCSVData(null);
    setFieldMappings({});
    setUploadStep(1);
    setUploadStatus('idle');
    setUploadProgress(0);
    setErrorMessage('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Data Upload</h2>
            <p className="text-gray-600 mt-1">Import your data from CSV files</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Progress Steps */}
        <div className="border-b border-gray-200">
          <div className="p-4">
            <div className="flex items-center">
              <div className={`flex items-center ${uploadStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 1 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  1
                </div>
                <span className="ml-2 text-sm font-medium">Select File</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${uploadStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center ${uploadStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 2 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  2
                </div>
                <span className="ml-2 text-sm font-medium">Map Fields</span>
              </div>
              <div className={`flex-1 h-0.5 mx-4 ${uploadStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
              <div className={`flex items-center ${uploadStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 3 ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  3
                </div>
                <span className="ml-2 text-sm font-medium">Upload</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {uploadStep === 1 && (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={handleClickFileInput}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                    <ArrowUpTrayIcon className="h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm font-medium text-gray-900">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">CSV files only</p>
                  </div>
                  {file && (
                    <div className="mt-4">
                      <UploadProgress
                        percentage={100}
                        status={errorMessage ? 'error' : 'success'}
                        fileName={file.name}
                        fileSize={file.size}
                      />
                      {errorMessage && (
                        <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="w-full md:w-1/2">
                  <div className="bg-gray-50 rounded-lg p-6 h-full">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Data Type
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Select the type of data you are uploading
                    </p>
                    <Select
                      id="data-type"
                      label="Data Type"
                      value={dataType}
                      onChange={handleDataTypeChange}
                      options={[
                        { value: '', label: 'Select a data type' },
                        { value: 'leads', label: 'Leads' },
                        { value: 'calls', label: 'Calls' },
                        { value: 'meetings', label: 'Meetings' },
                        { value: 'properties', label: 'Properties' }
                      ]}
                      required
                    />
                    
                    {csvData && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Total rows: </span>
                          {csvData.totalRows}
                        </p>
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Columns: </span>
                          {csvData.headers.length}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 flex justify-end">
                <Button
                  variant="primary"
                  onClick={() => setUploadStep(2)}
                  disabled={!file || !dataType || !csvData}
                >
                  Continue to Field Mapping
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 2 && csvData && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Map Fields
              </h3>
              <p className="text-sm text-gray-600">
                Match your CSV columns to the application fields. Required fields are marked with an asterisk (*).
              </p>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Application Field
                      </th>
                      <th className="px-2 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-10">
                        <ChevronDoubleRightIcon className="h-4 w-4 mx-auto" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        CSV Column
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sample Data
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dataTypeFields[dataType].map((field, index) => {
                      // Find CSV header mapped to this field
                      const mappedHeader = Object.keys(fieldMappings).find(
                        header => fieldMappings[header] === field.name
                      );
                      const isMapped = Boolean(mappedHeader);
                      const isMissing = field.required && !isMapped;
                      
                      // Get sample data if this field is mapped
                      const csvIndex = mappedHeader ? csvData.headers.indexOf(mappedHeader) : -1;
                      const sampleData = csvIndex >= 0 ? csvData.previewRows[0]?.[csvIndex] || '' : '';
                      
                      return (
                        <tr key={index} className={isMissing ? "bg-red-50" : ""}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.label}{field.required ? ' *' : ''}
                          </td>
                          <td className="px-2 py-4 whitespace-nowrap text-center">
                            <ChevronDoubleRightIcon className="h-4 w-4 mx-auto text-gray-400" />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Select
                              id={`field-mapping-${index}`}
                              value={mappedHeader || ''}
                              onChange={(e) => {
                                // Clear any existing mapping for this app field
                                const updatedMappings = { ...fieldMappings };
                                Object.keys(updatedMappings).forEach(key => {
                                  if (updatedMappings[key] === field.name) {
                                    delete updatedMappings[key];
                                  }
                                });
                                
                                // Set new mapping if a CSV column is selected
                                if (e.target.value) {
                                  updatedMappings[e.target.value] = field.name;
                                }
                                
                                setFieldMappings(updatedMappings);
                              }}
                              options={[
                                { value: '', label: 'Select a CSV column' },
                                ...csvData.headers.map(header => ({
                                  value: header,
                                  label: header
                                }))
                              ]}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {sampleData}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {isMissing ? (
                              <span className="text-red-600 font-medium">Required field missing</span>
                            ) : isMapped ? (
                              <span className="text-green-600">Mapped</span>
                            ) : (
                              <span className="text-gray-400">Optional</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!checkRequiredFieldsMapped() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Missing required fields
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          Please map all required fields (marked with *) before continuing.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  onClick={() => setUploadStep(3)}
                  disabled={!checkRequiredFieldsMapped()}
                >
                  Continue to Upload
                </Button>
              </div>
            </div>
          )}

          {uploadStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">
                Confirm and Upload
              </h3>
              
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">File:</span>
                    <span className="text-sm font-medium text-gray-900">{file?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Data Type:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{dataType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Rows:</span>
                    <span className="text-sm font-medium text-gray-900">{csvData?.totalRows}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Mapped Fields:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {Object.values(fieldMappings).filter(Boolean).length} of {csvData?.headers.length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <UploadProgress
                  percentage={uploadProgress}
                  status={uploadStatus}
                  fileName={file?.name}
                  fileSize={file?.size}
                />
              </div>

              {uploadStatus === 'error' && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        Upload failed
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{errorMessage || 'An error occurred during the upload process.'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200 flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setUploadStep(2)}
                  disabled={isUploading || uploadStatus === 'success'}
                >
                  Back
                </Button>
                
                {uploadStatus === 'success' ? (
                  <Button
                    variant="primary"
                    onClick={handleReset}
                  >
                    Upload Another File
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isUploading}
                    isLoading={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload Data'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 