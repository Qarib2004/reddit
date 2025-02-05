import { Link } from "react-router-dom";
import { useGetUserQuery, useLogoutMutation } from "../redux/apiSlice";
import { useEffect } from "react";
const Navbar = () => {
  const { data: user,refetch } = useGetUserQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout().unwrap();
    window.location.reload(); 
  };
  useEffect(() => {
    refetch(); 
  }, [refetch]);
  

  return (
    <nav>
      <Link to="/">Home</Link>
      {user ? (
        <>
          <span>Welcome, {user.username}!</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <Link to="/auth">Login</Link>
      )}
    </nav>
  );
};

export default Navbar;
