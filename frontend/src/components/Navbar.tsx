import { Link } from "react-router-dom";
import { useGetUserQuery, useLogoutMutation } from "../redux/apiSlice";

const Navbar = () => {
  const { data: user } = useGetUserQuery();
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    await logout();
  };

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
