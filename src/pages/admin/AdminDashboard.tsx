import React, { useEffect, useState } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, Edit, Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { collegeService } from '@/services/collegeService';
import { College } from '@/types';
import CollegeForm from '@/components/admin/CollegeForm';

const AdminDashboard = () => {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState<College | undefined>(undefined);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    logger.info('Admin Dashboard mounted');
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      setLoading(true);
      const data = await collegeService.getColleges();
      setColleges(data);
    } catch (error) {
      logger.error('Failed to fetch colleges', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    setEditingCollege(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (college: College) => {
    setEditingCollege(college);
    setIsFormOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await collegeService.deleteCollege(id);
        setColleges(colleges.filter(c => c.id !== id));
        logger.info('College deleted successfully');
      } catch (error) {
        logger.error('Failed to delete college', error);
        alert('Failed to delete college');
      }
    }
  };

  const handleFormSubmit = async (data: Omit<College, 'id'>) => {
    try {
      setActionLoading(true);
      if (editingCollege?.id) {
        await collegeService.updateCollege(editingCollege.id, data);
        setColleges(colleges.map(c => c.id === editingCollege.id ? { ...data, id: c.id } : c));
        logger.info('College updated successfully');
      } else {
        const newCollege = await collegeService.addCollege(data);
        setColleges([...colleges, newCollege as College]);
        logger.info('College added successfully');
      }
      setIsFormOpen(false);
    } catch (error) {
      logger.error('Failed to save college', error);
      alert('Failed to save college');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredColleges = colleges.filter(college => 
    (college.name && college.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (college.region && college.region.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (college.courses && Array.isArray(college.courses) && college.courses.some(c => c.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-bold text-gray-900">Admin Control Panel</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-4">Administrator</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">Manage Colleges</h1>
            <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleAddClick}>
              <Plus className="h-4 w-4 mr-2" />
              Add New College
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input 
                type="text" 
                placeholder="Search colleges by name, region, or course..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Colleges List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              {filteredColleges.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No colleges found. Add one to get started.
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {filteredColleges.map((college) => (
                    <li key={college.id}>
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div className="truncate">
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">{college.name}</p>
                              <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                                {college.location === 'India' ? 'in India' : 'Abroad'}
                              </p>
                            </div>
                            <div className="mt-2 flex flex-col sm:flex-row sm:gap-4">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>{college.region}</p>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <p>Rank: #{college.ranking || 'N/A'}</p>
                              </div>
                              <div className="flex items-center text-sm text-gray-500">
                                <p>Fees: ₹{college.fees ? college.fees.toLocaleString() : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0 flex gap-2">
                          <Button variant="destructive" size="sm" onClick={() => college.id && handleDeleteClick(college.id)}>
                            <Trash2 className="h-4 w-4 mr-1" /> Remove
                          </Button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {isFormOpen && (
        <CollegeForm 
          initialData={editingCollege}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
          isLoading={actionLoading}
        />
      )}
    </div>
  );
};

export default AdminDashboard;