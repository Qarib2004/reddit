import { Navigate } from "react-router-dom";
import { useGetUserQuery } from "../redux/apiSlice";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { data: user, isLoading } = useGetUserQuery();

  if (isLoading) return <p>Loading...</p>;
  return user ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
