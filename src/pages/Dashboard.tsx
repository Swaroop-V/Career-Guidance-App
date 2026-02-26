import React, { useEffect } from 'react';
import { logger } from '@/lib/logger';
import { Link, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { UserCircle, School, BookOpen, BrainCircuit } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import CollegeDashboard from '@/pages/college/CollegeDashboard';

const Dashboard = () => {
  const { currentUser, userRole, loading } = useAuth();

  useEffect(() => {
    logger.info('Dashboard mounted', { userRole, currentUser: currentUser?.email });
  }, [userRole, currentUser]);

  if (loading) {
    return <div className="p-8 text-center">Loading dashboard...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (userRole === 'college') {
    return <CollegeDashboard />;
  }

  // Student Dashboard
  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {currentUser?.displayName || 'Student'}!</h1>
        <p className="mt-2 text-gray-600">Manage your profile and college applications from here.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Profile Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserCircle className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Your Profile</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Manage Details</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/profile" className="font-medium text-indigo-600 hover:text-indigo-500">
                  View/Edit Profile <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Aptitude Test Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BrainCircuit className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Aptitude Test</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Take Test</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/aptitude-test" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Start Test <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Colleges Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <School className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Find Colleges</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Start Search</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/career-selection" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Select Career Path <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Applications Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">Track Status</div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-5 py-3">
              <div className="text-sm">
                <Link to="/applications" className="font-medium text-indigo-600 hover:text-indigo-500">
                  View Applications <span aria-hidden="true">&rarr;</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;