import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiMessageDetail, BiUser, BiStar } from "react-icons/bi";
import Loader from "../components/loader";
import { FaTimes, FaStar } from "react-icons/fa";

export default function ReviewAdmin() {
    const [review, setReview] = useState([]);
    const [isLoading, setIsLoding] = useState(true);
    const [clickedReview, setClickedReview] = useState(null);
    const [popupVisible, setPopupVisible] = useState(false);
    const [isShow, setIsShow] = useState("");

    useEffect(() => {
        if (isLoading) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/review/get-review", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                setReview(res.data);
                setIsLoding(false);
            }).catch(() => setIsLoding(false));
        }
    }, [isLoading]);

    // Helper to render Star Emojis based on count
    const renderStars = (count) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < count ? "text-yellow-400" : "text-gray-200"}>
                ★
            </span>
        ));
    };

    return (
        <div className="w-full h-full bg-gray-50 p-6 min-h-screen relative">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BiMessageDetail className="text-blue-600" size={28} /> Customer Reviews
                    </h1>
                    <p className="text-sm text-gray-500">Moderate and manage public feedback</p>
                </div>
            </div>

            {isLoading ? (
                <Loader />
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Review ID</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Message</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Rating</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Visibility</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {review.map((item, index) => (
                                    <tr 
                                        key={index} 
                                        className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                        onClick={() => {
                                            setIsShow(item.isShow.toString()); // Ensure it's a string for the select
                                            setClickedReview(item);
                                            setPopupVisible(true);
                                        }}
                                    >
                                        <td className="p-4 font-mono text-sm text-blue-600 font-semibold">#{item.reviewId}</td>
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500">{item.email}</div>
                                        </td>
                                        <td className="p-4 max-w-xs">
                                            <div className="text-xs text-gray-600 truncate italic italic">"{item.msg}"</div>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center text-lg leading-none">
                                                {renderStars(item.stars)}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                item.isShow 
                                                ? 'bg-green-100 text-green-700 border-green-200' 
                                                : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                                {item.isShow ? "Published" : "Hidden"}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Modern Review Popup */}
            {popupVisible && clickedReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        
                        {/* Modal Header */}
                        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                    <BiStar size={24} />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold italic font-sans">Review Details</h2>
                                    <p className="text-xs text-gray-400">ID: #{clickedReview.reviewId}</p>
                                </div>
                            </div>
                            <button onClick={() => setPopupVisible(false)} className="hover:bg-white/10 p-2 rounded-full transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-8">
                            {/* Review Content Card */}
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="text-2xl">{renderStars(clickedReview.stars)}</div>
                                    <span className="text-sm font-bold text-gray-400">({clickedReview.stars}/5)</span>
                                </div>
                                <p className="text-gray-700 italic text-lg leading-relaxed mb-6 leading-relaxed">
                                    "{clickedReview.msg}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-gray-200 pt-4">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                        <BiUser size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-800">{clickedReview.name}</p>
                                        <p className="text-xs text-gray-500">{clickedReview.email}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Visibility Toggle */}
                            <div className="space-y-3 mb-8">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Display Settings
                                </label>
                                <select 
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-gray-700 appearance-none" 
                                    value={isShow} 
                                    onChange={(e) => setIsShow(e.target.value)}
                                >
                                    <option value="true">Show on Website</option>
                                    <option value="false">Hide from Website</option>
                                </select>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setPopupVisible(false)}
                                    className="flex-1 py-4 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                {isShow !== clickedReview.isShow.toString() && (
                                    <button 
                                        className="flex-[2] py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
                                        onClick={async () => {
                                            setPopupVisible(false);
                                            try {
                                                await axios.put(
                                                    `${import.meta.env.VITE_BACKEND_URL}/api/review/${clickedReview.reviewId}`,
                                                    { isShow: isShow === "true" },
                                                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                                );
                                                toast.success("Review visibility updated");
                                                setIsLoding(true);
                                            } catch (error) {
                                                toast.error("Failed to update review");
                                            }
                                        }}
                                    >
                                        Apply Updates
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}