import { Link } from "react-router-dom"

export default function ProductCard(props) {
    const product = props.product
    
    // Calculate discount percentage if applicable
    const discount = product.labelledPrice > product.price 
        ? Math.round(((product.labelledPrice - product.price) / product.labelledPrice) * 100) 
        : 0;

    return (
        <Link 
            to={"/overview/" + product.productId} 
            className="group w-[300px] h-[450px] flex flex-col shrink-0 bg-white shadow-md hover:shadow-2xl rounded-3xl overflow-hidden transition-all duration-300 border border-gray-100 relative"
        >
            {/* Sale Badge */}
            {discount > 0 && (
                <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    {discount}% OFF
                </div>
            )}

            {/* Image Container */}
            <div className="w-full h-[65%] overflow-hidden bg-gray-50">
                <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
            </div>

            {/* Content Container */}
            <div className="w-full flex-1 flex flex-col p-5">
                <div className="flex justify-between items-start mb-1">
                    <span className="text-blue-600 text-[10px] font-bold uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded">
                        {product.category}
                    </span>
                    <span className="text-gray-300 text-[10px] font-medium">#{product.productId}</span>
                </div>

                <h1 className="text-lg font-bold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                    {product.name}
                </h1>

                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                    <div className="flex flex-col">
                        {product.labelledPrice > product.price ? (
                            <>
                                <span className="text-gray-400 text-xs line-through">
                                    LKR {product.labelledPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-xl font-black text-slate-900">
                                    LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </span>
                            </>
                        ) : (
                            <span className="text-xl font-black text-slate-900">
                                LKR {product.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                        )}
                    </div>
                    
                    {/* Visual CTA Icon */}
                    <div className="w-10 h-10 rounded-2xl bg-gray-900 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 shadow-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    )
}