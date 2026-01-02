import { useState } from "react"
import { addToCart, getCart, getTotal } from "../../utils/cart"
import { TbTrash, TbShoppingCartOff, TbArrowLeft } from "react-icons/tb"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

export default function CartPage() {
    const [cart, setCart] = useState(getCart())
    const navigate = useNavigate()

    const updateCart = (item, amount) => {
        addToCart(item, amount)
        setCart(getCart())
    }

    const handleCheckout = () => {
        if (cart.length === 0) {
            toast.error("Your cart is empty!")
        } else {
            navigate("/checkout", { state: { items: cart, fromCart: true } })
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[120px] pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
                    Your Shopping Cart <span className="text-lg font-normal text-gray-400">({cart.length} items)</span>
                </h1>

                {cart.length === 0 ? (
                    /* --- Empty State --- */
                    <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100 flex flex-col items-center">
                        <div className="bg-gray-50 p-6 rounded-full mb-6">
                            <TbShoppingCartOff size={80} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is feeling lonely</h2>
                        <p className="text-gray-500 mb-8">Add some amazing products to your cart and start shopping!</p>
                        <button 
                            onClick={() => navigate("/products")}
                            className="flex items-center gap-2 bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                        >
                            <TbArrowLeft /> Browse Products
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                        
                        {/* --- Items List --- */}
                        <div className="lg:col-span-2 space-y-4">
                            {cart.map((item) => (
                                <div key={item.productId} className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative group transition-all hover:shadow-md">
                                    <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-gray-50">
                                        <img src={item.image} className="w-full h-full object-cover" alt={item.name} />
                                    </div>

                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-lg font-bold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-blue-600 font-bold">
                                            LKR {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                                        <button 
                                            className="w-10 h-10 flex justify-center items-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-30" 
                                            onClick={() => updateCart(item, -1)}
                                            disabled={item.quantity <= 1}
                                        >-</button>
                                        <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                                        <button 
                                            className="w-10 h-10 flex justify-center items-center rounded-xl bg-white shadow-sm text-gray-600 hover:text-blue-600 transition-colors" 
                                            onClick={() => updateCart(item, 1)}
                                        >+</button>
                                    </div>

                                    <div className="text-right hidden md:block pr-4">
                                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Subtotal</p>
                                        <p className="text-xl font-black text-gray-800">
                                            {(item.quantity * item.price).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Remove Button */}
                                    <button 
                                        onClick={() => updateCart(item, -item.quantity)}
                                        className="absolute -top-2 -right-2 md:top-auto md:-right-4 bg-white md:opacity-0 group-hover:opacity-100 p-2.5 text-red-500 rounded-full shadow-lg border border-red-50 transition-all hover:bg-red-50"
                                    >
                                        <TbTrash size={22} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* --- Summary Sidebar --- */}
                        <div className="lg:col-span-1 sticky top-[120px]">
                            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-gray-500">
                                        <span>Items ({cart.length})</span>
                                        <span>LKR {getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-500">
                                        <span>Shipping</span>
                                        <span className="text-green-500 font-medium">Free</span>
                                    </div>
                                    <div className="border-t border-gray-50 pt-4 flex justify-between items-end">
                                        <span className="font-bold text-gray-800">Total</span>
                                        <div className="text-right">
                                            <p className="text-2xl font-black text-blue-600">
                                                LKR {getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleCheckout}
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98]"
                                >
                                    Proceed to Checkout
                                </button>

                                <p className="text-center text-gray-400 text-xs mt-6 flex items-center justify-center gap-2">
                                    🔒 Secure Checkout Guaranteed
                                </p>
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    )
}