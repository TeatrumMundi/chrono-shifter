import Image from 'next/image';

export function Footer() {
    const buttons = [
        { src: "main/footer/LOL_Icon.svg", text: "League of Legends", shortText: "LOL", disabled: false },
        { src: "main/footer/TFT_Icon.svg", text: "Teamfight Tactics", shortText: "TFT", disabled: true },
        { src: "main/footer/VAL_Icon.svg", text: "Valorant", shortText: "VAL", disabled: true },
    ];

    return (
        <>
            <div className="absolute bottom-7 left-1/2 transform -translate-x-1/2 flex gap-5 w-full max-w-[900px] px-5">
                {buttons.map((item, index) => (
                    <div key={index} className="relative group w-1/3">
                        <button
                            disabled={item.disabled}
                            className={`flex items-center justify-center gap-2 rounded-[20px] px-4 py-2 text-sm font-medium tracking-wider whitespace-nowrap relative w-full ${
                                item.disabled ? "bg-gray-800 bg-opacity-50 cursor-not-allowed" : "bg-black bg-opacity-80 text-white"
                            }`}
                        >
                            <Image src={item.src} alt={item.text} width={24} height={24} className="w-6 h-6 flex-shrink-0" />
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
        </>
    );
}
