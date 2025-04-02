import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaChartBar } from 'react-icons/fa';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, getToken } from '../../config/api';

function ProgressReportModal() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [progressData, setProgressData] = useState(null);
  const [error, setError] = useState('');

  // Fetch groups for the mentor
  const { data: groups, isLoading: groupsLoading } = useQuery({
    queryKey: ['mentorGroups'],
    queryFn: async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/getMentorGroups`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        });
        return response.data.data;
      } catch (error) {
        setError('Failed to fetch groups. Please try again later.');
        throw error;
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/checkProgress`,
        {
          groupId: selectedGroup
        },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );

      if (response.data.success) {
        setProgressData(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch progress data');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch progress data');
    } finally {
      setIsLoading(false);
    }
  };

  if (groupsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden"
    >
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-800"
        >
          Check Progress Report
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-1 text-sm text-gray-600"
        >
          View task completion progress for intern groups
        </motion.p>
      </div>
      
      <div className="p-6">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="mb-6">
            <motion.label 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Group
            </motion.label>
            <div className="flex gap-2">
              <motion.select
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a group</option>
                {groups?.map((group) => (
                  <option key={group._id} value={group.groupId}>
                    {group.projectTitle} - {group.groupId}
                  </option>
                ))}
              </motion.select>
              <motion.button
                type="submit"
                disabled={isLoading || !selectedGroup}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <FaSearch className="mr-2" />
                    Check
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <AnimatePresence>
            {progressData && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaChartBar className="text-blue-500" />
                  <h3 className="font-medium text-gray-800">
                    Progress Report for Group: {selectedGroup}
                  </h3>
                </div>
                <div className="space-y-3">
                  {progressData && Object.entries(progressData).map(([userId, progress]) => (
                    <motion.div
                      key={userId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">
                        {progress.userName}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress.percentage}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className="h-full bg-blue-500 rounded-full"
                          />
                        </div>
                        <span className="text-sm text-gray-600">
                          {progress.completedTasks}/{progress.totalTasks}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default ProgressReportModal;