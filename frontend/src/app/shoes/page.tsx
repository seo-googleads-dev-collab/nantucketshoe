"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { useSiteGlobal } from "@/lib/SiteGlobalContext";
import HeroNav from "@/components/HeroNav";

type Shoe = {
  id: number;
  name: string;
  price: string | number;
  color: string;
  description?: string;
  image?: string | null;
  tagline?: string;
  edition_label?: string;
  detail_image?: string | null;
  artist?: {
    name: string;
    image?: string | null;
    bio?: string;
  };
};

type ShoesPageData = {
  hero_image: string;
  page_title: string;
  page_subtitle: string;
  ocean_bg_image: string;
};

const FALLBACK_SHOES: Shoe[] = [
  {
    id: 1, name: "NO QUARTER", price: 299, color: "Earth Brown",
    description: "When flying the black flag meant your booty or your life. Five notorious pirates sailed the waters around Nantucket in search of whaling ships. Their flags make up the No Quarter shoe pattern: Black Sam Bellamy, Ned Low, Blackbeard, William Kidd and Thomas Tew.",
    image: "/images/shoe-no-quarter.jpg",
    tagline: "When flying the black flag meant your booty or your life",
    edition_label: "Limited Edition 100",
  },
  {
    id: 2, name: "SURF PUNK", price: 345, color: "Pacific Blue",
    description: "Retro 70s Pacific wanderlust captured in every stitch. Illustrator Charlemagne Criste from Manila, The Philippines, created this wild-riding shoe. Only 100 made, numbered and signed.",
    image: "/images/shoe-surf-punk.jpg",
    tagline: "Retro 70s Pacific wanderlust",
    edition_label: "Limited Edition 100",
  },
  {
    id: 3, name: "WASHASHORE", price: 250, color: "Nantucket Gray",
    description: "A washashore is someone who came to Nantucket and never left. These are the artists, dreamers, and wanderers who made the island their home. This shoe is for them.",
    image: "/images/shoe-two-pennies.jpg",
    tagline: "For those who came to Nantucket and never left",
    edition_label: "Limited Edition 100",
  },
  {
    id: 4, name: "THE ORDER OF TWO PENNIES", price: 410, color: "Midnight Black",
    description: "Tattoo artist Chris Harris, of Bristol, England inked this intricate limited edition. The Order of Two Pennies represents the pirates' code — equal share for all who sail. Only 100 made, numbered and signed.",
    image: null,
    tagline: "Equal share for all who sail",
    edition_label: "Limited Edition 100",
  },
];

const FALLBACK_PAGE: ShoesPageData = {
  hero_image: "/images/shoes-hero.jpg",
  page_title: "Nantucket Shoes",
  page_subtitle: "Limited Editions · Numbered & Signed",
  ocean_bg_image: "/images/modal-ocean-bg.jpg",
};

const IMAGE_MAP: Record<string, string> = {
  "NO QUARTER": "/images/shoe-no-quarter.jpg",
  "SURF PUNK": "/images/shoe-surf-punk.jpg",
  "WASHASHORE": "/images/shoe-two-pennies.jpg",
  "THE ORDER OF TWO PENNIES": "/images/shoe-two-pennies.jpg",
};

export default function ShoesPage() {
  const global = useSiteGlobal();
  const [shoes, setShoes] = useState<Shoe[]>(FALLBACK_SHOES);
  const [pageData, setPageData] = useState<ShoesPageData>(FALLBACK_PAGE);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Fetch shoe collection
  useEffect(() => {
    fetchAPI("/shoes", {
      populate: {
        image: true,
        detail_image: true,
        artist: {
          populate: {
            image: true,
          },
        },
      },
    }).then((result) => {
      if (result?.data?.length > 0) {
        setShoes(
          result.data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            color: item.color || "—",
            description: item.description || undefined,
            image: getStrapiMedia(item.image?.url ?? null) ?? IMAGE_MAP[item.name] ?? null,
            tagline: item.tagline || "",
            edition_label: item.edition_label || "",
            detail_image: getStrapiMedia(item.detail_image?.url ?? null),
            artist: item.artist
              ? {
                  name: item.artist.name || "",
                  image: getStrapiMedia(item.artist.image?.url ?? null),
                  bio: item.artist.bio || "",
                }
              : undefined,
          }))
        );
      }
    });
  }, []);

  // Fetch shoes-page single type (hero, title, subtitle, ocean bg)
  useEffect(() => {
    fetchAPI("/shoes-page", {
      populate: {
        hero_image: true,
        ocean_bg_image: true,
      },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setPageData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK_PAGE.hero_image,
            page_title: d.page_title || FALLBACK_PAGE.page_title,
            page_subtitle: d.page_subtitle || FALLBACK_PAGE.page_subtitle,
            ocean_bg_image: getStrapiMedia(d.ocean_bg_image?.url ?? null) ?? FALLBACK_PAGE.ocean_bg_image,
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleExpand = useCallback(
    (id: number) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    []
  );

  // Chunk shoes into rows of 3
  const rows: Shoe[][] = [];
  for (let i = 0; i < shoes.length; i += 3) {
    rows.push(shoes.slice(i, i + 3));
  }

  return (
    <div className="bg-white text-black">

      {/* ── HERO: shoes studio photo ── */}
      <section className="relative w-full overflow-hidden h-[300px] md:h-[480px]">
        <Image
          src={pageData.hero_image}
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
          {global.photo_credit}
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
          {pageData.page_title}
        </motion.h1>
        <p className="font-maven text-[#4b4c4b] text-[12px] md:text-[13px] tracking-[0.1em] mt-1 uppercase">
          {pageData.page_subtitle}
        </p>
      </div>

      {/* ── Shoe Grid with inline expand (Rando-style) ── */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-10 pb-10 md:pb-16">
        {rows.map((row, rowIdx) => {
          // Find if any tile in this row is expanded
          const expandedShoe = row.find((shoe) => shoe.id === expandedId) || null;

          return (
            <div key={rowIdx}>
              {/* Grid row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                {row.map((shoe, index) => (
                  <ShoeCard
                    key={shoe.id}
                    shoe={shoe}
                    index={rowIdx * 3 + index}
                    isExpanded={expandedId === shoe.id}
                    onClick={() => toggleExpand(shoe.id)}
                  />
                ))}
                {/* Fill empty slots in last row */}
                {row.length < 3 &&
                  Array.from({ length: 3 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
              </div>

              {/* Inline expand below this row */}
              <AnimatePresence>
                {expandedShoe && (
                  <motion.div
                    key={`expand-${expandedShoe.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden mb-4 md:mb-6"
                  >
                    <ShoeExpandedDetail
                      shoe={expandedShoe}
                      oceanBg={pageData.ocean_bg_image}
                      onClose={() => setExpandedId(null)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* ── Footer credit ── */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          {global.photo_credit}
        </p>
      </div>
    </div>
  );
}

/* ── Shoe Card Component ── */
function ShoeCard({
  shoe,
  index,
  isExpanded,
  onClick,
}: {
  shoe: Shoe;
  index: number;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      initial={false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.6 }}
      onClick={onClick}
      className={`cursor-pointer group border-[3px] transition-colors duration-300 ${
        isExpanded
          ? "border-[#d33a10]"
          : "border-[#aaa3a3] hover:border-[#d33a10]"
      }`}
    >
      {/* Image area */}
      <div className="relative bg-white overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {shoe.image ? (
          <Image
            src={shoe.image}
            alt={shoe.name}
            fill
            className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white" />
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

/* ── Expanded Detail Panel (appears inline below the row) ── */
function ShoeExpandedDetail({
  shoe,
  oceanBg,
  onClose,
}: {
  shoe: Shoe;
  oceanBg: string;
  onClose: () => void;
}) {
  return (
    <section className="relative w-full py-8 md:py-14 px-3 md:px-8">
      {/* Ocean background */}
      <div className="absolute inset-0 z-0">
        <Image src={oceanBg} alt="" fill className="object-cover" />
      </div>

      {/* White card overlay */}
      <div className="relative z-10 bg-white/80 max-w-[1280px] mx-auto px-5 md:px-16 py-8 md:py-14">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-0 right-0 w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-[#040404] text-white flex items-center justify-center hover:bg-[#d33a10] transition-colors z-20"
          aria-label="Close"
        >
          <span className="font-maven text-[18px]">X</span>
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12">

          {/* ═══ LEFT COLUMN: edition label → title → headline → body text ═══ */}
          <div>
            <p className="font-maven font-medium text-[#564215] text-[11px] tracking-[0.05em] mb-3 uppercase">
              {shoe.edition_label || "Limited Edition 100"}
            </p>
            <h2 className="font-kavoon text-[#413c3c] text-[28px] md:text-[40px] leading-tight tracking-[-0.01em] mb-6 md:mb-10">
              {shoe.name}
            </h2>
            <h3 className="font-marvel text-[#413c3c] text-[24px] md:text-[36px] leading-[1.15] max-w-[520px] mb-8 md:mb-10">
              {shoe.tagline}
            </h3>

            {/* Body text — render paragraphs from single field */}
            {shoe.description && (
              <div className="space-y-4">
                {shoe.description.split(/\n\n+/).map((para, i) => (
                  <p key={i} className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                    {para}
                  </p>
                ))}
              </div>
            )}
          </div>

          {/* ═══ RIGHT COLUMN: shoe detail image → artist section ═══ */}
          <div>
            {/* Shoe detail image + share */}
            <div className="relative mb-8 md:mb-10">
              <div className="absolute top-0 right-0 z-20 flex items-center gap-3 bg-white px-3 py-2">
                <span className="font-maven font-semibold text-[#4b4c4b] text-[11px] tracking-[0.15em]">SHARE</span>
                <div className="w-7 h-7 bg-[#3b5998] flex items-center justify-center">
                  <span className="font-bold text-white text-[16px] leading-none">f</span>
                </div>
              </div>
              <div className="relative bg-[#f5f5f2] w-full" style={{ aspectRatio: "1/0.75" }}>
                {shoe.detail_image ? (
                  <Image
                    src={shoe.detail_image}
                    alt={shoe.name}
                    fill
                    className="object-contain p-8"
                  />
                ) : shoe.image ? (
                  <Image
                    src={shoe.image}
                    alt={shoe.name}
                    fill
                    className="object-contain p-8"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="font-maven text-[#4b4c4b] text-[13px] tracking-[0.1em]">Image coming soon</span>
                  </div>
                )}
              </div>
            </div>

            {/* About the Artist */}
            {shoe.artist && (
              <>
                <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-4">
                  {/* Left: label + name stacked */}
                  <div>
                    <p className="font-maven font-semibold text-[#413c3c] text-[13px] tracking-[0.15em] uppercase mb-3">
                      About the Artist
                    </p>
                    {shoe.artist.name && (
                      <h3 className="font-marvel text-[#413c3c] text-[28px] md:text-[36px] leading-[1.15]">
                        {shoe.artist.name}
                      </h3>
                    )}
                  </div>
                  {/* Right: circular photo */}
                  {shoe.artist.image ? (
                    <div className="w-[140px] h-[140px] md:w-[168px] md:h-[168px] rounded-full overflow-hidden relative flex-shrink-0">
                      <Image
                        src={shoe.artist.image}
                        alt={shoe.artist.name || "Artist"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : <div />}
                </div>
                {/* Bio text below — render paragraphs from single field */}
                {shoe.artist.bio && (
                  <div className="space-y-4">
                    {shoe.artist.bio.split(/\n\n+/).map((para, i) => (
                      <p key={i} className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                        {para}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Price */}
            <div className="mt-6 pt-4 border-t border-[#d9d9d9]">
              <span className="font-baskerville text-[#564215] text-[28px]">${shoe.price}</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
