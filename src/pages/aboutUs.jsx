export default function About() {
    return (
        <div className="w-full min-h-screen bg-gray-50 py-10 px-6 md:px-20">
            <div className="max-w-4xl mx-auto">

                <h1 className="text-5xl font-extrabold text-center text-accent mb-12">
                    About Us
                </h1>

                {/* OUR STORY */}
                <section className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-l-4 border-accent">
                    <h2 className="text-3xl font-semibold text-accent mb-4">Our Story</h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                        At Isuru cosmetics, beauty is more than a product it's a feeling.
                        Our journey began with a simple idea: high-quality cosmetics should be accessible to everyone. 
                        What started as a small passion for skincare and makeup has grown into a trusted online store 
                        serving customers across Sri Lanka.
                        <br /><br />
                        We noticed how difficult it was for people to find genuine, safe, and effective beauty products
                        without paying high prices. So, we decided to change that. Today, we proudly offer a carefully
                        curated selection of cosmetics that blend quality, affordability, and confidence because 
                        everyone deserves to look and feel their best.
                    </p>
                </section>

                {/* VISION */}
                <section className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-l-4 border-pink-400">
                    <h2 className="text-3xl font-semibold text-pink-500 mb-4">OUR VISION</h2>
                    <p className="text-lg leading-relaxed text-gray-700">
                        To become Sri Lanka’s most trusted and loved online destination for cosmetics—
                        where beauty meets confidence, and quality meets affordability.
                        <br /><br />
                        We aim to inspire individuals to embrace their natural beauty while giving them access 
                        to products that enhance their unique style.
                    </p>
                </section>

                <section className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-l-4 border-purple-400">
                    <h2 className="text-3xl font-semibold text-purple-500 mb-4">OUR MISSION</h2>

                    <div className="space-y-3 text-lg leading-relaxed text-gray-700">
                        <div>To provide authentic, high-quality cosmetic and skincare products.</div>
                        <div>To offer customers a safe, smooth, and reliable online shopping experience.</div>
                        <div>To keep prices fair and transparent, ensuring beauty is accessible to all.</div>
                        <div>To continuously expand our collection with trending, effective, and trusted products.</div>
                        <div>To build a beauty community that promotes confidence, self-care, and positivity.</div>
                    </div>
                </section>

                <section className="bg-white shadow-lg rounded-2xl p-8 mb-10 border-l-4 border-yellow-400">
                    <h2 className="text-3xl font-semibold text-yellow-500 mb-4">OUR VALUES</h2>

                    <div className="space-y-6 text-gray-700 text-lg leading-relaxed">

                        <div>
                            <p className="font-bold text-gray-800">✨ Quality First</p>
                            <p>We believe customers deserve the best. Every product is checked for authenticity and safety before reaching you.</p>
                        </div>

                        <div>
                            <p className="font-bold text-gray-800">🤝 Trust & Transparency</p>
                            <p>We value honesty—no fake products, no hidden fees. Only genuine service you can rely on.</p>
                        </div>

                        <div>
                            <p className="font-bold text-gray-800">🌿 Care & Responsibility</p>
                            <p>From packaging to product sourcing, we prioritize choices that are safer for you and the environment.</p>
                        </div>

                        <div>
                            <p className="font-bold text-gray-800">😊 Customer-Centric</p>
                            <p>Your happiness is our priority. We are always here to help, support, and guide you on your beauty journey.</p>
                        </div>

                        <div>
                            <p className="font-bold text-gray-800">💡 Innovation</p>
                            <p>Beauty keeps evolving—and so do we. We constantly bring you the latest trends and products.</p>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    );
}
