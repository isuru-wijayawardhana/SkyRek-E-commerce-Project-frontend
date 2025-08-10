import axios from "axios";
import { useEffect, useState } from "react";
import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

const sampleProducts = [
  {
    productId: "COSM001",
    name: "Hydrating Lip Balm",
    altName: ["Moisturizing Lip Care", "Natural Lip Conditioner"],
    labelledPrice: 6.99,
    price: 5.49,
    images: [
      "https://example.com/images/lip-balm-1.jpg",
      "https://example.com/images/lip-balm-2.jpg"
    ],
    description: "A nourishing lip balm enriched with shea butter and vitamin E for soft, smooth lips.",
    stock: 120,
    isAvailable: true,
    category: "cosmatics"
  },
  {
    productId: "COSM002",
    name: "Velvet Matte Lipstick",
    altName: ["Matte Lip Color", "Long-lasting Lipstick"],
    labelledPrice: 14.99,
    price: 12.49,
    images: [
      "https://example.com/images/matte-lipstick-1.jpg",
      "https://example.com/images/matte-lipstick-2.jpg"
    ],
    description: "Richly pigmented matte lipstick that glides on smoothly and stays put all day.",
    stock: 80,
    isAvailable: true,
    category: "cosmatics"
  },
  {
    productId: "COSM003",
    name: "Rose Glow Face Serum",
    altName: ["Brightening Face Serum", "Vitamin C Serum"],
    labelledPrice: 24.99,
    price: 19.99,
    images: [
      "https://example.com/images/rose-serum-1.jpg"
    ],
    description: "Lightweight serum infused with rosehip oil and vitamin C for radiant, hydrated skin.",
    stock: 60,
    isAvailable: true,
    category: "cosmatics"
  },
  {
    productId: "COSM004",
    name: "Aloe Vera Moisturizer",
    altName: ["Daily Skin Hydrator", "Aloe Face Cream"],
    labelledPrice: 18.5,
    price: 15.0,
    images: [
      "https://example.com/images/aloe-moisturizer-1.jpg"
    ],
    description: "Gentle moisturizer enriched with aloe vera extract to soothe and hydrate skin.",
    stock: 100,
    isAvailable: true,
    category: "cosmatics"
  },
  {
    productId: "COSM005",
    name: "Charcoal Detox Face Mask",
    altName: ["Purifying Face Mask", "Clay Mask"],
    labelledPrice: 20.0,
    price: 16.5,
    images: [
      "https://example.com/images/charcoal-mask-1.jpg"
    ],
    description: "Detoxifying charcoal and clay mask that deeply cleanses pores and removes impurities.",
    stock: 50,
    isAvailable: true,
    category: "cosmatics"
  }
];

export default function ProductAdminPage(){
    const [products,setProduct] = useState(sampleProducts)
    useEffect(
      ()=>{
        axios.get(import.meta.env.VITE_BACKEND_URL+"/api/products").then(
          (res)=>{
            setProduct(res.data)
          }
        )
      },[]
    )
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

