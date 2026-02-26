import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User as UserIcon } from 'lucide-react';

const Layout = () => {
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    logger.info('Layout mounted');
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      logger.error('Failed to logout', error);
    }
  };

  const isCollegeAuthPage = location.pathname.includes('/login/college') || location.pathname.includes('/signup/college');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">Career Guidance</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {(!currentUser || userRole !== 'college') && !isCollegeAuthPage && (
                <>
                  <Link to="/career-selection" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Career Path
                  </Link>
                  <Link to="/colleges" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Colleges
                  </Link>
                </>
              )}
              {currentUser ? (
                <>
                  <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                    <span className="text-sm text-gray-600 hidden sm:block">
                      {currentUser.displayName || currentUser.email}
                    </span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={handleLogout}
                      title="Logout"
                    >
                      <LogOut className="h-5 w-5 text-gray-500 hover:text-red-600" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                  <Link to="/signup" className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Career Guidance App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;