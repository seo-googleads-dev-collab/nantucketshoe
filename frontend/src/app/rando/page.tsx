"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { useSiteGlobal } from "@/lib/SiteGlobalContext";

/* ── Types ── */
type RandoItem = {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  tagline: string;
  website_url: string;
  phone: string;
  bottom_text: string;
  tile_image?: string | null;
  circular_image?: string | null;
  feature_images: string[];
};

type RandoData = {
  hero_image?: string | null;
  ocean_bg_image: string;
  intro_eyebrow: string;
  intro_title: string;
  intro_text: string;
  items: RandoItem[];
};

const PLACEHOLDER_DESC =
  "We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation.";

const FALLBACK: RandoData = {
  hero_image: "/images/rando-hero.jpg",
  ocean_bg_image: "/images/modal-ocean-bg.jpg",
  intro_eyebrow: "NANTUCKET'S WANDERLUST",
  intro_title: "Like Ink For Your Feet",
  intro_text:
    "Ports attract people with adventure in their hearts: curious, restless, and keenly optimistic. For 400 years, rascals and raconteurs alike have walked Nantucket's docks and cobblestones.",
  items: [
    {
      id: 1, title: "No Quarter", subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC, tagline: "Hoisting the black flag means no quarter given",
      website_url: "www.website", phone: "+1 555 0100",
      bottom_text: "", tile_image: null, circular_image: null, feature_images: [],
    },
    {
      id: 2, title: "Surf Punk", subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC, tagline: "Retro 70s Pacific wanderlust",
      website_url: "www.website", phone: "+1 555 0200",
      bottom_text: "", tile_image: null, circular_image: null, feature_images: [],
    },
    {
      id: 3, title: "Washashore", subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC, tagline: "For those who came to Nantucket and never left",
      website_url: "www.website", phone: "+1 555 0300",
      bottom_text: "", tile_image: null, circular_image: null, feature_images: [],
    },
  ],
};

/* ── Main page ── */
export default function RandoPage() {
  const global = useSiteGlobal();
  const [data, setData] = useState<RandoData>(FALLBACK);
  const [expandedId, setExpandedId] = useState<number | string | null>(null);
  const [lightbox, setLightbox] = useState<{ images: string[]; idx: number } | null>(null);

  useEffect(() => {
    fetchAPI("/rando-page", {
      populate: {
        hero_image: true,
        ocean_bg_image: true,
        items: { populate: { tile_image: true, circular_image: true, feature_images: true } },
      },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK.hero_image,
            ocean_bg_image: getStrapiMedia(d.ocean_bg_image?.url ?? null) ?? FALLBACK.ocean_bg_image,
            intro_eyebrow: d.intro_eyebrow || FALLBACK.intro_eyebrow,
            intro_title: d.intro_title || FALLBACK.intro_title,
            intro_text: d.intro_text || FALLBACK.intro_text,
            items:
              Array.isArray(d.items) && d.items.length > 0
                ? d.items.map((it: any) => ({
                    id: it.id,
                    title: it.title || "",
                    subtitle: it.subtitle || "LIMITED EDITION 100",
                    description: it.description || PLACEHOLDER_DESC,
                    tagline: it.tagline || "",
                    website_url: it.website_url || "",
                    phone: it.phone || "",
                    bottom_text: it.bottom_text || "",
                    tile_image: getStrapiMedia(it.tile_image?.url ?? null),
                    circular_image: getStrapiMedia(it.circular_image?.url ?? null),
                    feature_images: Array.isArray(it.feature_images)
                      ? it.feature_images
                          .map((img: any) => getStrapiMedia(img?.url ?? null))
                          .filter(Boolean)
                      : [],
                  }))
                : FALLBACK.items,
          });
        }
      })
      .catch(() => {});
  }, []);

  const toggleExpand = useCallback(
    (id: number | string) => {
      setExpandedId((prev) => (prev === id ? null : id));
    },
    []
  );

  // Chunk items into rows of 3
  const rows: RandoItem[][] = [];
  for (let i = 0; i < data.items.length; i += 3) {
    rows.push(data.items.slice(i, i + 3));
  }

  return (
    <div className="bg-white text-black">
      {/* ── HERO ── */}
      <section className="relative w-full overflow-hidden h-[300px] md:h-[480px]">
        {data.hero_image && (
          <Image src={data.hero_image} alt="" fill className="object-cover object-center" priority />
        )}
        <HeroNav linkColor="#ffffff" hamburgerColor="#ffffff" />
      </section>

      {/* ── INTRO ── */}
      <section className="max-w-[800px] mx-auto text-center px-5 md:px-10 py-12 md:py-16">
        <p className="font-maven font-semibold text-[#050505] text-[11px] md:text-[13px] tracking-[0.35em] uppercase mb-2">
          {data.intro_eyebrow}
        </p>
        <h1 className="font-kavoon text-[#564215] text-[28px] md:text-[40px] tracking-[-0.03em] leading-tight mb-6">
          {data.intro_title}
        </h1>
        <p className="font-maven text-[#4b4c4b] text-[13px] md:text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em]">
          {data.intro_text}
        </p>
      </section>

      {/* ── SHOE GRID with inline expand ── */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-10 pb-10 md:pb-16">
        {rows.map((row, rowIdx) => {
          // Find if any tile in this row is expanded
          const expandedItem = row.find((item) => item.id === expandedId) || null;

          return (
            <div key={rowIdx}>
              {/* Grid row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
                {row.map((item) => (
                  <RandoTile
                    key={item.id}
                    item={item}
                    isExpanded={expandedId === item.id}
                    onClick={() => toggleExpand(item.id)}
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
                {expandedItem && (
                  <motion.div
                    key={`expand-${expandedItem.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="overflow-hidden mb-4 md:mb-5"
                  >
                    <ExpandedDetail
                      item={expandedItem}
                      onClose={() => setExpandedId(null)}
                      onOpenLightbox={(images, idx) => setLightbox({ images, idx })}
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

      {/* ── Page-level Lightbox (outside overflow containers) ── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/85 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-[90vw] max-h-[85vh] w-full aspect-[4/3]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={lightbox.images[lightbox.idx]}
                alt="Gallery expanded"
                fill
                className="object-contain"
              />
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-2 right-2 w-10 h-10 bg-black/60 text-white flex items-center justify-center hover:bg-[#d33a10] transition-colors rounded-full"
                aria-label="Close lightbox"
              >
                X
              </button>
              {lightbox.idx > 0 && (
                <button
                  onClick={() => setLightbox((lb) => lb ? { ...lb, idx: lb.idx - 1 } : null)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 text-white flex items-center justify-center text-[28px] hover:bg-[#d33a10] transition-colors rounded-full"
                  aria-label="Previous image"
                >
                  ‹
                </button>
              )}
              {lightbox.idx < lightbox.images.length - 1 && (
                <button
                  onClick={() => setLightbox((lb) => lb ? { ...lb, idx: lb.idx + 1 } : null)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-black/60 text-white flex items-center justify-center text-[28px] hover:bg-[#d33a10] transition-colors rounded-full"
                  aria-label="Next image"
                >
                  ›
                </button>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Tile Component ── */
function RandoTile({
  item,
  isExpanded,
  onClick,
}: {
  item: RandoItem;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <motion.div
      layout
      onClick={onClick}
      className={`cursor-pointer group relative border-[3px] transition-colors duration-300 ${
        isExpanded
          ? "border-[#d33a10]"
          : "border-[#aaa3a3] hover:border-[#d33a10]"
      }`}
    >
      {/* Square image area with shoe catalog image */}
      <div className="relative bg-white overflow-hidden" style={{ aspectRatio: "1/1" }}>
        {item.tile_image ? (
          <Image
            src={item.tile_image}
            alt={item.title}
            fill
            className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-white" />
        )}

        {/* Name overlaid at bottom of tile */}
        <div className="absolute bottom-0 left-0 right-0 pb-4 px-4 text-center">
          <h3 className="font-marvel font-bold text-[#4b4c4b] text-[22px] md:text-[32px] tracking-[0.15em] uppercase group-hover:text-[#d33a10] transition-colors">
            {item.title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Expanded Detail Panel ── */
function ExpandedDetail({
  item,
  onClose,
  onOpenLightbox,
}: {
  item: RandoItem;
  onClose: () => void;
  onOpenLightbox: (images: string[], idx: number) => void;
}) {
  const [currentImg, setCurrentImg] = useState(0);

  return (
    <div className="bg-white border border-[#d9d9d9] px-6 md:px-10 py-8 md:py-10 relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-0 right-0 w-[44px] h-[44px] md:w-[56px] md:h-[56px] bg-[#040404] text-white flex items-center justify-center hover:bg-[#d33a10] transition-colors z-10"
        aria-label="Close"
      >
        <span className="font-maven text-[18px]">X</span>
      </button>

      {/* Top row: circle | subtitle+name | tagline+website+phone */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_auto_1fr] gap-6 md:gap-8 mb-8 md:mb-10 items-center">
        {/* Circle image */}
        <div className="relative w-[180px] h-[180px] md:w-[220px] md:h-[220px] rounded-full overflow-hidden bg-[#d9d9d9] mx-auto md:mx-0 flex-shrink-0">
          {item.circular_image ? (
            <Image
              src={item.circular_image}
              alt={item.title}
              fill
              className="object-cover"
            />
          ) : null}
        </div>

        {/* Subtitle + Name (next to circle) */}
        <div className="text-center md:text-left">
          <p className="font-baskerville text-[#434141] text-[12px] md:text-[15px] tracking-[0.02em] mb-1">
            {item.subtitle}
          </p>
          <h2 className="font-kavoon text-[#413c3c] text-[24px] md:text-[32px] tracking-[-0.03em] leading-tight">
            {item.title}
          </h2>
        </div>

        {/* Tagline + website + phone (right column) */}
        <div className="flex flex-col justify-center">
          <h3 className="font-marvel text-[#413c3c] text-[24px] md:text-[36px] leading-[1.15] mb-3">
            {item.tagline}
          </h3>
          {item.website_url && (
            <p className="font-maven text-[#413c3c] text-[14px] md:text-[16px] mb-1">
              <a
                href={item.website_url.startsWith("http") ? item.website_url : `https://${item.website_url}`}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#d33a10] transition-colors"
              >
                {item.website_url}
              </a>
            </p>
          )}
          {item.phone && (
            <p className="font-maven text-[#413c3c] text-[14px] md:text-[16px]">
              {item.phone}
            </p>
          )}
        </div>
      </div>

      {/* Body text in two columns */}
      <div
        className="mb-8 md:mb-10"
        style={{ columns: 2, columnGap: "2.5rem" }}
      >
        {item.description.split("\n\n").map((para, i) => (
          <p
            key={i}
            className="font-maven text-[#413c3c] text-[12px] md:text-[13px] leading-[22px] md:leading-[24px] tracking-[-0.03em] mb-4 last:mb-0 break-inside-avoid"
          >
            {para.split("\n").map((line, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {line}
              </span>
            ))}
          </p>
        ))}
      </div>

      {/* ── Single Photo with navigation arrows ── */}
      {item.feature_images.length > 0 && (
        <div
          className="relative bg-[#e8e4dc] cursor-pointer w-full flex items-center justify-center"
          style={{ minHeight: "280px", maxHeight: "520px" }}
          onClick={() => onOpenLightbox(item.feature_images, currentImg)}
        >
          {/* Image shows completely – constrained to container without cropping */}
          <Image
            src={item.feature_images[currentImg]}
            alt={`${item.title} photo ${currentImg + 1}`}
            width={0}
            height={0}
            sizes="100vw"
            style={{
              width: "auto",
              height: "auto",
              maxWidth: "100%",
              maxHeight: "520px",
              display: "block",
              objectFit: "contain",
            }}
          />

          {/* Prev arrow */}
          {currentImg > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImg((i) => i - 1); }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white flex items-center justify-center text-[24px] hover:bg-[#d33a10] transition-colors rounded-full"
              aria-label="Previous photo"
            >
              ‹
            </button>
          )}

          {/* Next arrow */}
          {currentImg < item.feature_images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrentImg((i) => i + 1); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 text-white flex items-center justify-center text-[24px] hover:bg-[#d33a10] transition-colors rounded-full"
              aria-label="Next photo"
            >
              ›
            </button>
          )}
        </div>
      )}

    </div>
  );
}
