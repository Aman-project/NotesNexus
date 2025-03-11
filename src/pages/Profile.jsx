import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfile } from "firebase/auth";
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
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { User, Mail, Camera, ArrowLeft } from "lucide-react";

// Profile Schema
const profileSchema = z.object({
  displayName: z.string().min(2, { message: "Name must be at least 2 characters." }),
  photoURL: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
});

const Profile = () => {
  const { currentUser } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: currentUser?.displayName || "",
      photoURL: currentUser?.photoURL || "",
    },
    mode: "onChange"
  });

  const onProfileSubmit = async (data) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      await updateProfile(currentUser, {
        displayName: data.displayName,
        photoURL: data.photoURL || null,
      });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get the first letter of the user's display name or email for the avatar fallback
  const getInitials = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.charAt(0).toUpperCase();
    } else if (currentUser?.email) {
      return currentUser.email.charAt(0).toUpperCase();
    }
    return "U";
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
          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div variants={itemVariants} className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Profile Picture</CardTitle>
                <CardDescription>Your profile picture will be visible to other users.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4 border-4 border-border">
                  <AvatarImage src={currentUser.photoURL || ""} alt="Profile" />
                  <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <p className="font-medium text-lg">{currentUser.displayName || "User"}</p>
                  <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants} className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>Update your profile information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <FormField
                      control={profileForm.control}
                      name="displayName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <User className="h-4 w-4 mr-2 text-premium" />
                            Display Name
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Your name" 
                              {...field} 
                              className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={profileForm.control}
                      name="photoURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center">
                            <Camera className="h-4 w-4 mr-2 text-premium" />
                            Profile Picture URL
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://example.com/your-photo.jpg" 
                              {...field} 
                              className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all"
                            />
                          </FormControl>
                          <FormMessage />
                          <p className="text-sm text-muted-foreground">
                            Enter a URL to an image. Leave blank to use your initial as an avatar.
                          </p>
                        </FormItem>
                      )}
                    />

                    <div className="flex items-center">
                      <p className="text-sm text-muted-foreground mr-2 flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        Email:
                      </p>
                      <p className="text-sm">{currentUser.email}</p>
                      <p className="text-xs ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded-full">
                        {currentUser.emailVerified ? "Verified" : "Not Verified"}
                      </p>
                    </div>

                    <CardFooter className="px-0 pt-4">
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
                          "Save Changes"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 