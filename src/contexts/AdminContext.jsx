import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, doc, getDoc } from "firebase/firestore";

const AdminContext = createContext({
  isAdmin: false,
  userStats: null,
  allUsers: [],
  isLoading: true,
});

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if current user is admin
  useEffect(() => {
    let isMounted = true;

    if (!currentUser) {
      setIsAdmin(false);
      setIsLoading(false);
      return;
    }

    const checkAdminStatus = async () => {
      try {
        const userRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists() && isMounted) {
          setIsAdmin(userSnap.data().isAdmin === true);
        }
        
        if (isMounted) {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Listen for all users and their status
  useEffect(() => {
    if (!isAdmin) return;

    let unsubscribe;
    try {
      const usersRef = collection(db, "users");
      const usersQuery = query(
        usersRef,
        where("isAdmin", "!=", true)
      );
      
      unsubscribe = onSnapshot(usersQuery, (snapshot) => {
        try {
          const users = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              isOnline: data.isOnline === true,
              lastSeen: data.lastSeen || null,
              createdAt: data.createdAt || null,
              displayName: data.displayName || "Anonymous",
              email: data.email || "",
              photoURL: data.photoURL || null,
            };
          });

          const regularUsers = users.filter(user => !user.isAdmin);
          const onlineCount = regularUsers.filter(user => user.isOnline === true).length;

          setUserStats({
            totalUsers: regularUsers.length,
            onlineCount: onlineCount,
            lastUpdated: new Date(),
          });

          const sortedUsers = regularUsers.sort((a, b) => {
            if (a.isOnline === true && b.isOnline !== true) return -1;
            if (b.isOnline === true && a.isOnline !== true) return 1;
            
            const aLastSeen = a.lastSeen?.toDate() || new Date(0);
            const bLastSeen = b.lastSeen?.toDate() || new Date(0);
            return bLastSeen - aLastSeen;
          });

          setAllUsers(sortedUsers);
        } catch (error) {
          console.error("Error processing users snapshot:", error);
        }
      }, (error) => {
        console.error("Error listening to users:", error);
      });
    } catch (error) {
      console.error("Error setting up users listener:", error);
    }

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [isAdmin]);

  const value = {
    isAdmin,
    userStats,
    allUsers,
    isLoading,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}; 