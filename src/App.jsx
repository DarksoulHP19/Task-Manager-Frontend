import { useState, useEffect } from 'react';
import './App.css';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Signup from './components/Signup';
import Home from './pages/Home';
import I_app from './pages/Intern/i_app';
import { Route, Routes, Navigate } from 'react-router-dom';
import UserProfile from './components/UserProfile';
import M_app from './pages/Mentor/m_app';
import C_app from './pages/Coordinator/c_App';
import U_app from './pages/User/u_app';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    // Simulate a small delay to ensure localStorage is read
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/user-profile" element={<UserProfile/>}/>
        
        {/* Protected Routes */}
        <Route 
          path="/u_app" 
          element={
            <ProtectedRoute allowedRoles={["User"]}>
              <U_app />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/c_app" 
          element={
            <ProtectedRoute allowedRoles={["Coordinator"]}>
              <C_app />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/m_app" 
          element={
            <ProtectedRoute allowedRoles={["Mentor"]}>
              <M_app />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/i_app" 
          element={
            <ProtectedRoute allowedRoles={["Intern"]}>
              <I_app />
            </ProtectedRoute>
          } 
        />

        {/* Root path with role-based redirect */}
        <Route 
          path="/" 
          element={
            token && user ? (
              <Navigate 
                to={
                  user.userRole === "Coordinator" ? "/c_app" :
                  user.userRole === "Mentor" ? "/m_app" :
                  user.userRole === "Intern" ? "/i_app" :
                  user.userRole === "User" ? "/u_app" : "/login"
                } 
                replace 
              />
            ) : (
              <Home />
            )
          } 
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
