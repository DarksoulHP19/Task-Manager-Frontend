import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaTasks, FaClipboardList } from 'react-icons/fa';
import { API_BASE_URL, getToken } from '../../config/api';

const CompleteTask = () => {
  const queryClient = useQueryClient();
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch tasks using React Query
  const { data: tasks, isLoading, error } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/getTask`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      return response.data.data;
    }
  });

  // Mutation for completing tasks
  const completeTaskMutation = useMutation({
    mutationFn: async ({ taskArrid, tasksids }) => {
      const response = await axios.post(`${API_BASE_URL}/complteTask`, 
        { taskArrid, tasksids },
        {
          headers: {
            'Authorization': `Bearer ${getToken()}`
          }
        }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  });

  const handleTaskToggle = (taskArrid, taskId) => {
    completeTaskMutation.mutate({
      taskArrid,
      tasksids: [taskId]
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500">Error loading tasks: {error.message}</div>
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Your Tasks</h2>
            <p className="mt-1 text-sm text-gray-600">View and complete your assigned tasks</p>
          </div>
          <FaClipboardList className="h-6 w-6 text-gray-400" />
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex items-center"
              role="alert"
            >
              <FaCheckCircle className="mr-2" />
              <span>Task marked as completed!</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-4">
          {tasks && tasks.length > 0 ? (
            tasks.map((taskGroup) => (
              <div key={taskGroup._id} className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-3">
                  Group: {taskGroup.groupId}
                  {taskGroup.groupMentor && (
                    <span className="text-sm text-gray-600 ml-2">
                      (Mentor: {taskGroup.groupMentor.fullName})
                    </span>
                  )}
                </h3>
                {taskGroup.tasks.map((task) => (
                  <motion.div
                    key={task._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 mb-2"
                  >
                    <input
                      type="checkbox"
                      checked={task.is_completed}
                      onChange={() => handleTaskToggle(taskGroup._id, task._id)}
                      className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-4"
                    />
                    <div className="flex-1">
                      <span className={`text-gray-700 ${task.is_completed ? 'line-through' : ''}`}>
                        {task.description}
                      </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      task.is_completed ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {task.is_completed ? 'Completed' : 'Pending'}
                    </span>
                  </motion.div>
                ))}
              </div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <FaTasks className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks available</h3>
              <p className="mt-1 text-sm text-gray-500">
                There are no tasks assigned to you at the moment.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default CompleteTask;