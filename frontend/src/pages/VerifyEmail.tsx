import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGetUserQuery } from "../redux/apiSlice";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Helmet } from "react-helmet-async";


const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { refetch } = useGetUserQuery();

  useEffect(() => {
    if (token) {
      axios
        .get(`http://localhost:5000/api/auth/verify-email?token=${token}`, { withCredentials: true }) 
        .then(async (response) => {
          toast.success("Email verified! Redirecting...");
          setLoading(false);

          await refetch(); 
          
          setTimeout(() => navigate("/"), 2000); 
        })
        .catch((error:any) => {
          toast.error("Email verification failed");
          setLoading(false);
        });
    }
  }, [token, refetch, navigate]);

  return (
    <>
    <Helmet>
        <title>Verify Email</title>
      </Helmet>
    <div className="flex justify-center items-center min-h-screen">
      <h2>{loading ? "Verifying email..." : "Redirecting..."}</h2>
    </div>
    </>
  );
};

export default VerifyEmail;
