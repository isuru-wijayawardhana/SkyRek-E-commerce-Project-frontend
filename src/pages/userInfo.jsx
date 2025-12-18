import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../components/paginator";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import { GrClear } from "react-icons/gr";
import { FaRegUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaTimes } from "react-icons/fa";

export default function UserInfo() {
    const [users, setUsers] = useState([]); // Changed "" to [] for better mapping safety
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [role, setRole] = useState(null);
    const [isBlock, setIsBlock] = useState("");
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickedUser, setClickedUser] = useState(null);

    useEffect(() => {
        if (loading) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/getuserinfo/${page}/${limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setUsers(res.data.users);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [loading, page, limit]);

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 p-4 rounded-xl shadow-inner relative">
            {loading ? <Loader /> : (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
                            <tr>
                                <th className="p-4 border-b">User</th>
                                <th className="p-4 border-b">Email</th>
                                <th className="p-4 border-b">Phone</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Verified</th>
                                <th className="p-4 border-b">Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-blue-50 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        setRole(user.role);
                                        setIsBlock(user.isBlock);
                                        setClickedUser(user);
                                        setPopupVisible(true);
                                    }}
                                >
                                    <td className="p-4 flex items-center gap-3">
                                        {user.image ? (
                                            <img src={user.image} alt="User" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                        ) : (
                                            <div className="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full text-gray-400">
                                                <FaRegUser />
                                            </div>
                                        )}
                                        <div className="font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                                    </td>
                                    <td className="p-4 text-gray-600 text-sm">{user.email}</td>
                                    <td className="p-4 text-gray-600 text-sm">{user.phone}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.isBlock === 'false' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {user.isBlock === 'true' ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.isEmailVerified ? <span className="text-green-500">✔</span> : <span className="text-red-400">✘</span>}
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm truncate max-w-[150px]">{user.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            

            {/* Modern Popup Overlay */}
            {popupVisible && clickedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                            <button 
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                                onClick={() => setPopupVisible(false)}
                            >
                                <FaTimes size={20} />
                            </button>
                            <div className="flex items-center gap-4">
                                <img src={clickedUser.image} className="w-20 h-20 rounded-2xl border-4 border-white/20 object-cover" alt="Profile" />
                                <div>
                                    <h2 className="text-2xl font-bold">{clickedUser.firstName} {clickedUser.lastName}</h2>
                                    <p className="opacity-80 flex items-center gap-2"><FaEnvelope size={12}/> {clickedUser.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Change Role</label>
                                    <select className="w-full p-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Account Status</label>
                                    <select className="w-full p-2 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                                            value={isBlock} onChange={(e) => setIsBlock(e.target.value)}>
                                        <option value="false">Active</option>
                                        <option value="true">Block Access</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaPhone className="text-blue-500" /> <span>{clickedUser.phone || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaMapMarkerAlt className="text-blue-500" /> <span>{clickedUser.address || "No address provided"}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <FaShieldAlt className="text-blue-500" /> <span>Email Verified: {clickedUser.isEmailVerified ? "Yes" : "No"}</span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                                        onClick={() => setPopupVisible(false)}>
                                    Cancel
                                </button>
                                {(role !== clickedUser.role || isBlock !== clickedUser.isBlock) && (
                                    <button 
                                        className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                        onClick={async () => {
                                            setPopupVisible(false);
                                            try {
                                                await axios.put(
                                                    `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user-admin/${clickedUser.email}`,
                                                    { role: role, isBlock: isBlock },
                                                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                                );
                                                toast.success("User updated successfully");
                                                setLoading(true);
                                            } catch (err) {
                                                console.log(err);
                                                toast.error("Failed to update User");
                                            }
                                        }}
                                    >
                                        Save Changes
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* Pagination Container */}
            <div className="mt-auto py-1 flex justify-center items-center">
                <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200">
                    <Paginator 
                        currentPage={page} 
                        totalPages={totalPages} 
                        setCurrentPage={setPage} 
                        limit={limit} 
                        setLimit={setLimit} 
                        setLoading={setLoading} 
                    />
                </div>
            </div>
        </div>
    );
}