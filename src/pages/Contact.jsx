import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/30">
        {/* Enhanced animated background elements - similar to Hero */}
        <div className="absolute top-20 right-0 w-2/3 h-64 bg-premium/20 rounded-full filter blur-3xl opacity-30 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute -top-20 left-10 w-32 h-32 bg-note-blue/30 rounded-full filter blur-xl opacity-20 animate-float pointer-events-none"></div>
        <div className="absolute bottom-10 left-0 w-1/2 h-64 bg-note-purple/30 rounded-full filter blur-3xl opacity-20 animate-pulse-slow pointer-events-none"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 bg-note-green/30 rounded-full filter blur-xl opacity-30 animate-float pointer-events-none" style={{ animationDelay: '2s' }}></div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i}
              className="absolute rounded-full bg-premium/30"
              style={{
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `float ${Math.random() * 10 + 10}s infinite ease-in-out`,
                animationDelay: `${Math.random() * 5}s`,
                opacity: Math.random() * 0.5 + 0.3
              }}
            ></div>
          ))}
        </div>

        <div className="pt-24 pb-16 backdrop-blur-sm relative z-10">
          <div className="max-w-7xl mx-auto px-6 md:px-10">
            <div className="max-w-3xl mx-auto text-center">
              <div
                className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge 
                    variant="outline" 
                    className="mb-4 px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-primary/20 to-premium/20 border-primary/30 text-premium hover:bg-primary/20 transition-all duration-300 cursor-default"
                  >
                    <span className="mr-1.5">💻</span>
                    Get in Touch
                  </Badge>
                </motion.div>
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-premium">Contact Us</h1>
                <p className="text-muted-foreground text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                  Have questions or feedback? We'd love to hear from you and help with anything you need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-grow py-12 bg-gradient-to-b from-secondary/10 to-background">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          <motion.div 
            className="bg-background/80 backdrop-blur-sm rounded-xl p-6 md:p-8 shadow-lg border border-border"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ContactForm />
          </motion.div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div 
              className="bg-background/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-premium/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Email</h3>
              <a href="mailto:support@notesnexus.com" className="text-muted-foreground break-words hover:text-primary hover:underline transition-colors">support@notesnexus.com</a>
            </motion.div>
            
            <motion.div 
              className="bg-background/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-premium/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Phone</h3>
              <a href="tel:+918273843092" className="text-muted-foreground hover:text-primary hover:underline transition-colors">+91 8273843092</a>
            </motion.div>
            
            <motion.div 
              className="bg-background/80 backdrop-blur-sm rounded-xl p-6 text-center shadow-lg border border-border hover:border-primary/30 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <div className="mx-auto h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-premium/20 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Location</h3>
              <p className="text-muted-foreground">Gla University, Mathura</p>
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact; 