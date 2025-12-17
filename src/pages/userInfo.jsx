import axios from "axios"
import { useEffect, useState } from "react"
import Paginator from "../components/paginator"
import Loader from "../components/loader"
import toast from "react-hot-toast"
import { GrClear } from "react-icons/gr";
import { FaRegUser } from "react-icons/fa"

export default function UserInfo(){
    const [users, setUsers] = useState("")
    const [loading, setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [totalPages,setTotalPages] = useState(0)
    const [limit,setLimit] = useState(10)
    const [role,setRole]=useState(null)
    const [isBlock,setIsBlock]=useState(null)
    const [popupVisible, setPopupVisible] = useState(false)
    const [clickedUser, setClickedUser] = useState(null)

  
    useEffect(()=>{

        if(loading){
            axios.get(import.meta.env.VITE_BACKEND_URL + "/api/users/getuserinfo/"+page+"/"+limit,{
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res)=>{
                setUsers(res.data.users)
                setTotalPages(res.data.totalPages)
                setLoading(false)
                //console.log(res.data)
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
                            <th className="p-[10px]">Image</th>
                            <th className="p-[10px]">firstName</th>
                            <th className="p-[10px]">LastName</th>
                            <th className="p-[10px]">Email</th>
                            <th className="p-[10px]">Phone</th>
                            <th className="p-[10px]">Role</th>
                            <th className="p-[10px]">IsBlock</th>
                            <th className="p-[10px]">isEmailVerified</th>
                            <th className="p-[10px]">Address</th>   
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((user,index)=>{
                                return(
                                <tr key={index} className="border-b-[1px] hover:bg-blue-600 hover:text-white" 
                                onClick={()=>{
                                    setRole(user.role)
                                    setIsBlock(user.isBlock)
                                    setClickedUser(user)
                                    setPopupVisible(true)
                                }}>
                                    <td className="p-[10px]">
                                            {user.image ? (
                                                      <img src={user.image} alt="User" className="w-[50px] h-[50px] rounded-full"
                                                      />
                                            ) : (
                                                <div className="w-[50px] h-[50px] flex items-center justify-center bg-gray-200 rounded-full">
                                                    <GrClear className="text-red-500 text-xl" />
                                                </div>
                                            )}

                                    </td>
                                    <td className="p-[10px]">{user.firstName}</td>
                                    <td className="p-[10px]">{user.lastName}</td>
                                    <td className="p-[10px]">{user.email}</td>
                                    <td className="p-[10px]">{user.phone}</td>
                                    <td className="p-[10px]">{user.role}</td>
                                    <td className="p-[10px]">{user.isBlock}</td>
                                    <td className="p-[10px]">{user.isEmailVerified}</td>
                                    <td className="p-[10px]">{user.address}</td>
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
              (role!=clickedUser.role || isBlock!=clickedUser.isBlock)&&<button className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-lg cursor-pointer"
              onClick={async()=>{
                setPopupVisible(false)
                try{
                  await axios.put(
                    import.meta.env.VITE_BACKEND_URL + "/api/users/update-user-admin/" + clickedUser.email,
                    {
                      role: role,
                      notes: isBlock
                    },
                    {
                      headers:{Authorization: `Bearer ${localStorage.getItem("token")}`,},
                    }
                  )
                    toast.success("User updated successfully")
                    setLoading(true)
                    
                }catch(err){
                  console.log(err)
                  toast.error("Failed to update User")
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
            {/* Role */}
            <div className="mb-4 border-b pb-3">
              <div className="flex-row">
              <h2 className="text-xl font-bold text-gray-800">
                User <FaRegUser />{clickedUser.email}
              </h2>
              </div>
              <p className="text-sm">
                <span className="font-semibold">Role:</span>{" "}
                <span className={`capitalize px-2 py-1 rounded ${
                                            clickedUser.role === "User"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
                  {clickedUser.role}
                </span>
                <select className="ml-4 p-1 border rounded" value={role} onChange={(e)=> setRole(e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </p>
            </div>
            {/* IsBlock */}
            <div className="mb-4 border-b pb-3">
              <p className="text-sm">
                <span className="font-semibold">IsBlock:</span>{" "}
                <span className={`capitalize px-2 py-1 rounded ${
                                            clickedUser.isBlock === "User"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-green-100 text-green-700"
                                        }`}>
                  {clickedUser.isBlock}
                </span>
                <select className="ml-4 p-1 border rounded" value={isBlock} onChange={(e)=> setIsBlock(e.target.value)}>
                  <option value="true">True</option>
                  <option value="false">False</option>
                </select>
              </p>
            </div>
    
            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <img src={clickedUser.image} alt="User" className="w-[50px] h-[50px] rounded-full"/>
              <p><span className="font-semibold">Name:</span> {clickedUser.lastName}</p>
              <p><span className="font-semibold">Name:</span> {clickedUser.firstName}</p>
              <p><span className="font-semibold">Email:</span> {clickedUser.email}</p>
              <p><span className="font-semibold">Phone:</span> {clickedUser.phone}</p>
              <p><span className="font-semibold">Address:</span> {clickedUser.address}</p>
            </div>
            
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