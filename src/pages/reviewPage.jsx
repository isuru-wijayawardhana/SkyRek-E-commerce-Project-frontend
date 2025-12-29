import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "../components/reviewCard";
import Loader from "../components/loader";
import { FaStar, FaFilter, FaPenNib, FaQuoteLeft } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ReviewsPage() {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [msg, setMsg] = useState("");
    const [stars, setStars] = useState(5);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/review/get-public-review")
            .then((res) => {
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

    async function submitReview(e) {
        e.preventDefault();
        if (!msg.trim()) {
            toast.error("Please write your review");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await axios.post(
                import.meta.env.VITE_BACKEND_URL + "/api/review/",
                { msg, stars },
                { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
            );

            toast.success(res.data.message || "Review submitted!");
            toast.success("It will appear once approved by admin", { duration: 4000 });
            setMsg("");
            setStars(5);
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    }

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
        <div className="w-full min-h-screen bg-[#fcfcfd] py-16 px-4">
            <div className="max-w-6xl mx-auto">
                
                {/* --- HEADER SECTION --- */}
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-block p-3 bg-blue-50 text-blue-600 rounded-2xl mb-2">
                        <FaQuoteLeft size={24} />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">Community Feedback</h1>
                    <p className="text-lg text-slate-500 max-w-2xl mx-auto">
                        We take pride in our products. See what our customers have to say about their experience.
                    </p>
                </div>

                {/* --- FILTER & STATS BAR --- */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-12 flex flex-col lg:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Filter By</span>
                        <div className="h-8 w-[1px] bg-slate-200 hidden md:block"></div>
                        <div className="flex flex-wrap justify-center gap-2">
                            <button 
                                onClick={() => handleFilter("all")}
                                className={`px-5 py-2 rounded-xl font-bold text-sm transition-all ${activeFilter === "all" ? "bg-slate-900 text-white shadow-lg" : "bg-slate-50 text-slate-600 hover:bg-slate-100"}`}
                            >
                                All
                            </button>
                            {[5, 4, 3, 2, 1].map((star) => (
                                <button 
                                    key={star}
                                    onClick={() => handleFilter(star.toString())}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all border ${activeFilter === star.toString() ? "bg-yellow-400 text-yellow-900 border-yellow-400 shadow-md" : "bg-white text-slate-500 border-slate-200 hover:border-yellow-400"}`}
                                >
                                    {star} <FaStar size={12} />
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="text-sm font-medium text-slate-400">
                        Showing {filteredReviews.length} Approved Reviews
                    </div>
                </div>

                {/* --- REVIEWS GRID --- */}
                {filteredReviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
                        {filteredReviews.map((item, index) => (
                            <ReviewCard key={index} review={item} />
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-32 text-center bg-white rounded-[40px] border-2 border-dashed border-slate-200 mb-20">
                        <FaFilter size={40} className="mx-auto text-slate-200 mb-4" />
                        <h3 className="text-2xl font-bold text-slate-800">No reviews found</h3>
                        <p className="text-slate-500 mt-1">Be the first to leave a review for this category!</p>
                    </div>
                )}

                {/* --- WRITE A REVIEW SECTION --- */}
                {localStorage.getItem('token') && (
                    <div className="bg-white rounded-[40px] shadow-2xl shadow-blue-100/50 border border-blue-50 overflow-hidden flex flex-col md:flex-row max-w-5xl mx-auto">
                        {/* Left Info Panel */}
                        <div className="md:w-1/3 bg-slate-900 p-10 text-white flex flex-col justify-center">
                            <FaPenNib size={40} className="text-blue-400 mb-6" />
                            <h2 className="text-3xl font-bold mb-4">Share Your Story</h2>
                            <p className="text-slate-400 leading-relaxed">
                                Your feedback helps us improve and helps others make better choices. We appreciate your time!
                            </p>
                            <div className="mt-8 pt-8 border-t border-white/10 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold">!</div>
                                <p className="text-xs text-slate-400">Reviews are moderated for quality and safety.</p>
                            </div>
                        </div>

                        {/* Right Form Panel */}
                        <form onSubmit={submitReview} className="md:w-2/3 p-10 lg:p-14 space-y-8">
                            <div>
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest mb-4">How would you rate us?</label>
                                <div className="flex gap-3">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            type="button"
                                            onClick={() => setStars(s)}
                                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${stars >= s ? "bg-yellow-400 text-white shadow-lg shadow-yellow-100" : "bg-slate-50 text-slate-300"}`}
                                        >
                                            <FaStar size={20} />
                                        </button>
                                    ))}
                                    <span className="ml-4 flex items-center font-bold text-slate-700">{stars} Stars</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-black text-slate-400 uppercase tracking-widest">Your Experience</label>
                                <textarea
                                    rows="5"
                                    value={msg}
                                    onChange={(e) => setMsg(e.target.value)}
                                    className="w-full p-5 rounded-3xl bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none resize-none text-slate-700 placeholder:text-slate-300"
                                    placeholder="What did you love about the product? What could we improve?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full h-16 rounded-3xl font-black uppercase tracking-widest text-white transition-all shadow-xl active:scale-95 ${isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-200"}`}
                            >
                                {isSubmitting ? "Sending Feedback..." : "Post My Review"}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}