import React, { useState } from 'react';
// import Navbar from './components/Navbar';
import Navbar from '../../components/Navbar';
// import Sidebar from './Sidebar';
import TaskAssignmentModal from './TaskAssignmentModal';
import ProgressReportModal from './ProgressReportModal';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import GroupDetail from './GroupDetail';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTasks, FaChartLine, FaUsers, FaCheckCircle } from 'react-icons/fa';

const queryClient = new QueryClient()

function M_App() {
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  // const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  // const [taskData, setTaskData] = useState({});
  // const [progressData, setProgressData] = useState(null);

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  // const handleTaskSubmit = (data) => {
  //   setTaskData((prev) => ({
  //     ...prev,
  //     [data.groupId]: [...(prev[data.groupId] || []), ...data.tasks],
  //   }));
  //   setIsTaskModalOpen(false);
  // };
  const [activeComponent, setActiveComponent] = useState(null)

  const handleNavigation = (component) => {
    setActiveComponent(component)
  }

  // const handleProgressCheck = (groupId) => {
  //   const mockProgress = {
  //     groupId,
  //     progress: {
  //       'Intern1': { completed: 3, total: 5 },
  //       'Intern2': { completed: 2, total: 4 },
  //       'Intern3': { completed: 5, total: 5 },
  //     },
  //   };
  //   setProgressData(mockProgress);
  // };

const renderComponent = () => {
    switch(activeComponent) {
      case 'progressReport':
        return <ProgressReportModal/>
      case 'taskAssignment':
        return <TaskAssignmentModal/>
      case 'groupDetails':
        return <GroupDetail/>
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <h1 className="text-2xl font-bold text-gray-800">Mentor Dashboard</h1>
            <p className="mt-4 text-gray-600">
              Welcome to Mentor dashboard. Use the buttons above to manage tasks and check progress.
            </p>
          </motion.div>
        )
    }

}

//   return (
//     <div className="min-h-screen bg-[#F8F9FA]">
//       <Navbar toggleSidebar={toggleSidebar} />
//       <Sidebar
//         isOpen={isSidebarOpen}
//         onAssignTasks={() => setIsTaskModalOpen(true)}
//         onCheckProgress={() => setIsProgressModalOpen(true)}
//       />
      
//       <TaskAssignmentModal
//         isOpen={isTaskModalOpen}
//         onClose={() => setIsTaskModalOpen(false)}
//         onSubmit={handleTaskSubmit}
//       />
      
//       <ProgressReportModal
//         isOpen={isProgressModalOpen}
//         onClose={() => setIsProgressModalOpen(false)}
//         onCheck={handleProgressCheck}
//         progressData={progressData}
//       />

//       <main className="pt-16 px-6">
//         <div className="max-w-7xl mx-auto py-6">
//           <h1 className="text-2xl font-semibold text-[#1E293B] text-left"> hello</h1>
//         </div>
//       </main>
//     </div>
//   );
// }


return(
<QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Navbar onNavigate={handleNavigation} />
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 py-4 pt-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('taskAssignment')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaTasks className="text-lg" />
            Assign Tasks
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('progressReport')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaChartLine className="text-lg" />
            Check Progress
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('groupDetails')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaUsers className="text-lg" />
            Groups Details
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


)
}
export default M_App;