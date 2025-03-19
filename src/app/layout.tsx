import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import React from "react";

// Configure the Roboto font
const roboto = Roboto({
    weight: "400",
    subsets: ["latin"],
    display: "swap",
    variable: "--font-roboto",
});

export const metadata: Metadata = {
    title: "Chrono-Shifter",
    description: "Web application to check your progress in League of legends rankings.",
};

export default function RootLayout({children,}: Readonly<{ children: React.ReactNode; }>)
{
    return (
        <html lang="en" className={roboto.className}> {/* Apply the Roboto font to the entire app */}
        <body>
        {children}
        </body>
        </html>
    );
}