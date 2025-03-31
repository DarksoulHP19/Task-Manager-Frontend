import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUsers, FaCheck, FaExclamationCircle } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL, getToken } from '../../config/api';

const AssignGroupForm = () => {
  const [formData, setFormData] = useState({
    groupId: '',
    projectTitle: '',
    projectType: '',
    groupMentor: '',
    groupMembers: [],
    userId: []
  });
  const [numInterns, setNumInterns] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch mentors and interns
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}/getuser`);
      return response.data;
    }
  });

  // Filter users by role
  const mentors = users?.filter(user => user.userRole === 'Mentor') || [];
  const interns = users?.filter(user => user.userRole === 'Intern') || [];

  const projectTypes = [
    "cloud&devops",
    "cybersecurity",
    "dataScience",
    "fullStack",
    "java",
    "python",
    "react",
    "webDevelopment"
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNumInternsChange = (e) => {
    const num = parseInt(e.target.value);
    setNumInterns(num);
    // Reset group members when number changes
    setFormData(prev => ({
      ...prev,
      groupMembers: [],
      userId: []
    }));
  };

  const handleInternSelect = (e, index) => {
    const selectedInternId = e.target.value;
    const newGroupMembers = [...formData.groupMembers];
    newGroupMembers[index] = selectedInternId;
    
    // Filter out empty values and duplicates
    const filteredMembers = newGroupMembers.filter((id, idx, self) => 
      id && self.indexOf(id) === idx
    );

    setFormData(prev => ({
      ...prev,
      groupMembers: filteredMembers,
      userId: [prev.groupMentor, ...filteredMembers]
    }));
  };

  const getAvailableInterns = (currentIndex) => {
    // Filter out already selected interns
    return interns.filter(intern => 
      !formData.groupMembers.includes(intern._id) || 
      formData.groupMembers[currentIndex] === intern._id
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setShowError(false);
    
    try {
      const token = getToken();
      // Log the form data to verify projectType is included
      console.log('Submitting form data:', formData);
      
      const response = await axios.post(`${API_BASE_URL}/addGroup`, {
        ...formData,
        token
      });

      if (response.data.success) {
        setShowSuccess(true);
        // Reset form
        setFormData({
          groupId: '',
          projectTitle: '',
          projectType: '',
          groupMentor: '',
          groupMembers: [],
          userId: []
        });
        setNumInterns(1);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to create group');
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 bg-gray-50 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Assign Group</h2>
        <p className="mt-1 text-sm text-gray-600">Create and assign groups for internship programs</p>
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
              <FaCheck className="mr-2" />
              <span>Group successfully assigned!</span>
            </motion.div>
          )}
          
          {showError && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center"
              role="alert"
            >
              <FaExclamationCircle className="mr-2" />
              <span>{errorMessage}</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-1">
              <label htmlFor="groupId" className="block text-sm font-medium text-gray-700 mb-1">
                Group ID
              </label>
              <input
                type="text"
                id="groupId"
                name="groupId"
                value={formData.groupId}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter group identifier"
                required
              />
            </div>
            
            <div className="col-span-1">
              <label htmlFor="projectTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title
              </label>
              <input
                type="text"
                id="projectTitle"
                name="projectTitle"
                value={formData.projectTitle}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="Enter project title"
                required
              />
            </div>
            
            <div className="col-span-1">
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-700 mb-1">
                Project Type
              </label>
              <select
                id="projectType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="col-span-1">
              <label htmlFor="groupMentor" className="block text-sm font-medium text-gray-700 mb-1">
                Mentor
              </label>
              <select
                id="groupMentor"
                name="groupMentor"
                value={formData.groupMentor}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Select a mentor</option>
                {mentors.map((mentor) => (
                  <option key={mentor._id} value={mentor._id}>
                    {mentor.fullName}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-span-1">
              <label htmlFor="numInterns" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Interns
              </label>
              <select
                id="numInterns"
                value={numInterns}
                onChange={handleNumInternsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                required
              >
                {[1, 2, 3].map((num) => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'Intern' : 'Interns'}
                  </option>
                ))}
              </select>
            </div>

            {[...Array(numInterns)].map((_, index) => (
              <div key={index} className="col-span-1">
                <label htmlFor={`intern-${index}`} className="block text-sm font-medium text-gray-700 mb-1">
                  Intern {index + 1}
                </label>
                <select
                  id={`intern-${index}`}
                  value={formData.groupMembers[index] || ''}
                  onChange={(e) => handleInternSelect(e, index)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="">Select an intern</option>
                  {getAvailableInterns(index).map((intern) => (
                    <option key={intern._id} value={intern._id}>
                      {intern.fullName}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
          
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaUsers className="mr-2" />
                  Assign Group
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignGroupForm;