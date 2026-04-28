"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
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
  extended_story_heading?: string;
  extended_story_text?: string;
  artist_bio?: string;
  detail_image?: string | null;
};

type DetailSection = {
  edition_label: string;
  title: string;
  headline: string;
  detail_image?: string | null;
  body_left_intro: string;
  body_left_heading: string;
  body_left_text: string;
  body_right_heading: string;
  body_right_text: string;
  body_right_extra: string;
  artist_heading: string;
  artist_text_left: string;
  artist_text_right: string;
  artist_name: string;
  artist_image?: string | null;
};

type ShoesPageData = {
  hero_image: string;
  page_title: string;
  page_subtitle: string;
  ocean_bg_image: string;
  detail_section: DetailSection | null;
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
  detail_section: {
    edition_label: "Limited Edition 100",
    title: "No Quarter",
    headline: "Hoisting the black flag means no quarter given: it's your booty or your life",
    detail_image: "/images/shoe-no-quarter-detail.jpg",
    body_left_intro: "The Golden Age of Piracy ranged from 1650 to 1730 coinciding with the beginning of the Nantucket whaling. Whale oil was incredibly valuable was literally the worth its in gold. So Nantucket whaling ships were a fat prize for pirates.",
    body_left_heading: "The Pirate Round 1690s",
    body_left_text: "A brief period where pirates from the Caribbean and North American ports began making long-distance voyages to the Indian Ocean to rob wealthy merchant targets.",
    body_right_heading: "Post-Spanish Succession Period c. 1715-1730",
    body_right_text: "The most famous era, when thousands of unemployed sailors and privateers turned to piracy after the War of the Spanish Succession. This period saw the rise of legendary figures like Blackbeard, Bartholomew Roberts, and the female pirates Anne Bonny and Mary Read.",
    body_right_extra: "Five notorious pirates sailed the waters around Nantucket in search of whaling ships laden with oil. Their flags make up the No Quarter shoe pattern: Black Sam Bellamy, Ned Low, Blackbeard, William Kidd and Thomas Tew",
    artist_heading: "About the Artist",
    artist_text_left: "We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation: We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation: We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation:",
    artist_text_right: "We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation: We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation: We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation:",
    artist_name: "Charlemagne Christe",
    artist_image: null,
  },
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
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Fetch shoe collection
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
            tagline: item.tagline || "",
            edition_label: item.edition_label || "",
            extended_story_heading: item.extended_story_heading || "",
            extended_story_text: item.extended_story_text || "",
            artist_bio: item.artist_bio || "",
            detail_image: getStrapiMedia(item.detail_image?.url ?? null),
          }))
        );
      }
    });
  }, []);

  // Fetch shoes-page single type
  useEffect(() => {
    fetchAPI("/shoes-page", {
      populate: {
        hero_image: true,
        ocean_bg_image: true,
        detail_section: { populate: { detail_image: true, artist_image: true } },
      },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          const ds = d.detail_section;
          setPageData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK_PAGE.hero_image,
            page_title: d.page_title || FALLBACK_PAGE.page_title,
            page_subtitle: d.page_subtitle || FALLBACK_PAGE.page_subtitle,
            ocean_bg_image: getStrapiMedia(d.ocean_bg_image?.url ?? null) ?? FALLBACK_PAGE.ocean_bg_image,
            detail_section: ds
              ? {
                  edition_label: ds.edition_label || FALLBACK_PAGE.detail_section!.edition_label,
                  title: ds.title || FALLBACK_PAGE.detail_section!.title,
                  headline: ds.headline || FALLBACK_PAGE.detail_section!.headline,
                  detail_image: getStrapiMedia(ds.detail_image?.url ?? null) ?? FALLBACK_PAGE.detail_section!.detail_image,
                  body_left_intro: ds.body_left_intro || FALLBACK_PAGE.detail_section!.body_left_intro,
                  body_left_heading: ds.body_left_heading || FALLBACK_PAGE.detail_section!.body_left_heading,
                  body_left_text: ds.body_left_text || FALLBACK_PAGE.detail_section!.body_left_text,
                  body_right_heading: ds.body_right_heading || FALLBACK_PAGE.detail_section!.body_right_heading,
                  body_right_text: ds.body_right_text || FALLBACK_PAGE.detail_section!.body_right_text,
                  body_right_extra: ds.body_right_extra || FALLBACK_PAGE.detail_section!.body_right_extra,
                  artist_heading: ds.artist_heading || FALLBACK_PAGE.detail_section!.artist_heading,
                  artist_text_left: ds.artist_text_left || FALLBACK_PAGE.detail_section!.artist_text_left,
                  artist_text_right: ds.artist_text_right || FALLBACK_PAGE.detail_section!.artist_text_right,
                  artist_name: ds.artist_name || FALLBACK_PAGE.detail_section!.artist_name,
                  artist_image: getStrapiMedia(ds.artist_image?.url ?? null) ?? FALLBACK_PAGE.detail_section!.artist_image,
                }
              : FALLBACK_PAGE.detail_section,
          });
        }
      })
      .catch(() => {});
  }, []);

  const selected = shoes.find((s) => s.id === selectedId);
  const ds = pageData.detail_section;

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

      {/* ── DETAIL SECTION (ocean background) — from shoes-page single type ── */}
      {ds && (
        <section className="relative w-full py-10 md:py-20 px-3 md:px-10">
          {/* Ocean background */}
          <div className="absolute inset-0 z-0">
            <Image src={pageData.ocean_bg_image} alt="" fill className="object-cover" />
          </div>
          {/* White card overlay — 80% opacity per Figma */}
          {/* Single continuous 2-column grid: left flows headline→body, right flows shoe→artist */}
          <div className="relative z-10 bg-white/80 max-w-[1280px] mx-auto px-5 md:px-16 py-10 md:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 md:gap-x-12">

              {/* ═══ LEFT COLUMN: edition label → title → headline → body text ═══ */}
              <div>
                <p className="font-maven font-medium text-[#564215] text-[11px] tracking-[0.05em] mb-3 uppercase">
                  {ds.edition_label}
                </p>
                <h2 className="font-kavoon text-[#413c3c] text-[28px] md:text-[40px] leading-tight tracking-[-0.01em] mb-6 md:mb-10">
                  {ds.title}
                </h2>
                <h3 className="font-marvel text-[#413c3c] text-[24px] md:text-[36px] leading-[1.15] max-w-[520px] mb-8 md:mb-10">
                  {ds.headline}
                </h3>

                {/* Body text paragraphs */}
                <div className="space-y-6">
                  <p className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                    {ds.body_left_intro}
                  </p>
                  <div>
                    <h4 className="font-maven font-bold text-[#413c3c] text-[13px] mb-2">{ds.body_left_heading}</h4>
                    <p className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                      {ds.body_left_text}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-maven font-bold text-[#413c3c] text-[13px] mb-2">
                      {ds.body_right_heading}
                    </h4>
                    <p className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                      {ds.body_right_text}
                    </p>
                  </div>
                  <p className="font-maven font-bold text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                    {ds.body_right_extra}
                  </p>
                </div>
              </div>

              {/* ═══ RIGHT COLUMN: shoe image → artist section ═══ */}
              <div>
                {/* Shoe image + share */}
                <div className="relative mb-8 md:mb-10">
                  <div className="absolute top-0 right-0 z-20 flex items-center gap-3 bg-white px-3 py-2">
                    <span className="font-maven font-semibold text-[#4b4c4b] text-[11px] tracking-[0.15em]">SHARE</span>
                    <div className="w-7 h-7 bg-[#3b5998] flex items-center justify-center">
                      <span className="font-bold text-white text-[16px] leading-none">f</span>
                    </div>
                  </div>
                  <div className="relative bg-[#f5f5f2] w-full" style={{ aspectRatio: "1/0.75" }}>
                    {ds.detail_image && (
                      <Image
                        src={ds.detail_image}
                        alt={ds.title}
                        fill
                        className="object-contain p-8"
                      />
                    )}
                  </div>
                </div>

                {/* About the Artist — label+name left, photo right, bio below */}
                <div className="grid grid-cols-[1fr_auto] gap-4 items-center mb-4">
                  {/* Left: label + name stacked */}
                  <div>
                    <p className="font-maven font-semibold text-[#413c3c] text-[13px] tracking-[0.15em] uppercase mb-3">
                      {ds.artist_heading}
                    </p>
                    <h3 className="font-marvel text-[#413c3c] text-[28px] md:text-[36px] leading-[1.15]">
                      {ds.artist_name}
                    </h3>
                  </div>
                  {/* Right: circular photo */}
                  {ds.artist_image ? (
                    <div className="w-[140px] h-[140px] md:w-[168px] md:h-[168px] rounded-full overflow-hidden relative flex-shrink-0">
                      <Image
                        src={ds.artist_image}
                        alt={ds.artist_name || "Artist"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : <div />}
                </div>
                {/* Bio text below */}
                <p className="font-maven text-[#413c3c] text-[13px] leading-[20px] tracking-[-0.05em]">
                  {ds.artist_text_right}
                </p>
              </div>

            </div>
          </div>
        </section>
      )}

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
                src={pageData.ocean_bg_image}
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
                  <div className="w-full h-full bg-white flex items-center justify-center">
                    <span className="font-maven text-[#4b4c4b] text-[13px] tracking-[0.1em]">{global.image_coming_soon_text}</span>
                  </div>
                )}
              </div>

              {/* Right: details */}
              <div className="flex-1 p-5 md:p-10 flex flex-col justify-start overflow-y-auto">
                <p className="font-maven font-semibold text-[#d33a10] text-[11px] tracking-[0.2em] mb-1 uppercase">
                  {selected.edition_label || global.default_edition_label}
                </p>
                <h2 className="font-kavoon text-[#564215] text-[22px] md:text-[28px] leading-tight tracking-[-0.02em] mb-1 pr-12">
                  {selected.name}
                </h2>
                {selected.tagline && (
                  <p className="font-baskerville italic text-[#413c3c] text-[17px] leading-snug mb-5">
                    {selected.tagline}
                  </p>
                )}

                {/* Share */}
                <div className="flex gap-3 mb-6">
                  <span className="font-maven text-[13px] text-[#4b4c4b] tracking-[0.1em]">SHARE</span>
                  <span className="font-maven text-[13px] text-[#d33a10] tracking[0.1em] cursor-pointer hover:underline">f</span>
                </div>

                <p className="font-maven text-[#000] text-[13px] leading-[28px] mb-6">
                  {selected.description}
                </p>

                {selected.extended_story_heading && selected.extended_story_text && (
                  <div className="border-t border-[#d9d9d9] pt-4 mb-6">
                    <p className="font-maven font-semibold text-[12px] tracking-[0.1em] text-[#413c3c] mb-2">
                      {selected.extended_story_heading}
                    </p>
                    <p className="font-maven text-[#4b4c4b] text-[12px] leading-[22px]">
                      {selected.extended_story_text}
                    </p>
                  </div>
                )}

                {selected.artist_bio && (
                  <div className="border-t border-[#d9d9d9] pt-4 mb-6">
                    <p className="font-maven font-semibold text-[12px] tracking-[0.1em] text-[#413c3c] mb-2">{global.about_artist_label}</p>
                    <p className="font-maven text-[#4b4c4b] text-[12px] leading-[22px]">
                      {selected.artist_bio}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#d9d9d9]">
                  <span className="font-baskerville text-[#564215] text-[28px]">${selected.price}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Footer credit ── */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          {global.photo_credit}
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
