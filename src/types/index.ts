export interface CollegeDetails {
  tuitionFees: string;
  housingFees: string;
  eligibilityRequirements: string;
  placementOptions: string;
  housingFacilities: string;
  scholarshipSchemes: string;
  campusSupport: string;
  rulesAndRegulations: string;
}

export interface College {
  id?: string;
  name: string;
  location: 'India' | 'Abroad';
  country?: string;
  region: string;
  description: string;
  courses: string[];
  fees: number;
  ranking: number;
  eligibility: string;
  website?: string;
  details?: CollegeDetails;
}
