'use client';

import { useState, useEffect } from 'react';
import { Edit2, Trash2, Mail, Phone, Clock, UserPlus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

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
  const params = useParams();
  const slug = params.slug;
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formPermissions, setFormPermissions] = useState([]);
  const [formHourlyRate, setFormHourlyRate] = useState('');

  useEffect(() => {
    async function fetchTeam() {
      setLoading(true);
      setError(null);
      // Get business and owner_id from slug
      const { data: business, error: bizError } = await supabase
        .from('hvac_businesses')
        .select('id, owner_id, contact_email, contact_phone')
        .eq('slug', slug)
        .single();
      if (bizError || !business) {
        setError('Business not found.');
        setLoading(false);
        return;
      }
      // Fetch team members
      let { data: techs, error: techsError } = await supabase
        .from('hvac_technicians')
        .select('*')
        .eq('business_id', business.id);
      if (techsError) {
        setError('Failed to fetch team members.');
        setTeamMembers([]);
        setLoading(false);
        return;
      }
      // Check if owner is in team (by user_id and business_id)
      const ownerTech = techs.find(t => t.user_id === business.owner_id && t.business_id === business.id);
      if (!ownerTech) {
        const ownerEmail = business.contact_email || 'owner@unknown.com';
        const ownerPhone = business.contact_phone || '';
        await supabase
          .from('hvac_technicians')
          .insert([{
            business_id: business.id,
            user_id: business.owner_id,
            name: 'Owner/Admin',
            email: ownerEmail,
            phone: ownerPhone,
            hourly_rate: 0,
            is_active: true,
            permissions: [
              'Full Access',
              'Manage Team',
              'View Reports',
              'Manage Jobs',
              'View Customer Info',
              'Manage Schedule',
              'Process Payments'
            ]
          }]);
        // Re-fetch team after insert
        const { data: newTechs } = await supabase
          .from('hvac_technicians')
          .select('*')
          .eq('business_id', business.id);
        techs = newTechs || techs;
      }
      // Always show owner/admin at the top
      const sortedTechs = [
        ...techs.filter(t => t.user_id === business.owner_id),
        ...techs.filter(t => t.user_id !== business.owner_id)
      ];
      setTeamMembers(sortedTechs);
      setLoading(false);
    }
    if (slug) fetchTeam();
  }, [slug]);

  useEffect(() => {
    if (isEditing && selectedMember) {
      setFormName(selectedMember.name || '');
      setFormEmail(selectedMember.email || '');
      setFormPhone(selectedMember.phone || '');
      setFormRole(selectedMember.role || '');
      setFormPermissions(selectedMember.permissions || []);
      setFormHourlyRate(selectedMember.hourly_rate?.toString() || '');
    } else if (isAddingMember) {
      setFormName('');
      setFormEmail('');
      setFormPhone('');
      setFormRole('');
      setFormPermissions([]);
      setFormHourlyRate('');
    }
  }, [isEditing, isAddingMember, selectedMember]);

  const handleAddMember = () => {
    setIsAddingMember(true);
    setSelectedMember(null);
  };

  const handleEditMember = (member) => {
    setIsEditing(true);
    setSelectedMember(member);
  };

  const handleDeleteMember = async (memberId) => {
    setLoading(true);
    setError(null);
    const { error: delError } = await supabase
      .from('hvac_technicians')
      .delete()
      .eq('id', memberId);
    if (delError) setError('Failed to delete member.');
    // Refresh list
    const { data: business } = await supabase
      .from('hvac_businesses')
      .select('id')
      .eq('slug', slug)
      .single();
    const { data: techs } = await supabase
      .from('hvac_technicians')
      .select('*')
      .eq('business_id', business.id);
    setTeamMembers(techs || []);
    setLoading(false);
  };

  const handlePermissionChange = (permName) => {
    setFormPermissions((prev) =>
      prev.includes(permName)
        ? prev.filter((p) => p !== permName)
        : [...prev, permName]
    );
  };

  const handleFormSubmit = async () => {
    if (!formName || !formEmail || !formPhone || !formHourlyRate) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    setError(null);
    let invitedUserId = null;
    if (!isEditing) {
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(formEmail);
      if (inviteError || !inviteData?.user?.id) {
        setError('Failed to invite user: ' + (inviteError?.message || 'Unknown error'));
        setLoading(false);
        return;
      }
      invitedUserId = inviteData.user.id;
    }
    handleSaveMember({
      name: formName,
      email: formEmail,
      phone: formPhone,
      user_id: isEditing ? selectedMember.user_id : invitedUserId,
      hourly_rate: parseFloat(formHourlyRate),
      is_active: true,
      permissions: formPermissions,
    });
  };

  const handleSaveMember = async (memberData) => {
    setLoading(true);
    setError(null);
    const { data: business } = await supabase
      .from('hvac_businesses')
      .select('id')
      .eq('slug', slug)
      .single();
    if (!business) {
      setError('Business not found.');
      setLoading(false);
      return;
    }
    if (isEditing && selectedMember) {
      const { error: updError } = await supabase
        .from('hvac_technicians')
        .update(memberData)
        .eq('id', selectedMember.id);
      if (updError) setError('Failed to update member.');
    } else {
      const { error: insError } = await supabase
        .from('hvac_technicians')
        .insert([{ ...memberData, business_id: business.id }]);
      if (insError) setError('Failed to add member.');
    }
    const { data: techs } = await supabase
      .from('hvac_technicians')
      .select('*')
      .eq('business_id', business.id);
    setTeamMembers(techs || []);
    setIsAddingMember(false);
    setIsEditing(false);
    setLoading(false);
  };

  const renderMemberCard = (member) => {
    const permissions = Array.isArray(member.permissions) ? member.permissions : [];
    return (
      <div key={member.id} className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{member.name} {permissions.includes('Full Access') && <span className="ml-2 px-2 py-0.5 rounded bg-yellow-100 text-yellow-800 text-xs font-semibold">Owner/Admin</span>}</h3>
            <p className="text-sm text-gray-500">{member.role || (permissions.includes('Full Access') ? 'Admin' : '')}</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleEditMember(member)}
              className="text-blue-600 hover:text-blue-800"
              disabled={permissions.includes('Full Access')}
            >
              <Edit2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => handleDeleteMember(member.id)}
              className="text-red-600 hover:text-red-800"
              disabled={permissions.includes('Full Access')}
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
            Last active: {member.updated_at ? new Date(member.updated_at).toLocaleString() : ''}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
          <div className="mt-2 flex flex-wrap gap-2">
            {permissions.map((permission) => (
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
  };

  const renderAddEditForm = () => (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
      </h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formName}
            onChange={e => setFormName(e.target.value)}
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
            value={formEmail}
            onChange={e => setFormEmail(e.target.value)}
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
            value={formPhone}
            onChange={e => setFormPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="hourly_rate" className="block text-sm font-medium text-gray-700">
            Hourly Rate ($)
          </label>
          <input
            type="number"
            id="hourly_rate"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formHourlyRate}
            onChange={e => setFormHourlyRate(e.target.value)}
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            id="role"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            value={formRole}
            onChange={e => setFormRole(e.target.value)}
          >
            <option value="">Select a role</option>
            {ROLES.map((role) => (
              <option key={role.id} value={role.name}>
                {role.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Permissions (optional)</label>
          <div className="mt-2 space-y-2">
            {PERMISSIONS.map((permission) => (
              <div key={permission.id} className="flex items-center">
                <input
                  type="checkbox"
                  id={permission.id}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  checked={formPermissions.includes(permission.name)}
                  onChange={() => handlePermissionChange(permission.name)}
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
            onClick={handleFormSubmit}
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
            {teamMembers.map(renderMemberCard)}
          </div>
        )}
      </div>
    </div>
  );
} 