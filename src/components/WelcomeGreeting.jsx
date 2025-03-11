import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const WelcomeGreeting = () => {
  const { currentUser } = useAuth();
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hasShownGreeting, setHasShownGreeting] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const timerRef = useRef(null);
  const autoCloseTimerRef = useRef(null);

  useEffect(() => {
    // Check if user has opted out of the greeting
    const disableGreeting = localStorage.getItem("disableGreeting");
    
    if (disableGreeting === "true") {
      setHasShownGreeting(true);
      return;
    }
    
    // Check if we've already shown the greeting in this session
    const hasShown = sessionStorage.getItem("hasShownGreeting");
    
    if (hasShown !== "true") {
      // Wait a moment before showing the greeting
      timerRef.current = setTimeout(() => {
        setIsVisible(true);
        // Mark that we've shown the greeting
        sessionStorage.setItem("hasShownGreeting", "true");
        setHasShownGreeting(true);
        
        // Start the auto-close countdown
        startAutoCloseTimer();
      }, 1000);
    } else {
      setHasShownGreeting(true);
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (autoCloseTimerRef.current) clearInterval(autoCloseTimerRef.current);
    };
  }, []);

  const startAutoCloseTimer = () => {
    // Set up a countdown timer that updates every second
    autoCloseTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          closeGreeting();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const closeGreeting = () => {
    setIsVisible(false);
    
    // Clear the auto-close timer
    if (autoCloseTimerRef.current) {
      clearInterval(autoCloseTimerRef.current);
    }
    
    // If user checked "Don't show again", save this preference
    if (dontShowAgain) {
      localStorage.setItem("disableGreeting", "true");
    }
  };

  const handleDontShowChange = () => {
    setDontShowAgain(!dontShowAgain);
  };

  // Don't render anything if we've already shown the greeting
  if (hasShownGreeting && !isVisible) {
    return null;
  }

  const userName = currentUser?.displayName || "Guest";

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-[#111] text-gray-900 dark:text-white rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 right-0 h-24 bg-[#3050d0] dark:bg-[#3050d0]"></div>
            
            <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
              <div className="bg-black/30 text-white px-2 py-1 rounded-full text-xs flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>{timeLeft}s</span>
              </div>
              <button
                className="text-white/80 hover:text-white transition-colors"
                onClick={closeGreeting}
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="pt-24 pb-6 px-6 flex flex-col items-center">
              <h2 className="text-2xl font-bold text-center mb-2 text-gray-900 dark:text-white">Welcome to NotesNexus!</h2>
              <p className="text-lg font-medium text-[#3050d0] mb-4 text-center">
                Hello, {userName}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                We're excited to have you here. Explore our features and make the most of your experience.
              </p>
              
              <div className="flex items-center mb-5">
                <div 
                  className={`w-5 h-5 rounded-full border ${
                    dontShowAgain 
                      ? 'bg-[#3050d0] border-[#3050d0]' 
                      : 'border-gray-400 dark:border-gray-500'
                  } flex items-center justify-center mr-2 cursor-pointer`}
                  onClick={handleDontShowChange}
                >
                  {dontShowAgain && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Don't show this again</span>
              </div>
              
              <Button 
                className="bg-[#3050d0] hover:bg-[#2040b0] text-white rounded-md px-6 py-2 font-medium"
                onClick={closeGreeting}
              >
                Get Started
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeGreeting; 