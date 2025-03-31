import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaClipboardList, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL, getToken } from '../../config/api';

function TaskAssignmentModal() {
  const [selectedGroup, setSelectedGroup] = useState('');
  const [taskCount, setTaskCount] = useState(1);
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Fetch groups for the mentor using the new endpoint
  const { data: groups, isLoading } = useQuery({
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

  const handleAddTask = () => {
    if (currentTask.trim() && tasks.length < taskCount) {
      setTasks([...tasks, { description: currentTask.trim(), is_complete: false }]);
      setCurrentTask('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const selectedGroupData = groups.find(g => g._id === selectedGroup);
      if (!selectedGroupData) {
        throw new Error('Selected group not found');
      }

      const response = await axios.post(
        `${API_BASE_URL}/assignTask`,
        {
          token: getToken(),
          groupId: selectedGroupData.groupId,
          groupMembers: selectedGroupData.groupMembers.map(member => member._id),
          tasks: tasks
        },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );

      if (response.data.success) {
        setShowSuccess(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setShowSuccess(false);
          setSelectedGroup('');
          setTaskCount(1);
          setTasks([]);
          setCurrentTask('');
        }, 3000);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to assign tasks. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
          Assign Tasks
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-1 text-sm text-gray-600"
        >
          Create and assign tasks to intern groups
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

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex items-center"
            >
              <FaCheck className="mr-2" />
              <span>Tasks successfully assigned!</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.form 
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Group
              </label>
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a group</option>
                {groups?.map((group) => (
                  <option key={group._id} value={group._id}>
                    {group.projectTitle} - {group.groupId}
                  </option>
                ))}
              </select>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Tasks
              </label>
              <input
                type="number"
                min="1"
                value={taskCount}
                onChange={(e) => setTaskCount(parseInt(e.target.value) || 1)}
                className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </motion.div>

            {tasks.length < taskCount && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task {tasks.length + 1}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    className="flex-1 p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                  <motion.button
                    type="button"
                    onClick={handleAddTask}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Add
                  </motion.button>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-sm font-medium text-gray-700 mb-2">Added Tasks:</h3>
              <ul className="space-y-2">
                {tasks.map((task, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg"
                  >
                    <span className="text-gray-700">{task.description}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>

          <motion.div 
            className="mt-6 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <motion.button
              type="submit"
              disabled={isSubmitting || !selectedGroup || tasks.length !== taskCount}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaClipboardList className="mr-2" />
                  Assign Tasks
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </motion.div>
  );
}

export default TaskAssignmentModal;