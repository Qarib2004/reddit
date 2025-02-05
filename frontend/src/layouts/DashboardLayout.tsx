import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import PrivateRoute from '../components/PrivateRoute';

const DashboardLayout = () => {
  return (
    <PrivateRoute>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '20px' }}>
          <Outlet />
        </main>
      </div>
    </PrivateRoute>
  );
};

export default DashboardLayout;
