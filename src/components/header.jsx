import { BiCart } from "react-icons/bi";
import { Link } from "react-router-dom";

export default function Header(){
    return(
        <header className="h-[100px] bg-accent flex justify-center items-center relative">
            <Link to="/" className="text-white text-2xl">Home</Link>
            <Link to="/products" className="text-white text-xl ml-4">Products</Link>
            <Link to="/review" className="text-white text-xl ml-4">Review</Link>
            <Link to="/about" className="text-white text-xl ml-4">About-us</Link>
            <Link to="/contact" className="text-white text-xl ml-4">Contact-Us</Link>
            <Link to="/cart" className="absolute right-[80px]"><BiCart className="text-white text-2xl ml-4"/></Link>
        </header>
    )
}