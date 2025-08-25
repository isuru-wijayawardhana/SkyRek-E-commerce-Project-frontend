import axios from "axios"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router-dom"
import Loader from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart, getCart } from "../../utils/cart";

export default function ProductOverViewPage(){
    const params = useParams()
    const [product,setProduct] = useState(null)
    const [status,setStatus] = useState("loading") //loading,success,error
    useEffect(
        ()=>{
            if(status === "loading"){
                axios.get(import.meta.env.VITE_BACKEND_URL+`/api/products/${params.productId}`).then(
                    (res)=>{
                        setProduct(res.data)
                        setStatus("success")
                    }
                ).catch(
                    (error)=>{
                        setStatus("error")
                    }
                )
            }
        },[status]
    )
    return(
        <div className="w-full h-full">
            {
                status == "loading" && <Loader/>
            }
            {
                status == "success" && <div className="w-full h-full flex flex-row">
                    <div className="w-[49%] h-full flex flex-col justify-center items-center">
                        <ImageSlider images={product.images}/>
                    </div>
                    <div className="w-[49%] h-full flex flex-col items-center pt-[50px]">
                        <h1 className="text-2xl font-bold">{product.name} <span className="font-light">{product.altName.join("|")}</span></h1>
                        <p className="text-lg mt-[20px]">{product.description}</p>
                        <div className="w-full flex flex-col items-center mt-[20px]">
                            {
                                product.labelledPrice > product.price ? 
                                (<p>
                                    <span className="line-through mr-[10px] text-3xl font-semibold ">{product.labelledPrice.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>
                                    <span className="text-3xl font-bold">{product.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>
                                </p>) : 
                                (<span className="text-3xl font-bold">{product.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</span>)
                            }
                        </div>
                        <div className="w-full flex flex-row justify-center items-center mt-[20px] gap-[15px]">
                            <button className="w-[200px] h-[40px] cursor-pointer rounded-xl shadow-2xl text-white bg-blue-900 border-[3px] border-blue-900 hover:bg-white hover:w-[205px] hover:text-blue-900">
                                Buy Now
                            </button>
                            <button className="w-[200px] h-[40px] cursor-pointer rounded-xl shadow-2xl text-white bg-blue-600 border-[3px] border-blue-600 hover:bg-white hover:w-[205px] hover:text-blue-600" onClick={
                                ()=>{
                                    addToCart(product,1)
                                    toast.success("product Added to cart")
                                    console.log(getCart())
                                }
                            }>
                                Add to Cart
                            </button>
                        </div>    
                    </div>
                </div>
            }
            {
                status == "error" && <div>Product Error</div>
            }
        </div>
    )
}