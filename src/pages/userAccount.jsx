import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiEdit3 } from "react-icons/fi"; 
import Loader from "../components/loader";

export default function UserAccount() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1); 
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(true); // Control the Loader component

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
      setLoading(true); // Start loading
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/users/get-user-details",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get user");
    } finally {
      setLoading(false); // Stop loading regardless of success/fail
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
      
      // Refresh the page to update the "Verified" status in the UI
      window.location.reload(); 
      
    } catch (error) {
      toast.error("Invalid OTP or session expired");
      setIsModalOpen(false); 
      setVerificationStep(1);
    }
  }

  // 1. If global loading is true, show the Loader
  if (loading) {
    return <Loader />;
  }

  // 2. If not loading but user is still null (shouldn't happen with proper error handling)
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500">User data unavailable.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-[100px] ">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Profile Tile */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <img 
            src={user.image === "null" || !user.image ? "https://cdn-icons-png.flaticon.com/512/149/149071.png" : user.image} 
            className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-50" 
            alt="Profile"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.firstName} {user.lastName}</h1>
            
            {user.isEmailVerified === "true" ? (
              <div className="text-green-600 font-medium flex items-center gap-1">
                Verified
              </div>
            ) : (
              <button 
                onClick={() => setIsModalOpen(true)} 
                className="text-blue-500 font-medium hover:text-green-500 cursor-pointer"
              >
                Not Verified
              </button>
            )}

            {/* Verification Modal Overlay */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 text-center">
                <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
                  <button 
                    onClick={() => { setIsModalOpen(false); setVerificationStep(1); }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>

                  {verificationStep === 1 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Verify Email ✉️</h2>
                      <p className="text-gray-500 mb-6">We will send an OTP to <span className="font-semibold text-gray-800">{user.email}</span></p>
                      <button 
                        onClick={sendOTP}
                        className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
                      >
                        Send OTP
                      </button>
                    </div>
                  )} 

                  {verificationStep === 2 && (
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Enter Code 🔢</h2>
                      <p className="text-gray-500 mb-6">Enter the 6-digit code sent to your email</p>
                      <input 
                        type="text" 
                        maxLength="6"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="w-full text-center text-2xl tracking-widest py-3 border-2 border-gray-100 rounded-xl mb-6 focus:border-blue-500 outline-none"
                        placeholder="000000"
                      />
                      <button
                        onClick={verifyOTP} 
                        className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700 transition-all"
                      >
                        Verify
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Tile */}
        <button onClick={() => navigate("/updateUser", { state: user })} className="text-xl font-semibold gap-2 cursor-pointer bg-blue-600 p-8 rounded-3xl shadow-lg flex flex-col justify-center items-center text-white hover:bg-blue-700 transition-all">
          <div className="flex justify-center items-center gap-2"><FiEdit3 /> Edit Profile</div>
        </button>

        {/* Contact Details Tiles */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiMail />} label="Email" value={user.email} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiPhone />} label="Phone" value={user.phone || "Not Provided"} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiMapPin />} label="Location" value={user.address || "Not Provided"} />
        </div>

      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="text-blue-500 bg-blue-50 p-2 rounded-lg">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-gray-700 font-medium">{value}</p>
      </div>
    </div>
  );
}