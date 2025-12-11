import { useEffect, useState } from "react";
import { BiCart, BiStore } from "react-icons/bi";
import { FcAbout, FcContacts } from "react-icons/fc";
import { GiHamburgerMenu } from "react-icons/gi";
import { HiHome } from "react-icons/hi";
import { MdReviews } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiLogIn, FiLogOut } from "react-icons/fi";


export default function Header(){
    const navigate = useNavigate()
    const [isOpen,setIsOpen] = useState(false)
    const [loginStatus,setLoginStatus] = useState()

    useEffect(()=>{
        const value=localStorage.getItem("token")
        if(value==null){
            setLoginStatus(false)
        }else{
            setLoginStatus(true)
        }
    },[])

    function logOut() {

    localStorage.removeItem("token");
    localStorage.removeItem("cart");
    setLoginStatus(false);
    toast.success("LogOut Successful");
    }

    return(
        
        <header className="fixed h-[100px] bg-accent flex justify-center items-center w-full">
                {isOpen &&
                    <div className="fixed z-[100] w-[100vw] h-[100vh] top-0 right-0 bg-[#00000050]">
                        <div className="h-full w-[350px] bg-primary">
                            <div className="w-full bg-accent h-[100px] flex pl-[45px] flex-row items-center gap-[20px]">
                                <GiHamburgerMenu className="text-white text-4xl md:hidden "
                                onClick={()=>{setIsOpen(false)}}/>
                                <img className="w-[200px] h-[100px] object-cover cursor-pointer" src="/Logo.png" alt="logo" 
                                onClick={()=>{navigate("/")}}/>
                            </div>
                            <div className="w-full flex flex-col p-[45px] items-start ">
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/")
                                }}>
                                    <HiHome className="text-accent text-2xl mr-2"/>
                                    Home
                                </button>
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/products")
                                }}>
                                    <BiStore className="text-accent text-2xl mr-2"/>
                                    products
                                </button>
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/cart")
                                }}>
                                    <BiCart className="text-accent text-2xl mr-2"/>
                                    cart
                                </button>
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/contact")
                                }}>
                                    <FcContacts className="text-accent text-2xl mr-2"/>
                                    contact
                                </button>
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/review")
                                }}>
                                    <MdReviews className="text-accent text-2xl mr-2"/>
                                    review
                                </button>
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/about")
                                }}>
                                    <FcAbout className="text-accent text-2xl mr-2"/>
                                    about
                                </button>
                                {!loginStatus &&
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    navigate("/login")
                                }}>
                                    <FiLogIn className="text-accent text-2xl mr-2"/>
                                    Login
                                </button>
                                }
                                {loginStatus &&
                                <button className="text-accent text-2xl flex flex-row items-center" 
                                onClick={()=>{
                                    setIsOpen(false)
                                    logOut()
                                }}>
                                    <FiLogOut className="text-accent text-2xl mr-2"/>
                                    Logout
                                </button>
                                }
                            </div>

                        </div>

                    </div>
                }
                <img className="w-[200px] h-[100px] object-cover absolute md:left-[40px] cursor-pointer" src="/Logo.png" alt="logo" 
                onClick={()=>{navigate("/")}}/>
                <GiHamburgerMenu className="text-white text-4xl absolute md:hidden left-[40px]" 
                onClick={()=>setIsOpen(true)}/>
                <div className=" hidden w-full md:flex justify-center items-center ">
                    <Link to="/" className="text-white text-2xl">Home</Link>
                    <Link to="/products" className="text-white text-xl ml-4">Products</Link>
                    <Link to="/review" className="text-white text-xl ml-4">Review</Link>
                    <Link to="/about" className="text-white text-xl ml-4">About-us</Link>
                    <Link to="/contact" className="text-white text-xl ml-4">Contact-Us</Link>
                    <div className="absolute right-[80px] text-white flex gap-7 items-center justify-center ">
                    {loginStatus&& 
                    <button className="text-xl cursor-pointer" onClick={logOut}>LogOut</button>
                    }
                    {!loginStatus&&
                    <Link to="/login" className="text-xl">Login</Link>
                    } 
                    <Link to="/cart"><BiCart className="text-white text-3xl"/></Link>
                    </div> 
            </div>
            
        </header>
    )
}