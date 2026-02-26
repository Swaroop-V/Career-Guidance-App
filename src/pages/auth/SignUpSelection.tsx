import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle, School } from 'lucide-react';

const SignUpSelection = () => {
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Join our Platform
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose how you want to sign up
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 space-y-6">
          
          <Link to="/signup/student" className="block group">
            <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 group-hover:bg-indigo-200">
                <UserCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-700">I am a Student</h3>
                <p className="text-sm text-gray-500">Find and apply to your dream colleges.</p>
              </div>
            </div>
          </Link>

          <Link to="/signup/college" className="block group">
            <div className="flex items-center p-4 border-2 border-gray-200 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer">
              <div className="flex-shrink-0 bg-indigo-100 rounded-full p-3 group-hover:bg-indigo-200">
                <School className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 group-hover:text-indigo-700">I am a College/University</h3>
                <p className="text-sm text-gray-500">Register your institution and manage applications.</p>
              </div>
            </div>
          </Link>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Sign in here
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SignUpSelection;
