import { useState } from "react"
import { addToCart, getCart, getTotal } from "../../utils/cart"
import { TbTrash } from "react-icons/tb"
import { useNavigate } from "react-router-dom"

export default function CartPage(){
    const [cart , setCart] = useState(getCart())
    const navigate = useNavigate()
    return(
        <div className="max-w-[100vw] h-screen flex flex-col py-[40px] px-[10px] items-center">
            {
                cart.map(
                    (item)=>{
                        return(
                            <div key={item.productId} className=" w-full md:w-[800px] md:h-[100px] h-[250px] m-[10px] shadow-2xl flex flex-row items-center relative">
                                <div className="md:w-[100px] w-[200px] justify-center items-center flex flex-col">
                                    <img src={item.image} className="w-[100px] h-[100px] object-cover"/>
                                    <div className=" h-full flex-col justify-center pl-[10px] md:hidden flex">
                                        <span className="font-bold text-center md:text-left text-2xl md:text-md">{item.name}</span>
                                        <span className="font-semibold text-center">{item.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>
                                    </div>
                                </div>
                                <div className="w-[320px] h-full flex-col justify-center pl-[10px] hidden md:flex">
                                        <span className="font-bold text-center md:text-left">{item.name}</span>
                                        <span className="font-semibold">{item.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>
                                </div>
                                <div className="w-[190px] h-full text-4xl md:text-md flex flex-row justify-center items-center ">
                                    <button className="w-[30px] flex justify-center items-center rounded-lg text-white bg-accent cursor-pointer hover:bg-blue-400" onClick={
                                        ()=>{
                                            addToCart(item,-1)
                                            setCart(getCart())
                                        }
                                    }>-</button>
                                    <span className="mx-[10px]">{item.quantity}</span>
                                    <button className="w-[30px] flex justify-center items-center rounded-lg text-white bg-accent cursor-pointer hover:bg-blue-400" onClick={
                                        ()=>{
                                            addToCart(item,1)
                                            setCart(getCart())
                                        }
                                    }>+</button>
                                </div>
                                <div className="w-[190px] h-full text-3xl md:text-md flex justify-end items-center pr-[10px]">
                                    <span className="font-semibold">{(item.quantity * item.price).toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>
                                </div>
                                <button className="w-[30px] h-[30px] absolute top-[0px] right-[0px] md:top-[35px] md:right-[-40px] cursor-pointer bg-red-700 shadow rounded-full flex justify-center items-center text-white border-[2px] border-red-700 hover:bg-white hover:text-red-700" onClick={
                                    ()=>{
                                        addToCart(item,-item.quantity)
                                        setCart(getCart())
                                    }
                                }>
                                    <TbTrash className="text-2xl"/></button>
                            </div>
                        )
                    }
                )
            }
            <div className="md:w-[800px] w-full h-[100px] m-[10px] p-[10px] shadow-2xl flex flex-row justify-end items-center relative">
                <span className="font-bold text-2xl mr=[20px]">
                    Total: {getTotal().toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}
                </span>
                <button className="absolute left-[10px] w-[150px] h-[50px] cursor-pointer rounded-2xl bg-accent border-[2px] border-accent text-white hover:bg-white hover:text-accent"
                onClick={
                    ()=>{
                        navigate("/checkout", { state: {items:cart}})
                    }
                }>
                    Checkout
                </button>
            </div>
        </div>
    )
}