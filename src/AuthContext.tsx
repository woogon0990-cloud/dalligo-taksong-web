/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, GoogleAuthProvider, signInWithPopup, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs, limit, runTransaction } from 'firebase/firestore';
import { auth, db } from './firebase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUserData: (data: Partial<{ address: string; phone: string; carNumber: string }>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Check if user is admin in Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().role === 'admin');
        } else {
          // Atomic creation of user and initial point log
          try {
            await runTransaction(db, async (transaction) => {
              const userRef = doc(db, 'users', currentUser.uid);
              const isDefaultAdmin = currentUser.email === "woogon0990@gmail.com";
              const initialPoints = 1000;
              
              const initialData = {
                uid: currentUser.uid,
                email: currentUser.email,
                displayName: currentUser.displayName || '',
                role: isDefaultAdmin ? 'admin' : 'user',
                points: initialPoints,
                createdAt: new Date().toISOString()
              };

              transaction.set(userRef, initialData);

              // Add point log
              const logRef = doc(collection(db, 'point_logs'));
              transaction.set(logRef, {
                userId: currentUser.uid,
                amount: initialPoints,
                balanceAfter: initialPoints,
                reason: '신규 가입 환영 포인트',
                createdAt: new Date().toISOString()
              });
            });
            
            setIsAdmin(currentUser.email === "woogon0990@gmail.com");
            alert('환영합니다! 가입 축하 포인트 1,000P 문구가 지급되었습니다.');
          } catch (error) {
            console.error("Failed to create user transactionally:", error);
          }
        }
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login failed:", error);
      throw error;
    }
  };

/* loginWithNaver and loginWithKakao removed */
  const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const signupWithEmail = async (email: string, pass: string, name: string) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(user, { displayName: name });
    } catch (error) {
      console.error("Email signup failed:", error);
      throw error;
    }
  };

  const checkEmailExists = async (email: string) => {
    try {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email), limit(1));
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error("Error checking email existence:", error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const updateUserData = async (data: Partial<{ address: string; phone: string; carNumber: string }>) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), data);
    } catch (error) {
      console.error("Update user data failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAdmin, 
      loading, 
      login, 
      loginWithEmail, 
      signupWithEmail, 
      checkEmailExists, 
      logout, 
      updateUserData 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
