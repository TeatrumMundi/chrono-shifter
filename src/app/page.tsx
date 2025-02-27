export default function Home() {
    const randomNumber = Math.floor(Math.random() * 11) + 1;

    return (
        <div
            className="relative bg-cover bg-center bg-no-repeat min-h-screen text-white overflow-hidden"
            style={{
                backgroundImage: `url('/main/${randomNumber}.jpg')`,
                height: '100vh', // Ensure the container always takes the full viewport height
                minHeight: '450px', // Add a minimum height constraint
            }}
        >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>

            {/* Text Content */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full px-10">
                <h1
                    className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold uppercase leading-none tracking-[.25em] relative"
                    style={{
                        WebkitTextStroke: '2px white',
                    }}
                >
                    <span className="block">CHRONO</span>
                    <span
                        className="block mx-auto h-[4px] sm:h-[6px] md:h-[8px] bg-white my-4"
                        style={{ minWidth: '200px', width: '30%', maxWidth: '700px' }}
                    ></span>
                    <span className="block">SHIFTER</span>
                </h1>
            </div>

            {/* Search Box */}
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
                <div className="relative flex items-center">
                    {/* Region Picker Dropdown */}
                    <select
                        className="pl-2 pr-6 py-2 text-xs xs:pl-3 xs:pr-8 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-l-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white appearance-none"
                    >
                        <option value="REGION" disabled className="bg-blue-800/50">REGION</option>
                        <option value="NA" className="bg-blue-900/50">NA</option>
                        <option value="EUW" className="bg-indigo-800/50">EUW</option>
                        <option value="EUNE" className="bg-indigo-900/50">EUNE</option>
                        <option value="KR" className="bg-purple-800/50">KR</option>
                        <option value="BR" className="bg-purple-900/50">BR</option>
                        <option value="JP" className="bg-pink-800/50">JP</option>
                        <option value="RU" className="bg-pink-900/50">RU</option>
                        <option value="OCE" className="bg-teal-800/50">OCE</option>
                        <option value="TR" className="bg-teal-900/50">TR</option>
                        <option value="LAN" className="bg-rose-800/50">LAN</option>
                        <option value="LAS" className="bg-rose-900/50">LAS</option>
                        <option value="SEA" className="bg-cyan-800/50">SEA</option>
                        <option value="TW" className="bg-cyan-900/50">TW</option>
                        <option value="VN" className="bg-emerald-800/50">VN</option>
                        <option value="ME" className="bg-emerald-900/50">ME</option>
                    </select>
                    {/* Search Input */}
                    <input
                        type="text"
                        placeholder="NICKNAME#TAG"
                        className="flex-1 pl-2 pr-8 py-2 text-xs xs:pl-4 xs:pr-10 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-r-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-[.25em]"
                    />
                    {/* Search Icon */}
                    <svg
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white/70"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                    </svg>
                </div>
            </div>
        </div>
    );
}