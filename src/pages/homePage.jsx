import { useEffect, useState } from "react";
import Banners from "../components/banner";
import ProductCard from "../components/productCard";
import axios from "axios";
import Loader from "../components/loader";

export default function HomePage(){
    const [products,setProducts] = useState()
    const [loading,setLoading] = useState(true)

    
        useEffect(
            ()=>{
                if(loading){    
                    axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then(
                        (res)=>{
                            setProducts(res.data)
                            setLoading(false)
                        }
                    )                
                        
                }
            },[loading]
        )
    return(
        <div className="w-full h-full flex justify-center py-[30px]">
            <div className="w-[95%] h-[350px] ">
                <Banners/>
                {
                                loading ? <Loader/> : 
                                <div className="w-full flex flex-wrap gap-[40px] justify-center p-[20px]">
                                    {
                                        products.map(
                                            (product)=>{
                                                return(
                                                    <ProductCard key={product.productId} product={product}/>
                                                )
                                            }
                                        )
                                    }
                                </div>
                            }
            </div>
        </div>
    )
}