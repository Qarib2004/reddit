import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
} from "../redux/apiSlice";
import { Mail, Lock, User } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { refetch } = useGetUserQuery();

  const validationSchema = yup.object({
    username: yup
      .string()
      .when("isLogin", {
        is: false,
        then: (schema) => schema.required("Username is required"),
        otherwise: (schema) => schema.notRequired(),
      }),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters long")
      .required("Password is required"),
  });
  
  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (isLogin) {
          const result = await login({
            email: values.email,
            password: values.password,
          }).unwrap();
          if (result) {
            toast.success("Login successful!");
            await refetch();
            navigate("/");
          }
        } else {
          const result = await register(values).unwrap();
          if (result) {
            toast.success("Registration successful! Check your email to confirm.");
          }
        }
      } catch (error:any) {
        toast.error(error.data?.message || "An error occurred");
      }
    },
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-center text-xl font-bold">
          {isLogin ? "Log in to Reddit" : "Sign up for Reddit"}
        </h2>
        <button
          className="w-full flex items-center gap-2 border px-4 py-2 rounded-md mb-3"
          onClick={() => (window.location.href = "http://localhost:5000/api/auth/google")}
        >
          <img
            src="https://yt3.googleusercontent.com/K8WVrQAQHTTwsHEtisMYcNai7p7XIlyEAdZg86qYw78ye57r5DRemHQ9Te4PcD_v98HB-ZvQjQ=s900-c-k-c0x00ffffff-no-rj"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <div className="relative my-3 text-center">
          <span className="text-gray-500 text-sm bg-white px-2">or</span>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-3">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formik.values.username}
                onChange={formik.handleChange}
                className="border rounded-md px-10 py-2 w-full"
              />
              {formik.errors.username && <p className="text-red-500 text-sm">{formik.errors.username}</p>}
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="border rounded-md px-10 py-2 w-full"
            />
            {formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="border rounded-md px-10 py-2 w-full"
            />
            {formik.errors.password && <p className="text-red-500 text-sm">{formik.errors.password}</p>}
          </div>
          <Link to="/forgot-password" className="text-blue-600 text-sm hover:underline block text-right">
            Forgot password?
          </Link>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>
        <p className="text-sm text-center mt-4">
          {isLogin ? "New to Reddit?" : "Already have an account?"} {" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Sign up" : "Log in"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
