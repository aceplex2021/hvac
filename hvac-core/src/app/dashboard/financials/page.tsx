'use client';

import { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Receipt, 
  CreditCard, 
  Search, 
  Filter,
  Download,
  Plus,
  Calendar,
  FileText,
  BarChart2,
  PieChart,
  Wrench
} from 'lucide-react';

// Mock data for demonstration
const mockRevenueData = {
  totalRevenue: 25000,
  monthlyRevenue: 5000,
  serviceRevenue: 20000,
  otherRevenue: 5000,
  revenueTrend: '+15%',
  recentTransactions: [
    {
      id: 1,
      date: '2024-03-15',
      type: 'Service',
      description: 'AC Repair',
      amount: 299,
      status: 'Completed'
    },
    {
      id: 2,
      date: '2024-03-14',
      type: 'Service',
      description: 'Maintenance Check',
      amount: 99,
      status: 'Completed'
    }
  ]
};

const mockExpenses = [
  {
    id: 1,
    date: '2024-03-15',
    category: 'Supplies',
    description: 'AC Parts',
    amount: 150,
    status: 'Paid'
  },
  {
    id: 2,
    date: '2024-03-14',
    category: 'Equipment',
    description: 'New Tools',
    amount: 500,
    status: 'Pending'
  }
];

const mockInvoices = [
  {
    id: 1,
    number: 'INV-2024-001',
    date: '2024-03-15',
    customer: 'John Smith',
    amount: 299,
    status: 'Paid'
  },
  {
    id: 2,
    number: 'INV-2024-002',
    date: '2024-03-14',
    customer: 'Sarah Johnson',
    amount: 99,
    status: 'Pending'
  }
];

const mockPayments = [
  {
    id: 1,
    date: '2024-03-15',
    method: 'Credit Card',
    amount: 299,
    status: 'Completed',
    reference: 'TRX-12345'
  },
  {
    id: 2,
    date: '2024-03-14',
    method: 'Bank Transfer',
    amount: 99,
    status: 'Processing',
    reference: 'TRX-12346'
  }
];

const TABS = [
  { id: 'revenue', name: 'Revenue', icon: TrendingUp },
  { id: 'expenses', name: 'Expenses', icon: Receipt },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  { id: 'payments', name: 'Payments', icon: CreditCard }
];

export default function FinancialsPage() {
  const [activeTab, setActiveTab] = useState('revenue');
  const [searchQuery, setSearchQuery] = useState('');

  const renderRevenueDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">${mockRevenueData.totalRevenue}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      {mockRevenueData.revenueTrend}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Monthly Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">${mockRevenueData.monthlyRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wrench className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Service Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">${mockRevenueData.serviceRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Other Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">${mockRevenueData.otherRevenue}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h3>
          <div className="space-y-4">
            {mockRevenueData.recentTransactions.map((transaction) => (
              <div key={transaction.id} className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{transaction.description}</h4>
                      <p className="text-sm text-gray-500">{transaction.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">${transaction.amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {transaction.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Expenses</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockExpenses.map((expense) => (
            <li key={expense.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Receipt className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{expense.description}</h3>
                      <p className="text-sm text-gray-500">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">${expense.amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {expense.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderInvoices = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Invoices</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockInvoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{invoice.number}</h3>
                      <p className="text-sm text-gray-500">{invoice.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">${invoice.amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {invoice.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const renderPayments = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Payments</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Plus className="h-4 w-4 mr-2" />
          Record Payment
        </button>
      </div>

      <div className="flex space-x-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
            placeholder="Search payments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {mockPayments.map((payment) => (
            <li key={payment.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CreditCard className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{payment.reference}</h3>
                      <p className="text-sm text-gray-500">{payment.method}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">${payment.amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      payment.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {payment.date}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm`}
              >
                <tab.icon
                  className={`${
                    activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  } -ml-0.5 mr-2 h-5 w-5`}
                />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {activeTab === 'revenue' && renderRevenueDashboard()}
          {activeTab === 'expenses' && renderExpenses()}
          {activeTab === 'invoices' && renderInvoices()}
          {activeTab === 'payments' && renderPayments()}
        </div>
      </div>
    </div>
  );
} 