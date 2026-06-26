import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import app from '../firebase'; // Import the initialized Firebase app

// Initialize Auth & Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'customer', 'worker', 'admin'
  const [loading, setLoading] = useState(true);

  // Sign up with Email & Password
  async function signup(email, password, name, isWorker) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Default role is customer unless isWorker is true
    const role = isWorker ? 'worker' : 'customer';
    
    // Save user role in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      name: name,
      email: email,
      role: role,
      createdAt: new Date()
    });
    
    setUserRole(role);
    return userCredential;
  }

  // Log in with Email & Password
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Google Login
  async function loginWithGoogle(isWorker = false) {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if user already exists in Firestore
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      // If new user, create their document
      const role = isWorker ? 'worker' : 'customer';
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName,
        email: user.email,
        role: role,
        photoURL: user.photoURL,
        createdAt: new Date()
      });
      setUserRole(role);
    } else {
      // If existing user, load their role
      setUserRole(userDoc.data().role);
    }
    
    return result;
  }

  // Log out
  function logout() {
    setUserRole(null);
    return signOut(auth);
  }

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        // Fetch role from Firestore when user logs in
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Fallback for edge cases
            setUserRole('customer');
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('customer');
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    signup,
    login,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
