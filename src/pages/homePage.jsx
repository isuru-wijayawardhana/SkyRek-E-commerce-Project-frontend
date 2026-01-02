import { useEffect, useState } from "react";
import Banners from "../components/banner";
import ProductCard from "../components/productCard";
import axios from "axios";
import Loader from "../components/loader";
import { HiSparkles, HiSearch, HiFilter } from "react-icons/hi";

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");
    const [maxPrice, setMaxPrice] = useState(1000000); // Set to a high default

    useEffect(() => {
        axios.get(import.meta.env.VITE_BACKEND_URL + "/api/products")
            .then((res) => {
                setProducts(res.data);
                setFilteredProducts(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    // Logic to filter products whenever search, category, or price changes
    useEffect(() => {
        let tempProducts = products;

        if (activeCategory !== "All") {
            tempProducts = tempProducts.filter(p => p.category === activeCategory);
        }

        if (searchQuery) {
            tempProducts = tempProducts.filter(p => 
                p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        tempProducts = tempProducts.filter(p => p.price <= maxPrice);

        setFilteredProducts(tempProducts);
    }, [searchQuery, activeCategory, maxPrice, products]);

    // Get unique categories from products
    const categories = ["All", ...new Set(products.map(p => p.category))];

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* 1. Hero Section */}
            <div className="w-full bg-white pb-6">
                <div className="max-w-[1400px] mx-auto pt-4 px-4 md:px-8">
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-100">
                        <Banners />
                    </div>
                </div>
            </div>

            {/* 2. Filter Bar Section */}
            <div className="sticky top-[80px] z-30 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 mb-8">
                <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-4 items-center justify-between">
                    
                    {/* Search Bar */}
                    <div className="relative w-full md:w-[350px] group">
                        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="Search products..."
                            className="w-full pl-12 pr-4 py-3 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Pills */}
                    <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                                    activeCategory === cat 
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 3. Product Grid */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-8">
                <div className="flex items-center gap-2 text-blue-600 font-bold uppercase tracking-widest text-sm mb-6">
                    <HiSparkles />
                    <span>Results: {filteredProducts.length} Products</span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-[400px]">
                        <Loader />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.productId} product={product} />
                        ))}
                    </div>
                )}

                {!loading && filteredProducts.length === 0 && (
                    <div className="text-center py-20 flex flex-col items-center">
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-bold text-slate-700">No products match your search</h3>
                        <button 
                            onClick={() => {setSearchQuery(""); setActiveCategory("All")}}
                            className="mt-4 text-blue-600 font-bold underline"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
}