import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { logger } from '@/lib/logger';
import { auth } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { studentService } from '@/services/studentService';

const EXAM_OPTIONS = {
  Engineering: [
    "JEE Main",
    "JEE Advanced",
    "BITSAT",
    "VITEEE",
    "SRMJEEE",
    "WBJEE",
    "MHTCET",
    "KCET",
    "COMEDK",
    "GATE",
    "SAT",
    "ACT"
  ],
  Management: [
    "CAT",
    "XAT",
    "MAT",
    "CMAT",
    "SNAP",
    "NMAT",
    "GMAT",
    "GRE"
  ]
};

const signUpSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name must only contain letters and spaces" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  fieldOfInterest: z.enum(['Engineering', 'Management']),
  locationPreference: z.enum(['India', 'Abroad']),
  qualifyingExam: z.string().min(1, { message: "Please select a qualifying exam" }),
  examScore: z.string().min(1, { message: "Exam score/rank is required" }),
  technicalSkills: z.string().min(2, { message: "Technical skills are required" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

const StudentSignUp = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema) as any,
    defaultValues: {
      fieldOfInterest: 'Engineering',
      locationPreference: 'India',
      qualifyingExam: '',
      technicalSkills: ''
    }
  });

  const selectedField = watch('fieldOfInterest');

  const onSubmit = async (data: SignUpFormValues) => {
    setIsLoading(true);
    setError(null);
    logger.info('Attempting signup for user:', data.email);

    try {
      if (auth) {
        // 1. Create Auth User
        const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(userCredential.user, {
          displayName: data.name,
        });

        // 2. Save Additional Profile Details
        await studentService.saveProfile({
          uid: userCredential.user.uid,
          fullName: data.name,
          email: data.email,
          fieldOfInterest: data.fieldOfInterest,
          locationPreference: data.locationPreference,
          qualifyingExams: `${data.qualifyingExam}: ${data.examScore}`,
          technicalSkills: data.technicalSkills,
        });

        logger.info('Signup successful');
        navigate('/dashboard');
      } else {
        // Mock signup
        logger.warn('Firebase auth not initialized, simulating signup');
        await new Promise(resolve => setTimeout(resolve, 1000));
        logger.info('Mock signup successful');
        navigate('/login');
      }
    } catch (err: any) {
      logger.error('Signup failed', err);
      setError(err.message || 'Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Basic Info */}
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="mt-1">
                <Input 
                  id="name" 
                  type="text" 
                  autoComplete="name" 
                  {...register('name')} 
                  className={errors.name ? 'border-red-500' : ''} 
                  onInput={(e) => {
                    e.currentTarget.value = e.currentTarget.value.replace(/[^a-zA-Z\s]/g, '');
                  }}
                />
                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input id="email" type="email" autoComplete="email" {...register('email')} className={errors.email ? 'border-red-500' : ''} />
                {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>}
              </div>
            </div>

            {/* Academic Preferences */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="fieldOfInterest">Field of Interest</Label>
                <select
                  id="fieldOfInterest"
                  {...register('fieldOfInterest')}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  <option value="Engineering">Engineering</option>
                  <option value="Management">Management</option>
                </select>
                {errors.fieldOfInterest && <p className="mt-2 text-sm text-red-600">{errors.fieldOfInterest.message}</p>}
              </div>

              <div>
                <Label htmlFor="locationPreference">Location Preference</Label>
                <select
                  id="locationPreference"
                  {...register('locationPreference')}
                  className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border"
                >
                  <option value="India">India</option>
                  <option value="Abroad">Abroad</option>
                </select>
                {errors.locationPreference && <p className="mt-2 text-sm text-red-600">{errors.locationPreference.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Label htmlFor="qualifyingExam">Qualifying Exam</Label>
                <select
                  id="qualifyingExam"
                  {...register('qualifyingExam')}
                  className={`mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm border ${errors.qualifyingExam ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Exam</option>
                  {EXAM_OPTIONS[selectedField as keyof typeof EXAM_OPTIONS]?.map((exam) => (
                    <option key={exam} value={exam}>{exam}</option>
                  ))}
                  <option value="Other">Other</option>
                </select>
                {errors.qualifyingExam && <p className="mt-2 text-sm text-red-600">{errors.qualifyingExam.message}</p>}
              </div>

              <div>
                <Label htmlFor="examScore">Score / Rank</Label>
                <div className="mt-1">
                  <Input 
                    id="examScore" 
                    type="text" 
                    placeholder="e.g. 98.5 or 1200" 
                    {...register('examScore')} 
                    className={errors.examScore ? 'border-red-500' : ''} 
                    onInput={(e) => {
                      // Allow only numbers and decimal point
                      e.currentTarget.value = e.currentTarget.value.replace(/[^0-9.]/g, '');
                    }}
                  />
                  {errors.examScore && <p className="mt-2 text-sm text-red-600">{errors.examScore.message}</p>}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="technicalSkills">Technical Skills / Expertise</Label>
              <div className="mt-1">
                <Input 
                  id="technicalSkills" 
                  type="text" 
                  placeholder="e.g. Python, Java, Leadership, Public Speaking" 
                  {...register('technicalSkills')} 
                  className={errors.technicalSkills ? 'border-red-500' : ''} 
                />
                {errors.technicalSkills && <p className="mt-2 text-sm text-red-600">{errors.technicalSkills.message}</p>}
              </div>
            </div>

            {/* Password */}
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

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Signup Error</h3>
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
                {isLoading ? 'Creating account...' : 'Sign up'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSignUp;
