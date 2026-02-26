import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import StudentLogin from './pages/auth/StudentLogin';
import CollegeLogin from './pages/auth/CollegeLogin';
import LoginSelection from './pages/auth/LoginSelection';
import StudentSignUp from './pages/auth/StudentSignUp';
import CollegeSignUp from './pages/auth/CollegeSignUp';
import SignUpSelection from './pages/auth/SignUpSelection';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import CollegeList from './pages/student/CollegeList';
import StudentProfileForm from './pages/student/StudentProfileForm';
import StudentApplications from './pages/student/StudentApplications';
import CareerSelection from './pages/student/CareerSelection';
import LocationSelection from './pages/student/LocationSelection';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { logger } from './lib/logger';
import { AuthProvider } from './context/AuthContext';

import AptitudeTest from './pages/student/AptitudeTest';

function App() {
  React.useEffect(() => {
    logger.info('Application started');
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            
            {/* Login Routes */}
            <Route path="login" element={<LoginSelection />} />
            <Route path="login/student" element={<StudentLogin />} />
            <Route path="login/college" element={<CollegeLogin />} />
            
            {/* Signup Routes */}
            <Route path="signup" element={<SignUpSelection />} />
            <Route path="signup/student" element={<StudentSignUp />} />
            <Route path="signup/college" element={<CollegeSignUp />} />
            
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="career-selection" element={<CareerSelection />} />
            <Route path="location-selection" element={<LocationSelection />} />
            <Route path="profile" element={<StudentProfileForm />} />
            <Route path="colleges" element={<CollegeList />} />
            <Route path="applications" element={<StudentApplications />} />
            <Route path="aptitude-test" element={<AptitudeTest />} />
          </Route>

          {/* Admin Routes - Separate Layout or No Layout */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
