import { useState, useEffect } from "react";
import { useChat } from "@/contexts/ChatContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MessageCircle, Plus, Copy, LogIn, ArrowLeft, Trash2, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Chat = () => {
  const { currentUser } = useAuth();
  const { 
    chatRooms, 
    currentRoom, 
    messages, 
    isLoading, 
    createRoom, 
    joinRoom, 
    sendChatMessage, 
    terminateRoom,
    setCurrentRoom, 
    setMessages 
  } = useChat();
  
  const [newMessage, setNewMessage] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [roomToken, setRoomToken] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isIndexBuilding, setIsIndexBuilding] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);

  // Check for index building error in console logs
  useEffect(() => {
    const originalConsoleError = console.error;
    const originalConsoleLog = console.log;
    
    console.error = (...args) => {
      if (args[0] === "Error getting messages:" && args[1]?.message?.includes("requires an index")) {
        setIsIndexBuilding(true);
      }
      originalConsoleError.apply(console, args);
    };
    
    console.log = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes("Index not ready yet")) {
        setIsIndexBuilding(true);
      }
      originalConsoleLog.apply(console, args);
    };
    
    return () => {
      console.error = originalConsoleError;
      console.log = originalConsoleLog;
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    // Clear the input immediately for better UX
    const messageText = newMessage;
    setNewMessage("");
    
    // Create a temporary message to display immediately
    const tempMessage = {
      id: `temp-${Date.now()}`,
      roomId: currentRoom.id,
      userId: currentUser.uid,
      userName: currentUser.displayName || "You",
      message: messageText,
      timestamp: { toDate: () => new Date() },
      isTemp: true
    };
    
    // Add temporary message to the UI
    setMessages(prev => [...prev, tempMessage]);
    
    // Send the actual message
    const result = await sendChatMessage(messageText);
    
    if (result.error) {
      // Remove the temporary message if there was an error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      toast.error(result.error);
      // Put the message back in the input
      setNewMessage(messageText);
    }
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) {
      toast.error("Please enter a room name");
      return;
    }
    
    const result = await createRoom(newRoomName);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Room created! Token: ${result.token}`);
      setNewRoomName("");
      setIsCreateDialogOpen(false);
      
      // Find the newly created room in chatRooms and set it as current
      const newRoom = chatRooms.find(room => room.id === result.roomId);
      if (newRoom) {
        setCurrentRoom(newRoom);
      }
    }
  };

  const handleJoinRoom = async () => {
    if (!roomToken.trim()) {
      toast.error("Please enter a room token");
      return;
    }
    
    const result = await joinRoom(roomToken);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Joined room successfully!");
      setRoomToken("");
      setIsJoinDialogOpen(false);
    }
  };

  const copyTokenToClipboard = (token) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copied to clipboard!");
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  const handleBackButton = () => {
    setCurrentRoom(null);
  };

  const handleTerminateRoom = async () => {
    const result = await terminateRoom();
    
    if (result.success) {
      toast.success("Chat room terminated successfully");
      setIsTerminateDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to terminate chat room");
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Chat Rooms</h1>
          <div className="flex space-x-2">
            {currentRoom && (
              <Button variant="outline" size="sm" onClick={handleBackButton}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Rooms
              </Button>
            )}
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Join Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Join a Chat Room</DialogTitle>
                  <DialogDescription>
                    Enter the token provided by the room creator.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="token">Room Token</Label>
                    <Input
                      id="token"
                      placeholder="Enter room token"
                      value={roomToken}
                      onChange={(e) => setRoomToken(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleJoinRoom}>Join Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Chat Room</DialogTitle>
                  <DialogDescription>
                    Give your room a name. You'll receive a token that others can use to join.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter room name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRoom}>Create Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Room List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-200px)]">
              <CardHeader>
                <CardTitle>Your Rooms</CardTitle>
                <CardDescription>
                  Select a room to start chatting
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center h-40">
                    <p>Loading rooms...</p>
                  </div>
                ) : chatRooms.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-center">
                    <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">No chat rooms yet</p>
                    <p className="text-sm text-muted-foreground">Create or join a room to start chatting</p>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-300px)]">
                    <div className="space-y-2">
                      {chatRooms.map((room) => (
                        <div
                          key={room.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            currentRoom?.id === room.id
                              ? "bg-primary/10 border border-primary/20"
                              : "hover:bg-secondary"
                          }`}
                          onClick={() => setCurrentRoom(room)}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <h3 className="font-medium">{room.name}</h3>
                              <p className="text-xs text-muted-foreground">
                                {room.participants?.length || 1} participants
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyTokenToClipboard(room.token);
                              }}
                              title="Copy room token"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Chat Area */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-200px)] flex flex-col">
              {!currentRoom ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No chat room selected</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a room from the list or create a new one to start chatting
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" onClick={() => setIsJoinDialogOpen(true)}>
                      <LogIn className="h-4 w-4 mr-2" />
                      Join Room
                    </Button>
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Room
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <CardHeader className="border-b">
                    <div className="flex justify-between items-center">
                      <div>
                        <CardTitle>{currentRoom.name}</CardTitle>
                        <CardDescription>
                          Room Token: {currentRoom.token}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 ml-2"
                            onClick={() => copyTokenToClipboard(currentRoom.token)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </CardDescription>
                      </div>
                      {currentRoom.createdBy === currentUser.uid && (
                        <AlertDialog open={isTerminateDialogOpen} onOpenChange={setIsTerminateDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Terminate Chat
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Terminate Chat Room</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to terminate this chat room? This action cannot be undone.
                                All messages will be permanently deleted.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleTerminateRoom} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Terminate
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden p-0">
                    <ScrollArea className="h-full p-4">
                      {isIndexBuilding && (
                        <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 p-3 rounded-md mb-4">
                          <p className="text-sm font-medium">Setting up chat functionality...</p>
                          <p className="text-xs mt-1">
                            Firebase is creating necessary indexes. This may take a few minutes.
                            Messages will appear automatically when ready.
                          </p>
                        </div>
                      )}
                      {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-center">
                          <p className="text-muted-foreground">No messages yet</p>
                          <p className="text-sm text-muted-foreground">Be the first to send a message!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`flex ${
                                msg.userId === currentUser.uid ? "justify-end" : "justify-start"
                              }`}
                            >
                              <div
                                className={`flex max-w-[80%] ${
                                  msg.userId === currentUser.uid ? "flex-row-reverse" : "flex-row"
                                }`}
                              >
                                <Avatar className={`h-8 w-8 ${msg.userId === currentUser.uid ? "ml-2" : "mr-2"}`}>
                                  <AvatarFallback>{getInitials(msg.userName)}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <div
                                    className={`rounded-lg px-3 py-2 ${
                                      msg.userId === currentUser.uid
                                        ? msg.isTemp 
                                          ? "bg-primary/70 text-primary-foreground" 
                                          : "bg-primary text-primary-foreground"
                                        : "bg-secondary"
                                    }`}
                                  >
                                    <p className="text-sm">{msg.message}</p>
                                  </div>
                                  <div
                                    className={`flex text-xs text-muted-foreground mt-1 ${
                                      msg.userId === currentUser.uid ? "justify-end" : "justify-start"
                                    }`}
                                  >
                                    <span>{msg.userName}</span>
                                    <span className="mx-1">•</span>
                                    <span>
                                      {msg.isTemp 
                                        ? "Sending..." 
                                        : msg.timestamp ? format(msg.timestamp.toDate(), "p") : "Just now"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                  <CardFooter className="border-t p-3">
                    <form onSubmit={handleSendMessage} className="flex w-full space-x-2">
                      <Input
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="flex-grow"
                      />
                      <Button type="submit" disabled={!newMessage.trim()}>
                        Send
                      </Button>
                    </form>
                  </CardFooter>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 