import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { logger } from '@/lib/logger';

interface AuthContextType {
  currentUser: User | null;
  userRole: 'student' | 'college' | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshUserRole: (uid?: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'student' | 'college' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      logger.warn('Firebase auth not initialized');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          if (db) {
            // Check if user is a college
            const collegeDoc = await getDoc(doc(db, 'colleges', user.uid));
            if (collegeDoc.exists()) {
              setUserRole('college');
            } else {
              // Default to student
              setUserRole('student');
            }
          } else {
            setUserRole('student');
          }
        } catch (error) {
          logger.error('Error fetching user role', error);
          setUserRole('student');
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
      logger.info('Auth state changed:', user ? 'User logged in' : 'User logged out');
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    if (auth) {
      await signOut(auth);
    } else {
      // Mock logout
      setCurrentUser(null);
      setUserRole(null);
    }
  };

  const refreshUserRole = async (uid?: string) => {
    const targetUid = uid || auth?.currentUser?.uid;
    if (!targetUid || !db) return;
    
    try {
      const collegeDoc = await getDoc(doc(db, 'colleges', targetUid));
      if (collegeDoc.exists()) {
        setUserRole('college');
        logger.info('User role set to college for', targetUid);
      } else {
        setUserRole('student');
        logger.info('User role set to student for', targetUid, '(college doc not found)');
      }
      logger.info('User role refreshed for', targetUid, ':', collegeDoc.exists() ? 'college' : 'student');
    } catch (error) {
      logger.error('Error refreshing user role', error);
    }
  };

  const value = {
    currentUser,
    userRole,
    loading,
    logout,
    refreshUserRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
