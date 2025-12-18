import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage(){

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const navigate = useNavigate()
    const googleLogin = useGoogleLogin({
        onSuccess: (response)=>{
            axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/google-login",{
                token : response.access_token
            }).then(
                (response)=>{
                    console.log(response.data)
                    localStorage.setItem("token",response.data.token)
                    toast.success("Login successful")
                    if(response.data.role == "admin"){
                        navigate("/admin")
                    }else if(response.data.role == "user"){
                        navigate("/")
                    }
                }
            ).catch(
                ()=>{
                    toast.error("Google Login Failed")
                }
            )
        }
    })

    function register(){
        if(password!== confirmPassword){
            toast.error("Password do not match")
            return
        }
        axios.post(import.meta.env.VITE_BACKEND_URL+"/api/users/",{
            firstName:firstName,
            lastName:lastName,
            email:email,
            password:password
        }).then(
            (res)=>{
                //console.log(response.data)
                toast.success("Register Successful")
                navigate("/login")
            }
        ).catch(
            (error)=>{
                console.log(error)
                toast.error("Login Failed")
            }
        )
    }

    return(
        <div className="w-full h-screen bg-[url(./LoginBG.jpg)] bg-center bg-cover flex justify-center items-center">
            <div className="w-[500px] h-[500px] backdrop-blur-sm shadow-2xl rounded-[30px] gap-[20px] relative text-white flex flex-col items-center justify-center">
                <h1 className="absolute top-0 text-2xl font-bold text-center my-5">Register</h1>
                <div className="w-[350px] flex flex-col">
                    <span className="text-lg ">First Name</span>
                    <input onChange={
                        (e)=>{
                            setFirstName(e.target.value)
                        }
                    } type="text" className="w-[350px] h-[40px] border border-white rounded-xl"/>
                </div>
                <div className="w-[350px] flex flex-col">
                    <span className="text-lg ">Last Name</span>
                    <input onChange={
                        (e)=>{
                            setLastName(e.target.value)
                        }
                    } type="text" className="w-[350px] h-[40px] border border-white rounded-xl"/>
                </div>
                <div className="w-[350px] flex flex-col">
                    <span className="text-lg ">Email</span>
                    <input onChange={
                        (e)=>{
                            setEmail(e.target.value)
                        }
                    } type="text" className="w-[350px] h-[40px] border border-white rounded-xl"/>
                </div>
                <div className="w-[350px] flex flex-col">
                    <span className="text-lg ">Password</span>
                    <input onChange={
                        (e)=>{
                            setPassword(e.target.value)
                        }
                    }
                    type="password" className="w-[350px] h-[40px] border border-white rounded-xl"/>
                </div>
                <div className="w-[350px] flex flex-col">
                    <span className="text-lg ">Confirm Password</span>
                    <input onChange={
                        (e)=>{
                            setConfirmPassword(e.target.value)
                        }
                    }
                    type="password" className="w-[350px] h-[40px] border border-white rounded-xl"/>
                </div>
                <button onClick={register} className="w-[350px] h-[40px] bg-blue-500 rounded-xl text-white text-lg mt-5 hover:bg-blue-600 transition-all duration-300">
                    Register
                </button>
                <button onClick={googleLogin} className="w-[350px] h-[40px] bg-blue-500 rounded-xl text-white text-lg mt-5 hover:bg-blue-600 transition-all duration-300">
                    Register with Google
                </button>
                <p>Already a customer? <Link to="/login" className="text-blue-600">Sign in instead</Link> from here</p>
                <p>Forget Password? <Link to="/forget" className="text-yellow-300">Reset Password</Link> from here</p>
            </div>
        </div>
    )
}