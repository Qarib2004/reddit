import { Routes, Route, useParams } from "react-router-dom";
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
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminModeratorRequests from "./pages/admin/AdminModeratorRequets";
import ModeratorLayout from "./layouts/ModeraotrLayout";
import ModeratorDashboard from "./pages/moderator/ModeratorDashboard";
import ModeratorReportedPosts from "./pages/moderator/ModeratorReportedPosts";
import ModeratorReportedComments from "./pages/moderator/ModeratorReportedComments";
import ModeratorWarnings from "./pages/moderator/ModeratorWarning";
import ModeratorStats from "./pages/moderator/ModeratorStats";
import ModeratorHistory from "./pages/moderator/ModeraotHistoty";
import ModeratorChat from "./pages/moderator/ModeratorChat";
import SearchPage from "./pages/SearchPage";
import SettingsPost from "./pages/SettingsPost";
import CommunitySettings from "./pages/CommunitySettings";
import Subscribed from "./pages/Subscribed";
import CommentSettings from "./pages/CommentSettings";
import { useGetCommentByIdQuery } from "./redux/commentsSlice";
import NotFound from "./pages/NotFound";
import NotAuthorized from "./pages/NotAuthorized";


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
          <Route path="/search" element={<SearchPage />} />

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
          <Route path="/post/:id/edit" element={<SettingsPost />} />
          <Route path="/community/:id/communitySettings" element={<CommunitySettings />} />
          <Route path="/subscribed" element={<Subscribed />} />
          <Route path="/comment/:id/edit" element={<CommentWrapper />} />
          </Route>

    

          <Route path="/admin/*" element={
          authUser?.role === "admin" ? (
            <AdminLayout />
          ) : (
            <NotAuthorized role="admin" />
          )
        }>
         <Route index element={<AdminPanel />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="content" element={<AdminContent />} />
         <Route path="community" element={<AdminCommunity />} />
         <Route path="dashboard" element={<AdminDashboard />} />
         <Route path="moderator-requests" element={<AdminModeratorRequests />} />

        </Route>
      
        <Route path="/moderator/*" element={
          authUser?.role === "moderator" ? (
            <ModeratorLayout />
          ) : (
            <NotAuthorized role="moderator" />
          )
        }>
          <Route path="dashboard" element={<ModeratorDashboard />} />
          <Route path="reported-posts" element={<ModeratorReportedPosts />} />
          <Route path="reported-comments" element={<ModeratorReportedComments />} />
          <Route path="warnings" element={<ModeratorWarnings />} />
          <Route path="stats" element={<ModeratorStats />} />
          <Route path="history" element={<ModeratorHistory />} />
          <Route path="chat" element={<ModeratorChat />} />
        </Route>



        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

const CommentWrapper = () => {
  const { id } = useParams<{ id: string }>();
  const { data: comment, isLoading } = useGetCommentByIdQuery(id!);

  if (isLoading) return <p>Loading comment...</p>;
  if (!comment) return <p>Comment not found</p>;

  return <CommentSettings comment={comment} />;
};

export default App;
