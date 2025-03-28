import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeGreeting from "@/components/WelcomeGreeting";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Notes from "./pages/Notes";
import Videos from "./pages/Videos";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Offline from "./pages/Offline";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Chat from "./pages/Chat";
import VerifyEmail from "./pages/VerifyEmail";
import AdminDashboard from "@/pages/AdminDashboard";

// Prevent flash of incorrect theme
const ThemeScript = () => {
  useEffect(() => {
    // This script runs on client-side only
    const script = document.createElement('script');
    script.innerHTML = `
      (function() {
        try {
          const storedTheme = localStorage.getItem('notes-nexus-theme');
          if (storedTheme === 'dark' || 
              (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (e) {
          console.error('Error applying theme:', e);
        }
      })();
    `;
    script.async = false;
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return null;
};

const queryClient = new QueryClient();

// Create router with future flags
const router = createBrowserRouter(
  [
    { 
      path: "/", 
      element: (
        <>
          <ScrollToTop />
          <Index />
        </>
      )
    },
    { 
      path: "/notes", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <Notes />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/videos", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <Videos />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/chat", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <Chat />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/profile", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <Profile />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/settings", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <Settings />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/admin", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <AdminDashboard />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/verify-email", 
      element: (
        <ProtectedRoute>
          <ScrollToTop />
          <VerifyEmail />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/contact", 
      element: (
        <>
          <ScrollToTop />
          <Contact />
        </>
      )
    },
    { 
      path: "/auth", 
      element: (
        <>
          <ScrollToTop />
          <Auth />
        </>
      )
    },
    { 
      path: "/offline", 
      element: (
        <>
          <ScrollToTop />
          <Offline />
        </>
      )
    },
    { 
      path: "*", 
      element: (
        <>
          <ScrollToTop />
          <NotFound />
        </>
      )
    }
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const App = () => {
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

  // Conditionally render offline page
  if (!isOnline) {
    return <Offline />;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="notes-nexus-theme">
      <ThemeScript />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AdminProvider>
            <ChatProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <WelcomeGreeting />
                <RouterProvider router={router} />
              </TooltipProvider>
            </ChatProvider>
          </AdminProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;