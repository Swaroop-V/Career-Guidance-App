import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { collegeService } from '@/services/collegeService';
import { applicationService } from '@/services/applicationService';
import { studentService } from '@/services/studentService';
import { College } from '@/types';
import { StudentProfile } from '@/types/student';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, BookOpen, IndianRupee, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CollegeList = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedCollegeIds, setAppliedCollegeIds] = useState<Set<string>>(new Set());
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  useEffect(() => {
    logger.info('College List mounted');
    fetchData();
  }, [currentUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [collegesData, applicationsData, profileData] = await Promise.all([
        collegeService.getColleges(),
        currentUser ? applicationService.getStudentApplications(currentUser.uid) : Promise.resolve([]),
        currentUser ? studentService.getProfile(currentUser.uid) : Promise.resolve(null)
      ]);
      
      setColleges(collegesData);
      setStudentProfile(profileData);
      
      const appliedIds = new Set(applicationsData.map(app => app.collegeId));
      setAppliedCollegeIds(appliedIds);
      
    } catch (error) {
      logger.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (college: College) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      setApplyingId(college.id!);
      await applicationService.applyToCollege({
        studentId: currentUser.uid,
        studentName: currentUser.displayName || currentUser.email || 'Unknown',
        collegeId: college.id!,
        collegeName: college.name
      });
      
      setAppliedCollegeIds(prev => new Set(prev).add(college.id!));
      alert(`Successfully applied to ${college.name}!`);
    } catch (error: any) {
      logger.error('Failed to apply', error);
      alert(error.message || 'Failed to apply to college');
    } finally {
      setApplyingId(null);
    }
  };

  const isEligible = (college: College) => {
    if (!studentProfile) return true; // If no profile, show all
    
    // Filter by Location Preference
    if (studentProfile.locationPreference && college.location !== studentProfile.locationPreference) {
      return false;
    }

    // Filter by Field of Interest (Heuristic)
    if (studentProfile.fieldOfInterest) {
      const interest = studentProfile.fieldOfInterest.toLowerCase();
      const hasMatchingCourse = college.courses?.some(course => {
        const c = course.toLowerCase();
        if (interest === 'engineering') {
          return c.includes('engineering') || c.includes('tech') || c.includes('b.e') || c.includes('b.tech');
        }
        if (interest === 'management') {
          return c.includes('management') || c.includes('mba') || c.includes('bba') || c.includes('business');
        }
        return true;
      });
      
      if (!hasMatchingCourse && college.courses && college.courses.length > 0) {
        return false;
      }
    }

    return true;
  };

  const filteredColleges = colleges.filter(college => {
    const matchesSearch = 
      (college.name && college.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (college.region && college.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (college.courses && Array.isArray(college.courses) && college.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())));
    
    const eligible = isEligible(college);
    // console.log(`College ${college.name}: matchesSearch=${matchesSearch}, eligible=${eligible}`);
    return matchesSearch && eligible;
  });

  useEffect(() => {
    if (!loading) {
      console.log('Colleges:', colleges);
      console.log('Student Profile:', studentProfile);
      console.log('Filtered Colleges:', filteredColleges);
    }
  }, [loading, colleges, studentProfile, filteredColleges]);

  // Check if any colleges exist at all before filtering
  const hasColleges = colleges.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Find Your Dream College</h1>
          <p className="text-gray-600 mt-2">Explore top institutions and find the perfect match for your career.</p>
        </div>
        
        <div className="relative w-full md:w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <Input 
            type="text" 
            placeholder="Search by name, city, or course..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!hasColleges ? (
             <div className="col-span-full text-center py-12 text-gray-500">
               No colleges available in the system.
             </div>
          ) : filteredColleges.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
              <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No colleges found</h3>
              <p className="mt-2 text-center max-w-md">
                {searchQuery 
                  ? "No colleges match your search criteria." 
                  : "Based on your profile preferences (Location/Field), no colleges are currently available for you."}
              </p>
              {studentProfile && !searchQuery && (
                <div className="mt-4 text-sm bg-yellow-50 p-4 rounded-md border border-yellow-200">
                  <p><strong>Your Preferences:</strong></p>
                  <p>Location: {studentProfile.locationPreference}</p>
                  <p>Field: {studentProfile.fieldOfInterest}</p>
                </div>
              )}
            </div>
          ) : (
            filteredColleges.map((college) => (
              <div key={college.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                <div className="h-32 bg-indigo-600 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded backdrop-blur-sm">
                      {college.location === 'India' ? '🇮🇳 India' : '🌍 Abroad'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 line-clamp-2">{college.name}</h3>
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Rank #{college.ranking}
                    </span>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {college.region}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <BookOpen className="h-4 w-4 mr-2 text-gray-400" />
                      <span className="truncate">
                        {college.courses && Array.isArray(college.courses) && college.courses.length > 0
                          ? (
                              <>
                                {college.courses.slice(0, 3).join(', ')}
                                {college.courses.length > 3 && '...'}
                              </>
                            ) 
                          : 'Courses not listed'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <IndianRupee className="h-4 w-4 mr-2 text-gray-400" />
                      {college.fees ? college.fees.toLocaleString() : 'N/A'}/year
                    </div>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100 flex gap-3">
                    {appliedCollegeIds.has(college.id!) ? (
                      <Button className="w-full bg-green-600 hover:bg-green-700 cursor-default">
                        <CheckCircle className="h-4 w-4 mr-2" /> Applied
                      </Button>
                    ) : (
                      <Button 
                        className="w-full bg-indigo-600 hover:bg-indigo-700" 
                        onClick={() => handleApply(college)}
                        disabled={applyingId === college.id}
                      >
                        {applyingId === college.id ? 'Applying...' : 'Apply Now'}
                      </Button>
                    )}
                    
                    {college.website && (
                      <a href={college.website} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-indigo-600 transition-colors border rounded-md hover:bg-gray-50">
                        <Globe className="h-5 w-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default CollegeList;
