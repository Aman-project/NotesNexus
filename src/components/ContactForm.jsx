import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SendIcon, User, Mail, MessageSquare, FileText, Sparkles } from "lucide-react";
import useWeb3Forms from "@web3forms/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// web3forms access key
const ACCESS_KEY = "1423d992-b1e0-489f-8e7d-9abef4c8a741";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  subject: z.string().min(5, { message: "Subject must be at least 5 characters." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(0);
  const { toast } = useToast();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
    mode: "onChange"
  });

  const { submit: submitForm } = useWeb3Forms({
    access_key: ACCESS_KEY,
    settings: {
      from_name: "Magic Notes",
      subject: "New Contact Form Submission",
    },
    onSuccess: (message, data) => {
      console.log("Success:", message, data);
      toast({
        title: "Message Sent Successfully!",
        description: "Thank you for contacting us. We'll get back to you soon!",
        className: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/50 dark:border-green-800 dark:text-green-300",
      });
      form.reset();
      setIsSubmitting(false);
      setFormStep(0);
    },
    onError: (error, data) => {
      console.error("Error:", error, data);
      toast({
        variant: "destructive",
        title: "Error",
        description: error || "There was an error sending your message. Please try again.",
      });
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      console.log("Submitting form with data:", data);
      
      const response = await submitForm({
        ...data,
        "form-name": "Contact Form",
        access_key: ACCESS_KEY,
      });
      
      console.log("Form submission response:", response);
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error sending your message. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const formVariants = {
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

  const stepVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 }
  };

  // Check if current step is valid
  const isFirstStepValid = form.watch("name") && form.watch("email") && 
    !form.getFieldState("name").error && !form.getFieldState("email").error;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formVariants}
      className="relative bg-gradient-to-br from-background/80 to-secondary/10 p-8 rounded-xl border border-border/50 shadow-lg backdrop-blur-sm overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-premium/10 rounded-full filter blur-xl opacity-50 animate-pulse-slow pointer-events-none"></div>
      <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-note-blue/10 rounded-full filter blur-xl opacity-40 animate-float pointer-events-none"></div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          {formStep === 0 && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <motion.div variants={itemVariants} className="text-center mb-6">
                <div className="inline-flex items-center justify-center mb-3">
                  <Sparkles className="h-5 w-5 text-premium mr-2" />
                  <span className="text-sm font-medium text-premium">Let's Connect</span>
                </div>
                <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-premium">Get in Touch</h3>
                <p className="text-muted-foreground">We'd love to hear from you. Fill out the form below to start a conversation.</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-premium" />
                        Your Name
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className="rounded-lg border-border/50 focus:border-premium focus:ring-premium/20 transition-all bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-premium" />
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your.email@example.com" 
                          {...field} 
                          className="rounded-lg border-border/50 focus:border-premium focus:ring-premium/20 transition-all bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="pt-4">
                <Button
                  type="button"
                  className="w-full bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all rounded-lg shadow-md hover:shadow-premium/20"
                  onClick={() => isFirstStepValid && setFormStep(1)}
                  disabled={!isFirstStepValid}
                >
                  Continue
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              </motion.div>
            </motion.div>
          )}
          
          {formStep === 1 && (
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={stepVariants}
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <FileText className="h-4 w-4 mr-2 text-premium" />
                        Subject
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What is your message about?" 
                          {...field} 
                          className="rounded-lg border-border/50 focus:border-premium focus:ring-premium/20 transition-all bg-background/50 backdrop-blur-sm"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <MessageSquare className="h-4 w-4 mr-2 text-premium" />
                        Your Message
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us how we can help..."
                          className="min-h-32 resize-none rounded-lg border-border/50 focus:border-premium focus:ring-premium/20 transition-all bg-background/50 backdrop-blur-sm"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-lg border-border/50 hover:bg-secondary/50 transition-all backdrop-blur-sm"
                  onClick={() => setFormStep(0)}
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </Button>
                
                <Button 
                  type="submit" 
                  className="flex-1 bg-gradient-to-r from-premium to-premium-dark hover:opacity-90 transition-all rounded-lg shadow-md hover:shadow-premium/20" 
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
                      Send Message
                      <SendIcon className="ml-2 h-4 w-4" />
                    </span>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          )}
        </form>
      </Form>
    </motion.div>
  );
};

export default ContactForm;
