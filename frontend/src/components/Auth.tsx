import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useLoginWithFaceIdMutation,
} from "../redux/apiSlice";
import { Mail, Lock, User, LogIn, Smile } from "lucide-react";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import * as faceapi from "face-api.js";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [login] = useLoginMutation();
  const [register] = useRegisterMutation();
  const { refetch } = useGetUserQuery();

  const [loginWithFace] = useLoginWithFaceIdMutation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(
            "/models/tiny_face_detector"
          ),
          faceapi.nets.faceRecognitionNet.loadFromUri(
            "/models/face_recognition"
          ),
          faceapi.nets.faceLandmark68Net.loadFromUri(
            "/models/face_landmark_68"
          ),
        ]);
        toast.success("Face recognition models loaded!");
      } catch (error) {
        toast.error("Failed to load models.");
        console.error("Model loading error:", error);
      }
    };
    loadModels();
  }, []);

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
    }
  };
  const startCamera = async () => {
    if (!videoRef.current) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error access to the camera:", error);
      toast.error("Error access to the camera.");
    }
  };

  const handleFaceLogin = async () => {
    setLoading(true);
    await startCamera();

    const video = videoRef.current;
    if (!video) {
      toast.error("Camera not found");
      setLoading(false);
      return;
    }

    video.onloadeddata = async () => {
      setTimeout(async () => {
        try {
          if (video.paused || video.ended || !video.srcObject) {
            toast.error("Camera is not streaming properly");
            setLoading(false);
            stopCamera();
            return;
          }

          console.log(
            "Video dimensions:",
            video.videoWidth,
            "x",
            video.videoHeight
          );

          const simpleDetection = await faceapi.detectSingleFace(
            video,
            new faceapi.TinyFaceDetectorOptions({
              inputSize: 224,
              scoreThreshold: 0.3,
            })
          );

          if (!simpleDetection) {
            toast.error(
              "No face detected. Please ensure good lighting and face the camera directly."
            );
            setLoading(false);
            stopCamera();
            return;
          }

          const detection = await faceapi
            .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks();

          if (!detection) {
            toast.error(
              "Face detected but couldn't extract facial features. Try adjusting lighting."
            );
            setLoading(false);
            stopCamera();
            return;
          }

          const faceDescriptor = await faceapi.computeFaceDescriptor(video);

          if (!faceDescriptor || faceDescriptor instanceof Array) {
            toast.error("Error extracting face data");
            setLoading(false);
            stopCamera();
            return;
          }

          const faceId = Array.from(faceDescriptor as Float32Array);

          console.log("Face descriptor length:", faceId.length);

          const result = await loginWithFace({ faceId }).unwrap();

          if (result.success) {
            toast.success("Login successful!");
            await refetch();
            navigate("/");
          } else {
            toast.error("Face not recognized in system");
          }
        } catch (error) {
          console.error("Face API error:", error);
          toast.error(
            "Face processing error: " +
              (error instanceof Error ? error.message : "Unknown error")
          );
        } finally {
          setLoading(false);
          stopCamera();
        }
      }, 2000);
    };
  };

  const validationSchema = yup.object({
    username: yup.string().when("isLogin", {
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
            toast.success(
              "Registration successful! Check your email to confirm."
            );
          }
        }
      } catch (error: any) {
        toast.error(error.data?.message || "An error occurred");
      }
    },
  });

  return (
    <div className="min-h-screen bg-[#DAE0E6] flex flex-col md:flex-row items-stretch md:items-center justify-center p-4">
      <div className="hidden md:flex md:w-1/2 bg-[#0045AC] text-white p-8 rounded-l-lg items-center justify-center">
        <div className="max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <LogIn size={32} />
            <h1 className="text-3xl font-bold">reddit</h1>
          </div>
          <h2 className="text-2xl font-bold mb-4">Welcome to Reddit</h2>
          <p className="text-lg opacity-90 mb-6">
            Join the world's largest online community and explore endless
            conversations.
          </p>
          <img
            src="https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=500"
            alt="Community"
            className="rounded-lg shadow-xl w-full max-w-sm mx-auto"
          />
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-white p-6 md:p-12 rounded-lg md:rounded-l-none md:rounded-r-lg shadow-xl">
        <div className="max-w-md mx-auto">
          <div className="md:hidden flex items-center gap-2 mb-6 justify-center">
            <LogIn size={32} className="text-[#0045AC]" />
            <h1 className="text-3xl font-bold text-[#0045AC]">reddit</h1>
          </div>

          <h2 className="text-2xl font-bold text-center mb-8">
            {isLogin ? "Log in to Reddit" : "Sign up for Reddit"}
          </h2>

          <button
            className="w-full flex items-center justify-center gap-3 border border-gray-300 px-6 py-3 rounded-full mb-6 hover:bg-gray-50 transition-colors duration-200"
            onClick={() =>
              (window.location.href = "http://localhost:5000/api/auth/google")
            }
          >
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADcAAAA4CAMAAABuU5ChAAAA+VBMVEX////pQjU0qFNChfT6uwU0f/O4zvs6gfSJr/j6twDoOisjePPoNSXpPjDrWU/oLRr+9vZ7pff/vAAUoUAkpEn0ran619b82pT7wgD+68j947H/+e7//PafvPm/0vuBw5Df7+P63tz3xcPxl5HnJQ7qUEXxj4n4z83zoJzqSz/vgXrucWrsY1r1tbHrSBPoOjbvcSr0kx74rRH80XntZC3xhSPmGRr86+r4sk/936EJcfPS3/yowvnbwVKjsTjx9f5urEjkuBu9tC+ErkJyvoRRpj2az6hWs23j6/0emX2z2btAiuI8k8AyqkE5nZU1pGxCiOxVmtHJ5M+PSt3WAAACGElEQVRIieWSa3fSQBCGk20CJRcW2AWKxgJtqCmieNdatV5SUtFq5f//GJeE7CXJJOT4TZ+PO+c58+7MaNr/SWd60mecTDs1pMFp28dODPZnZw/369TXseXqHNfCblDdte84krTDwUFFwnMnJyXm+bSsmZ/vlcb1+6A2x5C1xYeyPgIyJlhtYDjzjOYyZA3oFighLYxni8UMY6dCG/jy9KzTQfI8DXSnTNN0kcl1lNE9dlxYC8TnnEVmAJ02qHlPllyb58vgmQ2Np0tYgzGMo2ex6IKRihi1mPhcZyYuO8McL4yYl0vrrI6mJZpx9Or1mzqa10rFt8p7o5ArXh+lXutC8d6ZBdiXvH6PeyPFsw8KMBu8fsG9+3t473l9yD1vD+/BX3v1cgqv3lzE/8A9NCUK5sn33vugeN1DQTcVTbG/9M56H+lEAzg2d54t7iW5657xCdEx5PF+B9Lj9oO9z4hBgIZX6YyaXfmZaV9QQkU781h+Hra+7jQaFv6Or8RW3r1rhErES641D9XKigox8jJaQxyAfZOpIQm6kiuT6BvfujqVuEpkkY43u+d1RBBF35v55aVJidKSEBRFiJAk/+0PM3NjgjFFMLc/WVYzlzImLBPprzvzrlBjHUmZSH8DmqatS0QSZtcjTxUBWSlZw1bckhaYlISTcm1rIqKolJJxtRWnXUVscTFsjWFFwoy7WTM2+zX69/gDaLcy7SET9nsAAAAASUVORK5CYII="
              alt="Google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-gray-500 bg-white">or</span>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <div className="relative">
                  <User
                    className="absolute left-4 top-3.5 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    className="w-full px-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {formik.errors.username && (
                  <p className="text-red-500 text-sm pl-4">
                    {formik.errors.username}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1">
              <div className="relative">
                <Mail
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="w-full px-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {formik.errors.email && (
                <p className="text-red-500 text-sm pl-4">
                  {formik.errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="relative">
                <Lock
                  className="absolute left-4 top-3.5 text-gray-400"
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  className="w-full px-12 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {formik.errors.password && (
                <p className="text-red-500 text-sm pl-4">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {isLogin && (
              <Link
                to="/forgot-password"
                className="block text-right text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot password?
              </Link>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="hidden"
            ></video>

            <button
              onClick={handleFaceLogin}
              className="w-full flex items-center justify-center gap-3 border border-gray-300 px-6 py-3 rounded-full hover:bg-gray-50 transition"
            >
              <Smile className="w-5 h-5 text-gray-600" />
              {loading ? "Recognizing Face..." : "Log in with Face ID"}
            </button>

            <button
              type="submit"
              className="w-full bg-[#0045AC] text-white px-6 py-3 rounded-full font-medium hover:bg-[#003D96] transition-colors duration-200 mt-6"
            >
              {isLogin ? "Log In" : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center mt-6 text-gray-600">
            {isLogin ? "New to Reddit?" : "Already have an account?"}{" "}
            <button
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
