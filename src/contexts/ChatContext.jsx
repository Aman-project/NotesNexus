import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { 
  createChatRoom, 
  joinChatRoom, 
  sendMessage, 
  getRoomMessages, 
  getUserChatRooms,
  terminateChatRoom
} from "@/lib/firebase";

const ChatContext = createContext({
  chatRooms: [],
  currentRoom: null,
  messages: [],
  isLoading: true,
  createRoom: () => {},
  joinRoom: () => {},
  sendChatMessage: () => {},
  terminateRoom: () => {},
  setCurrentRoom: () => {},
  setMessages: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [chatRooms, setChatRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for user's chat rooms
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (currentUser) {
      setIsLoading(true);
      unsubscribe = getUserChatRooms(currentUser.uid, (rooms) => {
        setChatRooms(rooms);
        setIsLoading(false);
      });
    } else {
      setChatRooms([]);
      setCurrentRoom(null);
      setMessages([]);
      setIsLoading(false);
    }
    
    return () => unsubscribe();
  }, [currentUser]);

  // Listen for messages in current room
  useEffect(() => {
    let unsubscribe = () => {};
    
    if (currentRoom) {
      unsubscribe = getRoomMessages(currentRoom.id, (roomMessages) => {
        setMessages(roomMessages);
      });
    } else {
      setMessages([]);
    }
    
    return () => unsubscribe();
  }, [currentRoom]);

  const createRoom = async (name, participantLimit) => {
    if (!currentUser) return { success: false, error: "You must be logged in" };
    
    const result = await createChatRoom(name, currentUser.uid, participantLimit);
    
    if (result.error) {
      return { success: false, error: result.error };
    }
    
    return { 
      success: true, 
      roomId: result.roomId, 
      token: result.token 
    };
  };

  const joinRoom = async (token) => {
    if (!currentUser) return { success: false, error: "You must be logged in" };
    
    const result = await joinChatRoom(token, currentUser.uid);
    
    if (result.error) {
      return { success: false, error: result.error };
    }
    
    return { success: true, roomId: result.roomId };
  };

  const sendChatMessage = async (message) => {
    if (!currentUser || !currentRoom) {
      return { success: false, error: "No active chat room" };
    }
    
    const result = await sendMessage(
      currentRoom.id, 
      currentUser.uid, 
      currentUser.displayName || "Anonymous", 
      message,
      currentUser.photoURL || null
    );
    
    return result;
  };

  const terminateRoom = async () => {
    if (!currentUser || !currentRoom) {
      return { success: false, error: "No active chat room" };
    }
    
    const result = await terminateChatRoom(currentRoom.id, currentUser.uid);
    
    if (result.success) {
      setCurrentRoom(null);
    }
    
    return result;
  };

  const value = {
    chatRooms,
    currentRoom,
    messages,
    isLoading,
    createRoom,
    joinRoom,
    sendChatMessage,
    terminateRoom,
    setCurrentRoom,
    setMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 