import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

const PrivateRoute = ({ children }) => {
  const { user, loading, isAuthenticated } = useSelector(
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

  // If user is not authenticated, redirect to Login
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.PUBLIC.LOGIN} replace />;
  }

  // If authenticated but user data is missing
  if (!user) {
    return <Navigate to={ROUTES.PUBLIC.HOME} replace />;
  }

  // Allow access to the protected page
  return children;
};

export default PrivateRoute;