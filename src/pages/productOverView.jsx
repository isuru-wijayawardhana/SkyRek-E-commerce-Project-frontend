import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate, useParams } from "react-router-dom"
import Loader from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart, getCart } from "../../utils/cart";
import { HiOutlineShoppingBag, HiLightningBolt } from "react-icons/hi";

export default function ProductOverViewPage() {
    const params = useParams()
    const [product, setProduct] = useState(null)
    const [status, setStatus] = useState("loading")
    const navigate = useNavigate()

    useEffect(() => {
        if (status === "loading") {
            axios.get(import.meta.env.VITE_BACKEND_URL + `/api/products/${params.productId}`).then(
                (res) => {
                    setProduct(res.data)
                    setStatus("success")
                }
            ).catch((error) => {
                setStatus("error")
            })
        }
    }, [status])

    return (
        <div className="min-h-screen bg-white pt-[80px]">
            {status === "loading" && <Loader />}

            {status === "success" && (
                <div className="max-w-7xl mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row gap-12">
                    
                    {/* 1. Mobile Title (Visible only on small screens) */}
                    <div className="md:hidden text-center mb-6">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                            Product Details
                        </span>
                        <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
                            {product.name}
                        </h1>
                        <div className="flex justify-center gap-2 mt-2">
                            {product.altName.map((name, i) => (
                                <span key={i} className="text-slate-400 text-sm italic">{name}{i !== product.altName.length - 1 && " |"}</span>
                            ))}
                        </div>
                    </div>

                    {/* 2. Left Side: Image Section */}
                    <div className="w-full md:w-1/2 flex flex-col justify-start">
                        <div className="sticky top-[100px] bg-slate-50 rounded-[2.5rem] p-4 md:p-8 overflow-hidden shadow-inner">
                            <ImageSlider images={product.images} />
                        </div>
                    </div>

                    {/* 3. Right Side: Info Section */}
                    <div className="w-full md:w-1/2 flex flex-col">
                        {/* Desktop Title */}
                        <div className="hidden md:block mb-8">
                            <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
                                Premium Quality
                            </span>
                            <h1 className="text-5xl font-black text-slate-900 mt-3 leading-tight">
                                {product.name}
                            </h1>
                            <p className="text-slate-400 text-lg mt-2 font-medium">
                                {product.altName.join(" • ")}
                            </p>
                        </div>

                        {/* Price Section */}
                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-8">
                            <div className="flex items-center gap-4">
                                {product.labelledPrice > product.price ? (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-3">
                                            <span className="text-4xl font-black text-slate-900">
                                                LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </span>
                                            <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                                                {Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100)}% OFF
                                            </span>
                                        </div>
                                        <span className="line-through text-slate-400 text-xl mt-1">
                                            LKR {product.labelledPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-4xl font-black text-slate-900">
                                        LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-10">
                            <h3 className="text-slate-900 font-bold text-lg mb-3">About this product</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {product.description}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                            <button 
                                onClick={() => navigate("/checkout", {
                                    state: {
                                        items: [{
                                            productId: product.productId,
                                            quantity: 1,
                                            name: product.name,
                                            image: product.images[0],
                                            price: product.price
                                        }]
                                    }
                                })}
                                className="flex-1 h-16 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-xl shadow-slate-200"
                            >
                                <HiLightningBolt className="text-yellow-400 text-xl" />
                                Buy Now
                            </button>

                            <button 
                                onClick={() => {
                                    addToCart(product, 1);
                                    toast.success("Added to cart!");
                                }}
                                className="flex-1 h-16 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 shadow-xl shadow-blue-100"
                            >
                                <HiOutlineShoppingBag className="text-xl" />
                                Add to Cart
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase">Secure Payment</p>
                            </div>
                            <div className="text-center border-x border-slate-100">
                                <p className="text-xs font-bold text-slate-400 uppercase">Fast Delivery</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase">Quality Verified</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {status === "error" && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center p-8 bg-red-50 rounded-3xl border border-red-100">
                        <h2 className="text-red-600 font-bold text-2xl">Product Not Found</h2>
                        <button onClick={() => navigate("/products")} className="mt-4 text-red-500 underline">Back to Shop</button>
                    </div>
                </div>
            )}
        </div>
    )
}