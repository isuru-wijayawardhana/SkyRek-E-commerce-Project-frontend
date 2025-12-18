import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/meadiaUpload";
import { BiPlus, BiImageAdd, BiPackage, BiListUl, BiMoney, BiX } from "react-icons/bi";

export default function AddProduct() {
    const [productId, setProductId] = useState("");
    const [productName, setProductName] = useState("");
    const [alternativeNames, setAlternativeNames] = useState("");
    const [labelledPrice, setlabelPrice] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState("");
    const [stock, setStock] = useState("");
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("cream");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit() {
        if (!productId || !productName || !price) {
            return toast.error("Please fill in the essential fields");
        }

        setIsSubmitting(true);
        try {
            const promisesArray = [];
            for (let i = 0; i < image.length; i++) {
                promisesArray[i] = uploadFile(image[i]);
            }
            const responses = await Promise.all(promisesArray);

            const altNameInArray = alternativeNames.split(",");
            const productData = {
                productId,
                name: productName,
                altName: altNameInArray,
                labelledPrice,
                price,
                images: responses,
                description,
                stock,
                isAvailable,
                category
            };

            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/login");
                return;
            }

            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/products", productData, {
                headers: { Authorization: "Bearer " + token }
            });

            toast.success("Product Added Successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add product");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#f8fafc] flex flex-col items-center py-10 px-4">
            {/* Header */}
            <div className="w-full max-w-4xl mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Add New Product</h1>
                    <p className="text-slate-500 mt-1">Fill in the information below to add a new product to your store.</p>
                </div>
                <Link to="/admin/products" className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-600">
                    <BiX size={32} />
                </Link>
            </div>

            {/* Main Form Container */}
            <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Media Upload */}
                <div className="md:w-1/3 bg-slate-50 p-8 border-r border-slate-100">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                        <BiImageAdd size={18}/> Product Media
                    </h3>
                    
                    <div className="relative group border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                        <input 
                            type="file" 
                            multiple 
                            onChange={(e) => setImage(e.target.files)}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 text-blue-500">
                                <BiPlus size={32} />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Upload Images</p>
                            <p className="text-xs text-slate-400 mt-2">{image.length > 0 ? `${image.length} files selected` : "Drag and drop or click"}</p>
                        </div>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-xs font-bold text-slate-400 uppercase mb-2">Visibility</p>
                            <select 
                                value={isAvailable} 
                                onChange={(e) => setIsAvailable(e.target.value === 'true')}
                                className="w-full bg-transparent font-semibold text-slate-700 outline-none cursor-pointer"
                            >
                                <option value={true}>Public (Visible)</option>
                                <option value={false}>Private (Hidden)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Content */}
                <div className="md:w-2/3 p-8 lg:p-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Section 1: Basic Info */}
                        <div className="col-span-full">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <BiPackage size={18}/> Basic Information
                            </h3>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Product ID</label>
                            <input 
                                type="text" 
                                placeholder="e.g. SKU-102"
                                value={productId} 
                                onChange={(e) => setProductId(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Product Name</label>
                            <input 
                                type="text" 
                                placeholder="Formal Name"
                                value={productName} 
                                onChange={(e) => setProductName(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="col-span-full flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Alternative Names (Separated by commas)</label>
                            <input 
                                type="text" 
                                placeholder="Keywords for search..."
                                value={alternativeNames} 
                                onChange={(e) => setAlternativeNames(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        {/* Section 2: Pricing & Inventory */}
                        <div className="col-span-full mt-4">
                            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <BiMoney size={18}/> Pricing & Stock
                            </h3>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Labelled Price (LKR)</label>
                            <input 
                                type="number" 
                                value={labelledPrice} 
                                onChange={(e) => setlabelPrice(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Selling Price (LKR)</label>
                            <input 
                                type="number" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-bold text-blue-600"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Stock Quantity</label>
                            <input 
                                type="number" 
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-slate-600 ml-1">Category</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="w-full h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all cursor-pointer"
                            >
                                <option value="cream">Cream</option>
                                <option value="face wash">Face-wash</option>
                                <option value="soap">Soap</option>
                                <option value="fragrance">Fragrance</option>
                            </select>
                        </div>

                        <div className="col-span-full flex flex-col gap-1.5 mt-4">
                            <label className="text-xs font-bold text-slate-600 ml-1 flex items-center gap-1">
                                <BiListUl /> Product Description
                            </label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all min-h-[120px] resize-none"
                                placeholder="Describe the product details, benefits, and ingredients..."
                            />
                        </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="flex items-center gap-4 mt-12 pt-8 border-t border-slate-100">
                        <Link to="/admin/products" className="flex-1 h-14 rounded-2xl flex items-center justify-center font-bold text-slate-500 hover:bg-slate-100 transition-all">
                            Cancel
                        </Link>
                        <button 
                            onClick={handleSubmit} 
                            disabled={isSubmitting}
                            className={`flex-[2] h-14 rounded-2xl flex items-center justify-center font-bold text-white shadow-xl shadow-blue-200 transition-all active:scale-95 ${isSubmitting ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                        >
                            {isSubmitting ? "Uploading Product..." : "Confirm & Add Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}