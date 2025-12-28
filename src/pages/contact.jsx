import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact() {
    const [name,setName] = useState("")
    const [subject,setSubject] = useState("")
    const [email,setEmail] = useState("")
    const [message,setMessage] = useState("")
    const backendBase = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") || ""; // strip trailing slash if any
    
    async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(`${backendBase}/api/users/contact`, {
        name,
        subject,
        email,
        message,
      });
      toast.success("Message sent successfully");
      // optionally clear form:
      setName("");
      setSubject("");
      setEmail("");
      setMessage("");
    } catch (error) {
      console.error("Contact form send error:", error?.response ?? error);
      toast.error("Failed to send Message");
    }
  }


    return (
        <div className="w-full min-h-screen bg-gray-50 py-10 px-6 md:px-20">

        
            <h1 className="text-4xl md:text-5xl font-extrabold text-center text-purple-600 mb-12 tracking-wide">
                Contact Us
            </h1>

            
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

                
                <div className="bg-white shadow-xl rounded-3xl p-10 border-l-4 border-purple-500 transition duration-300 hover:shadow-2xl">
                    <h2 className="text-5xl font-semibold text-gray-800 mb-4">
                        Get in Touch
                    </h2>

                    <p className="text-gray-600 leading-relaxed mb-6 text-xl">
                        We’re here to help! Whether you have questions about our products,
                        need support, or simply want to share feedback — we’d love to hear from you.
                    </p>

                    <div className="mt-4  text-4xl space-y-4 pt-[50px]">
                        <div>
                            <p className="font-semibold mb-3.5 text-gray-700">📞 Phone</p>
                            <p className="text-gray-600">+94 71 542 2671</p>
                        </div>

                        <div>
                            <p className="font-semibold mb-3.5 text-gray-700">📧 Email</p>
                            <p className="text-gray-600">isuruanuranga@gmail.com</p>
                        </div>

                        <div>
                            <p className="font-semibold mb-3.5 text-gray-700">📍 Address</p>
                            <p className="text-gray-600">Colombo, Sri Lanka</p>
                        </div>
                    </div>
                </div>

                
                <div className="bg-white shadow-xl rounded-3xl p-10 border-l-4 border-purple-500 transition duration-300 hover:shadow-2xl">
                    <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                        Send Us a Message
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Your Name
                            </label>
                            <input
                                required
                                value={name}
                                type="text"
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-sm transition"
                                placeholder="Enter your name"
                                onChange={(e)=>
                                    setName(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Subject
                            </label>
                            <input
                                value={subject}
                                required
                                type="text"
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-sm transition"
                                placeholder="Enter your Subject"
                                onChange={(e)=>
                                    setSubject(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Email Address
                            </label>
                            <input
                                value={email}
                                type="email"
                                required
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-sm transition"
                                placeholder="Enter your email"
                                onChange={(e)=>
                                    setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Message
                            </label>
                            <textarea
                            value={message}
                                rows="4"
                                required
                                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 outline-none shadow-sm transition"
                                placeholder="Write your message here..."
                                onChange={(e)=>
                                    setMessage(e.target.value)}
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-purple-500 hover:bg-purple-600 transition-all text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl active:scale-95"
                        >
                            Send Message
                        </button>

                    </form>
                </div>
            </div>

            {/* FOOTER */}
            <div className="text-center mt-12 text-gray-600 py-4 text-sm">
                © {new Date().getFullYear()} Isuru Cosmetics — All Rights Reserved.
            </div>
        </div>
    );
}
