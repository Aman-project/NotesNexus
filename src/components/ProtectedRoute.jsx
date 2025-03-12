import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading } = useAdmin();
  const location = useLocation();
  
  // Check if this is the admin route
  const isAdminRoute = location.pathname === "/admin";
  
  // Show loading state while authentication or admin status is being checked
  if (authLoading || (isAdminRoute && adminLoading)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />;
  }
  
  // Redirect to home if trying to access admin route without admin privileges
  if (isAdminRoute && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 