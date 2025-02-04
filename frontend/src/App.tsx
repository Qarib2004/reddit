import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Auth from './components/Auth';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
    <Routes>
      {/* Основной Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} /> {/* index означает "/", вместо дублирования path="/" */}
        <Route path="auth" element={<Auth />} />
        <Route path="community/:id" />
        <Route path="post/:id" />
      </Route>

      {/* Dashboard Layout */}
      <Route path="/dashboard/*" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="subscriptions" />
        <Route path="settings" />
        <Route path="create-post" />
      </Route>
    </Routes>
  );
};

export default App;
