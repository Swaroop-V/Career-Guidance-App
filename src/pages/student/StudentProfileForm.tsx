import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';
import { useAuth } from '@/context/AuthContext';
import { studentService } from '@/services/studentService';
import { StudentProfile } from '@/types/student';
import { Loader2 } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full Name is required"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateOfBirth: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid date"),
  gender: z.enum(['Male', 'Female', 'Other']),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip Code is required"),
  tenthMarks: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100"),
  twelfthMarks: z.coerce.number().min(0).max(100, "Percentage must be between 0 and 100"),
  stream: z.enum(['Science', 'Commerce', 'Arts']),
  preferredCourse: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const StudentProfileForm = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as any,
  });

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    } else {
        // Redirect to login if not authenticated, but allow mounting first
        // navigate('/login'); 
    }
  }, [currentUser]);

  const loadProfile = async () => {
    if (!currentUser) return;
    try {
      const profile = await studentService.getProfile(currentUser.uid);
      if (profile) {
        // Pre-fill form
        setValue('fullName', profile.fullName);
        setValue('phone', profile.phone);
        setValue('dateOfBirth', profile.dateOfBirth);
        setValue('gender', profile.gender);
        setValue('address', profile.address);
        setValue('city', profile.city);
        setValue('state', profile.state);
        setValue('zipCode', profile.zipCode);
        setValue('tenthMarks', profile.tenthMarks);
        setValue('twelfthMarks', profile.twelfthMarks);
        setValue('stream', profile.stream);
        setValue('preferredCourse', profile.preferredCourse || '');
      }
    } catch (error) {
      logger.error('Failed to load profile', error);
    } finally {
      setIsFetching(false);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const profileData: StudentProfile = {
        uid: currentUser.uid,
        email: currentUser.email || '',
        ...data
      };
      await studentService.saveProfile(profileData);
      logger.info('Profile saved successfully');
      navigate('/dashboard'); // Redirect to dashboard after saving
    } catch (error) {
      logger.error('Failed to save profile', error);
      alert('Failed to save profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white">Complete Your Profile</h2>
          <p className="text-indigo-100 text-sm">Colleges need this information to process your application.</p>
        </div>
        
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" {...register('fullName')} className={errors.fullName ? 'border-red-500' : ''} />
                {errors.fullName && <p className="text-sm text-red-500">{errors.fullName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register('phone')} className={errors.phone ? 'border-red-500' : ''} />
                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input id="dateOfBirth" type="date" {...register('dateOfBirth')} className={errors.dateOfBirth ? 'border-red-500' : ''} />
                {errors.dateOfBirth && <p className="text-sm text-red-500">{errors.dateOfBirth.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <select
                  id="gender"
                  {...register('gender')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-full space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input id="address" {...register('address')} className={errors.address ? 'border-red-500' : ''} />
                {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} className={errors.city ? 'border-red-500' : ''} />
                {errors.city && <p className="text-sm text-red-500">{errors.city.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} className={errors.state ? 'border-red-500' : ''} />
                {errors.state && <p className="text-sm text-red-500">{errors.state.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input id="zipCode" {...register('zipCode')} className={errors.zipCode ? 'border-red-500' : ''} />
                {errors.zipCode && <p className="text-sm text-red-500">{errors.zipCode.message}</p>}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Academic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tenthMarks">10th Grade Percentage</Label>
                <Input id="tenthMarks" type="number" step="0.01" {...register('tenthMarks')} className={errors.tenthMarks ? 'border-red-500' : ''} />
                {errors.tenthMarks && <p className="text-sm text-red-500">{errors.tenthMarks.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="twelfthMarks">12th Grade Percentage</Label>
                <Input id="twelfthMarks" type="number" step="0.01" {...register('twelfthMarks')} className={errors.twelfthMarks ? 'border-red-500' : ''} />
                {errors.twelfthMarks && <p className="text-sm text-red-500">{errors.twelfthMarks.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="stream">12th Stream</Label>
                <select
                  id="stream"
                  {...register('stream')}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <option value="Science">Science</option>
                  <option value="Commerce">Commerce</option>
                  <option value="Arts">Arts</option>
                </select>
                {errors.stream && <p className="text-sm text-red-500">{errors.stream.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredCourse">Preferred Course (Optional)</Label>
                <Input id="preferredCourse" {...register('preferredCourse')} placeholder="e.g. B.Tech, BBA" />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? 'Saving Profile...' : 'Save & Continue'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentProfileForm;
