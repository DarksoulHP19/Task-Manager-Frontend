import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaUsers } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const getToken = () => localStorage.getItem('token');

const ManageGroupTable = () => {
  const queryClient = useQueryClient();
  const [editingGroup, setEditingGroup] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  // Fetch groups
  const { data: groups, isLoading } = useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/getGroups`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data.data;
    }
  });

  // Fetch mentors
  const { data: mentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/getuser`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data.filter(user => user.userRole === 'Mentor');
    }
  });

  // Fetch interns
  const { data: interns } = useQuery({
    queryKey: ['interns'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/getuser`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data.filter(user => user.userRole === 'Intern');
    }
  });

  // Update group mutation
  const updateGroupMutation = useMutation({
    mutationFn: async (updatedGroup) => {
      const response = await axios.put(`${API_BASE_URL}/updateGroup`, updatedGroup, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      setShowModal(false);
    }
  });

  // Delete group mutation
  const deleteGroupMutation = useMutation({
    mutationFn: async (groupId) => {
      const response = await axios.delete(`${API_BASE_URL}/deleteGroup/${groupId}`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['groups']);
      setShowDeleteConfirm(false);
    }
  });

  const handleEdit = (group) => {
    setEditingGroup({ ...group });
    setShowModal(true);
  };

  const handleDelete = (group) => {
    setGroupToDelete(group);
    setShowDeleteConfirm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    updateGroupMutation.mutate(editingGroup);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Manage Groups</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Group ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Project Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Members</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {groups?.map((group) => (
              <tr key={group._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {group.groupId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.projectTitle}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.projectType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.groupMentor?.fullName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {group.groupMembers?.length} members
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(group)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit className="inline mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(group)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash className="inline mr-1" /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Group</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Project Title</label>
                  <input
                    type="text"
                    value={editingGroup?.projectTitle}
                    onChange={(e) => setEditingGroup({ ...editingGroup, projectTitle: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-150"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Project Type</label>
                  <select
                    value={editingGroup?.projectType}
                    onChange={(e) => setEditingGroup({ ...editingGroup, projectType: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-150"
                    required
                  >
                    <option value="">Select project type</option>
                    {["cloud&devops", "cybersecurity", "dataScience", "fullStack", "java", "python", "react", "webDevelopment"].map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Mentor</label>
                  <select
                    value={editingGroup?.groupMentor?._id || editingGroup?.groupMentor}
                    onChange={(e) => setEditingGroup({ ...editingGroup, groupMentor: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-150"
                    required
                  >
                    <option value="">Select a mentor</option>
                    {mentors?.map((mentor) => (
                      <option key={mentor._id} value={mentor._id}>
                        {mentor.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Group Members</label>
                  <select
                    multiple
                    value={editingGroup?.groupMembers?.map(member => member._id || member) || []}
                    onChange={(e) => {
                      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                      setEditingGroup({ ...editingGroup, groupMembers: selectedOptions });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-150"
                    required
                  >
                    {interns?.map((intern) => (
                      <option key={intern._id} value={intern._id}>
                        {intern.fullName}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-sm text-gray-500">Hold Ctrl/Cmd to select multiple members</p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-150"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-150"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete this group? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-100 transition-colors duration-150"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteGroupMutation.mutate(groupToDelete.groupId);
                    setShowDeleteConfirm(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-150"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageGroupTable; 