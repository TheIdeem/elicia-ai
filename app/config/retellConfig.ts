// Retell AI configuration

// Default agent ID to use for outbound calls
export const DEFAULT_AGENT_ID = process.env.RETELL_AGENT_ID || 'default-agent';

// Webhook URL configuration
export const getWebhookUrl = (): string => {
  // In production, use the actual deployed URL
  if (process.env.NODE_ENV === 'production') {
    return `${process.env.NEXT_PUBLIC_API_URL || ''}/api/webhook`;
  }
  
  // For local development, you can use ngrok or a similar service to expose your local server
  // then set this URL in your .env file
  if (process.env.RETELL_WEBHOOK_URL) {
    return process.env.RETELL_WEBHOOK_URL;
  }
  
  // Default fallback for development - this won't receive real events
  // but we show instructions for setting up properly
  return 'http://localhost:3000/api/webhook';
};

// Function to get instructions for setting up webhooks
export const getWebhookSetupInstructions = (): { 
  title: string; 
  steps: string[];
  webhookUrl: string;
} => {
  const webhookUrl = getWebhookUrl();
  const isLocalhost = webhookUrl.includes('localhost');
  
  return {
    title: 'Setting Up Retell Webhooks',
    steps: [
      isLocalhost 
        ? '1. Install ngrok (https://ngrok.com) to expose your localhost'
        : '1. Your webhook URL is already configured for production',
      
      isLocalhost
        ? '2. Run: ngrok http 3000 to get a public URL'
        : '2. No further action needed',
      
      isLocalhost
        ? '3. Copy the https URL from ngrok and add it to your .env file as RETELL_WEBHOOK_URL'
        : '3. Your webhook will receive call events automatically',
      
      '4. Register this webhook URL in your Retell dashboard under Webhooks',
      
      '5. Select the events you want to receive (call_started, call_ended, call_analyzed)'
    ],
    webhookUrl
  };
};

// Helper to check if Retell is properly configured
export const isRetellConfigured = (): boolean => {
  return Boolean(process.env.RETELL_API_KEY && process.env.RETELL_AGENT_ID);
}; 