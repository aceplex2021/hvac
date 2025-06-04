'use client';

import { useState } from 'react';
// import { BarChart2, LineChart, PieChart, TrendingUp } from 'lucide-react';
import { 
  Download,
  Filter,
  Calendar,
  DollarSign,
  Users,
  Clock,
  Settings
} from 'lucide-react';

// Mock data for demonstration
const mockReports = {
  revenue: {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    data: [12000, 15000, 18000, 14000, 16000, 20000]
  },
  services: {
    labels: ['AC Repair', 'Maintenance', 'Installation', 'Emergency'],
    data: [45, 30, 15, 10]
  },
  customers: {
    labels: ['New', 'Returning', 'Inactive'],
    data: [25, 60, 15]
  },
  performance: {
    labels: ['On Time', 'Delayed', 'Cancelled'],
    data: [85, 10, 5]
  }
};

const REPORT_TYPES = [
  { id: 'revenue', name: 'Revenue Analysis', icon: DollarSign },
  { id: 'services', name: 'Service Breakdown', icon: Settings },
  { id: 'customers', name: 'Customer Analytics', icon: Users },
  { id: 'performance', name: 'Performance Metrics', icon: Clock }
];

const TIME_RANGES = [
  'Last 7 Days',
  'Last 30 Days',
  'Last 90 Days',
  'This Year',
  'Custom Range'
];

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [timeRange, setTimeRange] = useState('Last 30 Days');
  const [isCustomizing, setIsCustomizing] = useState(false);

  const renderReportCard = (report: any) => (
    <div
      key={report.id}
      onClick={() => setSelectedReport(report.id)}
      className={`p-4 rounded-lg cursor-pointer ${
        selectedReport === report.id
          ? 'bg-blue-50 border-2 border-blue-500'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-center">
        <report.icon className="h-6 w-6 text-blue-500 mr-3" />
        <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
      </div>
    </div>
  );

  const renderChart = () => {
    // const data = mockReports[selectedReport]; // (comment out if not used)
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {REPORT_TYPES.find(r => r.id === selectedReport)?.name}
          </h2>
          <div className="flex space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              {TIME_RANGES.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
            <button
              onClick={() => setIsCustomizing(!isCustomizing)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-5 w-5 mr-2" />
              Customize
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-5 w-5 mr-2" />
              Export
            </button>
          </div>
        </div>

        <div className="h-96 bg-gray-50 rounded-lg p-4">
          {/* Placeholder for actual chart implementation */}
          <div className="flex items-center justify-center h-full text-gray-500">
            Chart visualization will be implemented here
          </div>
        </div>

        {isCustomizing && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customize Report</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Metrics</label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Revenue</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Service Count</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Customer Count</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Group By</label>
                <select className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option>Day</option>
                  <option>Week</option>
                  <option>Month</option>
                  <option>Quarter</option>
                  <option>Year</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Advanced Reporting</h1>
          <div className="flex space-x-4">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Report
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <Download className="h-5 w-5 mr-2" />
              Export All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="space-y-4">
              {REPORT_TYPES.map(renderReportCard)}
            </div>
          </div>
          <div className="lg:col-span-3">
            {renderChart()}
          </div>
        </div>
      </div>
    </div>
  );
} 