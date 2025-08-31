import { FaBoxArchive } from "react-icons/fa6";
import { GiShoppingBag } from "react-icons/gi";
import { IoPeople, IoSettings } from "react-icons/io5";
import { Link, Route, Routes } from "react-router-dom";
import ProductAdminPage from "./productsAdminPage";
import AddProduct from "./addProduct";
import UpdateProduct from "./updateProduct";
import OrderAdminPage from "./orderPageAdmin";

export default function AdminPage(){
    return(
        <div className="w-full h-screen flex ">
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
        </div>
    )
}