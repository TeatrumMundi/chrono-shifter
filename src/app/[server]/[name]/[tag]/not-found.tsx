"use client";

import Link from "next/link";
import Image from "next/image";
import SearchForm from "@/components/common/search/SearchForm";

export default function NotFound() {
    return (
        <div className="relative w-full h-screen overflow-hidden">

            <div className="absolute inset-0 -z-10 opacity-20">
                <Image
                    src="/main/5.jpg"
                    alt="Background"
                    fill
                    quality={75}
                    className="object-cover"
                    priority
                />
            </div>

            <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-center w-full max-w-2xl px-4 space-y-4">
                <div className="bg-red-900/70 rounded-lg p-4 md:p-6 shadow-lg">
                    <h2 className="text-xl md:text-2xl font-bold text-white tracking-[.20em] mb-2">
                        Summoner Not Found
                    </h2>
                    <p className="text-red-100 tracking-[.10em] font-sans">
                        We couldn&apos;t find the summoner you&apos;re looking for.
                    </p>
                </div>

                <div className="flex justify-center">
                    <div className=" rounded-xl shadow-md p-2">
                        <Image
                            src="/responseCodes/notfound_404.png"
                            alt="Ahri 404"
                            width={300}
                            height={300}
                            className="rounded-lg"
                            priority
                        />
                    </div>
                </div>
            </div>

            <SearchForm />

            <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
                <Link
                    href="/"
                    className="inline-block px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 tracking-[.25em]"
                >
                    Return to Home Page
                </Link>
            </div>
        </div>
    );
}
