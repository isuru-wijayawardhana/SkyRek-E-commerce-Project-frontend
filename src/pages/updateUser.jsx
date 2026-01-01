import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/userDP";
import { FiArrowLeft, FiCamera, FiLock, FiPhone, FiMapPin, FiCheckCircle } from "react-icons/fi";

export default function UpdateUser() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // 1. Added confirmPassword state
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); 
  const [phone, setPhone] = useState(state.phone || "");
  const [address, setAddress] = useState(state.address || "");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(state.image || "");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!image) return;
    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  async function updateUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login");
      navigate("/login");
      return;
    }

    // 2. Logic to check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    try {
      setIsUpdating(true);
      let imageUrl = state.image;
      if (image) {
        imageUrl = await uploadFile(image);
      }

      const userData = { password, phone, address, image: imageUrl };

      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/user-update/${state.email}`,
        userData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("User updated successfully");
      navigate("/account");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update user");
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium transition-colors"
          >
            <FiArrowLeft /> Back to Dashboard
          </button>
          <div className="hidden md:block text-right">
            <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
            <p className="text-sm text-slate-400">Update your personal information</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Profile Photo Tile */}
          <div className="md:col-span-1 bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center gap-4">
             <div className="relative group">
               <img
                 src={preview || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                 alt="Preview"
                 className="w-40 h-40 rounded-3xl object-cover shadow-2xl transition-transform group-hover:scale-95"
               />
               <label className="absolute -bottom-3 -right-3 bg-blue-600 p-3 rounded-2xl text-white cursor-pointer shadow-lg hover:bg-blue-700 transition-colors">
                 <FiCamera size={20} />
                 <input
                   type="file"
                   className="hidden"
                   onChange={(e) => setImage(e.target.files[0])}
                   accept="image/*"
                 />
               </label>
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">Profile Picture</p>
          </div>

          {/* Contact Info Tile */}
          <div className="md:col-span-2 bg-white p-13 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between gap-6">
            <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
               <span className="w-2 h-6 bg-blue-500 rounded-full"></span> 
               Contact Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                icon={<FiPhone />} 
                label="Phone Number" 
                type="text" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                placeholder="Enter phone"
              />
              <InputGroup 
                icon={<FiMapPin />} 
                label="Address" 
                type="text" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)} 
                placeholder="Enter address"
              />
            </div>
          </div>

          {/* Security Tile - Now with two columns for passwords */}
          <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-700 mb-6 flex items-center gap-2">
               <span className="w-2 h-6 bg-indigo-500 rounded-full"></span> 
               Security & Access
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InputGroup 
                icon={<FiLock />} 
                label="New Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Leave blank to keep current"
              />
              <InputGroup 
                icon={<FiLock />} 
                label="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                placeholder="Re-type new password"
              />
            </div>
          </div>

          {/* Save Changes Tile */}
          <button
            onClick={updateUser}
            disabled={isUpdating}
            className={`md:col-span-1 p-8 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all
              ${isUpdating 
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95"}`}
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            ) : (
              <>
                <FiCheckCircle size={40} className="opacity-50" />
                <span className="text-xl font-bold uppercase tracking-wide">Save Now</span>
              </>
            )}
          </button>

        </div>
      </div>
    </div>
  );
}

function InputGroup({ icon, label, type, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
          {icon}
        </div>
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:bg-white focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-slate-300 font-medium text-slate-600"
        />
      </div>
    </div>
  );
}