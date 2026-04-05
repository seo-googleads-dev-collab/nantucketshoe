"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Image from "next/image";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import HeroNav from "@/components/HeroNav";

type Shoe = {
  id: number;
  name: string;
  price: string | number;
  color: string;
  description?: string;
  image?: string | null;
};

const FALLBACK_SHOES: Shoe[] = [
  {
    id: 1, name: "NO QUARTER", price: 299, color: "Earth Brown",
    description: "When flying the black flag meant your booty or your life. Five notorious pirates sailed the waters around Nantucket in search of whaling ships. Their flags make up the No Quarter shoe pattern: Black Sam Bellamy, Ned Low, Blackbeard, William Kidd and Thomas Tew.",
    image: "/images/shoe-no-quarter.jpg",
  },
  {
    id: 2, name: "SURF PUNK", price: 345, color: "Pacific Blue",
    description: "Retro 70s Pacific wanderlust captured in every stitch. Illustrator Charlemagne Criste from Manila, The Philippines, created this wild-riding shoe. Only 100 made, numbered and signed.",
    image: "/images/shoe-surf-punk.jpg",
  },
  {
    id: 3, name: "WASHASHORE", price: 250, color: "Nantucket Gray",
    description: "A washashore is someone who came to Nantucket and never left. These are the artists, dreamers, and wanderers who made the island their home. This shoe is for them.",
    image: "/images/shoe-two-pennies.jpg",
  },
  {
    id: 4, name: "THE ORDER OF TWO PENNIES", price: 410, color: "Midnight Black",
    description: "Tattoo artist Chris Harris, of Bristol, England inked this intricate limited edition. The Order of Two Pennies represents the pirates' code — equal share for all who sail. Only 100 made, numbered and signed.",
    image: null,
  },
];

const IMAGE_MAP: Record<string, string> = {
  "NO QUARTER": "/images/shoe-no-quarter.jpg",
  "SURF PUNK": "/images/shoe-surf-punk.jpg",
  "WASHASHORE": "/images/shoe-two-pennies.jpg",
  "THE ORDER OF TWO PENNIES": "/images/shoe-two-pennies.jpg",
};

export default function ShoesPage() {
  const [shoes, setShoes] = useState<Shoe[]>(FALLBACK_SHOES);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    fetchAPI("/shoes", { populate: "*" }).then((result) => {
      if (result?.data?.length > 0) {
        setShoes(
          result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            color: item.color || "—",
            description: item.description || undefined,
            image: getStrapiMedia(item.image?.url ?? null) ?? IMAGE_MAP[item.name] ?? null,
          }))
        );
      }
    });
  }, []);

  const selected = shoes.find((s) => s.id === selectedId);

  return (
    <div className="bg-white text-black">

      {/* ── HERO: shoes studio photo ── */}
      <section className="relative w-full overflow-hidden h-[300px] md:h-[480px]">
        <Image
          src="/images/shoes-hero.jpg"
          alt="Nantucket Shoe studio"
          fill
          className="object-cover object-center"
          priority
        />
        <HeroNav linkColor="#ffffff" hamburgerColor="#ffffff" />
      </section>

      {/* ── Photo credit ── */}
      <div className="py-3 px-4 md:px-8 flex justify-end border-b border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>

      {/* ── Page header ── */}
      <div className="text-center pt-8 md:pt-12 pb-6 md:pb-10 px-4">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-kavoon text-[#564215] text-[30px] md:text-[40px] tracking-[-0.03em] leading-[1.3] md:leading-[58px]"
        >
          Nantucket Shoes
        </motion.h1>
        <p className="font-maven text-[#4b4c4b] text-[12px] md:text-[13px] tracking-[0.1em] mt-1 uppercase">
          Limited Editions · Numbered &amp; Signed
        </p>
      </div>

      {/* ── Shoe Grid: 3 col first row, 1 centered second row ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 pb-10 md:pb-16">
        {/* First row: 3 shoes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
          {shoes.slice(0, 3).map((shoe, index) => (
            <ShoeCard key={shoe.id} shoe={shoe} index={index} onClick={() => setSelectedId(shoe.id)} />
          ))}
        </div>
        {/* Second row: remaining shoes centered */}
        {shoes.length > 3 && (
          <div className="flex justify-center gap-4 md:gap-6">
            {shoes.slice(3).map((shoe, index) => (
              <div key={shoe.id} className="w-full max-w-[380px]">
                <ShoeCard shoe={shoe} index={index + 3} onClick={() => setSelectedId(shoe.id)} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── NO QUARTER DETAIL SECTION (ocean background) ── */}
      <section className="relative w-full py-10 md:py-20 px-3 md:px-10">
        {/* Ocean background */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/modal-ocean-bg.jpg" alt="" fill className="object-cover" />
        </div>
        {/* White card overlay */}
        <div className="relative z-10 bg-white max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-16">
          {/* Top: heading left, image right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-16">
            {/* LEFT: labels + big headline */}
            <div>
              <p className="font-maven font-semibold text-[#564215] text-[11px] tracking-[0.25em] mb-3 uppercase">
                Limited Edition 100
              </p>
              <h2 className="font-baskerville font-bold text-[#413c3c] text-[28px] md:text-[36px] leading-tight tracking-[-0.01em] mb-6 md:mb-12">
                No Quarter
              </h2>
              <h3 className="font-marvel font-bold text-[#413c3c] text-[24px] md:text-[36px] leading-[1.25] max-w-[520px]">
                Hoisting the black flag means no quarter given: it&apos;s your booty or your life
              </h3>
            </div>
            {/* RIGHT: shoe image + share */}
            <div className="relative">
              <div className="absolute top-0 right-0 z-20 flex items-center gap-3 bg-white px-3 py-2">
                <span className="font-maven font-semibold text-[#4b4c4b] text-[11px] tracking-[0.15em]">SHARE</span>
                <div className="w-7 h-7 bg-[#3b5998] flex items-center justify-center">
                  <span className="font-bold text-white text-[16px] leading-none">f</span>
                </div>
              </div>
              <div className="relative aspect-square bg-[#f5f5f2] w-full">
                <Image
                  src="/images/shoe-no-quarter-detail.jpg"
                  alt="No Quarter shoe"
                  fill
                  className="object-contain p-8"
                />
              </div>
            </div>
          </div>

          {/* Body text: two columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-10 md:mb-12">
            {/* LEFT column */}
            <div className="space-y-6">
              <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                The Golden Age of Piracy ranged from 1650 to 1730 coinciding with the beginning of the
                Nantucket whaling. Whale oil was incredibly valuable was literally the worth its in gold.
                So Nantucket whaling ships were a fat prize for pirates.
              </p>
              <div>
                <h4 className="font-maven font-bold text-[#413c3c] text-[13px] mb-2">The Pirate Round 1690s</h4>
                <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                  A brief period where pirates from the Caribbean and North American ports began making
                  long-distance voyages to the Indian Ocean to rob wealthy merchant targets.
                </p>
              </div>
            </div>
            {/* RIGHT column */}
            <div className="space-y-6">
              <div>
                <h4 className="font-maven font-bold text-[#413c3c] text-[13px] mb-2">
                  Post-Spanish Succession Period c. 1715-1730
                </h4>
                <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                  The most famous era, when thousands of unemployed sailors and privateers turned to piracy
                  after the War of the Spanish Succession. This period saw the rise of legendary figures
                  like Blackbeard, Bartholomew Roberts, and the female pirates Anne Bonny and Mary Read.
                </p>
              </div>
              <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                Five notorious pirates sailed the waters around Nantucket in search of whaling ships laden
                with oil. Their flags make up the No Quarter shoe pattern: Black Sam Bellamy, Ned Low,
                Blackbeard, William Kidd and Thomas Tew
              </p>
            </div>
          </div>

          {/* About the Artist */}
          <div>
            <h4 className="font-maven font-bold text-[#413c3c] text-[12px] tracking-[0.15em] uppercase mb-3 pb-3 border-b border-[#d9d9d9]">
              About the Artist
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 pt-4">
              <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                We want you to have more than all the comforts of home. Put the rush of the modern world
                in its place when you escape to Alpine Falls Ranch&apos;s finest accommodation: We want you
                to have more than all the comforts of home. Put the rush of the modern world in its place
                when you escape to Alpine Falls Ranch&apos;s finest accommodation: We want you to have more
                than all the comforts of home. Put the rush of the modern world in its place when you
                escape to Alpine Falls Ranch&apos;s finest accommodation:
              </p>
              <p className="font-maven text-[#413c3c] text-[13px] leading-[26px]">
                We want you to have more than all the comforts of home. Put the rush of the modern world
                in its place when you escape to Alpine Falls Ranch&apos;s finest accommodation: We want you
                to have more than all the comforts of home. Put the rush of the modern world in its place
                when you escape to Alpine Falls Ranch&apos;s finest accommodation: We want you to have more
                than all the comforts of home. Put the rush of the modern world in its place when you
                escape to Alpine Falls Ranch&apos;s finest accommodation:
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Modal ── */}
      <AnimatePresence>
        {selectedId && selected && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
            {/* Backdrop with shoe product background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedId(null)}
              className="absolute inset-0"
            >
              <Image
                src="/images/modal-ocean-bg.jpg"
                alt=""
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
            </motion.div>

            {/* Modal panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col md:flex-row z-10 shadow-2xl"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedId(null)}
                className="absolute top-0 right-0 w-[50px] h-[50px] md:w-[75px] md:h-[75px] bg-[#040404] flex items-center justify-center z-20 hover:bg-[#d33a10] transition-colors"
              >
                <span className="font-maven text-[#fffefb] text-[22px]">X</span>
              </button>

              {/* Left: shoe image */}
              <div className="relative w-full md:w-[45%] aspect-square bg-[#f5f5f5] flex-shrink-0">
                {selected.image ? (
                  <Image src={selected.image} alt={selected.name} fill className="object-contain p-10" />
                ) : (
                  <div className="w-full h-full bg-[#e8e4dc] flex items-center justify-center">
                    <span className="font-maven text-[#4b4c4b] text-[13px] tracking-[0.1em]">IMAGE COMING SOON</span>
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div className="flex-1 p-5 md:p-10 flex flex-col justify-start overflow-y-auto">
                <p className="font-maven font-semibold text-[#d33a10] text-[11px] tracking-[0.2em] mb-1 uppercase">
                  Limited Edition 100
                </p>
                <h2 className="font-kavoon text-[#564215] text-[22px] md:text-[28px] leading-tight tracking-[-0.02em] mb-1 pr-12">
                  {selected.name}
                </h2>
                <p className="font-baskerville italic text-[#413c3c] text-[17px] leading-snug mb-5">
                  {selected.name === "NO QUARTER" && "When flying the black flag meant your booty or your life"}
                  {selected.name === "SURF PUNK" && "Retro 70s Pacific wanderlust"}
                  {selected.name === "WASHASHORE" && "For those who came to Nantucket and never left"}
                  {selected.name === "THE ORDER OF TWO PENNIES" && "Equal share for all who sail"}
                </p>

                {/* Share */}
                <div className="flex gap-3 mb-6">
                  <span className="font-maven text-[13px] text-[#4b4c4b] tracking-[0.1em]">SHARE</span>
                  <span className="font-maven text-[13px] text-[#d33a10] tracking[0.1em] cursor-pointer hover:underline">f</span>
                </div>

                <p className="font-maven text-[#000] text-[13px] leading-[28px] mb-6">
                  {selected.description}
                </p>

                {selected.name === "NO QUARTER" && (
                  <div className="border-t border-[#d9d9d9] pt-4 mb-6">
                    <p className="font-maven font-semibold text-[12px] tracking-[0.1em] text-[#413c3c] mb-2">THE GOLDEN AGE OF PIRACY</p>
                    <p className="font-maven text-[#4b4c4b] text-[12px] leading-[22px]">
                      The Golden Age of Piracy ranged from 1650 to 1730 coinciding with the beginning of the Nantucket whaling.
                      The Pirate Round — a brief period where pirates from the Caribbean and North American ports began making
                      long-distance voyages to the Indian Ocean to rob wealthy merchant targets.
                    </p>
                  </div>
                )}

                <div className="border-t border-[#d9d9d9] pt-4 mb-6">
                  <p className="font-maven font-semibold text-[12px] tracking-[0.1em] text-[#413c3c] mb-2">ABOUT THE ARTIST</p>
                  <p className="font-maven text-[#4b4c4b] text-[12px] leading-[22px]">
                    One of 100 numbered and signed limited editions. Each shoe tells Nantucket&apos;s story through the hands of a world-class artist.
                  </p>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#d9d9d9]">
                  <span className="font-baskerville text-[#564215] text-[28px]">${selected.price}</span>
                  <button className="font-maven font-semibold text-[12px] md:text-[13px] tracking-[0.15em] bg-[#040404] text-[#fffefb] px-5 md:px-8 py-3 hover:bg-[#d33a10] transition-colors">
                    ADD TO CART
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Footer credit ── */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>
    </div>
  );
}

function ShoeCard({ shoe, index, onClick }: { shoe: Shoe; index: number; onClick: () => void }) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      onClick={onClick}
      className="cursor-pointer group border border-[#aaa3a3] hover:border-[#d33a10] transition-colors duration-300"
    >
      {/* Image area */}
      <div className="relative bg-[#e8e4dc] overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {shoe.image ? (
          <Image
            src={shoe.image}
            alt={shoe.name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-[#e8e4dc]" />
        )}
      </div>
      {/* Label */}
      <div className="py-4 px-5 border-t border-[#d9d9d9]">
        <h3 className="font-marvel font-bold text-[#4b4c4b] text-[16px] tracking-[0.12em] group-hover:text-[#d33a10] transition-colors uppercase">
          {shoe.name}
        </h3>
      </div>
    </motion.div>
  );
}
