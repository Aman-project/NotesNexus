import { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setupPresence } from "@/lib/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { logoutUser } from "@/lib/firebase";

const AuthContext = createContext({
  currentUser: null,
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cleanupPresence = null;
    let userDocUnsubscribe = null;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      // Clean up previous presence if exists
      if (cleanupPresence) {
        cleanupPresence();
        cleanupPresence = null;
      }
      
      // Clean up previous user doc listener
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
        userDocUnsubscribe = null;
      }
      
      // Set up presence for the current user
      if (user) {
        cleanupPresence = setupPresence(user.uid);
        
        // Listen for force logout flag
        const userRef = doc(db, "users", user.uid);
        userDocUnsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data();
            if (userData.forceLogout === true) {
              // Reset the flag first to prevent logout loop
              setDoc(userRef, { forceLogout: false }, { merge: true })
                .then(() => {
                  // Then logout the user
                  logoutUser();
                })
                .catch(error => {
                  console.error("Error resetting force logout flag:", error);
                });
            }
          }
        });
      }
    });

    return () => {
      unsubscribe();
      if (cleanupPresence) {
        cleanupPresence();
      }
      if (userDocUnsubscribe) {
        userDocUnsubscribe();
      }
    };
  }, []);

  const value = {
    currentUser,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}; 