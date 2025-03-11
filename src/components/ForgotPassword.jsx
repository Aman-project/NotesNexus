import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Mail, ArrowRight } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { resetPassword } from "@/lib/firebase";

// Reset Password Schema
const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const ForgotPassword = ({ onBack }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState(null);
  const { toast } = useToast();
  
  // Reset password form
  const resetForm = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange"
  });
  
  const onResetSubmit = async (data) => {
    setIsSubmitting(true);
    setResetError(null);
    
    try {
      const result = await resetPassword(data.email);
      
      if (result.error) {
        setResetError(result.error);
        toast({
          title: "Password reset failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        setResetSent(true);
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
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full"
    >
      <Card className="border-border shadow-md bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
        <CardHeader className="pb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2" 
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Button>
          <CardTitle className="text-center text-2xl font-bold">
            Reset Password
          </CardTitle>
          <CardDescription className="text-center">
            {resetSent 
              ? "Check your email for reset instructions" 
              : "Enter your email to receive a password reset link"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          {resetError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-300 rounded-md text-sm">
              {resetError}
            </div>
          )}
          
          {resetSent ? (
            <div className="p-4 bg-green-50 border border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300 rounded-md text-sm mb-4">
              <p className="font-medium">Password reset email sent!</p>
              <p className="mt-1">We've sent instructions to reset your password to your email address. Please check your inbox and follow the instructions.</p>
              <p className="mt-2">If you don't see the email, check your spam folder.</p>
            </div>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <motion.div variants={itemVariants}>
                  <FormField
                    control={resetForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Mail className="h-4 w-4 mr-2 text-premium" />
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="name@example.com" 
                            {...field} 
                            className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </motion.div>
                
                <motion.div variants={itemVariants}>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all rounded-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center">
                        Send Reset Link
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          )}
        </CardContent>
        
        {resetSent && (
          <CardFooter className="flex flex-col space-y-4 pt-0">
            <Button 
              variant="outline" 
              className="w-full rounded-lg border-premium/20 text-premium hover:bg-premium/5 hover:text-premium-dark transition-all"
              onClick={onBack}
            >
              Return to Login
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default ForgotPassword; 