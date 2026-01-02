import { useEffect, useState } from "react"
import { TbTrash, TbTruckDelivery, TbShoppingBag } from "react-icons/tb"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import axios from "axios"

export default function CheckOut() {
    const location = useLocation()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [phone, setPhone] = useState("")
    const [cart, setCart] = useState(location.state?.items || [])

    useEffect(() => {
        if (!location.state?.items) {
            toast.error("Please select items to checkout")
            navigate("/products")
            return
        }

        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login to checkout")
            navigate("/login")
            return
        }

        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/get-user-details", {
            headers: { Authorization: `Bearer ${token}` },
        }).then((res) => {
            setUser(res.data)
            setName(res.data.firstName + " " + res.data.lastName)
            setAddress(res.data.address || "")
            setPhone(res.data.phone || "")
        }).catch((err) => {
            console.error(err)
            toast.error("Failed to fetch user details")
            navigate("/login")
        })
    }, [])

    function getTotal() {
        return cart.reduce((total, item) => total + (item.quantity * item.price), 0)
    }

    async function placeOrder() {
        const token = localStorage.getItem("token")
        if (!token) {
            toast.error("Please login to place order")
            navigate("/login")
            return
        }
        if (!name || !address || address === "NOT GIVEN" || !phone || phone === "NOT GIVEN") {
            toast.error("Please fill all shipping fields")
            return
        }
        
        const phoneRegex = /^(?:\+94|0)\d{9}$/;
        if (!phoneRegex.test(phone)) {
            toast.error("Please enter a valid Sri Lankan phone number")
            return
        }

        const order = {
            address: address,
            phone: phone,
            items: cart.map(item => ({
                productId: item.productId,
                qty: item.quantity
            }))
        }

        try {
            await axios.post(import.meta.env.VITE_BACKEND_URL + "/api/orders", order, {
                headers: { Authorization: `Bearer ${token}` },
            })
            //Only clear localStorage if we came from the Cart Page
            if (location.state?.fromCart) {
                localStorage.removeItem("cart");
                toast.success("Order placed and cart cleared!");
            } else {
                toast.success("Order placed successfully!");
            }

            navigate("/products");

        } catch (err) {
            console.log(err)
            toast.error("Failed to place order")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-[100px] pb-12 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                    <TbShoppingBag className="text-blue-600" /> Checkout
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* LEFT COLUMN: Item List */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-700">Review Items</h2>
                            {cart.length === 0 ? (
                                <p className="text-gray-400 italic">Your cart is empty</p>
                            ) : (
                                cart.map((item, index) => (
                                    <div key={item.productId} className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0 group">
                                        <img src={item.image} className="w-20 h-20 object-cover rounded-2xl shadow-sm" alt={item.name} />
                                        
                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800">{item.name}</h3>
                                            <p className="text-blue-600 font-semibold">
                                                LKR {item.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>

                                        <div className="flex items-center bg-gray-100 rounded-xl p-1">
                                            <button 
                                                className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-white transition-colors"
                                                onClick={() => {
                                                    const newCart = [...cart]
                                                    newCart[index].quantity -= 1
                                                    if (newCart[index].quantity <= 0) newCart.splice(index, 1)
                                                    setCart(newCart)
                                                }}
                                            >-</button>
                                            <span className="px-3 font-bold">{item.quantity}</span>
                                            <button 
                                                className="w-8 h-8 flex justify-center items-center rounded-lg hover:bg-white transition-colors"
                                                onClick={() => {
                                                    const newCart = [...cart]
                                                    newCart[index].quantity += 1
                                                    setCart(newCart)
                                                }}
                                            >+</button>
                                        </div>

                                        <button 
                                            onClick={() => {
                                                const newCart = [...cart];
                                                newCart.splice(index, 1);
                                                setCart(newCart);
                                            }}
                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <TbTrash size={20} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Shipping & Summary */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Shipping Details */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h2 className="text-xl font-bold mb-6 text-gray-700 flex items-center gap-2">
                                <TbTruckDelivery /> Shipping Details
                            </h2>
                            
                            <div className="space-y-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Recipient Name</label>
                                    <input 
                                        className="w-full h-[45px] bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="text"
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Delivery Address</label>
                                    <input 
                                        className="w-full h-[45px] bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="text"
                                        placeholder="No, Street, City"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Contact Number</label>
                                    <input 
                                        className="w-full h-[45px] bg-gray-50 border border-gray-100 rounded-xl px-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                        type="text"
                                        placeholder="+94 or 07..."
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-200 text-white">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                            <div className="flex justify-between mb-6 opacity-90">
                                <span>Subtotal</span>
                                <span className="font-bold">LKR {getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                            </div>
                            <div className="border-t border-white/20 pt-4 mb-6 flex justify-between items-end">
                                <span className="text-lg">Total Amount</span>
                                <span className="text-3xl font-black">
                                    LKR {getTotal().toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <button 
                                onClick={placeOrder}
                                className="w-full bg-white text-blue-600 py-4 rounded-2xl font-bold text-lg hover:bg-gray-100 active:scale-[0.98] transition-all"
                            >
                                Confirm & Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}