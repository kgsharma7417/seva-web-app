import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  signOut
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
  const [userData, setUserData] = useState(null);
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

  // Update User Profile
  async function updateUserProfile(updates) {
    if (!currentUser) throw new Error("No user logged in");
    
    // Update in Firestore
    await setDoc(doc(db, 'users', currentUser.uid), updates, { merge: true });
    
    // Update local state
    setUserData(prev => ({ ...prev, ...updates }));
  }

  // Reset Password
  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  // Log out
  function logout() {
    setUserRole(null);
    setUserData(null);
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
            const data = userDoc.data();
            setUserRole(data.role);
            setUserData(data);
          } else {
            // Fallback for edge cases
            setUserRole('customer');
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUserRole('customer');
          setUserData(null);
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    userRole,
    signup,
    login,
    loginWithGoogle,
    logout,
    updateUserProfile,
    resetPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
