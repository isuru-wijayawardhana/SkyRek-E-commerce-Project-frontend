import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../components/loader";
import { TbPackage, TbTruckDelivery, TbCheckupList, TbClock } from "react-icons/tb";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        const res = await axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders/get-user-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [navigate]);

  // Helper to get status color
  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default: return "bg-amber-100 text-amber-700"; // Pending
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50 pt-[120px] pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
            <TbPackage size={30} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Order History</h1>
            <p className="text-slate-500 font-medium">Manage and track your recent purchases</p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100">
            <p className="text-slate-400 text-lg italic">You haven't placed any orders yet.</p>
            <button onClick={() => navigate("/products")} className="mt-6 text-blue-600 font-bold underline">Start Shopping</button>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
                
                {/* Order Header */}
                <div className="bg-slate-50 px-8 py-6 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-mono text-sm text-slate-700 font-bold">#{order.orderId || order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Date Placed</p>
                      <p className="text-sm text-slate-700 font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-tighter ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-8">
                  <div className="space-y-6">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-6 group">
                        <img 
                          src={item.image || "https://via.placeholder.com/100"} 
                          className="w-20 h-20 rounded-2xl object-cover ring-1 ring-slate-100 group-hover:scale-105 transition-transform" 
                          alt={item.name} 
                        />
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg">{item.name}</h4>
                          <p className="text-slate-400 text-sm font-medium">Quantity: {item.qty}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-slate-900 text-xl">LKR {(item.price * item.qty).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-500 italic text-sm">
                      <TbTruckDelivery className="text-blue-500" />
                      Delivering to: <span className="font-bold text-slate-700">{order.address}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 font-bold uppercase text-xs mr-4">Total Paid</span>
                      <span className="text-3xl font-black text-blue-600">LKR {order.total?.toLocaleString() || "Calculated at Shipping"}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}