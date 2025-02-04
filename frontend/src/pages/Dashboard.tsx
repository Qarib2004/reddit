import { useGetUserQuery } from '../redux/apiSlice';
  
const Dashboard = () => {
  const { data: user, isLoading } = useGetUserQuery();

  if (isLoading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.username}!</p>
      <p>Your email: {user?.email}</p>
    </div>
  );
};

export default Dashboard;