import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaLock, FaSignInAlt, FaUserPlus, FaKey } from 'react-icons/fa';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  
  useEffect(() => {
    if (token && user) {
      const userRole = user.userRole;
      if (userRole === "Coordinator") {
        navigate("/c_app");
      } else if (userRole === "Mentor") {
        navigate("/m_app");
      } else if (userRole === "Intern") {
        navigate("/i_app");
      } else if (userRole === "User") {
        navigate("/u_app");
      } else {
        navigate("/login");
      }
    }
  }, [token, user, navigate]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      if (response.success) {
        const { token, user } = response;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        if (user.userRole === "Coordinator") {
          navigate("/c_app");
        } else if (user.userRole === "Mentor") {
          navigate("/m_app");
        } else if (user.userRole === "Intern") {
          navigate("/i_app");
        } else if (user.userRole === "User") {
          navigate("/u_app");
        } else {
          navigate("/login");
        }
      } else {
        setError(response.message || "Login failed. Please check your credentials.");
      }
    } catch(err) {
      setError("Login failed. Please check your credentials.");
      console.error("Login Failure", err);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-center items-center min-h-screen bg-gray-100"
    >
      <motion.div 
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-bold text-center text-gray-800"
        >
          Login
        </motion.h2>
        
        <AnimatePresence>
          {error && (
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-red-500 text-sm text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                className="w-full pl-10 px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-blue-300 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 flex items-center justify-center gap-2"
          >
            <FaSignInAlt />
            Login
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-center text-gray-600"
        >
          <p>
            Don't have an account?{' '}
            <motion.a 
              whileHover={{ color: '#3B82F6' }}
              href="/signup" 
              className="text-blue-500 hover:underline flex items-center justify-center gap-1"
            >
              <FaUserPlus />
              Sign up
            </motion.a>
          </p>
          {/* <motion.a 
            whileHover={{ color: '#3B82F6' }}
            href="/forgot-password" 
            className="text-sm text-center text-blue-500 hover:underline flex items-center justify-center gap-1 mt-2"
          >
            <FaKey />
            Forgot Password?
          </motion.a> */}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;