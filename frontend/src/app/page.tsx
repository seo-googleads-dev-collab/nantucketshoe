"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";

type HomeContent = {
  hero_image: string;
  hero_video_1: string;
  hero_video_2: string;
  paisley_image: string;
  shoe_small_image: string;
  beach_image: string;
  wanderlust_eyebrow: string;
  wanderlust_title: string;
  wanderlust_text: string;
  limited_edition_eyebrow: string;
  limited_edition_title: string;
  limited_edition_text: string;
  sandbar_eyebrow: string;
  sandbar_title: string;
  sandbar_text: string;
};

const DEFAULTS: HomeContent = {
  hero_image: "/images/home-hero.jpg",
  hero_video_1: "/videos/IMG_8201.mp4",
  hero_video_2: "/videos/IMG_9519.mp4",
  paisley_image: "/images/home-paisley.jpg",
  shoe_small_image: "/images/home-shoe-small.jpg",
  beach_image: "/images/home-beach.jpg",
  wanderlust_eyebrow: "Nantucket's Wanderlust",
  wanderlust_title: "Like Ink For Your Feet",
  wanderlust_text:
    "Ports attract people with adventure in their hearts: curious, restless, and keenly optimistic. For 400 years, rascals and raconteurs alike have walked Nantucket's docks and cobblestones. Nantucket's seaman were some of the first to venture to the Pacific, chasing whales and discovering wild and strange cultures. Our art shoes tell Nantucket's stories, then and now. Are we selling Nantucket? Nah, who can afford it? Instead we champion Nantucket's wanderlust.",
  limited_edition_eyebrow: "Wandering Nantucket & The Globe",
  limited_edition_title: "Limited Edition Shoes",
  limited_edition_text:
    "Our creative director has partnered with tattoo artists, illustrators and librarians to tell Nantucket's stories. Illustrator Charlemagne Criste from Manila, The Philippines, created the retro 70s Surf Punk shoe. Tattoo artist Chris Harris, of Bristol, England inked The Order of Two Pennies shoe. Only 100 shoes are made, numbered and signed.",
  sandbar_eyebrow: "Getting Off The Sandbar",
  sandbar_title: "29% for Wandering",
  sandbar_text:
    "As the East Coast's most distant island, getting off the island is a bit of work and costly. We are, in fact, 29 miles at sea. Nantucket Shoe donates 29% of profits to help Nantucket High School students tour colleges, pay application fees and attend cultural events. We especially support the children of the island's work force — painters, maids, gardeners, waiters — who make Nantucket magical and support students intrigued by the arts.",
};

export default function Home() {
  const [c, setC] = useState<HomeContent>(DEFAULTS);

  useEffect(() => {
    fetchAPI("/home-page", {
      populate: ["hero_image", "hero_video_1", "hero_video_2", "paisley_image", "shoe_small_image", "beach_image"],
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setC({
            hero_image: getStrapiMedia(d.hero_image?.url) ?? DEFAULTS.hero_image,
            hero_video_1: getStrapiMedia(d.hero_video_1?.url) ?? DEFAULTS.hero_video_1,
            hero_video_2: getStrapiMedia(d.hero_video_2?.url) ?? DEFAULTS.hero_video_2,
            paisley_image: getStrapiMedia(d.paisley_image?.url) ?? DEFAULTS.paisley_image,
            shoe_small_image: getStrapiMedia(d.shoe_small_image?.url) ?? DEFAULTS.shoe_small_image,
            beach_image: getStrapiMedia(d.beach_image?.url) ?? DEFAULTS.beach_image,
            wanderlust_eyebrow: d.wanderlust_eyebrow || DEFAULTS.wanderlust_eyebrow,
            wanderlust_title: d.wanderlust_title || DEFAULTS.wanderlust_title,
            wanderlust_text: d.wanderlust_text || DEFAULTS.wanderlust_text,
            limited_edition_eyebrow: d.limited_edition_eyebrow || DEFAULTS.limited_edition_eyebrow,
            limited_edition_title: d.limited_edition_title || DEFAULTS.limited_edition_title,
            limited_edition_text: d.limited_edition_text || DEFAULTS.limited_edition_text,
            sandbar_eyebrow: d.sandbar_eyebrow || DEFAULTS.sandbar_eyebrow,
            sandbar_title: d.sandbar_title || DEFAULTS.sandbar_title,
            sandbar_text: d.sandbar_text || DEFAULTS.sandbar_text,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white text-black">

      {/* ── HERO: wave photo background ── */}
      <section className="relative w-full overflow-hidden" style={{ aspectRatio: "16/9", minHeight: 360 }}>
        {/* Background: wave/ocean photo */}
        <Image
          src={c.hero_image}
          alt="Nantucket wave"
          fill
          className="object-cover object-center"
          priority
        />

        <HeroNav linkColor="#413c3c" hamburgerColor="#413c3c" />

        {/* Decorative lines left — desktop only */}
        <div className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-20 flex-col gap-3">
          {[0,1,2].map(i => <div key={i} className="w-[25px] h-[1.5px] bg-white" />)}
        </div>
      </section>

      {/* ── Photo credit ── */}
      <div className="py-3 px-8 flex justify-end border-b border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>

      {/* ── SECTION 1: Video (IMG_8201 — crop from bottom) + Wanderlust text ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-0 md:min-h-[600px]">
        {/* LEFT: circular video, crop from bottom */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex items-center justify-center py-10 md:py-16 px-6 md:px-10 bg-white"
        >
          <div className="relative w-[260px] h-[260px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-4 border-[#d9d9d9] shadow-xl">
            <video
              src={c.hero_video_1}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center bottom" }}
            />
          </div>
        </motion.div>

        {/* RIGHT: Wanderlust text */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="px-6 md:px-12 py-10 md:py-16"
        >
          <p className="font-maven font-semibold text-[#d33a10] text-[12px] md:text-[13px] tracking-[0.2em] mb-3 uppercase">
            {c.wanderlust_eyebrow}
          </p>
          <h2 className="font-baskerville text-[#564215] text-[26px] md:text-[32px] leading-[1.2] tracking-[0.02em] mb-5 md:mb-6">
            {c.wanderlust_title}
          </h2>
          <p className="font-maven text-black text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em] max-w-[500px]">
            {c.wanderlust_text}
          </p>
        </motion.div>
      </section>

      {/* ── Charcoal divider ── */}
      <div className="w-full h-[6px] bg-[#413c3c]" />

      {/* ── SECTION 2: Limited Edition text + Paisley pattern ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-0 md:min-h-[600px]">
        {/* LEFT: text + small shoe */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="px-6 md:px-12 py-10 md:py-16 flex flex-col justify-center order-2 md:order-1"
        >
          <p className="font-maven font-semibold text-[#d33a10] text-[12px] md:text-[13px] tracking-[0.2em] mb-3 uppercase">
            {c.limited_edition_eyebrow}
          </p>
          <h2 className="font-baskerville text-[#564215] text-[26px] md:text-[32px] leading-[1.2] tracking-[0.02em] mb-5 md:mb-6">
            {c.limited_edition_title}
          </h2>
          <p className="font-maven text-black text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em] max-w-[500px] mb-6 md:mb-8">
            {c.limited_edition_text}
          </p>
          {/* Small shoe image */}
          <div className="relative w-[160px] h-[110px]">
            <Image src={c.shoe_small_image} alt="Limited edition shoe" fill className="object-contain" />
          </div>
        </motion.div>

        {/* RIGHT: Paisley / pattern image */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="relative h-[320px] md:h-[600px] w-full overflow-hidden order-1 md:order-2"
        >
          <Image
            src={c.paisley_image}
            alt="No Quarter shoe pattern"
            fill
            className="object-cover"
          />
        </motion.div>
      </section>

      {/* ── SECTION 3: Video (IMG_9519 — crop from top) + 29% text ── */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center gap-0 md:min-h-[600px] bg-[#fffafa]">
        {/* LEFT: circular video, crop from top */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="flex items-center justify-center py-10 md:py-16 px-6 md:px-10"
        >
          <div className="relative w-[260px] h-[260px] md:w-[420px] md:h-[420px] rounded-full overflow-hidden border-4 border-[#d9d9d9] shadow-xl">
            <video
              src={c.hero_video_2}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="absolute inset-0 w-full h-full object-cover"
              style={{ objectPosition: "center top" }}
            />
          </div>
        </motion.div>

        {/* RIGHT: 29% text */}
        <motion.div
          initial={false}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="px-6 md:px-12 py-10 md:py-16"
        >
          <p className="font-maven font-semibold text-[#d33a10] text-[12px] md:text-[13px] tracking-[0.2em] mb-3 uppercase">
            {c.sandbar_eyebrow}
          </p>
          <h2 className="font-baskerville text-[#564215] text-[26px] md:text-[32px] leading-[1.2] tracking-[0.02em] mb-5 md:mb-6">
            {c.sandbar_title}
          </h2>
          <p className="font-maven text-black text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em] max-w-[500px]">
            {c.sandbar_text}
          </p>
        </motion.div>
      </section>

      {/* ── FOOTER: Full-width beach photo ── */}
      <section className="relative w-full h-[280px] md:h-[700px] overflow-hidden">
        <Image
          src={c.beach_image}
          alt="Nantucket beach"
          fill
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/10" />
      </section>

      {/* ── Credit bar ── */}
      <div className="py-4 px-4 md:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 bg-white border-t border-[#d9d9d9]">
        <Link href="/shoes" className="font-maven font-semibold text-[12px] md:text-[13px] tracking-[0.15em] text-[#413c3c] hover:text-[#d33a10] transition-colors">
          EXPLORE COLLECTION →
        </Link>
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>

    </div>
  );
}
