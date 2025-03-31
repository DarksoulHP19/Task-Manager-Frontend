import React from 'react';
import { motion } from 'framer-motion';
import { FaClock, FaEnvelope } from 'react-icons/fa';

function U_App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mx-auto w-16 h-16 mb-6"
        >
          <FaClock className="w-full h-full text-blue-500" />
        </motion.div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Application Under Review
        </h1>
        
        <p className="text-gray-600 mb-6">
          Your application is currently being processed by our team. We will review your details and get back to you soon.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <FaEnvelope className="text-blue-500 mx-auto mb-2" />
          <p className="text-sm text-blue-700">
            We will notify you via email once your application status changes.
          </p>
        </div>

        <div className="space-y-2 text-sm text-gray-500">
          <p>Please check your email regularly for updates.</p>
          <p>If you have any questions, feel free to contact our support team.</p>
        </div>
      </motion.div>
    </div>
  );
}

export default U_App;
