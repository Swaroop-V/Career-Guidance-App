import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/studentService';
import { logger } from '@/lib/logger';
import { MapPin, Globe, Plane } from 'lucide-react';

const LocationSelection = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSelection = async (location: 'India' | 'Abroad') => {
    console.log('Button clicked:', location);
    if (!currentUser) {
      alert('User not logged in');
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
        locationPreference: location
      });
      
      console.log('Profile saved, navigating...');
      logger.info(`Location selected: ${location}`);
      navigate('/colleges');
    } catch (error: any) {
      console.error('Error in handleSelection:', error);
      logger.error('Failed to save location selection', error);
      alert(`Failed to save selection: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Where do you want to study?</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose your preferred study destination to explore relevant universities.
        </p>
        <button onClick={() => navigate('/career-selection')} className="mt-4 text-indigo-600 hover:text-indigo-800 underline">
          Back to Career Selection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        {/* India Card */}
        <button
          onClick={() => handleSelection('India')}
          disabled={loading}
          className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-orange-500 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-orange-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 group-hover:bg-orange-600 transition-colors duration-300 shadow-inner">
              <MapPin className="w-10 h-10 text-orange-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-orange-700">INDIA</h2>
            <p className="text-gray-600 mb-6">
              Explore top-tier institutes like IITs, NITs, and IIMs across the country.
            </p>
            <div className="mt-auto">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 text-orange-800 text-sm font-medium group-hover:bg-orange-200 transition-colors">
                Domestic Education
              </span>
            </div>
          </div>
        </button>

        {/* Abroad Card */}
        <button
          onClick={() => handleSelection('Abroad')}
          disabled={loading}
          className="group relative bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border-2 border-transparent hover:border-blue-500 text-left"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="p-8 relative z-10 flex flex-col items-center text-center">
            <div className="bg-blue-100 w-24 h-24 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300 shadow-inner">
              <Plane className="w-10 h-10 text-blue-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3 group-hover:text-blue-700">ABROAD</h2>
            <p className="text-gray-600 mb-6">
              Discover world-class universities in USA, UK, Canada, Australia, and more.
            </p>
            <div className="mt-auto">
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium group-hover:bg-blue-200 transition-colors">
                International Education
              </span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default LocationSelection;