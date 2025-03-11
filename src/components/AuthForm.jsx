import { useState } from "react";
import { z } from "zod";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, Mail, Lock, User, LogIn, UserPlus } from "lucide-react";
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
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  loginUser, 
  registerUser, 
  signInWithGoogle, 
  signInWithFacebook 
} from "@/lib/firebase";
import ForgotPassword from "@/components/ForgotPassword";

// Login Schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

// Signup Schema
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const AuthForm = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "login";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Login form
  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange"
  });
  
  // Signup form
  const signupForm = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange"
  });
  
  const onLoginSubmit = async (data) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await loginUser(data.email, data.password);
      
      if (result.error) {
        setAuthError(result.error);
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome back to NotesNexus.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const onSignupSubmit = async (data) => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await registerUser(data.email, data.password, data.name);
      
      if (result.error) {
        setAuthError(result.error);
        toast({
          title: "Registration failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Welcome to NotesNexus. Your account has been created successfully.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast({
        title: "Registration failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await signInWithGoogle();
      
      if (result.error) {
        setAuthError(result.error);
        toast({
          title: "Google sign-in failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome to NotesNexus.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        title: "Google sign-in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setIsSubmitting(true);
    setAuthError(null);
    
    try {
      const result = await signInWithFacebook();
      
      if (result.error) {
        setAuthError(result.error);
        toast({
          title: "Facebook sign-in failed",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Login successful!",
          description: "Welcome to NotesNexus.",
          className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Facebook sign-in error:", error);
      toast({
        title: "Facebook sign-in failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  
  const handleTabChange = (value) => {
    setSearchParams({ mode: value });
    setAuthError(null);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
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

  if (showForgotPassword) {
    return <ForgotPassword onBack={handleBackToLogin} />;
  }
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-md mx-auto"
    >
      <Card className="border-border shadow-md bg-gradient-to-b from-background to-secondary/10 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-center mb-6">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-premium to-premium-dark flex items-center justify-center text-white text-xl font-bold">
              {mode === "login" ? <LogIn className="h-6 w-6" /> : <UserPlus className="h-6 w-6" />}
            </div>
          </div>
          <CardTitle className="text-center text-2xl font-bold">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {mode === "login" 
              ? "Enter your credentials to access your account" 
              : "Fill in the details below to create your account"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pb-4">
          {authError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-800 dark:bg-red-900/50 dark:border-red-800 dark:text-red-300 rounded-md text-sm">
              {authError}
            </div>
          )}
          
          <Tabs value={mode} onValueChange={handleTabChange} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={loginForm.control}
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
                        <FormField
                          control={loginForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-premium" />
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                    onClick={togglePasswordVisibility}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants} className="text-sm text-right">
                        <button 
                          type="button"
                          onClick={handleForgotPasswordClick}
                          className="text-premium hover:text-premium-dark transition-colors focus:outline-none focus:underline"
                        >
                          Forgot password?
                        </button>
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
                              Logging in...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Login
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </motion.div>
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="signup">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key="signup"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Form {...signupForm}>
                    <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={signupForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-premium" />
                                Name
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
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={signupForm.control}
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
                        <FormField
                          control={signupForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-premium" />
                                Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                    onClick={togglePasswordVisibility}
                                  >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </motion.div>
                      
                      <motion.div variants={itemVariants}>
                        <FormField
                          control={signupForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="flex items-center">
                                <Lock className="h-4 w-4 mr-2 text-premium" />
                                Confirm Password
                              </FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input 
                                    type={showConfirmPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    {...field} 
                                    className="rounded-lg border-border focus:border-premium focus:ring-premium/20 transition-all pr-10"
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground"
                                    onClick={toggleConfirmPasswordVisibility}
                                  >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </div>
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
                              Creating account...
                            </span>
                          ) : (
                            <span className="flex items-center">
                              Create Account
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </span>
                          )}
                        </Button>
                      </motion.div>
                    </form>
                  </Form>
                </motion.div>
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4 pt-0">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="rounded-lg border-border hover:bg-secondary transition-all"
              onClick={handleGoogleSignIn}
              disabled={isSubmitting}
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </Button>
            <Button 
              variant="outline" 
              className="rounded-lg border-border hover:bg-secondary transition-all"
              onClick={handleFacebookSignIn}
              disabled={isSubmitting}
            >
              <svg className="h-4 w-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
              Facebook
            </Button>
          </div>
          
          <p className="text-center text-sm text-muted-foreground mt-4">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <Link to="/auth?mode=signup" className="text-premium hover:text-premium-dark transition-colors font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link to="/auth?mode=login" className="text-premium hover:text-premium-dark transition-colors font-medium">
                  Log in
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AuthForm;
