import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/studentService';
import { logger } from '@/lib/logger';
import { TrendingUp, Code } from 'lucide-react';
import { db } from '@/lib/firebase';

const CareerSelection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    console.log('CareerSelection mounted');
    if (!currentUser) {
      console.warn('User not logged in on mount');
    }
  }, [currentUser]);

  const handleSelection = async (field: 'Engineering' | 'Management') => {
    console.log('Button clicked:', field);
    
    if (!currentUser) {
      alert('User not logged in. Please log in to continue.');
      navigate('/login');
      return;
    }

    if (!db) {
      alert('Database connection failed. Please try again later.');
      return;
    }
    
    try {
      setLoading(true);
      console.log('Saving profile for:', currentUser.uid);
      // Update profile with selection
      await studentService.saveProfile({
        uid: currentUser.uid,
        fullName: currentUser.displayName || '',
        email: currentUser.email || '',
        fieldOfInterest: field
      });
      
      console.log('Profile saved, navigating...');
      logger.info(`Career selected: ${field}`);
      navigate('/location-selection');
    } catch (error: any) {
      console.error('Error in handleSelection:', error);
      logger.error('Failed to save career selection', error);
      alert(`Failed to save selection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Career Path</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Select the field you are most passionate about to find the best colleges for you.
        </p>
        <button onClick={() => navigate('/dashboard')} className="mt-4 text-indigo-600 hover:text-indigo-800 underline">
          Back to Dashboard
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* Engineering Card */}
        <div
          onClick={() => handleSelection('Engineering')}
          className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-indigo-500 text-left cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <div className="p-8 relative z-10">
            <div className="bg-indigo-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-600 transition-colors duration-300">
              <Code className="w-8 h-8 text-indigo-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-700">Engineering</h2>
            <p className="text-gray-600 mb-6">
              Build the future with technology. Ideal for students interested in computer science, mechanical, electrical, and civil engineering.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>Software Development</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>Robotics & AI</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-indigo-400 rounded-full mr-2"></span>Civil Infrastructure</li>
            </ul>
          </div>
        </div>

        {/* Management Card */}
        <div
          onClick={() => handleSelection('Management')}
          className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-emerald-500 text-left cursor-pointer"
          role="button"
          tabIndex={0}
        >
          <div className="p-8 relative z-10">
            <div className="bg-emerald-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
              <TrendingUp className="w-8 h-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700">Management</h2>
            <p className="text-gray-600 mb-6">
              Lead organizations to success. Perfect for future business leaders, entrepreneurs, and marketing strategists.
            </p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>Business Administration</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>Marketing & Finance</li>
              <li className="flex items-center"><span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2"></span>Entrepreneurship</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerSelection;