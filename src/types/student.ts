export interface StudentProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  tenthMarks?: number;
  twelfthMarks?: number;
  stream?: 'Science' | 'Commerce' | 'Arts';
  preferredCourse?: string;
  
  // New fields for college application requirements
  fieldOfInterest?: 'Engineering' | 'Management';
  locationPreference?: 'India' | 'Abroad';
  qualifyingExams?: string; // e.g., "JEE Main: 95%, SAT: 1400"
  technicalSkills?: string; // e.g., "Java, Python, Leadership"
}
