import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, accessToken, loading } = useSelector((state) => state.auth);

  return {
    user,
    accessToken,
    loading,
    isAuthenticated: !!accessToken,
  };
};