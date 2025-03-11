import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, Bell, Shield, Trash2, AlertTriangle } from "lucide-react";
import { resetPassword, auth } from "@/lib/firebase";
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, deleteUser } from "firebase/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Password Schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Delete Account Schema
const deleteAccountSchema = z.object({
  password: z.string().min(1, { message: "Password is required to delete your account." }),
  confirmation: z.literal("delete my account", {
    errorMap: () => ({ message: "Please type 'delete my account' to confirm" }),
  }),
});

const Settings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  
  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });

  // Delete account form
  const deleteAccountForm = useForm({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
      confirmation: "",
    },
    mode: "onChange"
  });

  const onPasswordSubmit = async (data) => {
    if (!currentUser || !currentUser.email) return;
    
    setIsSubmitting(true);
    
    try {
      // Re-authenticate user before changing password
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        data.currentPassword
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Update password
      await updatePassword(currentUser, data.newPassword);
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
      });
      
      // Reset form
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast({
        title: "Password update failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!currentUser || !currentUser.email) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await resetPassword(currentUser.email);
      
      if (result.error) {
        toast({
          title: "Password reset failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Password reset email sent",
          description: "Check your email for instructions to reset your password.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
      }
    } catch (error) {
      console.error("Password reset error:", error);
      toast({
        title: "Password reset failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDeleteAccountSubmit = async (data) => {
    if (!currentUser || !currentUser.email) return;
    
    setIsDeleting(true);
    
    try {
      // Re-authenticate user before deleting account
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        data.password
      );
      
      await reauthenticateWithCredential(currentUser, credential);
      
      // Delete user
      await deleteUser(currentUser);
      
      toast({
        title: "Account deleted",
        description: "Your account has been permanently deleted.",
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
      });
      
      navigate("/");
    } catch (error) {
      console.error("Account deletion error:", error);
      toast({
        title: "Account deletion failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

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

  if (!currentUser) {
    navigate("/auth?mode=login");
    return null;
  }

  return (
    <div className="container max-w-4xl py-20 px-4 md:px-6">
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
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="account" className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Account</span>
              <span className="sm:hidden">Account</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notif.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription>Manage your account details and preferences.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Account Created</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentUser.metadata.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Last Sign In</h3>
                      <p className="text-sm text-muted-foreground">
                        {currentUser.metadata.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString() : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-1">Email Verification</h3>
                      <div className="flex items-center">
                        {currentUser.emailVerified ? (
                          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 px-2 py-0.5 rounded-full">
                            Not Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-6 flex flex-col items-start">
                  <h3 className="text-base font-medium mb-2 text-red-600 dark:text-red-400 flex items-center">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Account
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. This action is permanent.
                  </p>
                  <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <DialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className="flex items-center text-red-600 dark:text-red-400">
                          <AlertTriangle className="h-5 w-5 mr-2" />
                          Delete Account
                        </DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...deleteAccountForm}>
                        <form onSubmit={deleteAccountForm.handleSubmit(onDeleteAccountSubmit)} className="space-y-4">
                          <FormField
                            control={deleteAccountForm.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="password" 
                                    placeholder="Enter your password" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={deleteAccountForm.control}
                            name="confirmation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Confirmation</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="Type 'delete my account' to confirm" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Please type "delete my account" to confirm.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <DialogFooter>
                            <Button 
                              variant="outline" 
                              onClick={() => setShowDeleteDialog(false)}
                              type="button"
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="destructive" 
                              type="submit"
                              disabled={isDeleting}
                            >
                              {isDeleting ? (
                                <span className="flex items-center">
                                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                  </svg>
                                  Deleting...
                                </span>
                              ) : (
                                "Delete Account"
                              )}
                            </Button>
                          </DialogFooter>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your password and security preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your current password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Enter your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirm New Password</FormLabel>
                            <FormControl>
                              <Input 
                                type="password" 
                                placeholder="Confirm your new password" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                        <Button 
                          type="submit" 
                          className="bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all rounded-lg" 
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <span className="flex items-center">
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Updating...
                            </span>
                          ) : (
                            "Update Password"
                          )}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline"
                          onClick={handleResetPassword}
                          disabled={isSubmitting}
                        >
                          Send Password Reset Email
                        </Button>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium">Push Notifications</h3>
                      <p className="text-sm text-muted-foreground">Receive notifications in your browser</p>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all rounded-lg"
                  >
                    Save Preferences
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default Settings; 