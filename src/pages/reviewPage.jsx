import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "../components/reviewCard";
import Loader from "../components/loader";
import { FaStar, FaFilter } from "react-icons/fa";

export default function ReviewsPage() {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/review/get-public-review")
            .then((res) => {
                // Only show reviews marked as 'isShow: true'
                const visibleReviews = res.data.filter(r => r.isShow === true);
                setAllReviews(visibleReviews);
                setFilteredReviews(visibleReviews);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Filter Logic
    const handleFilter = (stars) => {
        setActiveFilter(stars);
        if (stars === "all") {
            setFilteredReviews(allReviews);
        } else {
            const filtered = allReviews.filter(r => r.stars === parseInt(stars));
            setFilteredReviews(filtered);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="w-full min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* Header & Stats Section */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight">Customer Stories</h1>
                        <p className="text-gray-500 mt-2">Read what our community has to say about our products.</p>
                    </div>

                    {/* Interactive Filter Bar */}
                    <div className="flex flex-wrap justify-center gap-3">
                        <button 
                            onClick={() => handleFilter("all")}
                            className={`px-6 py-2 rounded-full font-bold text-sm transition-all border ${activeFilter === "all" ? "bg-gray-900 text-white border-gray-900 shadow-lg" : "bg-white text-gray-600 border-gray-200 hover:border-gray-900"}`}
                        >
                            All Reviews
                        </button>
                        {[5, 4, 3, 2, 1].map((star) => (
                            <button 
                                key={star}
                                onClick={() => handleFilter(star.toString())}
                                className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all border ${activeFilter === star.toString() ? "bg-yellow-400 text-yellow-900 border-yellow-400 shadow-lg shadow-yellow-100" : "bg-white text-gray-600 border-gray-200 hover:border-yellow-400"}`}
                            >
                                {star} <FaStar />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Reviews Grid */}
                {filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {filteredReviews.map((item, index) => (
                            <ReviewCard key={index} review={item} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-300">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                            <FaFilter size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">No reviews found</h3>
                        <p className="text-gray-500">Try selecting a different star rating.</p>
                    </div>
                )}
            </div>
        </div>
    );
}