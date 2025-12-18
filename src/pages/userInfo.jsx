import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../components/paginator";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import { GrClear } from "react-icons/gr";
import { FaRegUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaShieldAlt, FaTimes, FaUserShield } from "react-icons/fa";

export default function UserInfo() {
    const [users, setUsers] = useState([]);
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
        <div className="w-full h-full flex flex-col bg-gray-50 p-6 rounded-2xl shadow-inner relative min-h-screen">
            {/* Page Title */}
            <div className="mb-6 flex items-center gap-3">
                <div className="p-3 bg-blue-600 rounded-xl shadow-lg shadow-blue-200 text-white">
                    <FaUserShield size={20} />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
                    <p className="text-sm text-gray-500">View and manage user permissions and access</p>
                </div>
            </div>

            {loading ? <Loader /> : (
                <div className="overflow-x-auto bg-white rounded-2xl shadow-sm border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold tracking-wider">
                            <tr>
                                <th className="p-4 border-b">Member</th>
                                <th className="p-4 border-b">Contact Info</th>
                                <th className="p-4 border-b">Role</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Verified</th>
                                <th className="p-4 border-b">Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map((user, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-blue-50/50 transition-all cursor-pointer group"
                                    onClick={() => {
                                        setRole(user.role);
                                        setIsBlock(user.isBlock);
                                        setClickedUser(user);
                                        setPopupVisible(true);
                                    }}
                                >
                                    <td className="p-4 flex items-center gap-3">
                                        <div className="relative">
                                            {user.image ? (
                                                <img src={user.image} alt="User" className="w-11 h-11 rounded-full object-cover border-2 border-white shadow-sm" />
                                            ) : (
                                                <div className="w-11 h-11 flex items-center justify-center bg-gray-100 rounded-full text-gray-400 border-2 border-white shadow-sm">
                                                    <FaRegUser size={18} />
                                                </div>
                                            )}
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${user.isBlock === 'true' ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                        </div>
                                        <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {user.firstName} {user.lastName}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm text-gray-700 font-medium">{user.email}</div>
                                        <div className="text-xs text-gray-400">{user.phone}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${user.isBlock === 'false' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                            {user.isBlock === 'true' ? 'Blocked' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        {user.isEmailVerified ? 
                                            <div className="flex justify-center text-green-500 bg-green-50 w-8 h-8 items-center rounded-lg mx-auto"><FaShieldAlt size={14}/></div> : 
                                            <div className="flex justify-center text-gray-300 bg-gray-50 w-8 h-8 items-center rounded-lg mx-auto"><FaShieldAlt size={14}/></div>
                                        }
                                    </td>
                                    <td className="p-4 text-gray-500 text-sm truncate max-w-[180px]">{user.address}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Pagination Container */}
            <div className="mt-auto pt-8 flex justify-center items-center">
                <div className="bg-white px-6 py-2 rounded-full shadow-lg shadow-gray-200/50 border border-gray-100 transition-transform hover:scale-105">
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

            {/* Modern Popup Overlay */}
            {popupVisible && clickedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-300">
                        
                        {/* Profile Header */}
                        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 p-8 text-white relative">
                            <button 
                                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                                onClick={() => setPopupVisible(false)}
                            >
                                <FaTimes size={18} />
                            </button>
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-4">
                                    <img src={clickedUser.image} className="w-24 h-24 rounded-3xl border-4 border-white/20 object-cover shadow-xl" alt="Profile" />
                                    <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-lg text-[10px] font-bold uppercase shadow-lg ${clickedUser.isBlock === 'true' ? 'bg-red-500' : 'bg-green-500'}`}>
                                        {clickedUser.isBlock === 'true' ? 'Blocked' : 'Active'}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold">{clickedUser.firstName} {clickedUser.lastName}</h2>
                                <p className="text-blue-100/70 text-sm flex items-center justify-center gap-2 mt-1">
                                    <FaEnvelope size={12}/> {clickedUser.email}
                                </p>
                            </div>
                        </div>

                        {/* Control Panel */}
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Account Role</label>
                                    <select className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-semibold text-gray-700" 
                                            value={role} onChange={(e) => setRole(e.target.value)}>
                                        <option value="user">Standard User</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] ml-1">Access Control</label>
                                    <select className="w-full p-3 bg-gray-50 border-2 border-transparent focus:border-blue-500 rounded-xl outline-none transition-all font-semibold text-gray-700" 
                                            value={isBlock} onChange={(e) => setIsBlock(e.target.value)}>
                                        <option value="false">Grant Access</option>
                                        <option value="true">Restrict Access</option>
                                    </select>
                                </div>
                            </div>

                            {/* Contact Details Grid */}
                            <div className="grid grid-cols-1 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><FaPhone size={14}/></div>
                                    <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase">Phone</span><span className="font-semibold text-gray-700">{clickedUser.phone || "Not Set"}</span></div>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm"><FaMapMarkerAlt size={14}/></div>
                                    <div className="flex flex-col"><span className="text-[10px] font-bold text-gray-400 uppercase">Address</span><span className="font-semibold text-gray-700 truncate max-w-[300px]">{clickedUser.address || "No address on file"}</span></div>
                                </div>
                            </div>

                            {/* Save Button Logic */}
                            {(role !== clickedUser.role || isBlock !== clickedUser.isBlock) ? (
                                <button 
                                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                                    onClick={async () => {
                                        setPopupVisible(false);
                                        try {
                                            await axios.put(
                                                `${import.meta.env.VITE_BACKEND_URL}/api/users/update-user-admin/${clickedUser.email}`,
                                                { role: role, isBlock: isBlock },
                                                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                            );
                                            toast.success("Permissions updated successfully");
                                            setLoading(true);
                                        } catch (err) {
                                            toast.error("Update failed");
                                        }
                                    }}
                                >
                                    Confirm Changes
                                </button>
                            ) : (
                                <button className="w-full py-4 bg-gray-100 text-gray-400 rounded-2xl font-bold cursor-not-allowed">
                                    No Changes Detected
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}