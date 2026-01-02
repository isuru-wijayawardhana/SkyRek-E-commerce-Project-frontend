import { useNavigate } from "react-router-dom";
import { HiHome, HiArrowLeft } from "react-icons/hi";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
      <div className="text-center">
        {/* Animated Illustration or Large Text */}
        <div className="relative">
          <h1 className="text-[12rem] font-black text-slate-200 select-none">
            404
          </h1>
          <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-slate-800 w-full">
            Oops! Page Not Found
          </p>
        </div>

        {/* Message */}
        <p className="text-slate-500 mt-4 mb-10 max-w-md mx-auto text-lg">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-8 py-3 bg-white text-slate-700 font-semibold rounded-2xl shadow-sm border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
          >
            <HiArrowLeft /> Go Back
          </button>
          
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95"
          >
            <HiHome /> Back to Home
          </button>
        </div>

        {/* Decorative background element */}
        <div className="fixed bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-20"></div>
      </div>
    </div>
  );
}