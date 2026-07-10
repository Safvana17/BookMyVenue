import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const PublicRoute = ({ children }) => {
  const { loading, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  // Show loader while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // If already logged in, redirect to Home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
  }

  // Allow access to public pages
  return children;
};

export default PublicRoute;