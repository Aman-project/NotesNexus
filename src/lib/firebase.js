// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, updateProfile, sendPasswordResetEmail, sendEmailVerification, applyActionCode } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, onSnapshot, serverTimestamp, doc, getDoc, updateDoc, writeBatch, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Update user online status
const updateOnlineStatus = async (userId, isOnline) => {
  if (!userId) return;
  
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, {
      isOnline,
      lastSeen: serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.error("Error updating online status:", error);
  }
};

// Set up presence system
export const setupPresence = (userId) => {
  if (!userId) return () => {}; // Return empty cleanup function if no userId

  let unsubscribe = null;
  let cleanupFunctions = [];

  // Handle visibility change
  const handleVisibilityChange = async () => {
    try {
      const userRef = doc(db, "users", userId);
      const isVisible = document.visibilityState === "visible";
      
      await setDoc(userRef, {
        isOnline: isVisible,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating visibility status:", error);
    }
  };

  // Handle page load/reload
  const handlePageLoad = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating online status on page load:", error);
    }
  };

  // Handle before unload
  const handleBeforeUnload = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error updating offline status:", error);
    }
  };

  // Set initial online status
  const setInitialStatus = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    } catch (error) {
      console.error("Error setting initial status:", error);
    }
  };

  // Set up event listeners
  window.addEventListener("visibilitychange", handleVisibilityChange);
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("load", handlePageLoad);
  
  cleanupFunctions.push(() => {
    window.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("beforeunload", handleBeforeUnload);
    window.removeEventListener("load", handlePageLoad);
  });

  // Set initial status and check current visibility
  setInitialStatus();
  
  // Immediately check visibility state
  handleVisibilityChange();

  // Return cleanup function
  return () => {
    // Clean up event listeners
    cleanupFunctions.forEach(cleanup => cleanup());
    
    // Clean up connection listener if it exists
    if (unsubscribe) {
      unsubscribe();
    }
    
    // Set offline status one last time
    const userRef = doc(db, "users", userId);
    setDoc(userRef, {
      isOnline: false,
      lastSeen: serverTimestamp(),
    }, { merge: true }).catch(error => {
      console.error("Error cleaning up presence:", error);
    });
  };
};

// Register user with admin check
export const registerUser = async (email, password, name) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with the name
    if (userCredential.user) {
      await updateProfile(userCredential.user, {
        displayName: name
      });
      
      // Create user document
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        displayName: name,
        photoURL: null,
        isAdmin: false,
        isOnline: true,
        createdAt: serverTimestamp(),
        lastSeen: serverTimestamp(),
      });
      
      // Presence is now handled by AuthContext
      // No need to call setupPresence here
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message || "Registration failed" };
  }
};

// Login user with online status update
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    if (userCredential.user) {
      // Update online status
      const userRef = doc(db, "users", userCredential.user.uid);
      await setDoc(userRef, {
        isOnline: true,
        lastSeen: serverTimestamp(),
      }, { merge: true });
      
      // Presence is now handled by AuthContext
      // No need to call setupPresence here
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message || "Login failed" };
  }
};

// Logout user with offline status update
export const logoutUser = async () => {
  try {
    const userId = auth.currentUser?.uid;
    
    if (userId) {
      const userRef = doc(db, "users", userId);
      await setDoc(userRef, {
        isOnline: false,
        lastSeen: serverTimestamp(),
      }, { merge: true });
    }
    
    await signOut(auth);
    return { error: null };
  } catch (error) {
    return { error: error.message || "Logout failed" };
  }
};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message || "Google sign-in failed" };
  }
};

export const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    return { user: result.user, error: null };
  } catch (error) {
    return { user: null, error: error.message || "Facebook sign-in failed" };
  }
};

export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || "Password reset failed" };
  }
};

// Add email verification functions
export const sendVerificationEmail = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      return { success: false, error: "No user is signed in" };
    }
    await sendEmailVerification(user);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || "Failed to send verification email" };
  }
};

export const verifyEmail = async (actionCode) => {
  try {
    await applyActionCode(auth, actionCode);
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || "Failed to verify email" };
  }
};

// Chat functions
export const createChatRoom = async (name, createdBy, participantLimit) => {
  try {
    // Generate a random 6-character token
    const token = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    const roomRef = await addDoc(collection(db, "chatRooms"), {
      name,
      createdBy,
      createdAt: serverTimestamp(),
      token,
      participants: [createdBy],
      participantLimit: participantLimit || 10 // Default to 10 if not specified
    });
    
    return { roomId: roomRef.id, token, error: null };
  } catch (error) {
    return { roomId: null, token: null, error: error.message || "Failed to create chat room" };
  }
};

export const joinChatRoom = async (token, userId) => {
  try {
    const roomsQuery = query(collection(db, "chatRooms"), where("token", "==", token));
    const roomsSnapshot = await getDocs(roomsQuery);
    
    if (roomsSnapshot.empty) {
      return { success: false, error: "Invalid room token" };
    }
    
    const roomDoc = roomsSnapshot.docs[0];
    const roomData = roomDoc.data();
    
    // Check if user is already a participant
    if (roomData.participants.includes(userId)) {
      return { success: true, roomId: roomDoc.id, error: null };
    }

    // Check participant limit
    if (roomData.participants.length >= roomData.participantLimit) {
      return { success: false, error: "This room has reached its participant limit" };
    }
    
    // Add user to participants
    const roomRef = doc(db, "chatRooms", roomDoc.id);
    await updateDoc(roomRef, {
      participants: [...roomData.participants, userId]
    });
    
    return { success: true, roomId: roomDoc.id, error: null };
  } catch (error) {
    return { success: false, error: error.message || "Failed to join chat room" };
  }
};

export const sendMessage = async (roomId, userId, userName, message, userPhotoURL) => {
  try {
    await addDoc(collection(db, "chatMessages"), {
      roomId,
      userId,
      userName,
      message,
      userPhotoURL,
      timestamp: serverTimestamp()
    });
    
    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: error.message || "Failed to send message" };
  }
};

export const getRoomMessages = (roomId, callback) => {
  try {
    const messagesQuery = query(
      collection(db, "chatMessages"),
      where("roomId", "==", roomId),
      orderBy("timestamp", "asc")
    );
    
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Ensure timestamp is never undefined for sorting purposes
          timestamp: data.timestamp || { toDate: () => new Date() }
        };
      });
      callback(messages);
    }, (error) => {
      console.error("Error getting messages:", error);
      
      // If we get an index error, try to fetch messages without ordering
      if (error.code === 'failed-precondition' || error.message.includes('requires an index')) {
        console.log("Index not ready yet. Fetching messages without ordering...");
        
        // Fallback query without ordering
        const fallbackQuery = query(
          collection(db, "chatMessages"),
          where("roomId", "==", roomId)
        );
        
        // Use a one-time get instead of a listener to avoid multiple errors
        getDocs(fallbackQuery)
          .then((snapshot) => {
            const messages = snapshot.docs.map(doc => {
              const data = doc.data();
              return {
                id: doc.id,
                ...data,
                timestamp: data.timestamp || { toDate: () => new Date() }
              };
            });
            
            // Sort messages client-side
            messages.sort((a, b) => {
              const timeA = a.timestamp?.toDate?.() || new Date();
              const timeB = b.timestamp?.toDate?.() || new Date();
              return timeA - timeB;
            });
            
            callback(messages);
          })
          .catch((fallbackError) => {
            console.error("Fallback query failed:", fallbackError);
            callback([]);
          });
      } else {
        callback([]);
      }
    });
  } catch (error) {
    console.error("Error setting up messages query:", error);
    callback([]);
    return () => {}; // Return empty unsubscribe function
  }
};

export const getUserChatRooms = (userId, callback) => {
  const roomsQuery = query(
    collection(db, "chatRooms"),
    where("participants", "array-contains", userId)
  );
  
  return onSnapshot(roomsQuery, (snapshot) => {
    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(rooms);
  });
};

export const terminateChatRoom = async (roomId, userId) => {
  try {
    // Get the room to check if the user is the creator
    const roomRef = doc(db, "chatRooms", roomId);
    const roomSnap = await getDoc(roomRef);
    
    if (!roomSnap.exists()) {
      return { success: false, error: "Chat room not found" };
    }
    
    const roomData = roomSnap.data();
    
    // Only the creator can terminate the room
    if (roomData.createdBy !== userId) {
      return { success: false, error: "Only the creator can terminate this chat room" };
    }
    
    // Delete all messages in the room
    const messagesQuery = query(
      collection(db, "chatMessages"),
      where("roomId", "==", roomId)
    );
    
    const messagesSnapshot = await getDocs(messagesQuery);
    
    // Use a batch to delete all messages
    const batch = writeBatch(db);
    messagesSnapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    
    // Delete the room itself
    batch.delete(roomRef);
    
    // Commit the batch
    await batch.commit();
    
    return { success: true, error: null };
  } catch (error) {
    console.error("Error terminating chat room:", error);
    return { success: false, error: error.message || "Failed to terminate chat room" };
  }
};

export { auth, db }; 