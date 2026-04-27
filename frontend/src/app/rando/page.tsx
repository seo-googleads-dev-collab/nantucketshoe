"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";

type RandoItem = {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  bottom_text: string;
  circular_image?: string | null;
  feature_images: string[];
};

type RandoData = {
  hero_image?: string | null;
  intro_title: string;
  intro_text: string;
  items: RandoItem[];
};

const PLACEHOLDER_DESC =
  "We want you to have more than all the comforts of home. Put the rush of the modern world in its place when you escape to Alpine Falls Ranch's finest accommodation.";

const FALLBACK: RandoData = {
  hero_image: "/images/rando-hero.jpg",
  intro_title: "Rando",
  intro_text:
    "Random shoes, random stories, random rewards. Rando is our rotating collection of one-offs, experiments, and collaborations that don't fit anywhere else.",
  items: [
    {
      id: 1,
      title: "Item One",
      subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC,
      bottom_text: "AMENITIES + POLICIES + Open",
      circular_image: null,
      feature_images: [],
    },
    {
      id: 2,
      title: "Item Two",
      subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC,
      bottom_text: "AMENITIES + POLICIES + Open",
      circular_image: null,
      feature_images: [],
    },
    {
      id: 3,
      title: "Item Three",
      subtitle: "LIMITED EDITION 100",
      description: PLACEHOLDER_DESC,
      bottom_text: "AMENITIES + POLICIES + Open",
      circular_image: null,
      feature_images: [],
    },
  ],
};

export default function RandoPage() {
  const [data, setData] = useState<RandoData>(FALLBACK);
  const [currentItem, setCurrentItem] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchAPI("/rando-page", {
      populate: {
        hero_image: true,
        items: { populate: { circular_image: true, feature_images: true } },
      },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            hero_image:
              getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK.hero_image,
            intro_title: d.intro_title || FALLBACK.intro_title,
            intro_text: d.intro_text || FALLBACK.intro_text,
            items:
              Array.isArray(d.items) && d.items.length > 0
                ? d.items.map((it: any) => ({
                    id: it.id,
                    title: it.title || "",
                    subtitle: it.subtitle || "LIMITED EDITION 100",
                    description: it.description || PLACEHOLDER_DESC,
                    bottom_text: it.bottom_text || "",
                    circular_image: getStrapiMedia(
                      it.circular_image?.url ?? null
                    ),
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

  const item = data.items[currentItem] || data.items[0];
  const images = item?.feature_images ?? [];

  const prevSlide = () =>
    setCurrentSlide((s) => (s > 0 ? s - 1 : s));
  const nextSlide = () =>
    setCurrentSlide((s) => (s < images.length - 1 ? s + 1 : s));

  // Reset slide when item changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [currentItem]);

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="relative w-full overflow-hidden h-[260px] md:h-[420px]">
        {data.hero_image && (
          <Image
            src={data.hero_image}
            alt=""
            fill
            className="object-cover object-center"
            priority
          />
        )}
        <HeroNav linkColor="#ffffff" hamburgerColor="#ffffff" />
      </section>

      {/* Intro */}
      <section className="max-w-[800px] mx-auto text-center px-5 md:px-10 py-12 md:py-16">
        <h1 className="font-kavoon text-[#564215] text-[32px] md:text-[40px] tracking-[-0.03em] mb-4">
          {data.intro_title}
        </h1>
        <p className="font-maven text-[#4b4c4b] text-[13px] md:text-[14px] leading-[26px] md:leading-[28px]">
          {data.intro_text}
        </p>
      </section>

      {/* Ocean bg section — replaces old grid */}
      <section className="relative w-full py-10 md:py-20 px-3 md:px-10">
        {/* Ocean background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/modal-ocean-bg.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>

        {/* White card */}
        <div className="relative z-10 bg-white/80 max-w-[1086px] mx-auto px-5 md:px-12 py-8 md:py-12">
          {/* Close / X button — optional nav, top-right */}
          <button
            className="absolute top-0 right-0 w-[50px] h-[50px] md:w-[62px] md:h-[62px] bg-[#040404] text-white flex items-center justify-center hover:bg-[#d33a10] transition-colors z-10"
            onClick={() => setCurrentItem(0)}
            aria-label="Close"
          >
            <span className="font-maven text-[20px]">X</span>
          </button>

          {/* LIMITED EDITION + Name */}
          <div className="mb-6">
            <p className="font-maven font-medium text-[#434141] text-[11px] tracking-[0.05em] leading-[20px] uppercase">
              {item.subtitle}
            </p>
            <h2 className="font-kavoon text-[#413c3c] text-[28px] md:text-[36px] tracking-[-0.02em] mt-1">
              {item.title}
            </h2>
          </div>

          {/* Circular image + description */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-8 md:mb-12">
            {/* Circle */}
            <div className="relative w-[140px] h-[140px] md:w-[168px] md:h-[168px] rounded-full overflow-hidden bg-[#d9d9d9] flex-shrink-0 mx-auto md:mx-0">
              {item.circular_image ? (
                <Image
                  src={item.circular_image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            {/* Description */}
            <p className="font-maven text-[#000000] text-[13px] leading-[20px] max-w-[529px]">
              {item.description}
            </p>
          </div>

          {/* Feature image slider */}
          <div className="relative flex items-center justify-center mb-8">
            {/* Prev arrow */}
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              aria-label="Previous image"
              className="absolute left-0 md:-left-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black text-[28px] md:text-[36px] disabled:opacity-20 disabled:cursor-not-allowed hover:text-[#d33a10] transition-colors"
            >
              ‹
            </button>

            {/* Image */}
            <div className="relative w-full max-w-[706px] aspect-[706/533] bg-[#e8e4dc] overflow-hidden mx-8 md:mx-14">
              {images.length > 0 ? (
                <Image
                  src={images[currentSlide]}
                  alt={`${item.title} image ${currentSlide + 1}`}
                  fill
                  className="object-cover transition-opacity duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-maven text-[#4b4c4b] text-[11px] tracking-[0.1em]">
                    IMAGE COMING SOON
                  </span>
                </div>
              )}
              {/* Slide indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentSlide(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentSlide ? "bg-white" : "bg-white/50"
                      }`}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Next arrow */}
            <button
              onClick={nextSlide}
              disabled={currentSlide === images.length - 1 || images.length === 0}
              aria-label="Next image"
              className="absolute right-0 md:-right-4 z-10 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-black text-[28px] md:text-[36px] disabled:opacity-20 disabled:cursor-not-allowed hover:text-[#d33a10] transition-colors"
            >
              ›
            </button>
          </div>

          {/* Bottom text bar */}
          {item.bottom_text && (
            <div className="mt-4">
              <p className="font-maven font-semibold text-[#000000] text-[16px] md:text-[36px] leading-[28px]">
                {item.bottom_text}
              </p>
            </div>
          )}
        </div>

        {/* Item navigation dots — cycle through rando items */}
        {data.items.length > 1 && (
          <div className="relative z-10 flex justify-center gap-3 mt-6">
            {data.items.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentItem(i)}
                className={`w-3 h-3 rounded-full border-2 transition-colors ${
                  i === currentItem
                    ? "bg-white border-white"
                    : "bg-transparent border-white/70 hover:bg-white/50"
                }`}
                aria-label={`Go to item ${i + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer credit */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>
    </div>
  );
}
