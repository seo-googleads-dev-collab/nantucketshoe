"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";

type RandoItem = {
  id: number | string;
  title: string;
  subtitle?: string;
  image?: string | null;
};

type RandoData = {
  hero_image?: string | null;
  intro_title: string;
  intro_text: string;
  items: RandoItem[];
};

const FALLBACK: RandoData = {
  hero_image: "/images/shoes-hero.jpg",
  intro_title: "Rando",
  intro_text:
    "Random shoes, random stories, random rewards. Rando is our rotating collection of one-offs, experiments, and collaborations that don't fit anywhere else.",
  items: [
    { id: 1, title: "Item One", subtitle: "Limited Edition", image: null },
    { id: 2, title: "Item Two", subtitle: "Limited Edition", image: null },
    { id: 3, title: "Item Three", subtitle: "Limited Edition", image: null },
    { id: 4, title: "Item Four", subtitle: "Limited Edition", image: null },
    { id: 5, title: "Item Five", subtitle: "Limited Edition", image: null },
    { id: 6, title: "Item Six", subtitle: "Limited Edition", image: null },
  ],
};

export default function RandoPage() {
  const [data, setData] = useState<RandoData>(FALLBACK);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetchAPI("/rando-page", { populate: { hero_image: true, items: { populate: "*" } } })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK.hero_image,
            intro_title: d.intro_title || FALLBACK.intro_title,
            intro_text: d.intro_text || FALLBACK.intro_text,
            items:
              Array.isArray(d.items) && d.items.length > 0
                ? d.items.map((it: any) => ({
                    id: it.id,
                    title: it.title || "",
                    subtitle: it.subtitle || "",
                    image: getStrapiMedia(it.image?.url ?? null),
                  }))
                : FALLBACK.items,
          });
        }
      })
      .catch(() => {});
  }, []);

  const currentIdx = data.items.findIndex((i) => i.id === selected);
  const current = currentIdx >= 0 ? data.items[currentIdx] : null;

  const prev = () => {
    if (currentIdx > 0) setSelected(data.items[currentIdx - 1].id as number);
  };
  const next = () => {
    if (currentIdx >= 0 && currentIdx < data.items.length - 1)
      setSelected(data.items[currentIdx + 1].id as number);
  };

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="relative w-full overflow-hidden h-[260px] md:h-[420px]">
        {data.hero_image && (
          <Image src={data.hero_image} alt="" fill className="object-cover object-center" priority />
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

      {/* Grid 2x3 */}
      <section className="max-w-[1100px] mx-auto px-4 md:px-10 pb-16 md:pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
          {data.items.map((item) => (
            <button
              key={item.id}
              onClick={() => setSelected(item.id as number)}
              className="group relative bg-[#e8e4dc] aspect-square overflow-hidden border border-[#d9d9d9] hover:border-[#d33a10] transition-colors"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-maven text-[#4b4c4b] text-[11px] tracking-[0.1em]">
                    IMAGE COMING SOON
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 px-3 py-2 border-t border-[#d9d9d9]">
                <p className="font-marvel font-bold text-[#413c3c] text-[12px] md:text-[14px] tracking-[0.12em] uppercase text-left">
                  {item.title}
                </p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Modal with nav arrows */}
      {current && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            disabled={currentIdx === 0}
            aria-label="Previous"
            className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors z-10"
          >
            <span className="font-maven text-[#413c3c] text-[24px] leading-none">‹</span>
          </button>
          {/* Modal */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-[720px] max-h-[90vh] overflow-hidden flex flex-col"
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="absolute top-0 right-0 w-[50px] h-[50px] md:w-[60px] md:h-[60px] bg-[#040404] text-white flex items-center justify-center hover:bg-[#d33a10] transition-colors z-10"
            >
              <span className="font-maven text-[22px]">X</span>
            </button>
            <div className="relative aspect-square bg-[#f5f5f2]">
              {current.image ? (
                <Image src={current.image} alt={current.title} fill className="object-contain p-8" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-maven text-[#4b4c4b] text-[13px] tracking-[0.1em]">IMAGE COMING SOON</span>
                </div>
              )}
            </div>
            <div className="p-6 md:p-8">
              {current.subtitle && (
                <p className="font-maven font-semibold text-[#d33a10] text-[11px] tracking-[0.2em] mb-1 uppercase">
                  {current.subtitle}
                </p>
              )}
              <h2 className="font-kavoon text-[#564215] text-[22px] md:text-[28px] tracking-[-0.02em]">
                {current.title}
              </h2>
            </div>
          </div>
          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            disabled={currentIdx === data.items.length - 1}
            aria-label="Next"
            className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-white/90 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors z-10"
          >
            <span className="font-maven text-[#413c3c] text-[24px] leading-none">›</span>
          </button>
        </div>
      )}

      {/* Footer credit */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>
    </div>
  );
}
