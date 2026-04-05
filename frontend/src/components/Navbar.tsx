"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: "SHOES", path: "/shoes" },
    { name: "ABOUT", path: "/about" },
    { name: "CONTACT", path: "/contact" },
    { name: "RANDO", path: "/rando" },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-5 bg-white/90 backdrop-blur-sm border-b border-[#d9d9d9]"
    >
      <Link href="/" className="font-kavoon text-[28px] tracking-[-0.03em] text-earthBrown leading-none">
        Nantucket Shoe
      </Link>
      <div className="flex items-center gap-10">
        {links.map((link) => {
          const isActive = pathname === link.path;
          return (
            <Link key={link.name} href={link.path} className="relative group">
              <span
                className="font-maven font-semibold text-[13px] tracking-[0.15em] transition-colors duration-200"
                style={{
                  color: isActive ? "#d33a10" : "#413c3c",
                  letterSpacing: "0.15em",
                }}
              >
                {link.name}
              </span>
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#d33a10]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </motion.nav>
  );
}
