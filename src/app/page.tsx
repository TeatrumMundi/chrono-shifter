import { getRandomImage } from "@/utils/getRandomImage";
import { handleSearch } from "@/server/actions";
import Image from 'next/image';

const optionOpacity: number = 50;

export default function Home() {
    return (
        <div className="relative bg-cover bg-center bg-no-repeat min-h-screen text-white overflow-hidden"
             style={{
                 backgroundImage: `url(${getRandomImage(12)})`,
                 height: "100vh",
                 minHeight: "450px",
             }}>

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-indigo-600/50"></div>

            {/* Text Content */}
            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full px-10">
                <h1 className="text-[40px] sm:text-[60px] md:text-[80px] lg:text-[100px] font-bold uppercase leading-none tracking-[.25em] relative"
                    style={{ WebkitTextStroke: "2px white" }}>
                    <span className="block">CHRONO</span>
                    <span className="block mx-auto h-[4px] sm:h-[6px] md:h-[8px] bg-white my-4"
                          style={{ minWidth: "200px", width: "30%", maxWidth: "700px" }}>
                    </span>
                    <span className="block">SHIFTER</span>
                </h1>
            </div>

            {/* Search Box */}
            <div className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl px-4">
                <form action={handleSearch} className="relative flex items-center">
                    <select name="server" defaultValue="EUNE"
                            className="pl-2 pr-6 py-2 text-xs xs:pl-3 xs:pr-8 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-l-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white appearance-none"
                            autoComplete="off">
                        <option value="REGION" disabled className={`bg-blue-800/${optionOpacity}`}>REGION</option>
                        <option value="NA" className={`bg-blue-900/${optionOpacity}`}>NA</option>
                        <option value="EUW" className={`bg-indigo-800/${optionOpacity}`}>EUW</option>
                        <option value="EUNE" className={`bg-indigo-900/${optionOpacity}`}>EUNE</option>
                        <option value="KR" className={`bg-purple-800/${optionOpacity}`}>KR</option>
                        <option value="BR" className={`bg-purple-900/${optionOpacity}`}>BR</option>
                        <option value="JP" className={`bg-pink-800/${optionOpacity}`}>JP</option>
                        <option value="RU" className={`bg-pink-900/${optionOpacity}`}>RU</option>
                        <option value="OCE" className={`bg-teal-800/${optionOpacity}`}>OCE</option>
                        <option value="TR" className={`bg-teal-900/${optionOpacity}`}>TR</option>
                        <option value="LAN" className={`bg-rose-800/${optionOpacity}`}>LAN</option>
                        <option value="LAS" className={`bg-rose-900/${optionOpacity}`}>LAS</option>
                        <option value="SEA" className={`bg-cyan-800/${optionOpacity}`}>SEA</option>
                        <option value="TW" className={`bg-cyan-900/${optionOpacity}`}>TW</option>
                        <option value="VN" className={`bg-emerald-800/${optionOpacity}`}>VN</option>
                        <option value="ME" className={`bg-emerald-900/${optionOpacity}`}>ME</option>
                    </select>

                    <input type="text" name="nickTag" required placeholder="NICKNAME#TAG"
                           className="flex-1 pl-2 pr-[50px] xs:pr-[60px] py-2 text-xs xs:pl-4 xs:py-3 xs:text-sm sm:text-base md:text-lg lg:text-xl rounded-r-lg bg-white/20 backdrop-blur-sm border border-white/30 focus:outline-none focus:border-white/50 text-white placeholder-white/70 tracking-[.25em]"
                           autoComplete="off" spellCheck="false" maxLength={22} />

                    <button type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded p-2 aspect-square transition-all duration-200 ease-in-out hover:scale-105">
                        <svg className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z">
                            </path>
                        </svg>
                    </button>
                </form>
            </div>

            {/* Footer Buttons */}
            <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 flex gap-5 w-full max-w-[900px] px-5">
                {[
                    { src: "main/footer/LOL_Icon.svg", text: "League of Legends", shortText: "LOL", disabled: false },
                    { src: "main/footer/TFT_Icon.svg", text: "Teamfight Tactics", shortText: "TFT", disabled: true },
                    { src: "main/footer/VAL_Icon.svg", text: "Valorant", shortText: "VAL", disabled: true }
                ].map((item, index) => (
                    <div key={index} className="relative group w-1/3">
                        <button
                            disabled={item.disabled}
                            className={`flex items-center justify-center gap-2 rounded-[20px] px-4 py-2 text-sm font-medium tracking-wider whitespace-nowrap relative w-full
                            ${item.disabled ? "bg-gray-800 bg-opacity-50 cursor-not-allowed" : "bg-black bg-opacity-80 text-white"}`}
                        >
                            <Image
                                src={item.src}
                                alt={item.text}
                                width={24}
                                height={24}
                                className="w-6 h-6 flex-shrink-0"
                            />
                            <span className="hidden sm:inline overflow-hidden text-ellipsis">{item.text}</span>
                            <span className="sm:hidden overflow-hidden text-ellipsis">{item.shortText}</span>
                        </button>
                        {item.disabled && (
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap tracking-[.25em]">
                                Coming Soon
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <a
                href="https://github.com/TeatrumMundi"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-0 left-0 bg-gray-800 bg-opacity-50 text-white text-xs px-3 py-1 rounded-tr-md tracking-widest"
            >
                ©2025 Teatrum Mundi
            </a>

        </div>
    );
}
