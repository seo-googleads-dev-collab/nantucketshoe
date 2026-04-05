"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";

type Props = {
  linkColor?: string;
  hamburgerColor?: string;
};

const LINKS = ["HOME", "SHOES", "ABOUT", "CONTACT", "RANDO"];

export default function HeroNav({
  linkColor = "#413c3c",
  hamburgerColor = "#ffffff",
}: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const drawer = open && (
    <div className="md:hidden fixed inset-0 z-[9999] bg-black/95 flex flex-col">
      <button
        aria-label="Close menu"
        onClick={() => setOpen(false)}
        className="absolute top-5 right-5 w-12 h-12 flex items-center justify-center"
      >
        <span className="font-maven text-white text-[32px] leading-none">×</span>
      </button>
      <nav className="flex-1 flex flex-col items-center justify-center gap-8">
        {LINKS.map((l) => (
          <Link
            key={l}
            href={l === "HOME" ? "/" : `/${l.toLowerCase()}`}
            onClick={() => setOpen(false)}
            className="font-maven font-semibold text-white text-[22px] tracking-[0.2em] hover:text-[#d33a10] transition-colors"
          >
            {l}
          </Link>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Logo top-left */}
      <Link
        href="/"
        className="absolute top-4 left-4 md:top-5 md:left-6 z-30"
        style={{ width: 96, height: 72 }}
      >
        <Image
          src="/images/logo-card.png"
          alt="Nantucket Shoe"
          fill
          className="object-contain"
          priority
        />
      </Link>

      {/* Desktop nav links top-right */}
      <div className="hidden md:flex absolute top-6 right-8 z-20 gap-7">
        {LINKS.map((l) => (
          <Link
            key={l}
            href={l === "HOME" ? "/" : `/${l.toLowerCase()}`}
            className="font-maven font-semibold text-[13px] tracking-[0.15em] hover:text-[#d33a10] transition-colors drop-shadow-sm"
            style={{ color: linkColor }}
          >
            {l}
          </Link>
        ))}
      </div>

      {/* Mobile hamburger button */}
      <button
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="md:hidden absolute top-5 right-5 z-30 w-10 h-10 flex flex-col items-center justify-center gap-[5px]"
      >
        <span className="block w-6 h-[2px]" style={{ background: hamburgerColor }} />
        <span className="block w-6 h-[2px]" style={{ background: hamburgerColor }} />
        <span className="block w-6 h-[2px]" style={{ background: hamburgerColor }} />
      </button>

      {/* Drawer portaled to body to escape overflow:hidden parents */}
      {mounted && typeof window !== "undefined" && createPortal(drawer, document.body)}
    </>
  );
}
