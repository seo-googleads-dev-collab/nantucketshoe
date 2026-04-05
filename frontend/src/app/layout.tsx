import type { Metadata } from "next";
import { Libre_Baskerville, Maven_Pro, Marvel, Kavoon } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const libreBaskerville = Libre_Baskerville({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-baskerville",
});

const mavenPro = Maven_Pro({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-maven",
});

const marvel = Marvel({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-marvel",
});

const kavoon = Kavoon({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-kavoon",
});

export const metadata: Metadata = {
  title: "N-Shoe | Premium Footwear",
  description: "Experience the romance and cocoon of luxury shoes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${libreBaskerville.variable} ${mavenPro.variable} ${marvel.variable} ${kavoon.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-[#000000] overflow-x-hidden selection:bg-[#d33a10] selection:text-white">
        {children}
      </body>
    </html>
  );
}
