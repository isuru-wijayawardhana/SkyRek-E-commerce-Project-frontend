import axios from "axios"
import { useState } from "react"
import toast from "react-hot-toast"

export default function ForgetPassword(){
    const [emailSent, setEmailSent] = useState(false)
    const [email, setEmail] = useState("")

    async function sendOTP() {
        try{
            await axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/send-otp", { email:email });
            toast.success("OTP sent successfully");
            setEmailSent(true);
        }catch(error){
            toast.error("Failed to send OTP")
            console.error(error)
        }
    }
    return(
        <div className="w-full h-full flex justify-center items-center">
            {!emailSent && <div className="bg-primary w-[500px] h-[500px] shadow-2xl flex flex-col items-center justify-center gap-[20px] rounded-[30px]">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <input
                type="email"
                placeholder="Enter Your email"
                className="w-[350px] h-[40px] border border-black rounded-xl text-center"
                onChange={(e)=>{setEmail(e.target.value)}}/>
                <button className="w-[350px] h-[40px] bg-blue-600 rounded-xl text-white text-lg mt-5 hover:bg-white hover:text-blue-600"
                onClick={sendOTP}>
                    Send OTP
                </button>
            </div>}
        </div>
    )
}