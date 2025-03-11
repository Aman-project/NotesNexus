import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import WelcomeGreeting from "@/components/WelcomeGreeting";
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

const queryClient = new QueryClient();

// Create router with future flags
const router = createBrowserRouter(
  [
    { path: "/", element: <Index /> },
    { 
      path: "/notes", 
      element: (
        <ProtectedRoute>
          <Notes />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/videos", 
      element: (
        <ProtectedRoute>
          <Videos />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/chat", 
      element: (
        <ProtectedRoute>
          <Chat />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/profile", 
      element: (
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      ) 
    },
    { 
      path: "/settings", 
      element: (
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      ) 
    },
    { path: "/contact", element: <Contact /> },
    { path: "/auth", element: <Auth /> },
    { path: "/offline", element: <Offline /> },
    { path: "*", element: <NotFound /> }
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
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ChatProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <WelcomeGreeting />
              <RouterProvider router={router} />
            </TooltipProvider>
          </ChatProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;