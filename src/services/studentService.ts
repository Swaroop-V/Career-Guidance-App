import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { StudentProfile } from '@/types/student';
import { logger } from '@/lib/logger';

const COLLECTION_NAME = 'students';

export const studentService = {
  // Create or update student profile
  saveProfile: async (profile: StudentProfile) => {
    try {
      if (!db) throw new Error('Firestore not initialized');
      const studentRef = doc(db, COLLECTION_NAME, profile.uid);
      await setDoc(studentRef, profile, { merge: true });
      logger.info('Student profile saved:', profile.uid);
    } catch (error) {
      logger.error('Error saving student profile:', error);
      throw error;
    }
  },

  // Get student profile
  getProfile: async (uid: string): Promise<StudentProfile | null> => {
    try {
      if (!db) return null;
      const studentRef = doc(db, COLLECTION_NAME, uid);
      const docSnap = await getDoc(studentRef);
      if (docSnap.exists()) {
        return docSnap.data() as StudentProfile;
      }
      return null;
    } catch (error) {
      logger.error('Error getting student profile:', error);
      throw error;
    }
  }
};
