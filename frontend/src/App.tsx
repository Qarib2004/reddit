import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import AdminPanel from "./pages/AdminPanel";
import ForgotPassword from "./pages/ForgotPassword";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import CreateCommunity from "./pages/CreateCommunity";
import { ToastContainer } from "react-toastify";
import PostPage from "./pages/PostPage";
import Community from "./pages/Community";
import Saved from "./pages/Saved";

const App = () => {
  return (
   <>
   <ToastContainer />
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="auth" element={<Auth />} />
        <Route path="community/:id" element={<Community/>}/>
       
        <Route path="verify-email" element={<VerifyEmail />} />
        <Route path="admin" element={<AdminPanel />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        
      </Route>

      <Route path="/" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="subscriptions" element={<Subscriptions />}/>
        <Route path="settings" element={<Settings />}/>
        <Route path="create-post" element={<CreatePost />} />
        <Route path="create-community" element={<CreateCommunity />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/saved" element={<Saved />} />
      </Route>
    </Routes>
   </>
  );
};

export default App;
