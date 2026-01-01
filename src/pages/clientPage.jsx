import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import ProductPage from "./productPage";
import About from "./aboutUs"
import ProductOverViewPage from "./productOverView";
import CartPage from "./cart";
import CheckOut from "./checkoutPage";
import Contact from "./contact";
import HomePage from "./homePage";
import ReviewsPage from "./reviewPage";
import UserAccount from "./userAccount";
import NotFound from "./notFoundPage";
import UpdateUser from "./updateUser";

export default function ClientWebPage(){
    return(
        <div className="w-full h-screen max-h-screen ">
            <Header/>
            <div className="w-full h-[calc(100%-100px)]">
                <Routes path="/">
                    <Route path="/" element={<HomePage/>}/>
                    <Route path="/products" element={<ProductPage/>}/>
                    <Route path="/review" element={<ReviewsPage/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route path="/contact" element={<Contact/>}/>
                    <Route path="/overview/:productId" element={<ProductOverViewPage/>}/>
                    <Route path="/cart" element={<CartPage/>}/>
                    <Route path="/checkout" element={<CheckOut/>}/>
                    <Route path="/account" element={<UserAccount/>}/>
                    <Route path="/updateUser" element={<UpdateUser/>}/>
                    <Route path="/*" element={<NotFound/>}/>
                </Routes>
            </div>
        </div>
    )
}