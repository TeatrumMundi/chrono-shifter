import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: "Chrono-Shifter",
  description: "Web application to check your progress in League of legends rankings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body

      >
        {children}
      </body>
    </html>
  );
}
