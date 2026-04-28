import type { Metadata } from "next";
import { Libre_Baskerville, Maven_Pro, Marvel, Kavoon } from "next/font/google";
import { SiteGlobalProvider } from "@/lib/SiteGlobalContext";
import "./globals.css";

/** Server-side URL for Strapi (resolves inside Docker network) */
const SERVER_STRAPI_URL =
  process.env.STRAPI_URL || process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

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

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(`${SERVER_STRAPI_URL}/api/site-global`, {
      next: { revalidate: 60 } as RequestInit["next"],
    });
    if (res.ok) {
      const json = await res.json();
      if (json?.data) {
        return {
          title: json.data.site_title || "N-Shoe | Premium Footwear",
          description: json.data.site_description || "Experience the romance and cocoon of luxury shoes.",
        };
      }
    }
  } catch {}
  return {
    title: "N-Shoe | Premium Footwear",
    description: "Experience the romance and cocoon of luxury shoes.",
  };
}

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
        <SiteGlobalProvider>{children}</SiteGlobalProvider>
      </body>
    </html>
  );
}
