import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { College } from '@/types';
import { X } from 'lucide-react';

const collegeSchema = z.object({
  name: z.string().min(2, "Name is required"),
  location: z.enum(['India', 'Abroad']),
  region: z.string().min(2, "Region is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  courses: z.string().min(2, "At least one course is required (comma separated)"),
  fees: z.coerce.number().min(0, "Fees must be a positive number"),
  ranking: z.coerce.number().min(1, "Ranking must be at least 1"),
  eligibility: z.string().min(2, "Eligibility criteria is required"),
  website: z.string().url().optional().or(z.literal('')),
});

type CollegeFormValues = z.infer<typeof collegeSchema>;

interface CollegeFormProps {
  initialData?: College;
  onSubmit: (data: Omit<College, 'id'>) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const CollegeForm: React.FC<CollegeFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  console.log('CollegeForm initialData:', initialData);
  
  const { register, handleSubmit, formState: { errors } } = useForm<CollegeFormValues>({
    resolver: zodResolver(collegeSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name ?? '',
      location: initialData.location ?? 'India',
      region: initialData.region ?? '',
      description: initialData.description ?? '',
      courses: (initialData.courses && Array.isArray(initialData.courses)) ? initialData.courses.join(', ') : '',
      fees: initialData.fees ?? 0,
      ranking: initialData.ranking ?? 0,
      eligibility: initialData.eligibility ?? '',
      website: initialData.website ?? '',
    } : {
      location: 'India',
    },
  });

  const handleFormSubmit = (data: CollegeFormValues) => {
    const formattedData = {
      ...data,
      courses: data.courses.split(',').map(c => c.trim()).filter(Boolean),
    };
    onSubmit(formattedData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {initialData ? 'Edit College' : 'Add New College'}
          </h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">College Name</Label>
              <Input id="name" {...register('name')} className={errors.name ? 'border-red-500' : ''} />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location Type</Label>
              <select
                id="location"
                {...register('location')}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="India">India</option>
                <option value="Abroad">Abroad</option>
              </select>
              {errors.location && <p className="text-sm text-red-500">{errors.location.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region / City</Label>
              <Input id="region" {...register('region')} placeholder="e.g. Mumbai, London" className={errors.region ? 'border-red-500' : ''} />
              {errors.region && <p className="text-sm text-red-500">{errors.region.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ranking">Ranking</Label>
              <Input id="ranking" type="number" {...register('ranking')} className={errors.ranking ? 'border-red-500' : ''} />
              {errors.ranking && <p className="text-sm text-red-500">{errors.ranking.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fees">Annual Fees (approx)</Label>
              <Input id="fees" type="number" {...register('fees')} className={errors.fees ? 'border-red-500' : ''} />
              {errors.fees && <p className="text-sm text-red-500">{errors.fees.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website (Optional)</Label>
              <Input id="website" {...register('website')} placeholder="https://..." className={errors.website ? 'border-red-500' : ''} />
              {errors.website && <p className="text-sm text-red-500">{errors.website.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="courses">Courses Offered (comma separated)</Label>
            <Input id="courses" {...register('courses')} placeholder="Computer Science, MBA, Mechanical Engineering" className={errors.courses ? 'border-red-500' : ''} />
            {errors.courses && <p className="text-sm text-red-500">{errors.courses.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="eligibility">Eligibility Criteria</Label>
            <Input id="eligibility" {...register('eligibility')} placeholder="e.g. 75% in 12th, JEE Main Score" className={errors.eligibility ? 'border-red-500' : ''} />
            {errors.eligibility && <p className="text-sm text-red-500">{errors.eligibility.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              {...register('description')}
              className={`flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (initialData ? 'Update College' : 'Add College')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollegeForm;