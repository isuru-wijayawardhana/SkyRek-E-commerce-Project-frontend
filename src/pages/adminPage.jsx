import { Link, Route, Routes } from "react-router-dom";

export default function AdminPage(){
    return(
        <div className="w-full h-screen flex bg-red-500">
            <div className="w-[300px] h-full bg-white">
                <Link to="/admin/products">Product</Link>
            </div>
            <div className="w-[calc(100%-300px)] bg-blue-900 h-full">
                <Routes path="/*">
                    <Route path="/" element={<h1>Dashboard</h1>}/>
                    <Route path="/products" element={<h1>Product</h1>}/>
                    <Route path="/order" element={<h1>Orders</h1>}/>
                </Routes>
            </div>
        </div>
    )
}