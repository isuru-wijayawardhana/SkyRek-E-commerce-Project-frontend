import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiEdit3, FiPackage, FiArrowRight } from "react-icons/fi"; 
import Loader from "../components/loader";

export default function UserAccount() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  async function getUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You are not logged in");
      navigate("/login");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/users/get-user-details",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get user");
    } finally {
      setLoading(false);
    }
  }

  async function sendOTP() {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/verify-user`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("OTP sent successfully");
      setVerificationStep(2);
    } catch (error) {
      toast.error("Failed to send OTP");
    }
  }

  async function verifyOTP() {
    if (otp.length < 6) {
      toast.error("Please enter a valid OTP");
      return;
    }
    try {
      const email = user.email;
      await axios.put(import.meta.env.VITE_BACKEND_URL + "/api/users/verify-user-otp", {
        email,
        otp,
      });
      
      toast.success("Account verified successfully!");
      setIsModalOpen(false);
      setVerificationStep(1);
      window.location.reload(); 
    } catch (error) {
      toast.error("Invalid OTP or session expired");
      setIsModalOpen(false); 
      setVerificationStep(1);
    }
  }

  if (loading) return <Loader />;

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">User data unavailable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-[100px]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Profile Tile */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center gap-6">
          <img 
            src={user.image === "null" || !user.image ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : user.image} 
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-50 shadow-lg" 
            alt="Profile"
          />
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">{user.firstName} {user.lastName}</h1>
            
            <div className="mt-2">
                {user.isEmailVerified === "true" ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">
                    ✓ Verified Account
                </span>
                ) : (
                <button 
                    onClick={() => setIsModalOpen(true)} 
                    className="text-sm font-bold text-blue-500 hover:text-green-500 underline-offset-4 decoration-2 transition-all"
                >
                    Verify Email Address
                </button>
                )}
            </div>

            {/* Verification Modal Overlay */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
                <div className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in zoom-in duration-300">
                  <button 
                    onClick={() => { setIsModalOpen(false); setVerificationStep(1); }}
                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    ✕
                  </button>

                  {verificationStep === 1 && (
                    <div className="py-4">
                      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✉️</div>
                      <h2 className="text-2xl font-black text-gray-800 mb-2">Security Check</h2>
                      <p className="text-gray-500 mb-8 leading-relaxed">We will send a 6-digit code to <br/><span className="font-bold text-gray-800">{user.email}</span></p>
                      <button 
                        onClick={sendOTP}
                        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95"
                      >
                        Send Verification Code
                      </button>
                    </div>
                  )} 

                  {verificationStep === 2 && (
                    <div className="py-4">
                      <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🔢</div>
                      <h2 className="text-2xl font-black text-gray-800 mb-2">Check Email</h2>
                      <p className="text-gray-500 mb-8">Please enter the verification code</p>
                      <input 
                        type="text" 
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full text-center text-3xl font-black tracking-[0.5em] py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl mb-6 outline-none transition-all"
                        placeholder="000000"
                      />
                      <button
                        onClick={verifyOTP} 
                        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold hover:bg-green-700 shadow-xl shadow-green-100 transition-all active:scale-95"
                      >
                        Verify & Continue
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Tiles Container */}
        <div className="flex flex-col gap-4">
            {/* Edit Profile Button */}
            <button 
                onClick={() => navigate("/updateUser", { state: user })} 
                className="group h-[100px] w-full bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-100 flex items-center justify-between text-white transition-all hover:bg-blue-700 active:scale-95"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-2xl"><FiEdit3 size={24}/></div>
                    <span className="text-xl font-bold">Edit Profile</span>
                </div>
                <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0"/>
            </button>

            {/* User History Button */}
            <button 
                onClick={() => navigate("/orderHistory")} 
                className="group h-[100px] w-full bg-slate-800 p-6 rounded-3xl shadow-lg shadow-slate-200 flex items-center justify-between text-white transition-all hover:bg-slate-900 active:scale-95"
            >
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/10 rounded-2xl"><FiPackage size={24}/></div>
                    <span className="text-xl font-bold">Order History</span>
                </div>
                <FiArrowRight className="opacity-0 group-hover:opacity-100 transition-all -translate-x-4 group-hover:translate-x-0"/>
            </button>
        </div>

        {/* Details Grid */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
           <DetailItem icon={<FiMail />} label="Email Address" value={user.email} />
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
           <DetailItem icon={<FiPhone />} label="Phone Number" value={user.phone || "Not Provided"} />
        </div>
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
           <DetailItem icon={<FiMapPin />} label="Billing Location" value={user.address || "Not Provided"} />
        </div>

      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl transition-colors">
      <div className="text-blue-500 bg-blue-50 p-3 rounded-2xl">{icon}</div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-slate-700 font-bold">{value}</p>
      </div>
    </div>
  );
}