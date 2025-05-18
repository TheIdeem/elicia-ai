import { useState, useEffect, useCallback } from 'react';
import { fetchCalls } from '../services/callService';
import { getLeads } from '../services/leadStorageService';

/**
 * Custom hook to fetch and process data for the dashboard
 */
export const useDashboardData = (dateRange: string = 'week') => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState({
    calls: {
      total: 0,
      meetingsBooked: 0,
      totalCost: 0,
      avgDuration: '0:00',
      completionRate: '0%',
      inboundCount: 0,
      outboundCount: 0,
      callsByDay: [] as { label: string; value: number }[],
    },
    leads: {
      total: 0,
      active: 0,
      conversionRate: '0%',
      avgValue: '$0',
      bySource: [] as { label: string; value: number }[],
    },
    meetings: {
      total: 0,
      scheduled: 0,
      completed: 0,
      conversionRate: '0%',
      avgDuration: '0 min',
      byType: [] as { label: string; value: number }[],
    },
    properties: {
      total: 0,
      avgPrice: '$0',
      mostPopular: '',
      byLocation: [] as { label: string; value: number }[],
    }
  });

  // Get date range for filtering data
  const getDateRange = useCallback(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch (dateRange) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
    }
    
    return { startDate, endDate: now };
  }, [dateRange]);

  // Fetch data for the dashboard
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { startDate, endDate } = getDateRange();
      
      // Fetch calls
      let callsData;
      try {
        callsData = await fetchCalls();
      } catch (err) {
        console.error('Error fetching calls:', err);
        callsData = [];
      }
      
      // Filter calls based on date range
      const filteredCalls = callsData.filter(call => {
        const callDate = call.created_at 
          ? new Date(call.created_at) 
          : (call.start_timestamp ? new Date(call.start_timestamp) : null);
        
        return callDate && callDate >= startDate && callDate <= endDate;
      });
      
      // Process calls data
      const totalCalls = filteredCalls.length;
      let inboundCount = 0;
      let outboundCount = 0;
      let completedCount = 0;
      let meetingsBooked = 0;
      let totalCost = 0;
      let totalDuration = 0;
      
      // Process each call
      filteredCalls.forEach(call => {
        // Count by type
        if (call.from_number?.includes('+14253995840') || call.call_type === 'web_call') {
          outboundCount++;
        } else {
          inboundCount++;
        }
        
        // Count completed calls
        if (call.status === 'completed' || call.call_status === 'completed') {
          completedCount++;
        }
        
        // Check if meeting was booked (from call analysis or metadata)
        if (
          (call.call_analysis?.call_summary && 
           call.call_analysis.call_summary.toLowerCase().includes('appointment')) || 
          (call.metadata?.outcome && 
           call.metadata.outcome.toLowerCase().includes('meeting'))
        ) {
          meetingsBooked++;
        }
        
        // Calculate costs
        if (call.call_cost?.combined_cost) {
          totalCost += call.call_cost.combined_cost;
        }
        
        // Calculate duration
        if (call.duration_seconds) {
          totalDuration += call.duration_seconds;
        } else if (call.start_timestamp && call.end_timestamp) {
          totalDuration += Math.floor((call.end_timestamp - call.start_timestamp) / 1000);
        }
      });
      
      // Calculate average duration
      const avgDurationSeconds = totalCalls > 0 ? Math.floor(totalDuration / totalCalls) : 0;
      const avgDuration = `${Math.floor(avgDurationSeconds / 60)}:${(avgDurationSeconds % 60).toString().padStart(2, '0')}`;
      
      // Calculate completion rate
      const completionRate = totalCalls > 0 ? `${Math.round((completedCount / totalCalls) * 100)}%` : '0%';
      
      // Create calls by day chart data
      const callsByDay = generateDailyData(filteredCalls);
      
      // Fetch leads
      const leads = getLeads();
      const totalLeads = leads.length;
      
      // Count active leads (not converted or unqualified)
      const activeLeads = leads.filter(lead => lead.status !== 'converted' && lead.status !== 'unqualified').length;
      
      // Calculate average lead value
      const leadsWithValue = leads.filter(lead => lead.estimatedValue);
      const avgValue = leadsWithValue.length > 0 
        ? `$${Math.round(leadsWithValue.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0) / leadsWithValue.length).toLocaleString()}`
        : '$0';
      
      // Calculate conversion rate
      const convertedLeads = leads.filter(lead => lead.status === 'converted').length;
      const conversionRate = totalLeads > 0 ? `${Math.round((convertedLeads / totalLeads) * 100)}%` : '0%';
      
      // Group leads by source
      const leadsBySource = leads.reduce((acc, lead) => {
        if (!lead.source) return acc;
        acc[lead.source] = (acc[lead.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      // Convert to chart format and calculate percentages
      const bySource = Object.entries(leadsBySource).map(([label, count]) => ({
        label,
        value: Math.round((count / totalLeads) * 100)
      }));
      
      // Mock data for meetings
      const meetings = {
        total: 76,
        scheduled: 45,
        completed: 31,
        conversionRate: '92%',
        avgDuration: '45 min',
        byType: [
          { label: 'Property Viewing', value: 55 },
          { label: 'Consultation', value: 30 },
          { label: 'Follow-up', value: 15 }
        ]
      };
      
      // Mock data for properties
      const properties = {
        total: 123,
        avgPrice: '$425,000',
        mostPopular: 'Suburbs',
        byLocation: [
          { label: 'Downtown', value: 32 },
          { label: 'Suburbs', value: 45 },
          { label: 'Waterfront', value: 18 },
          { label: 'Rural', value: 5 }
        ]
      };
      
      // Update dashboard data
      setDashboardData({
        calls: {
          total: totalCalls,
          meetingsBooked,
          totalCost: Math.round(totalCost / 100), // Convert from cents to dollars
          avgDuration,
          completionRate,
          inboundCount,
          outboundCount,
          callsByDay,
        },
        leads: {
          total: totalLeads,
          active: activeLeads,
          conversionRate,
          avgValue,
          bySource,
        },
        meetings: meetings,
        properties: properties,
      });
      
    } catch (err: any) {
      setError(err.message || 'Failed to fetch dashboard data');
      console.error('Error in useDashboardData:', err);
    } finally {
      setIsLoading(false);
    }
  }, [getDateRange]);
  
  // Generate daily data for charts
  const generateDailyData = (calls: any[]) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyCounts = days.map(day => ({ label: day, value: 0 }));
    
    calls.forEach(call => {
      const callDate = call.created_at 
        ? new Date(call.created_at) 
        : (call.start_timestamp ? new Date(call.start_timestamp) : null);
      
      if (callDate) {
        const dayIndex = callDate.getDay();
        dailyCounts[dayIndex].value++;
      }
    });
    
    // Rotate array to start with Monday
    return [...dailyCounts.slice(1), dailyCounts[0]];
  };
  
  // Fetch data when component mounts or date range changes
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);
  
  return {
    dashboardData,
    isLoading,
    error,
    refreshData: fetchDashboardData
  };
}; 