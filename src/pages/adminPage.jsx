import { FaBoxArchive, FaArrowRightFromBracket } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { IoPeople, IoShieldCheckmark } from "react-icons/io5";
import { Link, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import ProductAdminPage from "./productsAdminPage";
import AddProduct from "./addProduct";
import UpdateProduct from "./updateProduct";
import OrderAdminPage from "./orderPageAdmin";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import axios from "axios";
import toast from "react-hot-toast";
import UserInfo from "./userInfo";
import ReviewAdmin from "./reviewAdminPage";
import { MdRateReview } from "react-icons/md";
import NotFound from "./notFoundPage";

export default function AdminPage() {
    const navigate = useNavigate();
    const location = useLocation(); // To detect active route
    const [adminValidated, setAdminValidated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token == null) {
            toast.error("You are not logged in");
            navigate("/login");
        } else {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                if (response.data.role == "admin") {
                    setAdminValidated(true);
                } else {
                    toast.error("You are not authorized");
                    navigate("/login");
                }
            }).catch((err) => {
                toast.error("Login expired or invalid token");
                navigate("/login");
            });
        }
    }, []);

    // Helper to determine active link styling
    const isActive = (path) => location.pathname === path;

    return (
        <div className="w-full h-screen flex bg-slate-50 overflow-hidden font-sans">
            {adminValidated ? (
                <>
                    {/* --- SIDEBAR --- */}
                    <div className="w-[280px] h-full bg-white border-r border-slate-200 flex flex-col shadow-sm z-10">
                        {/* Logo / Title Area */}
                        <div className="p-8 flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <IoShieldCheckmark size={24} />
                            </div>
                            <span className="text-xl font-black text-slate-800 tracking-tight">Admin Portal</span>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 px-4 space-y-2 mt-4">
                            <Link 
                                to="/admin/" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${
                                    isActive("/admin/") 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <IoPeople size={22} className={isActive("/admin/") ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                                Users
                            </Link>

                            <Link 
                                to="/admin/products" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${
                                    isActive("/admin/products") 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <FaBoxArchive size={20} className={isActive("/admin/products") ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                                Products
                            </Link>

                            <Link 
                                to="/admin/order" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${
                                    isActive("/admin/order") 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <GiShoppingBag size={22} className={isActive("/admin/order") ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                                Orders
                            </Link>

                            <Link 
                                to="/admin/reviewAdmin" 
                                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl font-bold transition-all duration-200 group ${
                                    isActive("/admin/reviewAdmin") 
                                    ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <MdRateReview size={22} className={isActive("/admin/reviewAdmin") ? "text-white" : "text-slate-400 group-hover:text-blue-600"} />
                                Review
                            </Link>
                        </nav>

                        {/* Footer / Logout Button */}
                        <div className="p-6 border-t border-slate-100">
                            <button 
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    navigate("/login");
                                    toast.success("Logged out successfully");
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-bold hover:bg-red-50 transition-colors"
                            >
                                <FaArrowRightFromBracket />
                                Logout
                            </button>
                        </div>
                    </div>

                    {/* --- CONTENT AREA --- */}
                    <main className="flex-1 h-full overflow-y-auto bg-slate-50">
                        {/* Inner Container for padding and max-width */}
                        <div className="p-8">
                            <Routes>
                                <Route path="/" element={<UserInfo />} />
                                <Route path="/products" element={<ProductAdminPage />} />
                                <Route path="/order" element={<OrderAdminPage />} />
                                <Route path="/newProduct" element={<AddProduct />} />
                                <Route path="/updateProduct" element={<UpdateProduct />} />
                                <Route path="/reviewAdmin" element={<ReviewAdmin/>}/>
                                <Route path="/*" element={<NotFound/>}/>
                            </Routes>
                        </div>
                    </main>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center bg-white">
                    <Loader />
                </div>
            )}
        </div>
    );
}