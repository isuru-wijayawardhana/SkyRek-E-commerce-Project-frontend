import { FaStar, FaUserCircle } from "react-icons/fa";

export default function ReviewCard({ review }) {
    // Helper to render star icons
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <FaStar key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"} />
        ));
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300 flex flex-col gap-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                        <FaUserCircle size={32} />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 leading-none">{review.name}</h4>
                        <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Verified Buyer</p>
                    </div>
                </div>
                <div className="flex text-sm">
                    {renderStars(review.stars)}
                </div>
            </div>
            
            <p className="text-gray-600 leading-relaxed italic text-sm">
                "{review.msg}"
            </p>
            
        </div>
    );
}