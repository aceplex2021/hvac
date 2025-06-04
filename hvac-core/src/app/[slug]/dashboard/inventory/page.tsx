'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
// import { Package, BarChart2, History, Filter } from 'lucide-react';
import { 
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  Download
} from 'lucide-react';

const CATEGORIES = [
  'Major Components',
  'Controls',
  'Refrigerants',
  'Tools',
  'Safety Equipment',
  'Consumables'
];

const SUPPLIERS = [
  'HVAC Parts Co.',
  'Control Systems Inc.',
  'Cooling Solutions',
  'Equipment Direct',
  'Parts Unlimited'
];

export default function InventoryPage() {
  const params = useParams();
  const slug = params.slug;
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    sku: '',
    category_name: '',
    quantity: '',
    min_quantity: '',
    location: '',
    cost: '',
    price: '',
    unit: ''
  });
  const [businessId, setBusinessId] = useState(null);
  const [categories, setCategories] = useState<{id: any, name: any}[]>([]);

  useEffect(() => {
    async function fetchInventoryAndCategories() {
      setLoading(true);
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      // Get business_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setInventory([]);
        setBusinessId(null);
        setCategories([]);
        setLoading(false);
        return;
      }
      setBusinessId(business.id);
      // Fetch inventory items for this business
      const { data: items } = await supabase
        .from('hvac_inventory_items')
        .select('*')
        .eq('business_id', business.id);
      setInventory(items || []);
      // Fetch categories for this business
      const { data: cats } = await supabase
        .from('hvac_inventory_categories')
        .select('id, name')
        .eq('business_id', business.id);
      setCategories(cats || []);
      setLoading(false);
    }
    if (slug) fetchInventoryAndCategories();
  }, [slug]);

  const handleAddItem = () => {
    setIsAddingItem(true);
    setSelectedItem(null);
    setFormState({
      name: '',
      sku: '',
      category_name: '',
      quantity: '',
      min_quantity: '',
      location: '',
      cost: '',
      price: '',
      unit: ''
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormState((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveItem = async () => {
    if (!businessId) return;
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { name, sku, category_name, quantity, min_quantity, location, cost, price, unit } = formState;
    // 1. Check if category exists (case-insensitive)
    let category = categories.find(
      (cat) => cat.name.toLowerCase() === category_name.trim().toLowerCase()
    );
    let category_id = category ? category.id : null;
    // 2. If not, insert new category and get its ID
    if (!category_id) {
      const { data: newCat, error: catError } = await supabase
        .from('hvac_inventory_categories')
        .insert([{ business_id: businessId, name: category_name.trim() }])
        .select('id')
        .single();
      if (catError) {
        alert('Failed to add category: ' + catError.message);
        return;
      }
      category_id = newCat.id;
      setCategories((prev) => [...prev, { id: newCat.id, name: category_name.trim() }]);
    }
    // 3. Insert the inventory item
    const { error } = await supabase.from('hvac_inventory_items').insert([
      {
        business_id: businessId,
        category_id,
        name,
        sku,
        quantity: quantity === '' ? null : Number(quantity),
        min_quantity: min_quantity === '' ? null : Number(min_quantity),
        location,
        cost: cost === '' ? null : Number(cost),
        price: price === '' ? null : Number(price),
        unit: unit || null
      }
    ]);
    if (!error) {
      setIsAddingItem(false);
      setIsEditing(false);
      // Refresh inventory
      const { data: items } = await supabase
        .from('hvac_inventory_items')
        .select('*')
        .eq('business_id', businessId);
      setInventory(items || []);
    } else {
      alert('Failed to add item: ' + error.message);
    }
  };

  const handleEditItem = (item: any) => {
    setIsEditing(true);
    setSelectedItem(item);
  };

  const handleDeleteItem = (itemId: any) => {
    // Implement delete functionality
    console.log('Delete item:', itemId);
  };

  const renderInventoryCard = (item: any) => (
    <div key={item.id} className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditItem(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteItem(item.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Category:</span>
          <span className="text-sm font-medium">{item.category_id || 'N/A'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Quantity:</span>
          <span className={`text-sm font-medium ${
            item.quantity <= (item.min_quantity || 0) ? 'text-red-600' : 'text-green-600'
          }`}>
            {item.quantity} {item.quantity <= (item.min_quantity || 0) && <AlertTriangle className="inline h-4 w-4 ml-1" />}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Location:</span>
          <span className="text-sm font-medium">{item.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Cost:</span>
          <span className="text-sm font-medium">${item.cost?.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Price:</span>
          <span className="text-sm font-medium">${item.price?.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Min Quantity:</span>
          <span className="text-sm font-medium">{item.min_quantity}</span>
        </div>
      </div>
    </div>
  );

  const renderAddEditForm = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Inventory Item' : 'Add New Inventory Item'}
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.name}
            onChange={handleFormChange}
          />
        </div>

        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU
          </label>
          <input
            type="text"
            id="sku"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.sku}
            onChange={handleFormChange}
          />
        </div>

        <div>
          <label htmlFor="category_name" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category_name"
            list="category-suggestions"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.category_name}
            onChange={handleFormChange}
            autoComplete="off"
          />
          <datalist id="category-suggestions">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name} />
            ))}
          </datalist>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formState.quantity}
              onChange={handleFormChange}
            />
          </div>

          <div>
            <label htmlFor="min_quantity" className="block text-sm font-medium text-gray-700">
              Min Quantity
            </label>
            <input
              type="number"
              id="min_quantity"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              value={formState.min_quantity}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.location}
            onChange={handleFormChange}
          />
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-700">
            Cost
          </label>
          <input
            type="number"
            id="cost"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.cost}
            onChange={handleFormChange}
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.price}
            onChange={handleFormChange}
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unit
          </label>
          <input
            type="text"
            id="unit"
            list="unit-suggestions"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formState.unit}
            onChange={handleFormChange}
            autoComplete="off"
            required
          />
          <datalist id="unit-suggestions">
            <option value="piece" />
            <option value="box" />
            <option value="roll" />
            <option value="canister" />
            <option value="gallon" />
            <option value="liter" />
            <option value="meter" />
            <option value="bag" />
            <option value="bottle" />
          </datalist>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsAddingItem(false);
              setIsEditing(false);
            }}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {isEditing ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
          <button
            onClick={handleAddItem}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Item
          </button>
        </div>

        <div className="mb-6 flex space-x-4">
          <div className="flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                placeholder="Search inventory..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="w-48">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>

        {isAddingItem || isEditing ? (
          renderAddEditForm()
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              <div>Loading...</div>
            ) : (
              inventory
                .filter(item =>
                  (!searchTerm || item.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (!selectedCategory || item.category_id === selectedCategory)
                )
                .map(renderInventoryCard)
            )}
          </div>
        )}
      </div>
    </div>
  );
} 