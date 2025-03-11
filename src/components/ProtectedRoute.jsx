import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // You could render a loading spinner here
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!currentUser) {
    // Redirect to login page if not authenticated
    return <Navigate to="/auth?mode=login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 