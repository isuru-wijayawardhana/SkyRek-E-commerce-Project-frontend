import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function ForgetPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Resend Timer State
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  // Handle countdown for resend button
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => { //setInterval is a JavaScript function that runs a piece of code repeatedly at a fixed delay. The Delay: 1000 means "run this every 1000 milliseconds" (which is 1 second).
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval); //Every time the timer changes, React runs the effect again. If we didn't clear the old interval, the browser would have dozens of timers running at once, making the clock count down way too fast and causing a memory leak. How it works: Before starting a new 1-second interval, React kills the previous one.
  }, [timer]);

  async function sendOTP() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/send-otp", { email });
      toast.success("OTP sent successfully");
      setTimer(60); // Start 60s cooldown
      if(step === 1) setStep(2);
    } catch (error) {
      toast.error("User not found or failed to send OTP");
    }
  }

  async function verifyOTP() {
    if (otp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }
    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/verify-otp", {
        email,
        otp,
      });
      toast.success("OTP Entered successfully");
      setStep(3);
    } catch (error) {
      toast.error("Invalid OTP or session expired");
      //setStep(1)
    }
    
  }

  async function resetPassword() {
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/users/reset-password", {
        email,
        otp,
        newPassword,
      });
      toast.success("Password reset successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Invalid OTP or session expired");
    }
  }

  return (
    <div className="w-full h-screen bg-[url(./LoginBG.jpg)] bg-center bg-cover flex justify-center items-center p-4 font-sans">
      <div className="w-full max-w-[450px] min-h-[520px] backdrop-blur-xl bg-black/40 shadow-2xl rounded-[40px] p-10 border border-white/10 text-white flex flex-col items-center">
        
        {/* Progress Tracker */}
        <div className="flex items-center gap-3 mb-10">
            <span className={`text-xs font-bold px-2 py-1 rounded ${step >= 1 ? 'bg-blue-500' : 'bg-white/20'}`}>1</span>
            <div className={`h-[2px] w-6 ${step >= 2 ? 'bg-blue-500' : 'bg-white/10'}`}></div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${step >= 2 ? 'bg-blue-500' : 'bg-white/20'}`}>2</span>
            <div className={`h-[2px] w-6 ${step >= 3 ? 'bg-blue-500' : 'bg-white/10'}`}></div>
            <span className={`text-xs font-bold px-2 py-1 rounded ${step >= 3 ? 'bg-blue-500' : 'bg-white/20'}`}>3</span>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-3xl font-bold mb-2">Reset Password</h1>
            <p className="text-white/60 text-center text-sm mb-8 px-4">Identify your account to receive a secure code.</p>
            <div className="w-full space-y-4">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-[55px] bg-white/5 border border-white/20 rounded-2xl px-5 outline-none focus:border-blue-500 focus:bg-white/10 transition-all"
                onChange={(e) => setEmail(e.target.value)}
              />
              <button onClick={sendOTP} className="w-full h-[55px] bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/30">
                Continue
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold mb-2">Check Email</h1>
            <p className="text-white/60 text-center text-sm mb-8 px-2">
              We sent a code to <br/><span className="text-blue-400 font-medium">{email}</span>
            </p>
            <div className="w-full space-y-4 text-center">
              <input
                type="text"
                maxLength="6"
                placeholder="000000"
                className="w-full h-[60px] bg-white/5 border border-white/20 rounded-2xl px-5 text-center tracking-[0.5em] font-bold text-3xl outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setOtp(e.target.value)}
              />
              <button onClick={verifyOTP} className="w-full h-[55px] bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all active:scale-95">
                Verify Code
              </button>
              
              <div className="pt-2">
                {timer > 0 ? (
                  <p className="text-xs text-white/40">Resend code in <span className="text-white font-mono">{timer}s</span></p>
                ) : (
                  <button onClick={sendOTP} className="text-sm text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-4">
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-500">
            <h1 className="text-3xl font-bold mb-2">Secure Account</h1>
            <p className="text-white/60 text-center text-sm mb-8">Choose a new password you haven't used before.</p>
            <div className="w-full space-y-4">
              <input
                type="password"
                placeholder="New Password"
                className="w-full h-[55px] bg-white/5 border border-white/20 rounded-2xl px-5 outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                className="w-full h-[55px] bg-white/5 border border-white/20 rounded-2xl px-5 outline-none focus:border-blue-500 transition-all"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button onClick={resetPassword} className="w-full h-[55px] bg-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all active:scale-95 shadow-lg shadow-blue-600/20">
                Reset Password
              </button>
            </div>
          </div>
        )}

        <div className="mt-auto pt-10">
          <Link to="/login" className="text-sm text-white/40 hover:text-white transition-colors flex items-center gap-2">
             Cancel and Login
          </Link>
        </div>
      </div>
    </div>
  );
}