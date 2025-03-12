import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Users, UserCheck, Clock, Search, LogOut, Key, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format, formatDistanceToNow } from "date-fns";
import { adminForceLogoutUser, adminResetUserPassword } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const AdminDashboard = () => {
  const { isAdmin, userStats, allUsers, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [actionInProgress, setActionInProgress] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const { toast } = useToast();

  // Redirect non-admin users immediately
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/", { replace: true });
    }
  }, [isAdmin, isLoading, navigate]);

  // Filter users based on search query
  useEffect(() => {
    if (!allUsers) return;

    const filtered = allUsers.filter(user => 
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, allUsers]);

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return "Never";
    try {
      return formatDistanceToNow(lastSeen.toDate(), { addSuffix: true });
    } catch (error) {
      return "Unknown";
    }
  };

  const handleForceLogout = async (userId, userName) => {
    setActionInProgress(userId);
    try {
      const result = await adminForceLogoutUser(userId);
      if (result.success) {
        toast({
          title: "User logged out",
          description: `${userName} has been successfully logged out.`,
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
      } else {
        toast({
          title: "Failed to log out user",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Force logout error:", error);
      toast({
        title: "Failed to log out user",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  const handleResetPassword = async (userEmail, userName) => {
    setActionInProgress(userEmail);
    try {
      const result = await adminResetUserPassword(userEmail);
      if (result.success) {
        toast({
          title: "Password reset email sent",
          description: `A password reset email has been sent to ${userName}.`,
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
      } else {
        toast({
          title: "Failed to send password reset",
          description: result.error || "An unexpected error occurred.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Failed to send password reset",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setActionInProgress(null);
    }
  };

  // Don't render anything while loading or if not admin
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="container max-w-7xl py-20 px-4 md:px-6">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full"
      >
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-4" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.totalUsers || 0}</div>
                <p className="text-xs text-muted-foreground">Regular users (excluding admins)</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Online Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats?.onlineCount || 0}</div>
                <p className="text-xs text-muted-foreground">Currently active users</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {userStats?.lastUpdated ? format(userStats.lastUpdated, "HH:mm:ss") : "--:--:--"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userStats?.lastUpdated ? format(userStats.lastUpdated, "MMM d, yyyy") : "Not available"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
              <CardDescription>Monitor all users and their status</CardDescription>
              <div className="mt-4">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback>
                            {user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{user.displayName || "Anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Joined: {user.createdAt ? format(user.createdAt.toDate(), "MMM d, yyyy") : "Unknown"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={user.isOnline ? "success" : "secondary"}
                            className={user.isOnline ? "bg-green-500" : ""}
                          >
                            {user.isOnline ? "Online" : "Offline"}
                          </Badge>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-7 w-7"
                                  onClick={() => handleForceLogout(user.id, user.displayName || user.email)}
                                  disabled={actionInProgress === user.id || !user.isOnline}
                                >
                                  {actionInProgress === user.id ? (
                                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                  ) : (
                                    <LogOut className="h-3 w-3" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Force logout</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                disabled={actionInProgress === user.email}
                                onClick={() => setSelectedUser(user)}
                              >
                                {actionInProgress === user.email ? (
                                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                                ) : (
                                  <Key className="h-3 w-3" />
                                )}
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                                  Reset User Password
                                </DialogTitle>
                                <DialogDescription>
                                  This will send a password reset email to {selectedUser?.email}. The user will need to check their email to set a new password.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <p className="text-sm font-medium">Are you sure you want to reset the password for:</p>
                                <p className="text-sm font-bold mt-1">{selectedUser?.displayName || "Anonymous"} ({selectedUser?.email})</p>
                              </div>
                              <DialogFooter className="sm:justify-end">
                                <DialogClose asChild>
                                  <Button type="button" variant="secondary">
                                    Cancel
                                  </Button>
                                </DialogClose>
                                <DialogClose asChild>
                                  <Button 
                                    type="button" 
                                    variant="default"
                                    onClick={() => handleResetPassword(selectedUser?.email, selectedUser?.displayName || selectedUser?.email)}
                                  >
                                    Reset Password
                                  </Button>
                                </DialogClose>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.isOnline ? "Currently active" : `Last seen: ${formatLastSeen(user.lastSeen)}`}
                        </p>
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                      {searchQuery ? "No users found matching your search" : "No users registered"}
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard; 