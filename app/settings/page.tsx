'use client';

import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import {
  Cog6ToothIcon,
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  ExclamationCircleIcon,
  UserCircleIcon,
  UsersIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ClockIcon,
  LanguageIcon,
  PhoneIcon,
  BellAlertIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { importLeadsFromCSV } from '../services/leadStorageService';

// Setting sections
type SettingSection = 'general' | 'import-export' | 'notifications' | 'account' | 'user-management' | 'automated-calling';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingSection>('general');
  const [importFormat, setImportFormat] = useState<string>('csv');
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [dateFormat, setDateFormat] = useState<string>('MM/DD/YYYY');
  const [overwriteExisting, setOverwriteExisting] = useState<boolean>(false);
  const [skipErrors, setSkipErrors] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(true);
  const [currency, setCurrency] = useState<string>('USD');
  const [timezone, setTimezone] = useState<string>('America/New_York');
  const [language, setLanguage] = useState<string>('en');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  // Automated calling settings
  const [autoCallEnabled, setAutoCallEnabled] = useState<boolean>(false);
  const [autoCallDelay, setAutoCallDelay] = useState<number>(5);
  const [autoCallRetries, setAutoCallRetries] = useState<number>(2);
  const [autoCallAgent, setAutoCallAgent] = useState<string>('');

  // New state for file import
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  // Load settings from localStorage on component mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const savedSettings = localStorage.getItem('elicia_settings');
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings);
          
          // Load general settings
          if (parsedSettings.currency) setCurrency(parsedSettings.currency);
          if (parsedSettings.timezone) setTimezone(parsedSettings.timezone);
          if (parsedSettings.language) setLanguage(parsedSettings.language);
          if (parsedSettings.dateFormat) setDateFormat(parsedSettings.dateFormat);
          
          // Load automated calling settings
          if (parsedSettings.autoCallEnabled !== undefined) setAutoCallEnabled(parsedSettings.autoCallEnabled);
          if (parsedSettings.autoCallDelay) setAutoCallDelay(parsedSettings.autoCallDelay);
          if (parsedSettings.autoCallRetries) setAutoCallRetries(parsedSettings.autoCallRetries);
          if (parsedSettings.autoCallAgent) setAutoCallAgent(parsedSettings.autoCallAgent);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);

  const handleSaveSettings = () => {
    try {
      // Create settings object
      const settings = {
        // General settings
        currency,
        timezone,
        language,
        dateFormat,
        // Automated calling settings
        autoCallEnabled,
        autoCallDelay,
        autoCallRetries,
        autoCallAgent
      };
      
      // Save to localStorage
      localStorage.setItem('elicia_settings', JSON.stringify(settings));
      
      setSuccessMessage('Settings saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleExportData = (type: 'leads' | 'calls' | 'meetings') => {
    setSuccessMessage(`${type} data export initiated. You'll receive a download link shortly.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportSuccess(null);
    setImportError(null);
    
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.name.endsWith('.csv')) {
      setImportError('Please select a CSV file');
      return;
    }
    
    handleFileUpload(file);
  };
  
  const handleFileUpload = (file: File) => {
    setIsImporting(true);
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result as string;
        if (!content) {
          throw new Error('Failed to read file content');
        }
        
        // Import the leads from CSV
        const importedLeads = importLeadsFromCSV(content);
        
        setImportSuccess(`Successfully imported ${importedLeads.length} leads`);
        
        // Auto-clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error: any) {
        console.error('Error importing leads:', error);
        setImportError(error.message || 'Failed to import leads');
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      setImportError('Failed to read file');
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  // Reset import messages when changing sections
  useEffect(() => {
    setImportSuccess(null);
    setImportError(null);
  }, [activeSection]);

  const settingNav: { id: SettingSection; label: string; icon: React.ReactNode }[] = [
    {
      id: 'general',
      label: 'General',
      icon: <Cog6ToothIcon className="h-5 w-5" />,
    },
    {
      id: 'automated-calling',
      label: 'Automated Calling',
      icon: <PhoneIcon className="h-5 w-5" />,
    },
    {
      id: 'import-export',
      label: 'Import & Export',
      icon: <ArrowUpTrayIcon className="h-5 w-5" />,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <ExclamationCircleIcon className="h-5 w-5" />,
    },
    {
      id: 'user-management',
      label: 'User Management',
      icon: <UsersIcon className="h-5 w-5" />,
    },
    {
      id: 'account',
      label: 'My Account',
      icon: <UserCircleIcon className="h-5 w-5" />,
    },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
            <p className="text-gray-600 mt-1">Configure your application preferences</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-1/4">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <nav className="space-y-1">
              {settingNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center px-4 py-3 w-full text-left text-sm rounded-lg transition-all
                    ${activeSection === item.id
                      ? 'bg-indigo-600 text-white font-medium shadow-sm'
                      : 'bg-indigo-50 text-black hover:bg-indigo-100 hover:text-indigo-900 border border-indigo-200'}
                  `}
                  style={{ borderLeft: activeSection === item.id ? '4px solid #6366f1' : '4px solid transparent' }}
                >
                  <span className={`w-5 h-5 mr-3 ${activeSection === item.id ? 'text-white' : 'text-indigo-400'}`}>
                    {item.icon}
                  </span>
                  <span className={activeSection === item.id ? 'text-white' : 'text-black'}>{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="w-full md:w-3/4">
          <div className="bg-white rounded-xl shadow-sm p-6">
            {successMessage && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-md p-4">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-800 rounded-md p-4">
                {errorMessage}
              </div>
            )}

            {activeSection === 'general' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">General Settings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Select
                        id="currency"
                        label="Currency"
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        options={[
                          { value: 'USD', label: 'USD ($) - US Dollar' },
                          { value: 'AED', label: 'AED (د.إ) - UAE Dirham' },
                          { value: 'EUR', label: 'EUR (€) - Euro' },
                          { value: 'GBP', label: 'GBP (£) - British Pound' },
                        ]}
                        leftIcon={<CurrencyDollarIcon className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                    
                    <div>
                      <Select
                        id="timezone"
                        label="Timezone"
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        options={[
                          { value: 'America/New_York', label: 'Eastern Time (ET)' },
                          { value: 'America/Chicago', label: 'Central Time (CT)' },
                          { value: 'America/Denver', label: 'Mountain Time (MT)' },
                          { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
                          { value: 'Asia/Dubai', label: 'Gulf Standard Time (GST)' },
                          { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
                        ]}
                        leftIcon={<ClockIcon className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                    
                    <div>
                      <Select
                        id="language"
                        label="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        options={[
                          { value: 'en', label: 'English' },
                          { value: 'es', label: 'Spanish' },
                          { value: 'fr', label: 'French' },
                          { value: 'ar', label: 'Arabic' },
                        ]}
                        leftIcon={<LanguageIcon className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                    
                    <div>
                      <Select
                        id="date-format"
                        label="Date Format"
                        value={dateFormat}
                        onChange={(e) => setDateFormat(e.target.value)}
                        options={[
                          { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
                          { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
                          { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD (ISO)' },
                        ]}
                        leftIcon={<GlobeAltIcon className="h-5 w-5 text-gray-400" />}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'automated-calling' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Automated Calling</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure how Elicia AI should automatically call new leads that are added to the system.
                  </p>
                  
                  <div className="mt-6 space-y-6">
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div>
                        <h4 className="font-medium text-gray-900">Enable Automated Calling</h4>
                        <p className="text-sm text-gray-600">
                          When enabled, Elicia will automatically call new leads when they are added
                        </p>
                      </div>
                      <div className="flex items-center">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={autoCallEnabled}
                            onChange={() => setAutoCallEnabled(!autoCallEnabled)}
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    </div>
                    
                    <div className={autoCallEnabled ? "" : "opacity-50 pointer-events-none"}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Select
                            id="auto-call-agent"
                            label="AI Agent to Use"
                            value={autoCallAgent}
                            onChange={(e) => setAutoCallAgent(e.target.value)}
                            options={[
                              { value: '', label: 'Default Agent' },
                              { value: 'agent-123', label: 'Property Specialist' },
                              { value: 'agent-456', label: 'Lead Qualifier' },
                              { value: 'agent-789', label: 'Custom Agent' },
                            ]}
                            leftIcon={<UserCircleIcon className="h-5 w-5 text-gray-400" />}
                            disabled={!autoCallEnabled}
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="auto-call-delay" className="block text-sm font-medium text-gray-700 mb-1">
                            Call Delay (minutes)
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ClockIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="auto-call-delay"
                              className="block w-full pl-10 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="5"
                              min="0"
                              max="1440"
                              value={autoCallDelay}
                              onChange={(e) => setAutoCallDelay(parseInt(e.target.value) || 0)}
                              disabled={!autoCallEnabled}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">min</span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Time to wait after a lead is added before calling
                          </p>
                        </div>
                        
                        <div>
                          <label htmlFor="auto-call-retries" className="block text-sm font-medium text-gray-700 mb-1">
                            Max Retry Attempts
                          </label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <PhoneIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="number"
                              id="auto-call-retries"
                              className="block w-full pl-10 pr-12 py-2 sm:text-sm border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                              placeholder="2"
                              min="0"
                              max="10"
                              value={autoCallRetries}
                              onChange={(e) => setAutoCallRetries(parseInt(e.target.value) || 0)}
                              disabled={!autoCallEnabled}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">calls</span>
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">
                            Number of times to retry if calls fail or go unanswered
                          </p>
                        </div>
                      </div>
                      
                      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                          <div className="flex-shrink-0">
                            <BellAlertIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                          </div>
                          <div className="ml-3">
                            <p className="text-sm text-yellow-700">
                              Automated calling requires a valid Retell API key and sufficient credits. 
                              Make sure your account is properly configured.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <Button
                    variant="primary"
                    onClick={handleSaveSettings}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}

            {activeSection === 'import-export' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Import & Export Data</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import your existing data or export your current data
                  </p>
                  
                  {/* Import section */}
                  <div className="border border-gray-200 rounded-md p-5 mt-6 mb-8">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Import Leads</h4>
                    
                    {importSuccess && (
                      <div className="mb-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-4 flex">
                        <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                        <span>{importSuccess}</span>
                      </div>
                    )}
                    
                    {importError && (
                      <div className="mb-4 bg-red-50 border border-red-200 text-red-800 rounded-md p-4 flex">
                        <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                        <span>{importError}</span>
                      </div>
                    )}
                    
                    <div className="mt-4 border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <div className="flex justify-center mb-4">
                        <DocumentTextIcon className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-gray-700 mb-4">
                        Upload your leads in CSV format
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Your CSV file should contain columns for firstName, lastName, and phone (required),<br />
                        and optionally email, company, jobTitle, status, source, and notes
                      </p>
                      <input
                        type="file"
                        accept=".csv"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isImporting}
                      />
                      <Button
                        variant="outline"
                        size="md"
                        icon={<ArrowUpTrayIcon className="h-5 w-5" />}
                        disabled={isImporting}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {isImporting ? 'Importing...' : 'Select CSV File'}
                      </Button>
                      
                      <div className="mt-4 flex items-center">
                        <input
                          type="checkbox"
                          id="auto-call-imported"
                          checked={autoCallEnabled}
                          onChange={() => setAutoCallEnabled(!autoCallEnabled)}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="auto-call-imported" className="ml-2 block text-sm text-gray-700">
                          Automatically call new leads after import
                        </label>
                      </div>
                      
                      <div className={`mt-2 text-xs text-gray-500 ${!autoCallEnabled ? 'text-gray-400' : ''}`}>
                        Calls will be staggered to avoid overwhelming the system
                      </div>
                    </div>
                  </div>
                  
                  {/* Export section */}
                  <div className="border border-gray-200 rounded-md p-5">
                    <h4 className="text-md font-medium text-gray-900 mb-4">Export Data</h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Select
                          id="export-format"
                          label="Export Format"
                          value={exportFormat}
                          onChange={(e) => setExportFormat(e.target.value)}
                          options={[
                            { value: 'csv', label: 'CSV' },
                            { value: 'json', label: 'JSON' },
                            { value: 'excel', label: 'Excel' },
                          ]}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Button
                            variant="outline"
                            size="md"
                            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                            onClick={() => handleExportData('leads')}
                            className="w-full"
                          >
                            Export Leads
                          </Button>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="md"
                            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                            onClick={() => handleExportData('calls')}
                            className="w-full"
                          >
                            Export Calls
                          </Button>
                        </div>
                        <div>
                          <Button
                            variant="outline"
                            size="md"
                            icon={<ArrowDownTrayIcon className="h-5 w-5" />}
                            onClick={() => handleExportData('meetings')}
                            className="w-full"
                          >
                            Export Meetings
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                  <div className="flex items-center">
                    <input
                      id="email-notifications"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                    />
                    <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                      Send email notification when import/export completes
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={handleSaveSettings}
                    className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                  >
                    Save Settings
                  </button>
                </div>
              </div>
            )}
            
            {activeSection === 'user-management' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">User Management</h3>
                  <p className="text-sm text-gray-600 mb-6">Manage user accounts and permissions for your organization.</p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="text-md font-medium text-gray-900 mb-2">Active Users (5)</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Email
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Role
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-blue-800">JD</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">John Doe</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">john.doe@example.com</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Administrator</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-black hover:text-gray-800 pr-4">Edit</a>
                              <a href="#" className="text-black hover:text-gray-800">Deactivate</a>
                            </td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-sm font-medium text-purple-800">SJ</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">sarah.j@example.com</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">Manager</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <a href="#" className="text-black hover:text-gray-800 pr-4">Edit</a>
                              <a href="#" className="text-black hover:text-gray-800">Deactivate</a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
                    >
                      <UsersIcon className="h-5 w-5 mr-2" />
                      Add New User
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Notification Settings</h3>
                <p className="text-gray-600">Configure how you receive notifications.</p>
                <p className="text-gray-500 italic">This section is under development.</p>
              </div>
            )}
            
            {activeSection === 'account' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Account Settings</h3>
                <p className="text-gray-600">Manage your account details and preferences.</p>
                <p className="text-gray-500 italic">This section is under development.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
} 