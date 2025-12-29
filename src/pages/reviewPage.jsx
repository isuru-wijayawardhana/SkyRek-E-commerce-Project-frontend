import { useEffect, useState } from "react";
import axios from "axios";
import ReviewCard from "../components/reviewCard";
import Loader from "../components/loader";
import { FaStar, FaFilter } from "react-icons/fa";
import toast from "react-hot-toast";
export default function ReviewsPage() {
    const [allReviews, setAllReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState("all");
    const [msg, setMsg] = useState("");
    const [stars, setStars] = useState(5);
    
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

    async function submitReview(e) {
    e.preventDefault();

    if (!msg.trim()) {
      toast.error("Please write your review");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/review/",
        {
          msg,
          stars,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      toast.success(res.data.message);
      toast.success("Take some time to Display your review")
      setMsg("");
      setStars(5);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to submit review"
      );
    } finally {
      setLoading(false);
    }
  }


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
            {localStorage.getItem('token') && (
                <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        onSubmit={submitReview}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Write a Review
        </h2>

        {/* Stars */}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Rating
        </label>
        <select
          value={stars}
          onChange={(e) => setStars(Number(e.target.value))}
          className="w-full mb-4 p-2 border rounded-lg"
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <option key={s} value={s}>
              {s} Star{s > 1 && "s"}
            </option>
          ))}
        </select>

        {/* Message */}
        <label className="block mb-2 text-sm font-semibold text-gray-600">
          Review
        </label>
        <textarea
          rows="4"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          className="w-full p-2 border rounded-lg mb-4"
          placeholder="Write your experience..."
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent text-white py-2 rounded-lg hover:opacity-90 transition"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
            )}
        </div>
    );
}