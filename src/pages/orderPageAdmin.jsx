import axios from "axios";
import { useEffect, useState } from "react";
import Paginator from "../components/paginator";
import Loader from "../components/loader";
import toast from "react-hot-toast";
import { FaBoxOpen, FaUser, FaCalendarAlt, FaMoneyBillWave, FaMapMarkerAlt, FaTimes, FaStickyNote } from "react-icons/fa";

export default function OrderAdminPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [limit, setLimit] = useState(10);
    const [popupVisible, setPopupVisible] = useState(false);
    const [clickedOrder, setClickedOrder] = useState(null);
    const [orderNotes, setOrderNotes] = useState("");
    const [orderStatus, setOrderStatus] = useState("pending");

    useEffect(() => {
        if (loading) {
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/${page}/${limit}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setOrders(res.data.orders);
                setTotalPages(res.data.totalPages);
                setLoading(false);
            }).catch((err) => {
                console.error(err);
                setLoading(false);
            });
        }
    }, [loading, page, limit]);

    // Status Badge Helper
    const getStatusStyle = (status) => {
        switch (status) {
            case "completed": return "bg-green-100 text-green-700 border-green-200";
            case "cancelled": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-yellow-100 text-yellow-700 border-yellow-200";
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-gray-50 p-6 rounded-2xl shadow-inner min-h-screen">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FaBoxOpen className="text-blue-600" /> Order Management
                </h1>
            </div>

            {loading ? <Loader /> : (
                <div className="overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-200">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
                            <tr>
                                <th className="p-4 border-b">Order ID</th>
                                <th className="p-4 border-b">Customer</th>
                                <th className="p-4 border-b">Status</th>
                                <th className="p-4 border-b">Date</th>
                                <th className="p-4 border-b text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order, index) => (
                                <tr 
                                    key={index} 
                                    className="hover:bg-blue-50/50 transition-colors cursor-pointer group"
                                    onClick={() => {
                                        setOrderNotes(order.notes);
                                        setOrderStatus(order.status);
                                        setClickedOrder(order);
                                        setPopupVisible(true);
                                    }}
                                >
                                    <td className="p-4 font-mono text-sm text-blue-600 font-semibold">#{order.orderId}</td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-900">{order.name}</div>
                                        <div className="text-xs text-gray-500">{order.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FaCalendarAlt className="text-gray-400" size={12}/>
                                            {new Date(order.date).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 text-right font-bold text-gray-800">
                                        {order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })} LKR
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Centered Paginator */}
            <div className="mt-auto py-8 flex justify-center">
                <div className="bg-white px-6 py-2 rounded-full shadow-md border border-gray-100">
                    <Paginator currentPage={page} totalPages={totalPages} setCurrentPage={setPage} limit={limit} setLimit={setLimit} setLoading={setLoading} />
                </div>
            </div>

            {/* Order Details Modal */}
            {popupVisible && clickedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200">
                        
                        {/* Modal Header */}
                        <div className="bg-gray-900 p-6 text-white flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    Order <span className="text-blue-400">#{clickedOrder.orderId}</span>
                                </h2>
                                <p className="text-xs text-gray-400 mt-1">{new Date(clickedOrder.date).toLocaleString()}</p>
                            </div>
                            <button onClick={() => setPopupVisible(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                                <FaTimes />
                            </button>
                        </div>

                        <div className="p-6 max-h-[75vh] overflow-y-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                {/* Status & Notes Section */}
                                <div className="space-y-4">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1 h-3 bg-blue-500 rounded-full"></div> Order Action
                                    </label>
                                    <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold text-gray-700" 
                                            value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)}>
                                        <option value="pending">Pending</option>
                                        <option value="completed">Completed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    
                                    <div className="relative">
                                        <FaStickyNote className="absolute top-3 left-3 text-gray-300" />
                                        <textarea 
                                            placeholder="Add internal notes here..."
                                            className="w-full h-24 p-3 pl-10 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                                            value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Customer Summary Card */}
                                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block mb-3">Customer Details</label>
                                    <div className="space-y-2 text-sm">
                                        <p className="flex items-center gap-2 text-gray-700"><FaUser className="text-blue-400" size={12}/> {clickedOrder.name}</p>
                                        <p className="flex items-center gap-2 text-gray-700"><FaMapMarkerAlt className="text-blue-400" size={12}/> {clickedOrder.address}</p>
                                        <p className="flex items-center gap-2 text-gray-700"><FaMoneyBillWave className="text-blue-400" size={12}/> {clickedOrder.phone}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Item List */}
                            <div className="mb-6">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-3">Order Items ({clickedOrder.items?.length})</label>
                                <div className="space-y-2">
                                    {clickedOrder.items?.map(item => (
                                        <div key={item._id} className="flex items-center bg-gray-50 rounded-xl p-3 border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-14 h-14 rounded-lg object-cover border border-white shadow-sm" />
                                            <div className="ml-4 flex-1">
                                                <p className="text-sm font-bold text-gray-800">{item.name}</p>
                                                <p className="text-xs text-gray-500 italic">Qty: {item.qty} × {item.price.toLocaleString()} LKR</p>
                                            </div>
                                            <p className="font-bold text-gray-700">{(item.price * item.qty).toLocaleString()} LKR</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Footer Summary */}
                            <div className="flex justify-between items-center p-4 bg-gray-900 rounded-2xl text-white">
                                <span className="text-gray-400 font-medium">Grand Total</span>
                                <span className="text-xl font-black text-blue-400">{clickedOrder.total.toLocaleString()} LKR</span>
                            </div>

                            {/* Action Buttons */}
                            {(orderStatus !== clickedOrder.status || orderNotes !== clickedOrder.notes) && (
                                <div className="mt-6">
                                    <button 
                                        className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
                                        onClick={async () => {
                                            setPopupVisible(false);
                                            try {
                                                await axios.put(
                                                    `${import.meta.env.VITE_BACKEND_URL}/api/orders/${clickedOrder.orderId}`,
                                                    { status: orderStatus, notes: orderNotes },
                                                    { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
                                                );
                                                toast.success("Order updated successfully");
                                                setLoading(true);
                                            } catch (err) {
                                                toast.error("Failed to update order");
                                            }
                                        }}
                                    >
                                        Apply Updates & Notify Customer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}