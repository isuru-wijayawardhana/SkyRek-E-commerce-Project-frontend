import axios from "axios";
import { useEffect, useState } from "react";
import { BiTrash } from "react-icons/bi";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";



export default function ProductAdminPage(){
    const [products,setProduct] = useState([])
    useEffect(() => {
  axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  }).then(res => setProduct(res.data));
}, []);
    return(
        <div className="w-full h-full border-[3px]">
            <table >
                <thead>
                    <tr>
                      <th className="p-[10px]">Image</th>
                      <th className="p-[10px]">productId</th>
                      <th className="p-[10px]">name</th>
                      <th className="p-[10px]">altName</th>
                      <th className="p-[10px]">labelledPrice</th>
                      <th className="p-[10px]">price</th>
                      <th className="p-[10px]">description</th>
                      <th className="p-[10px]">stock</th>
                      <th className="p-[10px]">isAvailable</th>
                      <th className="p-[10px]">category</th>
                      <th className="p-[10px]">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(
                            (product,index)=>{
                                return(
                                    <tr key={index}>
                                        <td className="p-[10px]">
                                            <img key={index} src={product.images[0]} alt={product.name} className="w-[50px] h-[50px]"/>
                                        </td>
                                        <td className="p-[10px]">{product.productId}</td>
                                        <td className="p-[10px]">{product.name}</td>
                                        <td className="p-[10px]">{product.altName}</td>
                                        <td className="p-[10px]">{product.labelledPrice}</td>
                                        <td className="p-[10px]">{product.price}</td>
                                        <td className="p-[10px]">{product.description}</td>
                                        <td className="p-[10px]">{product.stock}</td>
                                        <td className="p-[10px]">{String(product.isAvailable)}</td>
                                        <td className="p-[10px]">{product.category}</td>
                                        <td className="p-[10px]"><BiTrash className="bg-red-500 p-[7px] text-3xl rounded-full text-white shadow-2xl"/></td>
                                        
                                    </tr>
                                ) 
                            }
                        )
                    }
                </tbody>    
            </table> 
            <Link to={"/admin/newProduct"} className="fixed right-[60px] bottom-[60px] text-white bg-green-600 rounded-full p-[20px]">
                <PiPlusCircle className="text-3xl"/>
            </Link>
        </div>
    )
}

