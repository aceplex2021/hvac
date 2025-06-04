'use client';

import { useState, useEffect, useCallback } from 'react';
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
  Wrench
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useParams } from 'next/navigation';

const TABS = [
  { id: 'revenue', name: 'Revenue', icon: TrendingUp },
  { id: 'expenses', name: 'Expenses', icon: Receipt },
  { id: 'invoices', name: 'Invoices', icon: FileText },
  // { id: 'payments', name: 'Payments', icon: CreditCard }, // Payments tab hidden for now
];

export default function FinancialsPage() {
  const params = useParams();
  const slug = params.slug;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [activeTab, setActiveTab] = useState('revenue');
  const [searchQuery, setSearchQuery] = useState('');
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    date: '',
    category: '',
    description: '',
    amount: '',
    status: '',
  });
  const [invoiceForm, setInvoiceForm] = useState({
    date: '',
    customer: '',
    service: '',
    part: '',
    misc: '',
    miscDesc: '',
    tax: 8.25,
  });
  // State for DB data
  const [revenueData, setRevenueData] = useState<any>(null);
  const [revenueLoading, setRevenueLoading] = useState(true);
  const [revenueError, setRevenueError] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expensesLoading, setExpensesLoading] = useState(true);
  const [expensesError, setExpensesError] = useState<string | null>(null);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [workOrders, setWorkOrders] = useState<any[]>([]);
  // Expense categories/statuses (use enums/constants if not in DB)
  const EXPENSE_CATEGORIES = ['Supplies', 'Equipment', 'Travel', 'Utilities', 'Other'];
  const EXPENSE_STATUSES = ['Paid', 'Pending', 'Overdue'];

  // Fetch businessId from slug
  const [businessId, setBusinessId] = useState<string | null>(null);
  // Add state for parts revenue
  const [partsRevenue, setPartsRevenue] = useState(0);

  // Move fetchExpenses to top-level so it can be reused
  const fetchExpenses = useCallback(async () => {
    if (!businessId) return;
    setExpensesLoading(true);
    setExpensesError(null);
    try {
      const { data, error } = await supabase
        .from('hvac_expenses')
        .select('*')
        .eq('business_id', businessId)
        .order('date', { ascending: false });
      if (error) throw error;
      setExpenses(data || []);
    } catch (err: any) {
      setExpensesError(err.message || 'Failed to fetch expenses.');
    } finally {
      setExpensesLoading(false);
    }
  }, [businessId, supabase]);

  useEffect(() => {
    async function fetchBusinessId() {
      if (!slug) return;
      const { data: business } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      setBusinessId(business?.id || null);
    }
    fetchBusinessId();
  }, [slug, supabase]);

  // Fetch all financial data when businessId is available
  useEffect(() => {
    if (!businessId) return;
    // Revenue (aggregate from invoices/payments)
    async function fetchRevenue() {
      setRevenueLoading(true);
      setRevenueError(null);
      try {
        // Total revenue: sum of paid invoices
        const { data: invoices, error: invError } = await supabase
          .from('hvac_invoices')
          .select('*')
          .eq('business_id', businessId);
        if (invError) throw invError;
        const paidInvoices = (invoices || []).filter((inv) => inv.status?.toLowerCase() === 'paid');
        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
        // Monthly revenue: sum of paid invoices in current month
        const now = new Date();
        const thisMonth = now.getMonth();
        const thisYear = now.getFullYear();
        const monthlyRevenue = paidInvoices.filter((inv) => {
          const d = new Date(inv.issue_date);
          return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
        }).reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
        // Service revenue: sum of paid invoices for service jobs
        // (Assume service_id is not null for service jobs)
        const serviceRevenue = paidInvoices.filter((inv) => inv.service_id).reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
        // Other revenue: paid invoices without service_id
        const otherRevenue = paidInvoices.filter((inv) => !inv.service_id).reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
        // Revenue trend: compare this month to last month
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastMonthRevenue = paidInvoices.filter((inv) => {
          const d = new Date(inv.issue_date);
          return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === lastMonth.getFullYear();
        }).reduce((sum, inv) => sum + (parseFloat(inv.total_amount) || 0), 0);
        const revenueTrend = lastMonthRevenue > 0 ? `+${Math.round(((monthlyRevenue - lastMonthRevenue) / lastMonthRevenue) * 100)}%` : '+0%';
        // Recent transactions: last 5 paid invoices
        const recentTransactions = paidInvoices.slice(-5).reverse().map((inv, i) => {
          let type = 'Other';
          let description = 'Other';
          if (inv.work_order_id) {
            const wo = workOrders.find(w => w.id === inv.work_order_id);
            if (wo) {
              type = wo.type || 'Other';
              description = wo.description || 'Other';
            }
          } else if (inv.service_id) {
            const service = services.find(s => s.id === inv.service_id);
            if (service) {
              type = service.name;
              description = service.name;
            }
          }
          return {
            id: inv.id || i,
            date: inv.issue_date ? new Date(inv.issue_date).toLocaleDateString() : '',
            type,
            description,
            amount: inv.total_amount,
            status: inv.status,
          };
        });
        setRevenueData({ totalRevenue, monthlyRevenue, serviceRevenue, otherRevenue, revenueTrend, recentTransactions });
      } catch (err: any) {
        setRevenueError(err.message || 'Failed to fetch revenue data.');
      } finally {
        setRevenueLoading(false);
      }
    }
    // Expenses
    fetchExpenses();
    // Invoices
    async function fetchInvoices() {
      setInvoicesLoading(true);
      setInvoicesError(null);
      try {
        const { data, error } = await supabase
          .from('hvac_invoices')
          .select('*')
          .eq('business_id', businessId)
          .order('created_at', { ascending: false });
        if (error) throw error;
        setInvoices(data || []);
      } catch (err: any) {
        setInvoicesError(err.message || 'Failed to fetch invoices.');
      } finally {
        setInvoicesLoading(false);
      }
    }
    // Customers (for invoice dropdown)
    async function fetchCustomers() {
      const { data } = await supabase
        .from('hvac_clients')
        .select('id, name')
        .eq('business_id', businessId);
      setCustomers(data || []);
    }
    // Services (for invoice dropdown)
    async function fetchServices() {
      const { data } = await supabase
        .from('hvac_services')
        .select('id, name, base_price')
        .eq('business_id', businessId);
      setServices(data || []);
    }
    // Parts (for invoice dropdown)
    async function fetchParts() {
      const { data } = await supabase
        .from('hvac_inventory_items')
        .select('id, name, price')
        .eq('business_id', businessId);
      setParts(data || []);
    }
    // Add parts revenue calculation
    async function fetchPartsRevenue() {
      try {
        // 1. Get all inventory item names (part names)
        const { data: inventoryItems } = await supabase
          .from('hvac_inventory_items')
          .select('name')
          .eq('business_id', businessId);
        const partNames = (inventoryItems || []).map(item => item.name);
        if (partNames.length === 0) {
          setPartsRevenue(0);
          return;
        }
        // 2. Get all paid invoice IDs
        const { data: paidInvoices } = await supabase
          .from('hvac_invoices')
          .select('id')
          .eq('business_id', businessId)
          .in('status', ['paid', 'Paid']);
        const paidInvoiceIds = (paidInvoices || []).map(inv => inv.id);
        if (paidInvoiceIds.length === 0) {
          setPartsRevenue(0);
          return;
        }
        // 3. Get all invoice items for those invoices
        const { data: invoiceItems } = await supabase
          .from('hvac_invoice_items')
          .select('description, amount, invoice_id')
          .in('invoice_id', paidInvoiceIds);
        // 4. Sum amount for items whose description matches a part name
        const partsRevenue = (invoiceItems || [])
          .filter(item => partNames.includes(item.description))
          .reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        setPartsRevenue(partsRevenue);
      } catch (err) {
        setPartsRevenue(0);
      }
    }
    // Work orders
    async function fetchWorkOrders() {
      const { data } = await supabase
        .from('hvac_work_orders')
        .select('id, type, description')
        .eq('business_id', businessId);
      setWorkOrders(data || []);
    }
    fetchRevenue();
    fetchInvoices();
    fetchCustomers();
    fetchServices();
    fetchParts();
    fetchPartsRevenue();
    fetchWorkOrders();
  }, [businessId, fetchExpenses, services, supabase, workOrders]);

  const handleExpenseChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setExpenseForm({ ...expenseForm, [e.target.name]: e.target.value });
  };
  const handleInvoiceChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };
  const handleExpenseSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!businessId) return;
    setExpensesLoading(true);
    try {
      const { error } = await supabase
        .from('hvac_expenses')
        .insert([
          {
            business_id: businessId,
            date: expenseForm.date,
            category: expenseForm.category,
            description: expenseForm.description,
            amount: parseFloat(expenseForm.amount),
            status: expenseForm.status,
          },
        ]);
      if (error) throw error;
      setShowExpenseModal(false);
      setExpenseForm({ date: '', category: '', description: '', amount: '', status: '' });
      // Refetch expenses to update the list
      await fetchExpenses();
    } catch (err) {
      setExpensesError((err as Error).message || 'Failed to add expense.');
    } finally {
      setExpensesLoading(false);
    }
  };
  const getServicePrice = () => {
    const service = services.find((s) => s.id.toString() === invoiceForm.service);
    return service ? service.base_price : 0;
  };
  const getPartPrice = () => {
    const part = parts.find((p) => p.id.toString() === invoiceForm.part);
    return part ? part.price : 0;
  };
  const getSubtotal = () => {
    const service = getServicePrice();
    const part = getPartPrice();
    const misc = parseFloat(invoiceForm.misc) || 0;
    return service + part + misc;
  };
  const getTaxAmount = () => {
    const subtotal = getSubtotal();
    const taxRate = invoiceForm.tax || 0;
    return subtotal * (taxRate / 100);
  };
  const getTotal = () => {
    return (getSubtotal() + getTaxAmount()).toFixed(2);
  };
  const handleInvoiceSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowInvoiceModal(false);
    setInvoiceForm({ date: '', customer: '', service: '', part: '', misc: '', miscDesc: '', tax: 8.25 });
  };

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
                    <div className="text-2xl font-semibold text-gray-900">${revenueData?.totalRevenue}</div>
                    <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                      <TrendingUp className="self-center flex-shrink-0 h-5 w-5 text-green-500" />
                      <span className="sr-only">Increased by</span>
                      {revenueData?.revenueTrend}
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
                  <dd className="text-2xl font-semibold text-gray-900">${revenueData?.monthlyRevenue}</dd>
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
                  <dd className="text-2xl font-semibold text-gray-900">${revenueData?.serviceRevenue}</dd>
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
                  <dd className="text-2xl font-semibold text-gray-900">${revenueData?.otherRevenue}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Parts Revenue</dt>
                  <dd className="text-2xl font-semibold text-gray-900">${partsRevenue}</dd>
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
            {revenueData?.recentTransactions.map((transaction: { id: string; description: string; type: string; amount: number; status: string; date: string }) => (
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
        <h2 className="text-lg font-medium text-black">Expenses</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setShowExpenseModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </button>
      </div>
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowExpenseModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-black">Add Expense</h3>
            <form onSubmit={handleExpenseSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Date</label>
                <input type="date" name="date" value={expenseForm.date} onChange={handleExpenseChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Category</label>
                <select name="category" value={expenseForm.category} onChange={handleExpenseChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option value="">Select category</option>
                  {EXPENSE_CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Description</label>
                <input type="text" name="description" value={expenseForm.description} onChange={handleExpenseChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Amount</label>
                <input type="number" name="amount" value={expenseForm.amount} onChange={handleExpenseChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Status</label>
                <select name="status" value={expenseForm.status} onChange={handleExpenseChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option value="">Select status</option>
                  {EXPENSE_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="flex justify-end">
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Add Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <input type="text" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-black border rounded-md text-black" placeholder="Search expenses..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {expenses.map((expense) => (
            <li key={expense.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Receipt className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-black">{expense.description}</h3>
                      <p className="text-sm text-black">{expense.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-black">${expense.amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      expense.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-black">
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
        <h2 className="text-lg font-medium text-black">Invoices</h2>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={() => setShowInvoiceModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </button>
      </div>
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-600" onClick={() => setShowInvoiceModal(false)}>&times;</button>
            <h3 className="text-xl font-bold mb-4 text-black">Create Invoice</h3>
            <form onSubmit={handleInvoiceSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black">Date</label>
                <input type="date" name="date" value={invoiceForm.date} onChange={handleInvoiceChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Customer</label>
                <select name="customer" value={invoiceForm.customer} onChange={handleInvoiceChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option value="">Select customer</option>
                  {customers.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Services</label>
                <select name="service" value={invoiceForm.service} onChange={handleInvoiceChange} required className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option value="">Select service</option>
                  {services.map((s) => <option key={s.id} value={s.id}>{s.name} (+${s.base_price})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Parts</label>
                <select name="part" value={invoiceForm.part} onChange={handleInvoiceChange} className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black">
                  <option value="">Select part</option>
                  {parts.map((p) => <option key={p.id} value={p.id}>{p.name} (+${p.price})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Miscellaneous Charges</label>
                <input type="number" name="misc" value={invoiceForm.misc} onChange={handleInvoiceChange} className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" placeholder="Amount" />
                <input type="text" name="miscDesc" value={invoiceForm.miscDesc} onChange={handleInvoiceChange} className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" placeholder="Description" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Tax (%)</label>
                <input type="number" name="tax" value={invoiceForm.tax} onChange={handleInvoiceChange} step="0.01" className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black" />
              </div>
              <div>
                <label className="block text-sm font-medium text-black">Total</label>
                <input type="text" value={getTotal()} readOnly className="mt-1 block w-full rounded-md border-black shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black bg-gray-100" />
              </div>
              <div className="flex justify-end">
                <button type="submit" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create Invoice</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex space-x-4">
        <div className="relative flex-1">
          <input type="text" className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-3 sm:text-sm border-black border rounded-md text-black" placeholder="Search invoices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
        </div>
        <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-black bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </button>
      </div>
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {invoices.map((invoice) => (
            <li key={invoice.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-black">{invoice.number || invoice.id}</h3>
                      <p className="text-sm text-black">{customers.find(c => c.id === invoice.client_id)?.name || 'Unknown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-black">${invoice.total_amount}</span>
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      invoice.status === 'Paid' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>
                <div className="mt-2 text-sm text-black">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : ''}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Comment out renderPayments and its usage
  // const renderPayments = () => ( ... )

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
          {/* {activeTab === 'payments' && renderPayments()} */}
        </div>
      </div>
    </div>
  );
} 