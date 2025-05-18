import React, { useState } from 'react';
import { getWebhookSetupInstructions, isRetellConfigured } from '../config/retellConfig';
import { CheckCircleIcon, ClipboardIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

export default function WebhookSetup() {
  const { title, steps, webhookUrl } = getWebhookSetupInstructions();
  const [copied, setCopied] = useState(false);
  const isConfigured = isRetellConfigured();

  // Copy webhook URL to clipboard
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(webhookUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start space-x-2 mb-4">
        <InformationCircleIcon className="h-6 w-6 text-blue-500 flex-shrink-0 mt-0.5" />
        <div>
          <h2 className="text-lg font-medium text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1">
            Set up webhooks to enable Retell to send call events to your application.
          </p>
        </div>
      </div>

      {!isConfigured && (
        <div className="bg-yellow-50 p-4 rounded-md mb-4">
          <p className="text-sm text-yellow-700">
            <strong>Note:</strong> Retell API key and Agent ID are not configured. 
            Please set the RETELL_API_KEY and RETELL_AGENT_ID environment variables.
          </p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Webhook URL
        </label>
        <div className="flex">
          <input
            type="text"
            value={webhookUrl}
            readOnly
            className="flex-grow rounded-l-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-600"
          />
          <button
            onClick={handleCopyUrl}
            className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100"
          >
            {copied ? (
              <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ClipboardIcon className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Setup Steps</h3>
        <ol className="space-y-2 text-sm text-gray-600">
          {steps.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium mr-2 flex-shrink-0 mt-0.5">
                {index + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="bg-blue-50 p-4 rounded-md">
        <h3 className="text-sm font-medium text-blue-700 mb-2">Webhook Event Types</h3>
        <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
          <li><strong>call_started</strong>: Triggered when a call starts</li>
          <li><strong>call_ended</strong>: Triggered when a call ends, with transcript</li>
          <li><strong>call_analyzed</strong>: Triggered when call analysis is complete</li>
        </ul>
      </div>
      
      <div className="mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open('https://docs.retellai.com/features/webhook', '_blank')}
        >
          View Retell Webhook Documentation
        </Button>
      </div>
    </div>
  );
} 