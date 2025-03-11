import { useEffect, useState } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Offline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  // If we're online, redirect to home
  useEffect(() => {
    if (isOnline) {
      window.location.href = '/';
    }
  }, [isOnline]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card rounded-lg shadow-lg p-8 text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <WifiOff className="h-10 w-10 text-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">You're offline</h1>
        <p className="text-muted-foreground mb-6">
          It seems you're not connected to the internet. Some features may not be available while offline.
        </p>
        
        <div className="space-y-4">
          <Button 
            onClick={handleRefresh} 
            className="w-full bg-gradient-to-r from-premium to-premium-dark hover:opacity-90"
          >
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Try Again
          </Button>
          
          <p className="text-sm text-muted-foreground">
            Don't worry! NotesNexus has cached some content for offline use. You can still access previously viewed pages.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Offline; 