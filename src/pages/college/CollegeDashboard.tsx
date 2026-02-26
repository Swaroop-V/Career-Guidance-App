import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { applicationService, Application } from '@/services/applicationService';
import { Users, FileText, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CollegeDashboard = () => {
  const { currentUser } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (currentUser) {
        try {
          const apps = await applicationService.getCollegeApplications(currentUser.uid);
          setApplications(apps);
        } catch (error) {
          logger.error('Failed to fetch applications', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchApplications();
  }, [currentUser]);

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">College Dashboard</h1>
        <p className="mt-2 text-gray-600">Manage your institution and view incoming applications.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5 flex items-center">
            <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3">
              <FileText className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Total Applications</dt>
              <dd className="text-2xl font-semibold text-gray-900">{applications.length}</dd>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5 flex items-center">
             <div className="flex-shrink-0 bg-green-100 rounded-full p-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Accepted</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {applications.filter(a => a.status === 'accepted').length}
              </dd>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-5 flex items-center">
             <div className="flex-shrink-0 bg-red-100 rounded-full p-3">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5">
              <dt className="text-sm font-medium text-gray-500 truncate">Rejected</dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {applications.filter(a => a.status === 'rejected').length}
              </dd>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Applications</h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">No applications received yet.</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {applications.map((app) => (
                <li key={app.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{app.studentName}</p>
                    <p className="text-sm text-gray-500">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${app.status === 'applied' ? 'bg-yellow-100 text-yellow-800' : 
                        app.status === 'accepted' ? 'bg-green-100 text-green-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                    <Button variant="outline" size="sm">View Details</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollegeDashboard;
