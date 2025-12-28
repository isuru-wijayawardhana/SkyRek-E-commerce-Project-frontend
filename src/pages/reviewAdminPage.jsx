import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiPackage } from "react-icons/bi";
import Loader from "../components/loader";
import { FaTimes } from "react-icons/fa";

export default function ReviewAdmin() {
    const [review, setReview] = useState([]);
    const [isLoading, setIsLoding] = useState(true)
    const [clickedReview, setClickedReview] = useState(null)
    const [popupVisible,setPopupVisible] = useState(false)
    const [isShow,setIsShow] = useState("")

    useEffect(() => {
        if (isLoading) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/review/get-review", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                setReview(res.data);
                setIsLoding(false);
            });
        }
    }, [isLoading]);

    return (
        <div className="w-full h-full bg-gray-50 p-6 min-h-screen relative">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                        <BiPackage className="text-blue-600" /> Review
                    </h1>
                    <p className="text-sm text-gray-500">Manage Reviews</p>
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
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Review</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Stars</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {review.map((review, index) => (
                                    <tr key={index} className="hover:bg-gray-50/80 transition-colors group"
                                    onClick={()=>{
                                        setIsShow(review.isShow)
                                        setClickedReview(review)
                                        setPopupVisible(true)
                                    }}>

                                        {/* Details Column */}
                                        
                                        <td className="p-4 font-mono text-sm text-blue-600 font-semibold">#{review.reviewId}</td>
                                        <td className="p-4">
                                        <div className="text-sm font-medium text-gray-900">{review.name}</div>
                                        <div className="text-xs text-gray-500">{review.email}</div>
                                        </td>
                                        <td><div className="text-xs text-gray-500">{review.msg}</div></td>
                                        
                                        <td>
                                            <div className="text-xs text-gray-500">{review.stars}</div>
                                        </td>
                                        {/* Status Column */}
                                        <td className="p-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                review.isShow 
                                                ? 'bg-green-100 text-green-700 border-green-200' 
                                                : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                                {review.isShow ? "Show" : "Hidden"}
                                            </span>
                                        </td>


                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            {popupVisible && clickedReview && (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
        
        {/* Modal Box */}
        <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-xl overflow-hidden">
            
            {/* Header */}
            <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold">
                        Review <span className="text-blue-400">#{clickedReview.reviewId}</span>
                    </h2>
                    <p className="text-xs text-gray-400">{clickedReview.email}</p>
                </div>

                <button
                    onClick={() => setPopupVisible(false)}
                    className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition"
                >
                    <FaTimes />
                </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4 text-gray-700">
                <p><strong>Name:</strong> {clickedReview.name}</p>
                <p><strong>Message:</strong> {clickedReview.msg}</p>
                <p><strong>Stars:</strong> ⭐ {clickedReview.stars}</p>
                <div className="space-y-4">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Status
                                                    </label>
                                                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-700" 
                                                            value={isShow} onChange={(e) => setIsShow(e.target.value)}>
                                                        <option value="true">Show</option>
                                                        <option value="false">Hidden</option>
                                                    </select>
                                                </div>
            </div>
            {(isShow !== clickedReview.isShow )&& 
                <div className="mr-6">
                    <button className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                    onClick={async ()=>{
                        setPopupVisible(false)
                        try{
                            await axios.put(
                                `${import.meta.env.VITE_BACKEND_URL}/api/review/${clickedReview.reviewId}`,
                                {isShow : isShow},
                                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                
                            )
                            toast.success("Order updated successfully");
                            setIsLoding(true);
                        }catch(error){

                        }
                    }}>
                        Apply Updates
                    </button>
                </div>}
        </div>
    </div>
)}

        </div>
    );
}