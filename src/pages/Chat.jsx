import { useState, useEffect, useRef } from "react";
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
import { MessageCircle, Plus, Copy, LogIn, ArrowLeft, Trash2, AlertTriangle, Home, Send, Users, Clock, Search } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

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
  const [participantLimit, setParticipantLimit] = useState(10);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);
  const [isIndexBuilding, setIsIndexBuilding] = useState(false);
  const [isTerminateDialogOpen, setIsTerminateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const messagesEndRef = useRef(null);

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

  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      userPhotoURL: currentUser.photoURL || null,
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

    if (participantLimit < 2) {
      toast.error("Participant limit must be at least 2");
      return;
    }
    
    const result = await createRoom(newRoomName, participantLimit);
    
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Room created! Token: ${result.token}`);
      setNewRoomName("");
      setParticipantLimit(10);
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

  const handleTerminateRoom = async () => {
    const result = await terminateRoom();
    
    if (result.success) {
      toast.success("Chat room terminated successfully");
      setIsTerminateDialogOpen(false);
    } else {
      toast.error(result.error || "Failed to terminate chat room");
    }
  };

  // Filter rooms based on search query
  const filteredRooms = chatRooms.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format timestamp with relative time
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "Just now";
    
    const date = timestamp.toDate();
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return format(date, "MMM d, h:mm a");
  };

  return (
    <div className="container mx-auto py-6 px-4 md:py-10 md:px-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to="/">
              <Button variant="outline" size="sm" className="mr-4">
                <Home className="h-4 w-4 mr-2" />
                Home
              </Button>
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold">Chat Rooms</h1>
          </div>
          <div className="flex space-x-2">
            {/* Join Room - Desktop */}
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="sm" className="hidden sm:flex">
                          <LogIn className="h-4 w-4 mr-2" />
                          Join Room
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Join an existing chat room</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
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

            {/* Join Room - Mobile */}
            <Dialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon" className="sm:hidden">
                          <LogIn className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Join an existing chat room</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogTrigger>
            </Dialog>

            {/* Create Room - Desktop */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button className="hidden sm:flex">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Room
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create a new chat room</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Chat Room</DialogTitle>
                  <DialogDescription>
                    Give your room a name and set the maximum number of participants allowed to join.
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
                  <div className="grid gap-2">
                    <Label htmlFor="limit">Maximum Participants</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="limit"
                        type="number"
                        min="2"
                        max="100"
                        value={participantLimit}
                        onChange={(e) => setParticipantLimit(Math.max(2, Math.min(100, parseInt(e.target.value) || 2)))}
                      />
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        (2-100 people)
                      </span>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateRoom}>Create Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Create Room - Mobile */}
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button size="icon" className="sm:hidden">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Create a new chat room</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </DialogTrigger>
            </Dialog>
          </div>
        </div>

        <div className={cn(
          "grid gap-6",
          isMobileView && currentRoom ? "grid-cols-1" : "grid-cols-1 md:grid-cols-3"
        )}>
          {/* Room List - Hide on mobile when a room is selected */}
          {(!isMobileView || !currentRoom) && (
            <div className="md:col-span-1">
              <Card className="h-[calc(100vh-180px)]">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Your Rooms</CardTitle>
                    <Badge variant="outline" className="font-normal">
                      {chatRooms.length} {chatRooms.length === 1 ? 'room' : 'rooms'}
                    </Badge>
                  </div>
                  <div className="relative mt-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search rooms..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <div className="flex flex-col items-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <p className="text-sm text-muted-foreground">Loading rooms...</p>
                      </div>
                    </div>
                  ) : filteredRooms.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                      {searchQuery ? (
                        <>
                          <Search className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No rooms match your search</p>
                          <p className="text-sm text-muted-foreground">Try a different search term</p>
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-10 w-10 text-muted-foreground mb-2" />
                          <p className="text-muted-foreground">No chat rooms yet</p>
                          <p className="text-sm text-muted-foreground">Create or join a room to start chatting</p>
                        </>
                      )}
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-260px)]">
                      <div className="space-y-1 p-2">
                        {filteredRooms.map((room) => (
                          <div
                            key={room.id}
                            className={cn(
                              "p-3 rounded-lg cursor-pointer transition-all hover:bg-secondary/80",
                              currentRoom?.id === room.id
                                ? "bg-primary/10 border border-primary/20"
                                : "hover:bg-secondary"
                            )}
                            onClick={() => setCurrentRoom(room)}
                          >
                            <div className="flex justify-between items-center">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center">
                                  <h3 className="font-medium truncate">{room.name}</h3>
                                  {room.createdBy === currentUser.uid && (
                                    <Badge variant="secondary" className="ml-2 text-xs">Owner</Badge>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground mt-1">
                                  <Users className="h-3 w-3 mr-1" />
                                  <span>{room.participants?.length || 1}</span>
                                  <span className="mx-1">•</span>
                                  <Clock className="h-3 w-3 mr-1" />
                                  <span>{room.createdAt ? formatTimestamp(room.createdAt) : "Just now"}</span>
                                </div>
                              </div>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        copyTokenToClipboard(room.token);
                                      }}
                                    >
                                      <Copy className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy room token</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Area */}
          <div className={cn(
            isMobileView && currentRoom ? "col-span-1" : "md:col-span-2"
          )}>
            <Card className="h-[calc(100vh-180px)] flex flex-col">
              {!currentRoom ? (
                <div className="flex flex-col items-center justify-center h-full text-center p-6">
                  <MessageCircle className="h-16 w-16 text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No chat room selected</h2>
                  <p className="text-muted-foreground mb-4">
                    Select a room from the list or create a new one to start chatting
                  </p>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
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
                  <CardHeader className="border-b py-3 px-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {isMobileView && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="mr-2" 
                            onClick={() => setCurrentRoom(null)}
                          >
                            <ArrowLeft className="h-4 w-4" />
                          </Button>
                        )}
                        <div>
                          <CardTitle className="text-lg">{currentRoom.name}</CardTitle>
                          <div className="flex items-center">
                            <CardDescription className="text-xs">
                              {currentRoom.participants?.length || 1} participants
                            </CardDescription>
                            <span className="mx-1 text-xs text-muted-foreground">•</span>
                            <CardDescription 
                              className="text-xs flex items-center cursor-pointer hover:underline"
                              onClick={() => copyTokenToClipboard(currentRoom.token)}
                            >
                              Token: {currentRoom.token}
                              <Copy className="h-3 w-3 ml-1" />
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                      {currentRoom.createdBy === currentUser.uid && (
                        <AlertDialog open={isTerminateDialogOpen} onOpenChange={setIsTerminateDialogOpen}>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Terminate</span>
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
                          {messages.map((msg, index) => {
                            const isFirstInGroup = index === 0 || 
                              messages[index - 1].userId !== msg.userId;
                            const isLastInGroup = index === messages.length - 1 || 
                              messages[index + 1].userId !== msg.userId;
                            
                            return (
                              <div
                                key={msg.id}
                                className={cn(
                                  "flex",
                                  msg.userId === currentUser.uid ? "justify-end" : "justify-start",
                                  !isLastInGroup && "mb-1"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex max-w-[85%]",
                                    msg.userId === currentUser.uid ? "flex-row-reverse" : "flex-row"
                                  )}
                                >
                                  <Avatar className={cn(
                                    "h-8 w-8",
                                    msg.userId === currentUser.uid ? "ml-2" : "mr-2"
                                  )}>
                                    <AvatarImage src={msg.userPhotoURL} alt={msg.userName} />
                                    <AvatarFallback>{getInitials(msg.userName)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <div
                                      className={cn(
                                        "px-3 py-2",
                                        msg.userId === currentUser.uid
                                          ? msg.isTemp 
                                            ? "bg-primary/70 text-primary-foreground" 
                                            : "bg-primary text-primary-foreground"
                                          : "bg-secondary",
                                        isFirstInGroup && msg.userId === currentUser.uid 
                                          ? "rounded-t-lg rounded-bl-lg rounded-br-sm" 
                                          : isFirstInGroup 
                                            ? "rounded-t-lg rounded-br-lg rounded-bl-sm"
                                            : isLastInGroup && msg.userId === currentUser.uid
                                              ? "rounded-b-lg rounded-bl-lg rounded-tr-sm"
                                              : isLastInGroup
                                                ? "rounded-b-lg rounded-br-lg rounded-tl-sm"
                                                : msg.userId === currentUser.uid
                                                  ? "rounded-l-lg rounded-tr-sm rounded-br-sm"
                                                  : "rounded-r-lg rounded-tl-sm rounded-bl-sm"
                                      )}
                                    >
                                      {isFirstInGroup && (
                                        <p className={cn(
                                          "text-xs font-medium mb-1",
                                          msg.userId === currentUser.uid 
                                            ? "text-primary-foreground/90" 
                                            : "text-foreground/90"
                                        )}>
                                          {msg.userName}
                                        </p>
                                      )}
                                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                                    </div>
                                    {isLastInGroup && (
                                      <div
                                        className={cn(
                                          "flex text-xs text-muted-foreground mt-1",
                                          msg.userId === currentUser.uid ? "justify-end mr-2" : "justify-start ml-2"
                                        )}
                                      >
                                        <span>
                                          {msg.isTemp 
                                            ? "Sending..." 
                                            : msg.timestamp ? formatTimestamp(msg.timestamp) : "Just now"}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
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
                      <Button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Send className="h-4 w-4 sm:mr-2" />
                        <span className="hidden sm:inline">Send</span>
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