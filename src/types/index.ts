export interface College {
  id?: string;
  name: string;
  location: 'India' | 'Abroad';
  region: string;
  description: string;
  courses: string[];
  fees: number;
  ranking: number;
  eligibility: string;
  website?: string;
}
