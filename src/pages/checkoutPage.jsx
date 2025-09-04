import { useEffect, useState } from "react"
import { TbTrash } from "react-icons/tb"
import { useLocation, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import axios from "axios"

export default function CheckOut(){
    const location = useLocation()
    const navigate = useNavigate()
    const [user,setUser] = useState(null)
    const [name,setName] = useState("")
    const [address,setAddress] = useState("")
    const [phone,setPhone] = useState("")

    useEffect(()=>{
        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please login to checout")
            navigate("login")
            return
        }else{
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/",{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }).then(
                (res)=>{
                    setUser(res.data)
                    setName(res.data.firstName + " " + res.data.lastName)
                }
            ).catch(
                (err)=>{
                    console.error(err)
                    toast.error("Failed to fech user details")
                    navigate("/login")
                }
            )
        }
    },[])

    const [cart , setCart] = useState(location.state.items || [])
    if(location.state.items == null){
        toast.error("Please select item to checkout")
        navigate("/products")
    }

    function getTotal(){
        let total = 0
        cart.forEach((item)=>{
            total+= item.quantity*item.price
        })
        return total
    }

    async function placeOrder(){
        const token = localStorage.getItem("token")
        if(token == null){
            toast.error("Please login to place order")
            navigate("/login")
            return
        }
        if(name === "" || address=== ""|| phone === ""){
            toast.error("Please Fill the Feilds")
            return
        }

        const order ={
            address:address,
            phone:phone,
            items : []
        }
        cart.forEach((item)=>{
            order.items.push({
                productId:item.productId,
                qty:item.quantity
            })
        })
        try{
            await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/orders",order,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            })
            toast.success("Order Place successfully")
            navigate("/products")
        }catch(err){
            console.log(err)
            toast.error("Failed to place order")
            return
        }
    }

    return(
        <div className="max-w-[100vw] h-screen flex flex-col py-[40px] px-[10px] items-center">
            {
                cart.map((item ,index)=>{
                    return(
                        <div key={item.productId} className="w-full md:w-[800px] md:h-[100px] h-[250px] m-[10px] shadow-2xl flex flex-row items-center relative">
                            
                            {/* Image & Mobile info */}
                            <div className="md:w-[100px] w-[200px] flex flex-col justify-center items-center">
                                <img src={item.image} className="w-[100px] h-[100px] object-cover"/>
                                <div className="h-full flex-col justify-center pl-[10px] md:hidden flex">
                                    <span className="font-bold text-center md:text-left text-2xl md:text-md">{item.name}</span>
                                    <span className="font-semibold text-center">
                                        {item.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}
                                    </span>
                                </div>
                            </div>

                            {/* Desktop info */}
                            <div className="w-[320px] h-full flex-col justify-center pl-[10px] hidden md:flex">
                                <span className="font-bold text-center md:text-left">{item.name}</span>
                                <span className="font-semibold">
                                    {item.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}
                                </span>
                            </div>

                            {/* Quantity controls */}
                            <div className="w-[190px] h-full text-4xl md:text-md flex flex-row justify-center items-center ">
                                <button 
                                    className="w-[30px] flex justify-center items-center rounded-lg text-white bg-accent cursor-pointer hover:bg-blue-400"
                                    onClick={()=>{
                                        const newCart = [...cart]
                                        newCart[index].quantity -=1
                                        if(newCart[index].quantity<=0){
                                            newCart.splice(index,1)
                                        }
                                        setCart(newCart)
                                    }}
                                >-</button>
                                <span className="mx-[10px]">{item.quantity}</span>
                                <button 
                                    className="w-[30px] flex justify-center items-center rounded-lg text-white bg-accent cursor-pointer hover:bg-blue-400"
                                    onClick={()=>{
                                        const newCart = [...cart]
                                        newCart[index].quantity +=1
                                        setCart(newCart)
                                    }}
                                >+</button>
                            </div>

                            {/* Subtotal */}
                            <div className="w-[190px] h-full text-3xl md:text-md flex justify-end items-center pr-[10px]">
                                <span className="font-semibold">
                                    {(item.quantity * item.price).toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}
                                </span>
                            </div>

                            {/* Delete button */}
                            <button 
                                className="w-[30px] h-[30px] absolute top-[0px] right-[0px] md:top-[35px] md:right-[-40px] cursor-pointer bg-red-700 shadow rounded-full flex justify-center items-center text-white border-[2px] border-red-700 hover:bg-white hover:text-red-700"
                                onClick={()=>{
                                    const newCart = [...cart]
                                    newCart.splice(index,1)
                                    setCart(newCart)
                                }}
                            >
                                <TbTrash className="text-2xl"/>
                            </button>
                        </div>
                    )
                })
            }
            
            {/* Total & Place Order */}
            <div className="md:w-[800px] w-full h-[100px] m-[10px] p-[10px] shadow-2xl flex flex-row justify-end items-center relative">
                <span className="font-bold text-2xl mr=[20px]">
                    Total: {getTotal().toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}
                </span>
                <button 
                    className="absolute left-[10px] w-[150px] h-[50px] cursor-pointer rounded-2xl bg-accent border-[2px] border-accent text-white hover:bg-white hover:text-accent"
                    onClick={placeOrder}
                >
                    Place Order
                </button>
            </div>

            {/* User Info */}
            <div className="md:w-[800px] w-full m-[10px] p-[10px] shadow-2xl flex flex-col md:flex-row justify-center items-center gap-3">
                <input 
                    className="w-full md:w-[200px] h-[40px] border border-gray-300 rounded-lg p-[10px]"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input 
                    className="w-full md:w-[200px] h-[40px] border border-gray-300 rounded-lg p-[10px]"
                    type="text"
                    placeholder="Enter your address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <input 
                    className="w-full md:w-[200px] h-[40px] border border-gray-300 rounded-lg p-[10px]"
                    type="text"
                    placeholder="Enter your phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </div>
        </div>
    )
}
