import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Fetch users from the API
const fetchUsers = async () => {
  const response = await axios.get(`${API_BASE_URL}/getuser`);
  return response.data;
};

const ManageUserTable = () => {
  const { data: users, isLoading, isError, refetch } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  const [editingUser, setEditingUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const roles = ['Mentor', 'Intern', 'User'];

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await axios.delete(`${API_BASE_URL}/deleteUser/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      refetch();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    }
  };

  // Handle opening the edit user modal
  const handleEdit = (user) => {
    setEditingUser({ ...user });
    setShowModal(true);
  };

  // Handle input changes in the form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingUser({ ...editingUser, [name]: value });
  };

  // Handle form submission for updating a user
  const handleSubmit = async () => {
    const token = getToken();
    try {
      await axios.put(`${API_BASE_URL}/manageUsers/${editingUser._id}`, {editingUser, token});
      setShowModal(false);
      refetch();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  // Filter out coordinators from the users list
  const filteredUsers = users?.filter(user => user.userRole !== 'Coordinator') || [];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Manage Users</h2>
      </div>

      {/* User Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sr. No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user, index) => (
              <tr key={user._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{index + 1}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.userRole === 'Intern' 
                      ? 'bg-green-100 text-green-800'
                      : user.userRole === 'Mentor'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.userRole}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-900 mr-4">
                    <FaEdit className="inline mr-1" /> Update
                  </button>
                  <button onClick={() => handleDelete(user._id)} className="text-red-600 hover:text-red-900">
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Update User</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingUser?.fullName || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingUser?.email || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="userRole"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  value={editingUser?.userRole || ''}
                  onChange={handleInputChange}
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-3">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-150">Cancel</button>
                <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150">
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageUserTable;
