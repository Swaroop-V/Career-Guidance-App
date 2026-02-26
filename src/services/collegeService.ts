import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { College } from '@/types';
import { logger } from '@/lib/logger';

const COLLECTION_NAME = 'colleges';

export const collegeService = {
  // Add a new college
  addCollege: async (college: Omit<College, 'id'>) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const docRef = await addDoc(collection(db, COLLECTION_NAME), college);
      logger.info('College added with ID: ', docRef.id);
      return { id: docRef.id, ...college };
    } catch (error) {
      logger.error('Error adding college: ', error);
      throw error;
    }
  },

  // Get all colleges
  getColleges: async () => {
    try {
      if (!db) {
        // Return mock data if db is not initialized
        return [
          { id: '1', name: 'IIT Bombay', location: 'India', region: 'Mumbai', description: 'Top engineering institute', courses: ['CSE', 'EE'], fees: 200000, ranking: 1, eligibility: 'JEE Advanced' },
          { id: '2', name: 'MIT', location: 'Abroad', region: 'USA', description: 'World class research', courses: ['All'], fees: 5000000, ranking: 1, eligibility: 'SAT/ACT' }
        ] as College[];
      }
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const colleges = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as College));
      
      if (colleges.length === 0) {
        logger.info('No colleges found, seeding database...');
        return await collegeService.seedColleges();
      }
      
      return colleges;
    } catch (error) {
      logger.error('Error getting colleges: ', error);
      return [];
    }
  },

  // Seed database with initial colleges
  seedColleges: async () => {
    const sampleColleges: Omit<College, 'id'>[] = [
      // India - Engineering
      { name: 'IIT Bombay', location: 'India', region: 'Mumbai', description: 'Premier engineering institute in India.', courses: ['Computer Science Engineering', 'Electrical Engineering', 'Mechanical Engineering'], fees: 250000, ranking: 1, eligibility: 'JEE Advanced', website: 'https://www.iitb.ac.in' },
      { name: 'IIT Delhi', location: 'India', region: 'New Delhi', description: 'Leading technical university.', courses: ['Computer Science Engineering', 'Civil Engineering'], fees: 220000, ranking: 2, eligibility: 'JEE Advanced', website: 'https://home.iitd.ac.in' },
      { name: 'NIT Trichy', location: 'India', region: 'Tiruchirappalli', description: 'Top National Institute of Technology.', courses: ['Computer Science Engineering', 'Electronics'], fees: 150000, ranking: 8, eligibility: 'JEE Main', website: 'https://www.nitt.edu' },
      { name: 'BITS Pilani', location: 'India', region: 'Pilani', description: 'Prestigious private institute.', courses: ['Computer Science', 'Electrical'], fees: 450000, ranking: 5, eligibility: 'BITSAT', website: 'https://www.bits-pilani.ac.in' },
      
      // India - Management
      { name: 'IIM Ahmedabad', location: 'India', region: 'Ahmedabad', description: 'Best business school in India.', courses: ['MBA', 'PGP'], fees: 2300000, ranking: 1, eligibility: 'CAT', website: 'https://www.iima.ac.in' },
      { name: 'IIM Bangalore', location: 'India', region: 'Bangalore', description: 'Leading management institute.', courses: ['MBA', 'PGP'], fees: 2100000, ranking: 2, eligibility: 'CAT', website: 'https://www.iimb.ac.in' },
      { name: 'XLRI Jamshedpur', location: 'India', region: 'Jamshedpur', description: 'Top private business school.', courses: ['PGDM (BM)', 'PGDM (HRM)'], fees: 2000000, ranking: 6, eligibility: 'XAT', website: 'https://www.xlri.ac.in' },

      // Abroad - Engineering
      { name: 'Massachusetts Institute of Technology (MIT)', location: 'Abroad', region: 'USA', description: 'World leader in science and technology.', courses: ['Computer Science', 'Mechanical Engineering'], fees: 4500000, ranking: 1, eligibility: 'SAT/ACT, TOEFL', website: 'https://www.mit.edu' },
      { name: 'Stanford University', location: 'Abroad', region: 'USA', description: 'Renowned for innovation and entrepreneurship.', courses: ['Computer Science', 'Electrical Engineering'], fees: 4800000, ranking: 2, eligibility: 'SAT/ACT, TOEFL', website: 'https://www.stanford.edu' },
      { name: 'University of Cambridge', location: 'Abroad', region: 'UK', description: 'Historic and prestigious university.', courses: ['Engineering', 'Computer Science'], fees: 3500000, ranking: 3, eligibility: 'A-Levels, IELTS', website: 'https://www.cam.ac.uk' },

      // Abroad - Management
      { name: 'Harvard Business School', location: 'Abroad', region: 'USA', description: 'Top business school globally.', courses: ['MBA'], fees: 6000000, ranking: 1, eligibility: 'GMAT/GRE', website: 'https://www.hbs.edu' },
      { name: 'London Business School', location: 'Abroad', region: 'UK', description: 'Leading international business school.', courses: ['MBA', 'Masters in Finance'], fees: 5500000, ranking: 4, eligibility: 'GMAT/GRE', website: 'https://www.london.edu' },
      { name: 'INSEAD', location: 'Abroad', region: 'France/Singapore', description: 'The business school for the world.', courses: ['MBA'], fees: 5800000, ranking: 3, eligibility: 'GMAT/GRE', website: 'https://www.insead.edu' }
    ];

    const seededColleges: College[] = [];
    for (const college of sampleColleges) {
      try {
        const added = await collegeService.addCollege(college);
        seededColleges.push(added);
      } catch (e) {
        logger.error(`Failed to seed college ${college.name}`, e);
      }
    }
    return seededColleges;
  },

  // Update a college
  updateCollege: async (id: string, updates: Partial<College>) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const collegeRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(collegeRef, updates);
      logger.info('College updated: ', id);
    } catch (error) {
      logger.error('Error updating college: ', error);
      throw error;
    }
  },

  // Delete a college
  deleteCollege: async (id: string) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      logger.info('College deleted: ', id);
    } catch (error) {
      logger.error('Error deleting college: ', error);
      throw error;
    }
  }
};
