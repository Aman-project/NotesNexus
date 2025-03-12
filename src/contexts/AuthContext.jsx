import { createContext, useContext, useState, useEffect } from "react";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { setupPresence } from "@/lib/firebase";

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
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
      
      // Clean up previous presence if exists
      if (cleanupPresence) {
        cleanupPresence();
        cleanupPresence = null;
      }
      
      // Set up presence for the current user
      if (user) {
        cleanupPresence = setupPresence(user.uid);
      }
    });

    return () => {
      unsubscribe();
      if (cleanupPresence) {
        cleanupPresence();
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