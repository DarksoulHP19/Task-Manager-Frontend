import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaTasks, FaUserPlus, FaSignInAlt, FaUsers, FaChartLine } from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaTasks className="w-8 h-8" />,
      title: "Task Management",
      description: "Efficiently manage and track your tasks with our intuitive interface"
    },
    {
      icon: <FaUsers className="w-8 h-8" />,
      title: "Team Collaboration",
      description: "Work seamlessly with your team members in real-time"
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      title: "Progress Tracking",
      description: "Monitor your progress and achievements with detailed analytics"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center h-[calc(100vh-80px)] bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4"
      >
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold text-center mb-6"
        >
          Welcome to Task Manager
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-xl text-center mb-8 max-w-2xl"
        >
          Streamline your workflow, collaborate with your team, and achieve your goals efficiently
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-4"
        >
          <Link 
            to="/signup" 
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <FaUserPlus />
            Get Started
          </Link>
          <Link 
            to="/login" 
            className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <FaSignInAlt />
            Sign In
          </Link>
        </motion.div>
      </motion.div>

      {/* Features Section */}
      <div className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center text-gray-800 mb-12"
          >
            Why Choose Task Manager?
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-500 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-blue-50 py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-8">
            Join thousands of teams already using Task Manager to boost their productivity
          </p>
          <Link 
            to="/signup" 
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <FaUserPlus />
            Create Your Account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;
