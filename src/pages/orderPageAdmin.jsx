import axios from "axios"
import { useEffect, useState } from "react"
import Paginator from "../components/paginator"
import Loader from "../components/loader"
import toast from "react-hot-toast"


export default function OrderAdminPage(){
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(10)
    const [popupVisible, setPopupVisible] = useState(false)
    const [clickedOrder, setClickedOrder] = useState(null)
    const [orderNotes, setOrderNotes] = useState("")
    const [orderStatus, setOrderStatus] = useState("pending")
    useEffect(()=>{

        if(loading){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/orders/"+page+"/"+limit,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res)=>{
                setOrders(res.data.orders)
                setTotalPages(res.data.totalPages)
                setLoading(false)
                console.log(res.data)
            }).catch((err)=>{
                console.error(err)
            })
        }
    },[loading,page,limit])
    return(
        <div className="w-full h-full flex flex-col justify-between">
            { loading ? <Loader/> :
            <table className="w-full border-[3px] ">
                <thead>
                    <tr>
                        <th className="p-[10px]">Order ID</th>
                        <th className="p-[10px]">Email</th>
                        <th className="p-[10px]">Name</th>
                        <th className="p-[10px]">Address</th>
                        <th className="p-[10px]">Phone</th>
                        <th className="p-[10px]">Status</th>
                        <th className="p-[10px]">Date</th>
                        <th className="p-[10px]">Total</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.map((order,index)=>{
                            return(
                            <tr key={index} className="border-b-[1px] hover:bg-blue-600 hover:text-white" 
                            onClick={()=>{
                                setOrderNotes(order.notes)
                                setOrderStatus(order.status)
                                setClickedOrder(order)
                                setPopupVisible(true)
                            }}>
                                <td className="p-[10px]">{order.orderId}</td>
                                <td className="p-[10px]">{order.email}</td>
                                <td className="p-[10px]">{order.name}</td>
                                <td className="p-[10px]">{order.address}</td>
                                <td className="p-[10px]">{order.phone}</td>
                                <td className="p-[10px]">{order.status}</td>
                                <td className="p-[10px]">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="p-[10px] text-end">{order.total.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})}</td>
                            </tr>
                            )
                        })
                    }
                </tbody>
            </table>}
            {
  popupVisible && (
    <div className="fixed top-0 left-0 w-full h-full bg-[#00000050] flex justify-center items-center">
      <div className="w-[600px] h-[600px] bg-white relative rounded-xl shadow-lg p-6 ">
        {
          (orderStatus!=clickedOrder.status || orderNotes!=clickedOrder.notes)&&<button className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
          onClick={async()=>{
            setPopupVisible(false)
            try{
              await axios.put(
                import.meta.env.VITE_BACKEND_URL + "/api/orders/" + clickedOrder.orderId,
                {
                  status: orderStatus,
                  notes: orderNotes
                },
                {
                  headers:{Authorization: `Bearer ${localStorage.getItem("token")}`,},
                }
              )
                toast.success("Order updated successfully")
                setLoading(true)
                
            }catch(err){
              console.log(err)
              toast.error("Failed to update order")
            }
          }}>
            Save Changes
          </button>
        }
        <button
          className="absolute w-[30px] h-[30px] bg-red-600 border-[2px] border-red-600 text-white 
          top-[-30px] right-[-30px] rounded-full cursor-pointer hover:bg-transparent hover:text-red-600"
          onClick={() => {
            setPopupVisible(false);
          }}
        >
          X
        </button>
        {/* Order Header */}
        <div className="mb-4 border-b pb-3">
          <h2 className="text-xl font-bold text-gray-800">
            Order #{clickedOrder.orderId}
          </h2>
          <p className="text-sm text-gray-500">Date: {new Date(clickedOrder.date).toLocaleString()}</p>
          <p className="text-sm">
            <span className="font-semibold">Status:</span>{" "}
            <span className={`capitalize px-2 py-1 rounded ${
										clickedOrder.status === "pending"
											? "bg-yellow-100 text-yellow-700"
											: "bg-green-100 text-green-700"
									}`}>
              {clickedOrder.status}
            </span>
            <select className="ml-4 p-1 border rounded" value={orderStatus} onChange={(e)=> setOrderStatus(e.target.value)}>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">cancelled</option>
            </select>
          </p>
        </div>
        {/* Notes */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Notes</h3>
          <textarea className="w-full h-[50px] p-2 border rounded mt-2" value={orderNotes} onChange={(e)=>setOrderNotes(e.target.value)}>

          </textarea>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <p><span className="font-semibold">Name:</span> {clickedOrder.name}</p>
          <p><span className="font-semibold">Email:</span> {clickedOrder.email}</p>
          <p><span className="font-semibold">Phone:</span> {clickedOrder.phone}</p>
          <p><span className="font-semibold">Address:</span> {clickedOrder.address}</p>
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Items</h3>
          <div className="space-y-2 max-h-[150px] overflow-y-auto">
            {clickedOrder.items?.map(item => (
              <div key={item._id} className="flex items-center border rounded p-2">
                <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover mr-3" />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-gray-500">x{item.qty} • {item.price.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})} LKR</p>
                </div>
                <p className="font-semibold">{(item.price * item.qty).toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})} LKR</p>
              </div>
            ))}
          </div>
        </div>

        

        {/* Total */}
        <div className="flex justify-between items-center border-t pt-3">
          <p className="text-lg font-bold">Total:</p>
          <p className="text-lg font-bold text-green-600">{clickedOrder.total.toLocaleString('en-US',{ minimumFractionDigits : 2, maximumFractionDigits: 2})} LKR</p>
        </div>

        {/* Close Button */}
        
      </div>
    </div>
  )
}

            <Paginator currentPage={page}
				totalPages={totalPages}
				setCurrentPage={setPage}
				limit={limit}
				setLimit={setLimit}
                setLoading={setLoading}/>
        </div>
    )
}