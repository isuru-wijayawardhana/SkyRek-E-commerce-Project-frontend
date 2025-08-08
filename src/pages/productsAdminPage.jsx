import { PiPlusCircle } from "react-icons/pi";
import { Link } from "react-router-dom";

export default function ProductAdminPage(){
    return(
        <div className="w-full h-full border-[3px]">
            Product admin page 
            <Link to={"/admin/newProduct"} className="fixed right-[60px] bottom-[60px] text-white bg-green-600 rounded-full p-[20px]">
                <PiPlusCircle className="text-3xl"/>
            </Link>
        </div>
    )
}

