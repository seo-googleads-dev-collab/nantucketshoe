"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useSiteGlobal } from "@/lib/SiteGlobalContext";

export default function PageNav() {
  const global = useSiteGlobal();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const drawer = open && (
    <div className="md:hidden fixed inset-0 z-[9999] bg-black/95 flex flex-col">
      <button aria-label="Close menu" onClick={() => setOpen(false)}
        className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center">
        <span className="font-maven text-white text-[32px] leading-none">×</span>
      </button>
      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        {global.nav_links.map(l => (
          <Link key={l.label} href={l.href} onClick={() => setOpen(false)}
            className="font-maven font-semibold text-white text-[22px] tracking-[0.2em] hover:text-[#d33a10] transition-colors">
            {l.label}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-4 md:px-10 py-3 md:py-4 bg-white border-b border-[#d9d9d9]">
      {/* Logo */}
      <Link href="/" className="relative" style={{ width: 80, height: 56 }}>
        <Image src={global.logo} alt="Nantucket Shoe" fill className="object-contain" priority />
      </Link>

      {/* Desktop nav */}
      <div className="hidden md:flex items-center gap-5 md:gap-8">
        {global.nav_links.map(l => {
          const active = pathname === l.href;
          return (
            <Link key={l.label} href={l.href} className="relative">
              <span className="font-maven font-semibold text-[13px] tracking-[0.15em] transition-colors duration-200"
                style={{ color: active ? "#d33a10" : "#413c3c" }}>
                {l.label}
              </span>
              {active && <div className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#d33a10]" />}
            </Link>
          );
        })}
      </div>

      {/* Mobile hamburger */}
      <button aria-label="Open menu" onClick={() => setOpen(true)}
        className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-[5px]">
        <span className="block w-6 h-[2px] bg-[#413c3c]" />
        <span className="block w-6 h-[2px] bg-[#413c3c]" />
        <span className="block w-6 h-[2px] bg-[#413c3c]" />
      </button>

      {mounted && typeof window !== "undefined" && createPortal(drawer, document.body)}
    </nav>
  );
}
