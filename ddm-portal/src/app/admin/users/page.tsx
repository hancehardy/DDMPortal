'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import Layout from '@/components/Layout';

interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive' | 'blocked';
  company?: string;
  phone?: string;
}

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Debug auth state  
  useEffect(() => {
    console.log('Auth Debug - User Management:');
    console.log('User:', user);
    console.log('Is Admin:', isAdmin);
  }, [user, isAdmin]);
  
  // Check if user is admin
  useEffect(() => {
    if (!isAdmin) {
      router.push('/'); // Redirect non-admin users
    }
  }, [isAdmin, router]);
  
  // Load users (mock data for demo)
  useEffect(() => {
    async function loadUsers() {
      try {
        setLoading(true);
        
        // In a real app, fetch from API:
        // const users = await fetch('/api/users').then(res => res.json());
        
        // Mock data for demo
        const mockUsers: User[] = [
          { 
            id: '1', 
            name: 'Admin User', 
            email: 'admin@example.com', 
            isAdmin: true, 
            createdAt: '2023-01-01T00:00:00Z',
            lastLogin: '2023-06-15T10:30:00Z',
            status: 'active',
            company: 'DDM Inc',
            phone: '(123) 456-7890'
          },
          { 
            id: '2', 
            name: 'John Smith', 
            email: 'john@example.com', 
            isAdmin: false, 
            createdAt: '2023-02-15T00:00:00Z',
            lastLogin: '2023-06-10T08:20:00Z',
            status: 'active',
            company: 'Smith Cabinets',
            phone: '(234) 567-8901'
          },
          { 
            id: '3', 
            name: 'Jane Doe', 
            email: 'jane@example.com', 
            isAdmin: false, 
            createdAt: '2023-03-20T00:00:00Z',
            lastLogin: '2023-06-05T14:45:00Z',
            status: 'active',
            phone: '(345) 678-9012'
          },
          { 
            id: '4', 
            name: 'Bob Johnson', 
            email: 'bob@example.com', 
            isAdmin: false, 
            createdAt: '2023-04-10T00:00:00Z',
            status: 'inactive',
            company: 'Johnson Interiors'
          },
          { 
            id: '5', 
            name: 'Sarah Williams', 
            email: 'sarah@example.com', 
            isAdmin: false, 
            createdAt: '2023-05-05T00:00:00Z',
            lastLogin: '2023-05-30T09:15:00Z',
            status: 'blocked',
            company: 'Williams Designs',
            phone: '(567) 890-1234'
          },
        ];
        
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        setLoading(false);
      }
    }
    
    loadUsers();
  }, []);
  
  // Filter users based on search and status
  useEffect(() => {
    let result = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        (user.company && user.company.toLowerCase().includes(term))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  }, [users, searchTerm, statusFilter]);
  
  const handleToggleAdmin = (id: string) => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, isAdmin: !u.isAdmin };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    // In real app: await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify({ isAdmin: !currentAdmin }) })
  };
  
  const handleChangeStatus = (id: string, newStatus: 'active' | 'inactive' | 'blocked') => {
    const updatedUsers = users.map(u => {
      if (u.id === id) {
        return { ...u, status: newStatus };
      }
      return u;
    });
    
    setUsers(updatedUsers);
    // In real app: await fetch(`/api/users/${id}`, { method: 'PATCH', body: JSON.stringify({ status: newStatus }) })
  };
  
  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };
  
  const handleSaveEdit = () => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(u => {
      if (u.id === editingUser.id) {
        return editingUser;
      }
      return u;
    });
    
    setUsers(updatedUsers);
    setEditingUser(null);
    // In real app: await fetch(`/api/users/${editingUser.id}`, { method: 'PUT', body: JSON.stringify(editingUser) })
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You don't have permission to access this page.</p>
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <p>Debug info:</p>
            <p>User: {user ? JSON.stringify(user) : 'Not logged in'}</p>
            <p>isAdmin: {isAdmin ? 'true' : 'false'}</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>
        
        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by name, email, or company"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button 
              onClick={() => setSearchTerm('')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow text-center">
            <p className="text-xl">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-left">Company</th>
                  <th className="py-3 px-4 text-left">Last Login</th>
                  <th className="py-3 px-4 text-left">Role</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">
                      {user.name}
                    </td>
                    <td className="py-3 px-4">
                      {user.email}
                    </td>
                    <td className="py-3 px-4">
                      {user.company || 'N/A'}
                    </td>
                    <td className="py-3 px-4">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString() 
                        : 'Never'
                      }
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                        ${user.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}
                      `}>
                        {user.isAdmin ? 'Admin' : 'Customer'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-sm font-medium
                        ${user.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                        ${user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${user.status === 'blocked' ? 'bg-red-100 text-red-800' : ''}
                      `}>
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleAdmin(user.id)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                        </button>
                        <div className="relative inline-block text-left">
                          <select
                            value=""
                            onChange={(e) => {
                              if (e.target.value) {
                                handleChangeStatus(user.id, e.target.value as any);
                                e.target.value = "";
                              }
                            }}
                            className="border rounded p-1 text-sm"
                          >
                            <option value="">Change Status</option>
                            {user.status !== 'active' && <option value="active">Activate</option>}
                            {user.status !== 'inactive' && <option value="inactive">Deactivate</option>}
                            {user.status !== 'blocked' && <option value="blocked">Block</option>}
                          </select>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        
        {/* Edit User Modal */}
        {editingUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Edit User</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    value={editingUser.phone || ''}
                    onChange={(e) => setEditingUser({...editingUser, phone: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Company</label>
                  <input
                    type="text"
                    value={editingUser.company || ''}
                    onChange={(e) => setEditingUser({...editingUser, company: e.target.value})}
                    className="w-full p-2 border rounded"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={editingUser.isAdmin}
                      onChange={(e) => setEditingUser({...editingUser, isAdmin: e.target.checked})}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Admin</span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    value={editingUser.status}
                    onChange={(e) => setEditingUser({...editingUser, status: e.target.value as any})}
                    className="w-full p-2 border rounded"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="blocked">Blocked</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
} 