'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { PhoneIcon, CheckCircleIcon, XCircleIcon, UserIcon } from '@heroicons/react/24/outline';
import { createCall } from '../services/callService';
import { getLeads as getLeadsFromSupabase } from '../services/supabaseLeadService';
import { Lead } from '../leads/types';
import PropertySearchDemo from './PropertySearchDemo';
import WebhookSetup from './WebhookSetup';

export default function DemoPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [selectedLeadId, setSelectedLeadId] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [error, setError] = useState('');
  const [callInfo, setCallInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [callSuccess, setCallSuccess] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'call' | 'property-search' | 'webhook-setup'>('call');

  // Load leads from Supabase
  useEffect(() => {
    async function fetchLeads() {
      try {
        const loadedLeads = await getLeadsFromSupabase();
        setLeads(loadedLeads);
        if (loadedLeads.length > 0) {
          setSelectedLeadId(loadedLeads[0].id);
          setSelectedLead(loadedLeads[0]);
        }
      } catch (e) {
        setLeads([]);
      }
    }
    fetchLeads();
  }, []);

  // Update selected lead when dropdown changes
  useEffect(() => {
    if (selectedLeadId) {
      const lead = leads.find(lead => lead.id === selectedLeadId);
      setSelectedLead(lead || null);
    } else {
      setSelectedLead(null);
    }
  }, [selectedLeadId, leads]);
  
  const handleStartCall = async () => {
    try {
      if (!selectedLead) {
        setError('Please select a lead to call');
        return;
      }
      
      setError('');
      setIsLoading(true);
      setCallSuccess(null);
      
      // Format the phone number for the call
      const phoneNumber = selectedLead.phone ? selectedLead.phone.replace(/\D/g, '') : '';
      const finalNumber = phoneNumber
        ? (!phoneNumber.startsWith('+') 
            ? (phoneNumber.startsWith('1') ? `+${phoneNumber}` : `+1${phoneNumber}`)
            : selectedLead.phone)
        : '';
      
      if (!finalNumber) {
        setError('Lead has no valid phone number');
        setIsLoading(false);
        return;
      }
      
      // Create a call using our service - pass leadId as well
      const callResponse = await createCall(finalNumber, selectedLead.id);
      
      console.log('Call response:', callResponse);
      setCallInfo(callResponse);
      setIsCallActive(true);
      setCallSuccess(true);
      
    } catch (err: any) {
      console.error('Error making call:', err);
      setError(err.message || 'Failed to initiate call');
      setCallSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleEndCall = () => {
    setIsCallActive(false);
    setCallInfo(null);
  };
  
  const handleViewCalls = () => {
    router.push('/calls');
  };
  
  const handleViewLeads = () => {
    router.push('/leads');
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Demo Features</h1>
        
        <div className="mb-6 flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'call' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('call')}
          >
            Call Demo
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'property-search' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('property-search')}
          >
            Property Search
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'webhook-setup' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('webhook-setup')}
          >
            Webhook Setup
          </button>
        </div>
        
        {activeTab === 'call' ? (
          <div className="flex items-center justify-center">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <div className="text-center mb-8">
                <PhoneIcon className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold text-gray-900">Demo Calling</h1>
                <p className="text-gray-600 mt-2">Select a lead to start a call</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="lead-select" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Lead
                  </label>
                  {leads.length > 0 ? (
                    <div className="relative">
                      <select
                        id="lead-select"
                        className="block w-full rounded-md border border-gray-300 p-2.5 pr-10 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                        value={selectedLeadId}
                        onChange={(e) => setSelectedLeadId(e.target.value)}
                        disabled={isCallActive || isLoading}
                      >
                        <option value="" disabled>Select a lead to call</option>
                        {leads.map((lead) => (
                          <option key={lead.id} value={lead.id}>
                            {lead.firstName} {lead.lastName} - {lead.phone}
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <UserIcon className="h-5 w-5" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 p-3 rounded-md">
                      <p className="text-yellow-700 text-sm">No leads found in your database. Please add leads first.</p>
                      <Button 
                        onClick={handleViewLeads}
                        variant="outline"
                        size="sm"
                        className="mt-2"
                      >
                        Go to Leads
                      </Button>
                    </div>
                  )}
                  
                  {selectedLead && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-900">{selectedLead.firstName} {selectedLead.lastName}</h3>
                      <p className="text-sm text-gray-600">{selectedLead.phone || 'No phone'}</p>
                      <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          {selectedLead.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                {error && (
                  <div className="bg-red-50 p-3 rounded-md">
                    <p className="text-red-600 text-sm flex items-center">
                      <XCircleIcon className="h-5 w-5 mr-1" />
                      {error}
                    </p>
                  </div>
                )}
                
                {callSuccess === true && (
                  <div className="bg-green-50 p-3 rounded-md">
                    <p className="text-green-600 text-sm flex items-center">
                      <CheckCircleIcon className="h-5 w-5 mr-1" />
                      Call initiated successfully
                    </p>
                  </div>
                )}
                
                {isCallActive ? (
                  <div className="space-y-4">
                    <Button
                      onClick={handleEndCall}
                      variant="danger"
                      size="lg"
                      className="w-full py-3"
                    >
                      End Call
                    </Button>
                    <Button
                      onClick={handleViewCalls}
                      variant="outline"
                      size="lg"
                      className="w-full py-3"
                    >
                      View Call History
                    </Button>
                    <div className="text-center animate-pulse mt-4">
                      <p className="text-blue-600 font-medium">Call in progress...</p>
                      {callInfo && callInfo.id && (
                        <p className="text-sm text-gray-600 mt-1">Call ID: {callInfo.id}</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button
                      onClick={handleStartCall}
                      variant="primary"
                      size="lg"
                      icon={<PhoneIcon className="h-5 w-5" />}
                      disabled={!selectedLead || isLoading}
                      className="w-full py-3"
                    >
                      {isLoading ? 'Initiating Call...' : 'Start Calling'}
                    </Button>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={handleViewCalls}
                        variant="outline"
                        size="lg"
                        className="w-full py-3"
                      >
                        Call History
                      </Button>
                      <Button
                        onClick={handleViewLeads}
                        variant="outline"
                        size="lg"
                        className="w-full py-3"
                      >
                        Manage Leads
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : activeTab === 'property-search' ? (
          <PropertySearchDemo />
        ) : (
          <WebhookSetup />
        )}
      </div>
    </DashboardLayout>
  );
} 