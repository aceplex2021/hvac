'use client';

import { useState } from 'react';
import { 
  Users,
  Plus,
  Edit2,
  Trash2,
  Shield,
  UserPlus,
  UserCheck,
  UserX,
  Clock,
  Mail,
  Phone
} from 'lucide-react';

// Mock data for demonstration
const mockTeamMembers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@acproservices.com',
    phone: '(555) 123-4567',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 hours ago',
    permissions: ['Full Access', 'Manage Team', 'View Reports'],
    joinDate: '2023-01-15'
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@acproservices.com',
    phone: '(555) 234-5678',
    role: 'Technician',
    status: 'Active',
    lastActive: '1 day ago',
    permissions: ['View Jobs', 'Update Status', 'View Customer Info'],
    joinDate: '2023-02-20'
  },
  {
    id: 3,
    name: 'Mike Wilson',
    email: 'mike@acproservices.com',
    phone: '(555) 345-6789',
    role: 'Dispatcher',
    status: 'Active',
    lastActive: '3 hours ago',
    permissions: ['Assign Jobs', 'View Schedule', 'Manage Appointments'],
    joinDate: '2023-03-10'
  }
];

const ROLES = [
  { id: 'admin', name: 'Admin', description: 'Full access to all features' },
  { id: 'technician', name: 'Technician', description: 'Access to job management and customer info' },
  { id: 'dispatcher', name: 'Dispatcher', description: 'Access to scheduling and appointment management' },
  { id: 'office', name: 'Office Staff', description: 'Access to customer service and basic operations' }
];

const PERMISSIONS = [
  { id: 'full_access', name: 'Full Access', description: 'Complete access to all features' },
  { id: 'manage_team', name: 'Manage Team', description: 'Add, edit, and remove team members' },
  { id: 'view_reports', name: 'View Reports', description: 'Access to business analytics and reports' },
  { id: 'manage_jobs', name: 'Manage Jobs', description: 'Create and manage service jobs' },
  { id: 'view_customers', name: 'View Customer Info', description: 'Access to customer profiles and history' },
  { id: 'manage_schedule', name: 'Manage Schedule', description: 'Create and modify appointments' },
  { id: 'process_payments', name: 'Process Payments', description: 'Handle customer payments and invoices' }
];

export default function TeamPage() {
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const handleAddMember = () => {
    setIsAddingMember(true);
    setSelectedMember(null);
  };

  const handleEditMember = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
  };

  const handleDeleteMember = (memberId) => {
    // Implement delete functionality
    console.log('Delete member:', memberId);
  };

  const renderMemberCard = (member) => (
    <div key={member.id} className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
          <p className="text-sm text-gray-500">{member.role}</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditMember(member)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Edit2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => handleDeleteMember(member.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Mail className="h-4 w-4 mr-2" />
          {member.email}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Phone className="h-4 w-4 mr-2" />
          {member.phone}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Clock className="h-4 w-4 mr-2" />
          Last active: {member.lastActive}
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
        <div className="mt-2 flex flex-wrap gap-2">
          {member.permissions.map((permission) => (
            <span
              key={permission}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              {permission}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAddEditForm = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedMember?.name || ''}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedMember?.email || ''}
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedMember?.phone || ''}
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            defaultValue={selectedMember?.role || ''}
          >
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Permissions</label>
          <div className="mt-2 space-y-2">
            {PERMISSIONS.map((permission) => (
              <div key={permission.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={permission.id}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  defaultChecked={selectedMember?.permissions?.includes(permission.name)}
                />
                <label htmlFor={permission.id} className="ml-2 block text-sm text-gray-700">
                  {permission.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => {
              setIsAddingMember(false);
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
            {isEditing ? 'Save Changes' : 'Add Member'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Team Management</h1>
          <button
            onClick={handleAddMember}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <UserPlus className="h-5 w-5 mr-2" />
            Add Team Member
          </button>
        </div>

        {isAddingMember || isEditing ? (
          renderAddEditForm()
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {mockTeamMembers.map(renderMemberCard)}
          </div>
        )}
      </div>
    </div>
  );
} 