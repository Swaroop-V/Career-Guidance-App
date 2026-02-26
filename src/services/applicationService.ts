import { db } from '@/lib/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { logger } from '@/lib/logger';

const COLLECTION_NAME = 'applications';

export interface Application {
  id?: string;
  studentId: string;
  studentName: string;
  collegeId: string;
  collegeName: string;
  status: 'applied' | 'shortlisted' | 'rejected' | 'accepted';
  appliedAt: string; // ISO string
}

export const applicationService = {
  // Apply to a college
  applyToCollege: async (application: Omit<Application, 'id' | 'status' | 'appliedAt'>) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      
      // Check if already applied
      const q = query(
        collection(db, COLLECTION_NAME), 
        where('studentId', '==', application.studentId),
        where('collegeId', '==', application.collegeId)
      );
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        throw new Error('You have already applied to this college.');
      }

      const newApplication = {
        ...application,
        status: 'applied',
        appliedAt: new Date().toISOString()
      };

      const docRef = await addDoc(collection(db, COLLECTION_NAME), newApplication);
      logger.info('Application submitted with ID: ', docRef.id);
      return { id: docRef.id, ...newApplication };
    } catch (error) {
      logger.error('Error applying to college: ', error);
      throw error;
    }
  },

  // Get student's applications
  getStudentApplications: async (studentId: string) => {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), where('studentId', '==', studentId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    } catch (error) {
      logger.error('Error getting applications: ', error);
      throw error;
    }
  },

  // Get college's applications
  getCollegeApplications: async (collegeId: string) => {
    try {
      if (!db) return [];
      const q = query(collection(db, COLLECTION_NAME), where('collegeId', '==', collegeId));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    } catch (error) {
      logger.error('Error getting college applications: ', error);
      throw error;
    }
  }
};
