'use client';

import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import DashboardCard from '../components/DashboardCard';
import AnalyticsChart from '../components/AnalyticsChart';
import {
  PhoneIcon,
  UserGroupIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowRightIcon,
  BanknotesIcon,
  MapPinIcon,
  PhoneArrowUpRightIcon,
  PhoneArrowDownLeftIcon,
  CalendarDaysIcon,
  AdjustmentsHorizontalIcon,
  CheckCircleIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useDashboardData } from './useDashboardData';

export default function Dashboard() {
  const [dateRange, setDateRange] = useState<string>('week');
  const [isDateSelectorOpen, setIsDateSelectorOpen] = useState<boolean>(false);
  
  // Use our custom hook to fetch and process dashboard data
  const { dashboardData, isLoading, error, refreshData } = useDashboardData(dateRange);
  
  // Date range options
  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' },
  ];

  // Function to handle date range change
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    setIsDateSelectorOpen(false);
  };

  // Sample data for the dashboard (now replaced with real data)
  const cardsData = [
    { 
      title: 'Total Calls', 
      value: dashboardData.calls.total.toString(), 
      icon: <PhoneIcon className="w-6 h-6 text-blue-600" />, 
      trend: { value: 12.5, isPositive: true } 
    },
    { 
      title: 'Active Leads', 
      value: dashboardData.leads.active.toString(), 
      icon: <UserGroupIcon className="w-6 h-6 text-green-600" />, 
      trend: { value: 8.2, isPositive: true } 
    },
    { 
      title: 'Scheduled Meetings', 
      value: dashboardData.meetings.scheduled.toString(), 
      icon: <CalendarIcon className="w-6 h-6 text-purple-600" />, 
      trend: { value: 5.3, isPositive: true } 
    },
    { 
      title: 'Properties', 
      value: dashboardData.properties.total.toString(), 
      icon: <BuildingOfficeIcon className="w-6 h-6 text-amber-600" />, 
      trend: { value: 2.1, isPositive: false } 
    }
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your AI calling agent.</p>
        </div>
        <div className="mt-4 sm:mt-0 relative">
          <button 
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white rounded-md shadow-sm text-sm font-medium !text-black hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onClick={() => setIsDateSelectorOpen(!isDateSelectorOpen)}
            style={{ color: 'black' }}
          >
            <CalendarDaysIcon className="h-5 w-5 mr-2 text-gray-500" />
            <span className="text-black">{dateRangeOptions.find(option => option.value === dateRange)?.label}</span>
            <AdjustmentsHorizontalIcon className="h-5 w-5 ml-2 text-gray-500" />
          </button>
          
          {isDateSelectorOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" role="menu" aria-orientation="vertical">
                {dateRangeOptions.map((option) => (
                  <button
                    key={option.value}
                    className={`block w-full text-left px-4 py-2 text-sm ${
                      option.value === dateRange ? 'bg-indigo-50 text-blue-600' : 'text-black hover:bg-gray-100'
                    }`}
                    onClick={() => handleDateRangeChange(option.value)}
                    role="menuitem"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cardsData.map((card, index) => (
          <DashboardCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            trend={card.trend}
          />
        ))}
      </div>

      {/* Calls Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <PhoneIcon className="w-6 h-6 mr-3 text-blue-600" />
            <h3 className="text-xl font-bold text-gray-800">Calls</h3>
          </div>
          <Link href="/calls" className="text-blue-600 hover:text-blue-800 flex items-center text-sm font-medium">
            View All Calls
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-5">
            <h4 className="text-base font-medium text-gray-700 mb-4">Calls by Day</h4>
            <AnalyticsChart
              data={dashboardData.calls.callsByDay.length > 0 ? dashboardData.calls.callsByDay : [
                { label: 'Mon', value: 45 },
                { label: 'Tue', value: 58 },
                { label: 'Wed', value: 63 },
                { label: 'Thu', value: 72 },
                { label: 'Fri', value: 59 },
                { label: 'Sat', value: 33 },
                { label: 'Sun', value: 28 }
              ]}
              type="bar"
              height={240}
              barColor="#3B82F6"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
            <h4 className="text-base font-medium text-gray-700 mb-4">Call Type Distribution</h4>
            <AnalyticsChart
              data={
                dashboardData.calls.total === 0 
                ? [{ label: 'No Calls', value: 1 }]  // Fallback data when no calls
                : dashboardData.calls.inboundCount === 0 && dashboardData.calls.outboundCount > 0
                ? [{ label: 'Outbound', value: dashboardData.calls.outboundCount }]  // Only outbound calls
                : dashboardData.calls.outboundCount === 0 && dashboardData.calls.inboundCount > 0
                ? [{ label: 'Inbound', value: dashboardData.calls.inboundCount }]  // Only inbound calls
                : [  // Both inbound and outbound calls
                    { label: 'Inbound', value: dashboardData.calls.inboundCount },
                    { label: 'Outbound', value: dashboardData.calls.outboundCount }
                  ]
              }
              type="pie"
              height={180}
              colors={['#8B5CF6', '#3B82F6']}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-4">
            <h4 className="text-base font-medium text-gray-700 mb-4">Call Statistics</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <ClockIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Average Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.calls.avgDuration}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <CheckCircleIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Meetings Booked</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.calls.meetingsBooked}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-blue-100 p-3 mr-4">
                  <CurrencyDollarIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Cost</p>
                  <p className="text-lg font-semibold text-gray-900">${dashboardData.calls.totalCost}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Leads Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <UserGroupIcon className="w-6 h-6 mr-3 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Leads</h3>
          </div>
          <Link href="/leads" className="text-green-600 hover:text-green-800 flex items-center text-sm font-medium">
            View All Leads
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-5">
            <h4 className="text-base font-medium text-gray-700 mb-4">Lead Conversion Rate</h4>
            <AnalyticsChart
              data={dashboardData.leads.bySource.length > 0 ? dashboardData.leads.bySource : [
                { label: 'Week 1', value: 35 },
                { label: 'Week 2', value: 42 },
                { label: 'Week 3', value: 48 },
                { label: 'Week 4', value: 53 }
              ]}
              type="line"
              height={240}
              lineColor="#22C55E"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
            <h4 className="text-base font-medium text-gray-700 mb-4">Lead Sources</h4>
            <AnalyticsChart
              data={dashboardData.leads.bySource.length > 0 ? dashboardData.leads.bySource : [
                { label: 'Website', value: 45 },
                { label: 'Referral', value: 25 },
                { label: 'Direct', value: 15 },
                { label: 'Social', value: 15 }
              ]}
              type="pie"
              height={180}
              colors={['#22C55E', '#10B981', '#34D399', '#6EE7B7']}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-4">
            <h4 className="text-base font-medium text-gray-700 mb-4">Lead Statistics</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <ArrowTrendingUpIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Conversion Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.leads.conversionRate}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <BanknotesIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Value</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.leads.avgValue}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-green-100 p-3 mr-4">
                  <UserGroupIcon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Leads</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.leads.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Meetings Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <CalendarIcon className="w-6 h-6 mr-3 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Meetings</h3>
          </div>
          <Link href="/meetings" className="text-purple-600 hover:text-purple-800 flex items-center text-sm font-medium">
            View All Meetings
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-5">
            <h4 className="text-base font-medium text-gray-700 mb-4">Meeting Schedule</h4>
            <AnalyticsChart
              data={[
                { label: 'Mon', value: 8 },
                { label: 'Tue', value: 12 },
                { label: 'Wed', value: 15 },
                { label: 'Thu', value: 10 },
                { label: 'Fri', value: 14 },
                { label: 'Sat', value: 5 },
                { label: 'Sun', value: 2 }
              ]}
              type="bar"
              height={240}
              barColor="#8B5CF6"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
            <h4 className="text-base font-medium text-gray-700 mb-4">Meeting Types</h4>
            <AnalyticsChart
              data={dashboardData.meetings.byType}
              type="pie"
              height={180}
              colors={['#8B5CF6', '#A78BFA', '#C4B5FD']}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-4">
            <h4 className="text-base font-medium text-gray-700 mb-4">Meeting Statistics</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <ChartBarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion Rate</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.meetings.conversionRate}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <ClockIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Duration</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.meetings.avgDuration}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-purple-100 p-3 mr-4">
                  <CalendarIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scheduled Meetings</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.meetings.scheduled}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Properties Section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <BuildingOfficeIcon className="w-6 h-6 mr-3 text-amber-600" />
            <h3 className="text-xl font-bold text-gray-800">Properties</h3>
          </div>
          <Link href="/properties" className="text-amber-600 hover:text-amber-800 flex items-center text-sm font-medium">
            View All Properties
            <ArrowRightIcon className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-5">
            <h4 className="text-base font-medium text-gray-700 mb-4">Property Trend</h4>
            <AnalyticsChart
              data={[
                { label: 'Jan', value: 110 },
                { label: 'Feb', value: 115 },
                { label: 'Mar', value: 118 },
                { label: 'Apr', value: 123 },
                { label: 'May', value: 127 },
                { label: 'Jun', value: 123 }
              ]}
              type="line"
              height={240}
              lineColor="#F59E0B"
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-3">
            <h4 className="text-base font-medium text-gray-700 mb-4">Property Locations</h4>
            <AnalyticsChart
              data={dashboardData.properties.byLocation}
              type="pie"
              height={180}
              colors={['#F59E0B', '#FBBF24', '#FCD34D', '#FDE68A']}
            />
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6 lg:col-span-4">
            <h4 className="text-base font-medium text-gray-700 mb-4">Property Statistics</h4>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 p-3 mr-4">
                  <BanknotesIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Price</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.properties.avgPrice}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 p-3 mr-4">
                  <MapPinIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Most Popular</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.properties.mostPopular}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="rounded-full bg-amber-100 p-3 mr-4">
                  <BuildingOfficeIcon className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Properties</p>
                  <p className="text-lg font-semibold text-gray-900">{dashboardData.properties.total}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
} 