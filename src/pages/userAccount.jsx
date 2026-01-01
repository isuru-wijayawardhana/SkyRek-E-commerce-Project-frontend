import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiMail, FiPhone, FiMapPin, FiEdit3, FiUser } from "react-icons/fi"; // Optional: npm install react-icons

export default function UserAccount() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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
      const res = await axios.get(
        import.meta.env.VITE_BACKEND_URL + "/api/users/get-user-details",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to get user");
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-[100px] ">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Main Profile Tile */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6">
          <img src={user.image=="null" ? user.image : "https://cdn-icons-png.flaticon.com/512/149/149071.png"} className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-50" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{user.firstName} {user.lastName}</h1>
            <p className="text-blue-600 font-medium">Verified Account</p>
          </div>
        </div>

        {/* Action Tile */}
        <button onClick={() => navigate("/updateUser", { state: user })} className="text-xl font-semibold gap-2 cursor-pointer bg-blue-600 p-8 rounded-3xl shadow-lg flex flex-col justify-center items-center text-white">
          <div className="flex justify-center items-center gap-2"><FiEdit3 /> Edit Profile</div>
            
          
        </button>

        {/* Contact Details Tiles */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiMail />} label="Email" value={user.email} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiPhone />} label="Phone" value={user.phone || "None"} />
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <DetailItem icon={<FiMapPin />} label="Location" value={user.address || "None"} />
        </div>

      </div>
    </div>
  );
}

// Helper component for clean layout
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