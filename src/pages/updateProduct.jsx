import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import uploadFile from "../../utils/meadiaUpload";

export default function UpdateProduct() {
    const location = useLocation()
    const [productId, setProductId] = useState(location.state.productId);
    const [productName, setProductName] = useState(location.state.name);
    const [alternativeNames, setAlternativeNames] = useState(location.state.altName.join(","));
    const [labelledPrice, setlabelPrice] = useState(location.state.labelledPrice);
    const [price, setPrice] = useState(location.state.price);
    const [image, setImage] = useState([]);
    const [description, setDescription] = useState(location.state.description);
    const [stock, setStock] = useState(location.state.stock);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const navigate = useNavigate();

//console.log(location)
    async function handleSubmit(){

        const promisesArray = []

        for(let i=0;i<image.length;i++){
            const promis = uploadFile(image[i])
            promisesArray[i] = promis

        }
        const responses = await Promise.all(promisesArray)
        
        

        const altNameInArray = alternativeNames.split(",")
        const productData = {
            productId: productId,
            name: productName,
            altName: altNameInArray,
            labelledPrice: labelledPrice,
            price: price,
            images: responses,
            description: description,
            stock: stock,
            isAvailable: isAvailable,
            category: category
        }
        if(responses.length == 0){
            productData.images = location.state.images
        }
        
        const token = localStorage.getItem("token")
        if(token == null){
            window.location.href = "/login"
            return;
        }

        axios.put(import.meta.env.VITE_BACKEND_URL + "/api/products/"+productId,productData,
            {
                headers:{
                    Authorization: "Bearer "+token
                }
            }
        ).then(
            (response)=>{
                toast.success("Product Added Successfully")
                navigate("/admin/products")

            }
        ).catch(
            (error)=>{
                console.log(error)
                toast.error("Failed to add products")
            }
        )
    }

    return (
        <div className="w-full h-full flex justify-center items-center ">
            <div className="w-[600px] border-[3px] rounded-[15px] flex flex-wrap justify-between p-[40px]">
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Product Id</label>
                    <input
                        disabled
                        type="text"
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[300px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Product Name</label>
                    <input
                        type="text"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Alternative Names</label>
                    <input
                        type="text"
                        value={alternativeNames}
                        onChange={(e) => setAlternativeNames(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Labelled Price</label>
                    <input
                        type="number"
                        value={labelledPrice}
                        onChange={(e) => setlabelPrice(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Price</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Image</label>
                    <input
                        multiple
                        type="file"
                        onChange={(e) => setImage(e.target.files)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[500px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Description</label>
                    <textarea
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    ></textarea>
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Stock</label>
                    <input
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md"
                    />
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold">Is Available</label>
                    <select
                        value={isAvailable}
                        onChange={(e) => setIsAvailable(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md p-[5px]"
                    >
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                    </select>
                </div>
                <div className="w-[200px] flex flex-col gap-[5px]">
                    <label className="text-sm font-semibold ">Category</label>
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full border-[1px] h-[40px] rounded-md p-[5px]"
                    >
                        <option value="cream">Cream</option>
                        <option value="face wash">Face-wash</option>
                        <option value="soap">Soap</option>
                        <option value="fragrance">Fragrance</option>
                    </select>
                </div>
                <div className="w-full flex justify-center flex-row py-[20px]">
                    <Link
                        to={"/admin/products"}
                        className="w-[200px] h-[50px] bg-white text-black rounded-md flex justify-center items-center border-[2px]  "
                    >
                        Cancel
                    </Link>
                    <button onClick={handleSubmit} className="w-[200px] h-[50px] bg-black text-white rounded-md flex justify-center items-center border-[2px] ">
                        Update Product
                    </button>
                </div>
            </div>
        </div>
    );
}
