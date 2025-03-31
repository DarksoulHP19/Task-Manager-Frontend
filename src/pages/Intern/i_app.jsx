import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import CompleteTask from './CompleteTask';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaCheckCircle } from 'react-icons/fa';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function I_App() {
  // const [tasks, setTasks] = useState([
  //   { id: 1, text: 'Review project proposal', completed: false },
  //   { id: 2, text: 'Update documentation', completed: false },
  //   { id: 3, text: 'Schedule team meeting', completed: false },
  // ])

  // const toggleTask = (taskId) => {
  //   setTasks(tasks.map(task => 
  //     task.id === taskId ? { ...task, completed: !task.completed } : task
  //   ))
  // }
  const [activeComponent, setActiveComponent] = useState(null);

  const handleNavigation = (component) => {
    setActiveComponent(component);
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'completeTask':
        return <CompleteTask />;
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <h1 className="text-2xl font-bold text-gray-800">Intern Dashboard</h1>
            <p className="mt-4 text-gray-600">
              Welcome to Intern dashboard. Use the buttons above to view and complete your tasks.
            </p>
          </motion.div>
        );
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Navbar onNavigate={handleNavigation} />
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 py-4 pt-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('completeTask')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaTasks className="text-lg" />
            View Tasks
          </motion.button>
         
        </div>

        {/* Render Selected Component */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeComponent}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto p-4 pt-6"
          >
            {renderComponent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </QueryClientProvider>
  );
}

export default I_App;