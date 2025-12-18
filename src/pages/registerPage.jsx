import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc"; // Optional but recommended

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: (response) => {
      axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/google-login", {
        token: response.access_token,
      }).then((response) => {
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

  function register() {

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      toast.error("Please fill in all name fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
        firstName,
        lastName,
        email,
        password
    }).then(() => {
        toast.success("Register Successful");
        navigate("/login");
    }).catch((error) => {
        console.log(error);
        toast.error("Registration Failed");
    });
  }

  return (
    <div className="w-full min-h-screen bg-[url(./LoginBG.jpg)] bg-center bg-cover flex justify-center items-center p-6">
      <div className="w-full max-w-[500px] backdrop-blur-lg bg-black/30 shadow-2xl rounded-[40px] p-10 border border-white/10 text-white flex flex-col">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="text-white/60 text-sm mt-2">Join us today! It only takes a minute.</p>
        </div>

        <div className="space-y-4">
          {/* Name Row */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold ml-1 uppercase text-white/50">First Name</label>
              <input 
                onChange={(e) => setFirstName(e.target.value)} 
                type="text" 
                className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold ml-1 uppercase text-white/50">Last Name</label>
              <input 
                onChange={(e) => setLastName(e.target.value)} 
                type="text" 
                className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold ml-1 uppercase text-white/50">Email Address</label>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" 
              className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Passwords Row */}
          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold ml-1 uppercase text-white/50">Password</label>
              <input 
                onChange={(e) => setPassword(e.target.value)} 
                type="password" 
                className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-semibold ml-1 uppercase text-white/50">Confirm</label>
              <input 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                type="password" 
                className="w-full h-11 bg-white/10 border border-white/20 rounded-xl px-4 outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col gap-3">
            <button 
              onClick={register} 
              className="w-full h-12 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-bold transition-all transform active:scale-95 shadow-lg shadow-blue-500/20"
            >
              Register
            </button>
            
            <button 
              onClick={googleLogin} 
              className="w-full h-12 bg-white text-gray-800 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
            >
              <FcGoogle size={20} />
              Register with Google
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center gap-2">
          <p className="text-sm text-white/70">
            Already a customer? 
            <Link to="/login" className="text-blue-400 font-bold ml-1 hover:text-blue-300">Sign in instead</Link>
          </p>
          <Link to="/forget" className="text-xs text-yellow-400/70 hover:text-yellow-400 transition-colors">
            Forget Password? Reset here
          </Link>
        </div>

      </div>
    </div>
  );
}