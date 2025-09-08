import { FaBoxArchive } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { IoPeople, IoSettings } from "react-icons/io5";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import ProductAdminPage from "./productsAdminPage";
import AddProduct from "./addProduct";
import UpdateProduct from "./updateProduct";
import OrderAdminPage from "./orderPageAdmin";
import { useEffect, useState } from "react";
import Loader from "../components/loader";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminPage(){
    const navigate = useNavigate()
    const [adminValidated, setAdminValidated] = useState(false)
    useEffect(
            ()=>{
                const token = localStorage.getItem("token")
                if(token == null){
                    toast.error("You are not logged in")
                    navigate("/login")
                    
                }else{
                    axios.get(import.meta.env.VITE_BACKEND_URL+"/api/users/",{
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }).then((response)=>{
                        if(response.data.role == "admin"){
                            setAdminValidated(true)
                        }else{
                            toast.error("You are not authorized")
                            navigate("/login")
                        }
                    }).catch((err) => {
                        //console.error(err)
                        // handle network/token issues → avoid repeating same toast
                        toast.error("Login expired or invalid token")
                        navigate("/login")
    })
                }
            }
        ,[])
    return(
        <div className="w-full h-screen flex ">
            {adminValidated?<>
            <div className="w-[300px] h-full flex flex-col items-center">
                <span className="text-3xl font-bold my-5">Admin Panal</span>
                <Link className="flex flex-row h-[60px] w-full p-[20px] items-center text-xl gap-[25px]" to="/admin/products"><FaBoxArchive/>Product</Link>
                <Link className="flex flex-row h-[60px] w-full p-[20px] items-center text-xl gap-[25px]" to="/admin/order"><GiShoppingBag/>Order</Link>
                <Link className="flex flex-row h-[60px] w-full p-[20px] items-center text-xl gap-[25px]" to="/admin/"><IoPeople/>Users</Link>
                <Link className="flex flex-row h-[60px] w-full p-[20px] items-center text-xl gap-[25px]" to="/admin/settings"><IoSettings/>Settings</Link>

            </div>
            <div className="w-[calc(100%-300px)] h-full">
                <Routes path="/*">
                    <Route path="/" element={<h1>Users</h1>}/>
                    <Route path="/products" element={<ProductAdminPage/>}/>
                    <Route path="/order" element={<OrderAdminPage/>}/>
                    <Route path="/settings" element={<h1>Settings</h1>}/>
                    <Route path="/newProduct" element={<AddProduct/>}/>
                    <Route path="/updateProduct" element={<UpdateProduct/>}/>
                    
                </Routes>
            </div>
            </>:<Loader/>}
        </div>
    )
}