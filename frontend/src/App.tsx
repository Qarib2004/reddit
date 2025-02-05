import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail"; 


const App = () => {
  return (
    <Routes>
      
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="community/:id" />
        <Route path="post/:id" />

       
        <Route path="verify-email" element={<VerifyEmail />} />
      </Route>

      
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
