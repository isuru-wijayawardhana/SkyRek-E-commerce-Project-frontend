import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/meadiaUpload";
import { BiArrowBack, BiCloudUpload, BiPackage, BiInfoCircle } from "react-icons/bi";

export default function UpdateProduct() {
    const location = useLocation();
    const navigate = useNavigate();

    const [productId, setProductId] = useState(location.state.productId);
    const [productName, setProductName] = useState(location.state.name);
    const [alternativeNames, setAlternativeNames] = useState(location.state.altName.join(","));
    const [labelledPrice, setlabelPrice] = useState(location.state.labelledPrice);
    const [price, setPrice] = useState(location.state.price);
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState(location.state.description);
    const [stock, setStock] = useState(location.state.stock);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleSubmit() {
        setIsUpdating(true);
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
                images: responses.length === 0 ? location.state.images : responses,
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

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/products/${productId}`, productData, {
                headers: { Authorization: "Bearer " + token }
            });

            toast.success("Product Updated Successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update product");
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 p-6 flex flex-col items-center">
            {/* Header Area */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-8">
                <button 
                    onClick={() => navigate("/admin/products")} 
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    <BiArrowBack size={20} /> Back to Products
                </button>
                <div className="text-right">
                    <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-sm text-gray-500 font-mono">ID: {productId}</p>
                </div>
            </div>

            {/* Main Form Card */}
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col md:flex-row">
                
                {/* Left Side: Product Preview/Media */}
                <div className="md:w-1/3 bg-gray-900 p-8 text-white flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-6 opacity-80 uppercase tracking-widest text-xs font-bold">
                            <BiPackage size={18} /> Current Status
                        </div>
                        <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase mb-4 ${isAvailable ? "bg-green-500" : "bg-red-500"}`}>
                            {isAvailable ? "Active" : "Hidden"}
                        </div>
                        <h2 className="text-xl font-bold mb-2 truncate">{productName}</h2>
                        <p className="text-gray-400 text-sm line-clamp-3">{description}</p>
                    </div>

                    <div className="mt-8">
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-3">Upload New Images</label>
                        <div className="relative group cursor-pointer border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-blue-500 transition-all">
                            <input 
                                type="file" 
                                multiple 
                                onChange={(e) => setImage(e.target.files)} 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <BiCloudUpload size={32} className="mx-auto mb-2 text-gray-500 group-hover:text-blue-400" />
                            <p className="text-xs text-gray-400 group-hover:text-blue-300">
                                {image.length > 0 ? `${image.length} files selected` : "Drag or Click to replace images"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Fields */}
                <div className="md:w-2/3 p-8 lg:p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Basic Info */}
                        <div className="col-span-full border-b pb-2 mb-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                <BiInfoCircle /> General Information
                            </h3>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Product Name</label>
                            <input 
                                type="text" 
                                value={productName} 
                                onChange={(e) => setProductName(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Alternative Names (Comma separated)</label>
                            <input 
                                type="text" 
                                value={alternativeNames} 
                                onChange={(e) => setAlternativeNames(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Inventory & Category */}
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Category</label>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="cream">Cream</option>
                                <option value="face wash">Face-wash</option>
                                <option value="soap">Soap</option>
                                <option value="fragrance">Fragrance</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Stock Level</label>
                            <input 
                                type="number" 
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Pricing */}
                        <div className="col-span-full border-b pb-2 mt-4 mb-2">
                            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                Pricing & Availability
                            </h3>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Labelled Price (LKR)</label>
                            <input 
                                type="number" 
                                value={labelledPrice} 
                                onChange={(e) => setlabelPrice(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Selling Price (LKR)</label>
                            <input 
                                type="number" 
                                value={price} 
                                onChange={(e) => setPrice(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Visibility Status</label>
                            <select 
                                value={isAvailable} 
                                onChange={(e) => setIsAvailable(e.target.value === "true")} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value={true}>Available (Visible to Customers)</option>
                                <option value={false}>Not Available (Hidden)</option>
                            </select>
                        </div>

                        <div className="col-span-full">
                            <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Description</label>
                            <textarea 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 h-32 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            ></textarea>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row gap-4 mt-10">
                        <Link
                            to={"/admin/products"}
                            className="flex-1 h-14 bg-white text-gray-700 rounded-xl flex justify-center items-center border-2 border-gray-200 font-bold hover:bg-gray-50 transition-all"
                        >
                            Discard Changes
                        </Link>
                        <button 
                            disabled={isUpdating}
                            onClick={handleSubmit} 
                            className={`flex-[2] h-14 rounded-xl flex justify-center items-center font-bold text-white shadow-lg transition-all active:scale-95 ${isUpdating ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"}`}
                        >
                            {isUpdating ? "Processing..." : "Update Product"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}