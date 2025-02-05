import { Navigate } from "react-router-dom";
import { useGetUserQuery } from "../redux/apiSlice";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading, isError } = useGetUserQuery();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <Navigate to="/auth" replace />;
  return user ? children : <Navigate to="/auth" replace />;
  
};

export default PrivateRoute;
