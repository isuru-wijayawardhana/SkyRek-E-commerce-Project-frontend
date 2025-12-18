import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiEdit, BiTrash, BiPackage, BiCategory, BiTag } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/loader";

export default function ProductAdminPage() {
    const [products, setProduct] = useState([]);
    const [isLoading, setIsLoding] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoading) {
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products", {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then((res) => {
                setProduct(res.data);
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
                        <BiPackage className="text-blue-600" /> Product Inventory
                    </h1>
                    <p className="text-sm text-gray-500">Manage your catalog, stock, and pricing</p>
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
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Details</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Pricing</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Inventory</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {products.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50/80 transition-colors group">
                                        {/* Product Column */}
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
                                                    <img 
                                                        src={product.images[0]} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-800 text-sm">{product.name}</div>
                                                    <div className="text-[10px] font-mono text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded inline-block mt-1 uppercase">
                                                        {product.productId}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Details Column */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                                                    <BiCategory className="text-gray-400" /> {product.category}
                                                </div>
                                                <div className="text-xs text-gray-400 italic line-clamp-1 max-w-[200px]">
                                                    {product.description}
                                                </div>
                                            </div>
                                        </td>

                                        {/* Pricing Column */}
                                        <td className="p-4">
                                            <div className="text-sm font-bold text-gray-800">{product.price.toLocaleString()} LKR</div>
                                            <div className="text-[10px] text-gray-400 line-through">{product.labelledPrice.toLocaleString()} LKR</div>
                                        </td>

                                        {/* Inventory Column */}
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className={`text-xs font-bold ${product.stock < 10 ? 'text-orange-500' : 'text-gray-600'}`}>
                                                    {product.stock} in stock
                                                </span>
                                                <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full ${product.stock < 10 ? 'bg-orange-400' : 'bg-green-400'}`} 
                                                        style={{ width: `${Math.min(product.stock, 100)}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Status Column */}
                                        <td className="p-4 text-sm">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                                product.isAvailable 
                                                ? 'bg-green-100 text-green-700 border-green-200' 
                                                : 'bg-red-100 text-red-700 border-red-200'
                                            }`}>
                                                {product.isAvailable ? "Available" : "Hidden"}
                                            </span>
                                        </td>

                                        {/* Actions Column */}
                                        <td className="p-4">
                                            <div className="flex justify-center items-center gap-3">
                                                <button 
                                                    onClick={() => navigate("/admin/updateProduct", { state: product })}
                                                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                                    title="Edit Product"
                                                >
                                                    <BiEdit size={18} />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        const token = localStorage.getItem("token");
                                                        if (!token) return navigate("/login");
                                                        
                                                        axios.delete(import.meta.env.VITE_BACKEND_URL + "/api/products/" + product.productId, {
                                                            headers: { Authorization: `Bearer ${token}` }
                                                        }).then(() => {
                                                            toast.success("Product deleted successfully");
                                                            setIsLoding(true);
                                                        }).catch(() => toast.error("Failed to delete product"));
                                                    }}
                                                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                    title="Delete Product"
                                                >
                                                    <BiTrash size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Floating Action Button */}
            <Link 
                to={"/admin/newProduct"} 
                className="fixed right-8 bottom-8 flex items-center gap-2 bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl hover:bg-green-700 hover:-translate-y-1 transition-all active:scale-95 group"
            >
                <PiPlusCircle className="text-2xl group-hover:rotate-90 transition-transform duration-300" />
                <span className="font-bold">Add New Product</span>
            </Link>
        </div>
    );
}