import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import Auth from "./components/Auth";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import CreatePost from "./pages/CreatePost";
import Settings from "./pages/Settings";
import Subscriptions from "./pages/Subscriptions";
import CreateCommunity from "./pages/CreateCommunity";
import { ToastContainer } from "react-toastify";
import PostPage from "./pages/PostPage";
import Community from "./pages/Community";
import Saved from "./pages/Saved";
import UserDetails from "./pages/UserDetails";
import AdminLayout from "./layouts/AdminLayout";
import UsersManagement from "./pages/admin/UsersManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminPanel from "./pages/admin/AdminPanel";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useGetUserQuery } from "./redux/apiSlice";
import { setUser } from "./redux/authSlice";
import AdminContent from "./pages/admin/AdminContent";
import AdminCommunity from "./pages/admin/AdminCommunity";

const App = () => {
  const dispatch = useDispatch();
  const { data: user } = useGetUserQuery();
  const authUser = useSelector((state: any) => state.auth?.user);
  
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    }
  }, [user, dispatch]);
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="auth" element={<Auth />} />
          <Route path="community/:id" element={<Community />} />

          <Route path="verify-email" element={<VerifyEmail />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="settings" element={<Settings />} />
          <Route path="create-post" element={<CreatePost />} />
          <Route path="create-community" element={<CreateCommunity />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/profile/:id" element={<UserDetails />} />
        </Route>

    

        {authUser && authUser.role === "admin" && (
        <Route path="/admin" element={<AdminLayout />}>
         <Route index element={<AdminPanel />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="content" element={<AdminContent />} />
         <Route path="community" element={<AdminCommunity />} />
        </Route>
      )}
      </Routes>
    </>
  );
};

export default App;
