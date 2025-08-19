import { Route, Routes } from "react-router-dom";
import Header from "../components/header";

export default function ClientWebPage(){
    return(
        <div className="w-full h-screen max-h-screen ">
            <Header/>
            <div className="w-full h-[calc(100%-100px)] bg-amber-200">
                <Routes path="/">
                    <Route path="/" element={<h1 className="text-3xl text-center">Welcome to Home page</h1>}/>
                    <Route path="/products" element={<h1 className="text-3xl text-center">Product</h1>}/>
                    <Route path="/review" element={<h1 className="text-3xl text-center">Review</h1>}/>
                    <Route path="/about" element={<h1 className="text-3xl text-center">About us</h1>}/>
                    <Route path="/contact" element={<h1 className="text-3xl text-center">contact us</h1>}/>
                    <Route path="/*" element={<h1 className="text-3xl text-center">404 not found</h1>}/>
                </Routes>
            </div>
        </div>
    )
}