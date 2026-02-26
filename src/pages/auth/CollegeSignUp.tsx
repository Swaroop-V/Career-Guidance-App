import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';

const collegeSignUpSchema = z.object({
  collegeName: z.string()
    .min(3, { message: "College Name must be at least 3 characters" })
    .regex(/^[a-zA-Z\s&]+$/, { message: "Name must only contain letters, spaces and &" }),
  country: z.string().min(1, "Please select a country"),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  
  // Detailed Info
  tuitionFees: z.string().min(1, "Tuition fees is required"),
  housingFees: z.string().min(1, "Housing fees is required"),
  eligibilityRequirements: z.string().min(10, "Please provide detailed eligibility requirements"),
  placementOptions: z.string().min(10, "Please describe placement opportunities"),
  housingFacilities: z.string().min(5, "Describe housing facilities"),
  scholarshipSchemes: z.string().optional(),
  campusSupport: z.string().optional(),
  rulesAndRegulations: z.string().min(10, "Please outline key rules and regulations"),
  
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type CollegeSignUpFormValues = z.infer<typeof collegeSignUpSchema>;

const CollegeSignUp = () => {
  const navigate = useNavigate();
  const { refreshUserRole } = useAuth();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<CollegeSignUpFormValues>({
    resolver: zodResolver(collegeSignUpSchema),
  });

  const onSubmit = async (data: CollegeSignUpFormValues) => {
    setIsLoading(true);
    setError(null);
    logger.info('Attempting college signup for:', data.email);

    try {
      if (auth && db) {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, {
          displayName: data.collegeName,
        });

        // 2. Save College Details to Firestore
        await setDoc(doc(db, 'colleges', userCredential.user.uid), {
          uid: userCredential.user.uid,
          name: data.collegeName,
          email: data.email,
          country: data.country,
          role: 'college', // Mark as college role
          details: {
            tuitionFees: data.tuitionFees,
            housingFees: data.housingFees,
            eligibilityRequirements: data.eligibilityRequirements,
            placementOptions: data.placementOptions,
            housingFacilities: data.housingFacilities,
            scholarshipSchemes: data.scholarshipSchemes || '',
            campusSupport: data.campusSupport || '',
            rulesAndRegulations: data.rulesAndRegulations,
          },
          createdAt: new Date().toISOString()
        });

        // 3. Refresh user role to ensure dashboard loads correctly
        await refreshUserRole(userCredential.user.uid);

        logger.info('College Signup successful');
        navigate('/dashboard'); // Or a specific college dashboard
      } else {
        // Mock signup
        logger.warn('Firebase auth not initialized, simulating college signup');
        await new Promise(resolve => setTimeout(resolve, 1000));
        navigate('/login');
      }
    } catch (err: any) {
      logger.error('College Signup failed', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Register Your Institution
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join our network of top universities and colleges.
          <br />
          Already have an account?{' '}
          <Link to="/login/college" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            
            {/* Basic Account Info */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Label htmlFor="collegeName">Institution Name</Label>
                <div className="mt-1">
                  <Input 
                    id="collegeName" 
                    type="text" 
                    {...register('collegeName')} 
                    className={errors.collegeName ? 'border-red-500' : ''} 
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s&]/g, '');
                    }}
                  />
                  {errors.collegeName && <p className="mt-2 text-sm text-red-600">{errors.collegeName.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country</Label>
                <div className="mt-1">
                  <select
                    id="country"
                    {...register('country')}
                    className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${errors.country ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Canada">Canada</option>
                    <option value="Australia">Australia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ireland">Ireland</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Singapore">Singapore</option>
                    <option value="France">France</option>
                  </select>
                  {errors.country && <p className="mt-2 text-sm text-red-600">{errors.country.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="email">Official Email Address</Label>
                <div className="mt-1">
                  <Input id="email" type="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                  {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
                </div>
              </div>
            </div>

            {/* Financials */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="tuitionFees">Tuition Fees (per year)</Label>
                <div className="mt-1">
                  <Input 
                    id="tuitionFees" 
                    type="text" 
                    placeholder="e.g. 150000" 
                    {...register('tuitionFees')} 
                    className={errors.tuitionFees ? 'border-red-500' : ''}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                  />
                  {errors.tuitionFees && <p className="mt-2 text-sm text-red-600">{errors.tuitionFees.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="housingFees">Housing/Hostel Fees (per year)</Label>
                <div className="mt-1">
                  <Input 
                    id="housingFees" 
                    type="text" 
                    placeholder="e.g. 80000" 
                    {...register('housingFees')} 
                    className={errors.housingFees ? 'border-red-500' : ''}
                    onInput={(e) => {
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9]/g, '');
                    }}
                  />
                  {errors.housingFees && <p className="mt-2 text-sm text-red-600">{errors.housingFees.message}</p>}
                </div>
              </div>
            </div>

            {/* Detailed Information */}
            <div>
              <Label htmlFor="eligibilityRequirements">Eligibility Requirements</Label>
              <div className="mt-1">
                <textarea
                  id="eligibilityRequirements"
                  rows={3}
                  {...register('eligibilityRequirements')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${errors.eligibilityRequirements ? 'border-red-500' : ''}`}
                  placeholder="e.g. Minimum 75% in 12th Grade, Valid JEE Score..."
                />
                {errors.eligibilityRequirements && <p className="mt-2 text-sm text-red-600">{errors.eligibilityRequirements.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="placementOptions">Campus Placement Options</Label>
              <div className="mt-1">
                <textarea
                  id="placementOptions"
                  rows={3}
                  {...register('placementOptions')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${errors.placementOptions ? 'border-red-500' : ''}`}
                  placeholder="Describe placement statistics, top recruiters, average package..."
                />
                {errors.placementOptions && <p className="mt-2 text-sm text-red-600">{errors.placementOptions.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="housingFacilities">Housing Facilities</Label>
              <div className="mt-1">
                <textarea
                  id="housingFacilities"
                  rows={2}
                  {...register('housingFacilities')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${errors.housingFacilities ? 'border-red-500' : ''}`}
                  placeholder="e.g. AC/Non-AC rooms, Wi-Fi, Mess, Gym..."
                />
                {errors.housingFacilities && <p className="mt-2 text-sm text-red-600">{errors.housingFacilities.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="scholarshipSchemes">Scholarship Schemes (Optional)</Label>
                <div className="mt-1">
                  <Input id="scholarshipSchemes" type="text" {...register('scholarshipSchemes')} placeholder="e.g. Merit-based, Sports quota" />
                </div>
              </div>

              <div>
                <Label htmlFor="campusSupport">Campus Support Services (Optional)</Label>
                <div className="mt-1">
                  <Input id="campusSupport" type="text" {...register('campusSupport')} placeholder="e.g. Counseling, Health Center" />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="rulesAndRegulations">Rules and Regulations</Label>
              <div className="mt-1">
                <textarea
                  id="rulesAndRegulations"
                  rows={3}
                  {...register('rulesAndRegulations')}
                  className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 ${errors.rulesAndRegulations ? 'border-red-500' : ''}`}
                  placeholder="Outline key rules regarding attendance, discipline, etc."
                />
                {errors.rulesAndRegulations && <p className="mt-2 text-sm text-red-600">{errors.rulesAndRegulations.message}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1">
                  <Input id="password" type="password" autoComplete="new-password" {...register('password')} className={errors.password ? 'border-red-500' : ''} />
                  {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password.message}</p>}
                </div>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="mt-1">
                  <Input id="confirmPassword" type="password" autoComplete="new-password" {...register('confirmPassword')} className={errors.confirmPassword ? 'border-red-500' : ''} />
                  {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Registration Error</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isLoading}
              >
                {isLoading ? 'Registering Institution...' : 'Register Institution'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CollegeSignUp;
