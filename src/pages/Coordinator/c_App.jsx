import React, { useState } from 'react'
import Navbar from '../../components/Navbar'
import AssignRoleTable from './AssignRoleTable'
import ManageUserTable from './ManageUserTable'
import AssignGroupForm from './AssignGroupForm'
import ManageGroupTable from './ManageGroupTable'
import { motion, AnimatePresence } from 'framer-motion'
import { FaUsers, FaUserCog, FaUserPlus, FaUserFriends } from 'react-icons/fa'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Create a client
const queryClient = new QueryClient()

function C_App() {
  const [activeComponent, setActiveComponent] = useState(null)

  const handleNavigation = (component) => {
    setActiveComponent(component)
  }

  const renderComponent = () => {
    switch (activeComponent) {
      case 'manageUsers':
        return <ManageUserTable />
      case 'assignGroup':
        return <AssignGroupForm />
      case 'manageGroups':
        return <ManageGroupTable />
      case 'assignRole':
        return <AssignRoleTable />
      default:
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <h1 className="text-2xl font-bold text-gray-800">Coordinator Dashboard</h1>
            <p className="mt-4 text-gray-600">
              Welcome to Coordinator dashboard. Use the buttons above to manage users and groups.
            </p>
          </motion.div>
        )
    }
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100">
        <Navbar onNavigate={handleNavigation} />
        
        {/* Navigation Buttons */}
        <div className="flex justify-center gap-4 py-4 pt-20">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('manageUsers')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaUserCog className="text-lg" />
            Manage Users
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('assignGroup')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaUserFriends className="text-lg" />
            Assign Groups
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('manageGroups')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaUsers className="text-lg" />
            Manage Groups
          </motion.button>
          {/* <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleNavigation('assignRole')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <FaUserPlus className="text-lg" />
            Assign Roles
          </motion.button> */}
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

export default C_App
