import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./productPage";
import About from "./aboutUs"
import ProductOverViewPage from "./productOverView";
import CartPage from "./cart";
import CheckOut from "./checkoutPage";
import Contact from "./contact";

export default function ClientWebPage(){
    return(
        <div className="w-full h-screen max-h-screen ">
            <Header/>
            <div className="w-full h-[calc(100%-100px)]">
                <Routes path="/">
                    <Route path="/" element={<h1 className="text-3xl text-center">Welcome to Home page</h1>}/>
                    <Route path="/products" element={<ProductPage/>}/>
                    <Route path="/review" element={<h1 className="text-3xl text-center">Review</h1>}/>
                    <Route path="/about" element={<h1 className="text-3xl text-center"><About/></h1>}/>
                    <Route path="/contact" element={<h1 className="text-3xl text-center"><Contact/></h1>}/>
                    <Route path="/overview/:productId" element={<ProductOverViewPage/>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/checkout" element={<CheckOut/>}/>
                    <Route path="/*" element={<h1 className="text-3xl text-center">404 not found</h1>}/>
                </Routes>
            </div>
        </div>
    )
}