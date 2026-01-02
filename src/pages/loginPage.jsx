import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Optional: Add react-icons for a better Google button

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/google-login", {
        token: response.access_token,
      }).then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.token);
        toast.success("Login successful");
        if (response.data.role === "admin") {
          navigate("/admin");
        } else if (response.data.role === "user") {
          navigate("/");
        }
      }).catch(() => {
        toast.error("Google Login Failed");
      });
    }
  });

  function login() {
        if (!email || !password) {
      toast.error("Please fill in all name fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/login", {
      email: email,
      password: password
    }).then((response) => {
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      toast.success("Login Successful");
      if (response.data.role === "admin") {
        navigate("/admin");
      } else if (response.data.role === "user") {
        navigate("/");
      }
    }).catch((error) => {
      console.log(error);
      toast.error(error.response?.data?.message||"Login Failed");
    });
  }

  return (
    <div className="w-full h-screen bg-[url(./LoginBG.jpg)] bg-center bg-cover flex justify-center items-center font-sans p-4">
      {/* Login Card */}
      <div className="w-full max-w-[450px] min-h-[550px] backdrop-blur-md bg-white/10 border border-white/20 shadow-2xl rounded-[30px] p-8 flex flex-col items-center justify-between text-white">
        
        <div className="w-full flex flex-col items-center">
          <h1 className="text-4xl font-extrabold mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-white/70 text-sm mb-8">Please enter your details to sign in</p>

          {/* Email Field */}
          <div className="w-full flex flex-col gap-1 mb-4">
            <label className="text-sm font-medium ml-1">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="text" 
              placeholder="name@example.com"
              className="w-full h-[48px] px-4 bg-white/5 border border-white/30 rounded-xl outline-none focus:border-blue-400 focus:bg-white/10 transition-all placeholder:text-white/30"
            />
          </div>

          {/* Password Field */}
          <div className="w-full flex flex-col gap-1 mb-6">
            <label className="text-sm font-medium ml-1">Password</label>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              placeholder="••••••••"
              className="w-full h-[48px] px-4 bg-white/5 border border-white/30 rounded-xl outline-none focus:border-blue-400 focus:bg-white/10 transition-all placeholder:text-white/30"
            />
          </div>

          {/* Login Button */}
          <button 
            onClick={login} 
            className="w-full h-[48px] bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-semibold text-lg transition-all duration-300 shadow-lg shadow-blue-500/30 active:scale-[0.98]"
          >
            Sign In
          </button>

          {/* Divider */}
          <div className="w-full flex items-center my-6 gap-3">
            <div className="h-[1px] bg-white/20 flex-grow"></div>
            <span className="text-xs text-white/50 uppercase tracking-widest">or continue with</span>
            <div className="h-[1px] bg-white/20 flex-grow"></div>
          </div>

          {/* Google Login Button */}
          <button 
            onClick={googleLogin} 
            className="w-full h-[48px] bg-white text-gray-900 rounded-xl font-medium text-md flex items-center justify-center gap-3 hover:bg-gray-100 transition-all duration-300 active:scale-[0.98]"
          >
            <FcGoogle size={24} />
            Sign in with Google
          </button>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center space-y-2">
          <p className="text-sm text-white/70">
            Don't have an account? 
            <Link to="/register" className="text-blue-400 font-bold ml-1 hover:underline">Sign up</Link>
          </p>
          <p className="text-sm">
            <Link to="/forget" className="text-yellow-400/80 hover:text-yellow-400 transition-colors">Forgot Password?</Link>
          </p>
        </div>

      </div>
    </div>
  );
}