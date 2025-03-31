import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaUsers, FaEnvelope, FaUser, FaUserTie } from 'react-icons/fa';
import { API_BASE_URL, getToken } from '../../config/api';

function GroupDetail() {
  const { data: groupsData, isLoading, error } = useQuery({
    queryKey: ['mentorGroups'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getMentorGroupDetails`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        return response.data.data;
      } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch group details');
      }
    }
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
        {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">My Assigned Groups</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupsData?.map((group, index) => (
          <motion.div
            key={group._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Group Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaUsers className="text-white text-xl" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {group.groupId}
                    </h3>
                    <p className="text-sm text-blue-100">
                      {group.projectType}
                    </p>
                  </div>
                </div>
                <div className="bg-white/10 px-3 py-1 rounded-lg">
                  <span className="text-white text-sm">
                    {group.groupMembers.length} Members
                  </span>
                </div>
              </div>
            </div>

            {/* Project Info */}
            <div className="p-4 border-b border-gray-200">
              <h4 className="font-medium text-gray-800 mb-2">{group.projectTitle}</h4>
            </div>

            {/* Members List */}
            <div className="p-4">
              <div className="space-y-3">
                {/* Mentor */}
                <div className="flex items-center space-x-3 p-2 bg-blue-50 rounded-lg">
                  <FaUserTie className="text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-800">{group.groupMentor.fullName}</p>
                    <p className="text-sm text-gray-600">{group.groupMentor.email}</p>
                  </div>
                </div>

                {/* Interns */}
                {group.groupMembers.map((member) => (
                  <div key={member._id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                    <FaUser className="text-gray-500" />
                    <div>
                      <p className="font-medium text-gray-800">{member.fullName}</p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default GroupDetail;