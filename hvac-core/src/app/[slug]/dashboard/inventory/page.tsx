'use client';

import { useState } from 'react';
// import { Package, BarChart2, History, Filter } from 'lucide-react';
import { 
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  Search,
  Download
} from 'lucide-react';

// Mock data for demonstration
const mockInventory = [
  {
    id: 1,
    name: 'AC Compressor',
    sku: 'AC-COMP-001',
    category: 'Major Components',
    quantity: 5,
    reorderPoint: 3,
    unitPrice: 299.99,
    location: 'Warehouse A',
    lastRestocked: '2024-02-15',
    supplier: 'HVAC Parts Co.',
    status: 'In Stock'
  },
  {
    id: 2,
    name: 'Thermostat',
    sku: 'TH-001',
    category: 'Controls',
    quantity: 12,
    reorderPoint: 5,
    unitPrice: 89.99,
    location: 'Warehouse B',
    lastRestocked: '2024-02-10',
    supplier: 'Control Systems Inc.',
    status: 'In Stock'
  },
  {
    id: 3,
    name: 'Refrigerant R-410A',
    sku: 'REF-410A-25',
    category: 'Refrigerants',
    quantity: 2,
    reorderPoint: 5,
    unitPrice: 149.99,
    location: 'Warehouse A',
    lastRestocked: '2024-02-05',
    supplier: 'Cooling Solutions',
    status: 'Low Stock'
  }
];

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
  const [isAddingItem, setIsAddingItem] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleAddItem = () => {
    setIsAddingItem(true);
    setSelectedItem(null);
  };

  const handleEditItem = (item) => {
    setIsEditing(true);
    setSelectedItem(item);
  };

  const handleDeleteItem = (itemId) => {
    // Implement delete functionality
    console.log('Delete item:', itemId);
  };

  const renderInventoryCard = (item) => (
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
          <span className="text-sm font-medium">{item.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Quantity:</span>
          <span className={`text-sm font-medium ${
            item.quantity <= item.reorderPoint ? 'text-red-600' : 'text-green-600'
          }`}>
            {item.quantity} {item.quantity <= item.reorderPoint && <AlertTriangle className="inline h-4 w-4 ml-1" />}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Location:</span>
          <span className="text-sm font-medium">{item.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-gray-500">Unit Price:</span>
          <span className="text-sm font-medium">${item.unitPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Last Restocked:</span>
          <span className="text-sm font-medium">{item.lastRestocked}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-gray-500">Supplier:</span>
          <span className="text-sm font-medium">{item.supplier}</span>
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
            defaultValue={selectedItem?.name || ''}
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
            defaultValue={selectedItem?.sku || ''}
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedItem?.category || ''}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
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
              defaultValue={selectedItem?.quantity || 0}
            />
          </div>

          <div>
            <label htmlFor="reorderPoint" className="block text-sm font-medium text-gray-700">
              Reorder Point
            </label>
            <input
              type="number"
              id="reorderPoint"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              defaultValue={selectedItem?.reorderPoint || 0}
            />
          </div>
        </div>

        <div>
          <label htmlFor="unitPrice" className="block text-sm font-medium text-gray-700">
            Unit Price
          </label>
          <input
            type="number"
            id="unitPrice"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedItem?.unitPrice || 0}
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedItem?.location || ''}
          />
        </div>

        <div>
          <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
            Supplier
          </label>
          <select
            id="supplier"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedItem?.supplier || ''}
          >
            <option value="">Select a supplier</option>
            {SUPPLIERS.map((supplier) => (
              <option key={supplier} value={supplier}>
                {supplier}
              </option>
            ))}
          </select>
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
            {mockInventory.map(renderInventoryCard)}
          </div>
        )}
      </div>
    </div>
  );
} 