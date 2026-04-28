"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";
import { useSiteGlobal } from "@/lib/SiteGlobalContext";

type Artist = {
  id: number | string;
  name: string;
  location: string;
  website: string;
  story: string;
  image?: string | null;
};

type AboutData = {
  hero_image?: string | null;
  page_title: string;
  founder_story: string;
  founder_image?: string | null;
  artists: Artist[];
};

const FALLBACK: AboutData = {
  hero_image: "/images/about-hero.jpg",
  page_title: "Nantucket Shoe",
  founder_story:
    "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born (shoes on the right). Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the genius of its artists, Leighton's role is to coach, cajole and sometimes barks at his illustrators and otherwise keeps the stories behind the shoes true to Nantucket and the crazy people who make a sand bar 25 miles out to sea a home and a crossroads.",
  founder_image: "/images/hotel-shoe.jpg",
  artists: [
    {
      id: 1,
      name: "Charlemange Christe",
      location: "Manilla, Phillippines",
      website: "www.website",
      story:
        "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born. Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the art of its illustrators. Leighton coaches, cajoles and barks at his artists and keeps the stories behind the art genuine and true.",
      image: null,
    },
    {
      id: 2,
      name: "Chris Harris",
      location: "Bristol, England",
      website: "www.website",
      story:
        "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born. Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the art of its illustrators. Leighton coaches, cajoles and barks at his artists and keeps the stories behind the art genuine and true.",
      image: null,
    },
  ],
};

export default function AboutPage() {
  const global = useSiteGlobal();
  const [data, setData] = useState<AboutData>(FALLBACK);

  useEffect(() => {
    fetchAPI("/about-page", {
      populate: {
        hero_image: true,
        founder_image: true,
        artists: { populate: "*" },
      },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK.hero_image,
            page_title: d.page_title || FALLBACK.page_title,
            founder_story: d.founder_story || FALLBACK.founder_story,
            founder_image: getStrapiMedia(d.founder_image?.url ?? null) ?? FALLBACK.founder_image,
            artists:
              Array.isArray(d.artists) && d.artists.length > 0
                ? d.artists.map((a: any) => ({
                    id: a.id,
                    name: a.name || "",
                    location: a.location || "",
                    website: a.website || "",
                    story: a.story || "",
                    image: getStrapiMedia(a.image?.url ?? null),
                  }))
                : FALLBACK.artists,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-white text-black">
      {/* HERO */}
      <section className="relative w-full overflow-hidden h-[320px] md:h-[520px]">
        {data.hero_image && (
          <Image src={data.hero_image} alt="" fill className="object-cover object-center" priority />
        )}
        <HeroNav linkColor="#ffffff" hamburgerColor="#ffffff" />
      </section>

      {/* Page title */}
      <section className="py-10 md:py-14">
        <h1 className="font-kavoon text-[#564215] text-[28px] md:text-[40px] leading-tight tracking-[-0.03em] text-center">
          {data.page_title}
        </h1>
      </section>

      {/* Founder story + shoe image — two columns */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-16 pb-14 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
          {/* Left: founder story text */}
          <div>
            {data.founder_story.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="font-maven text-black text-[13px] md:text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-center mb-6 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
          {/* Right: shoe image */}
          <div className="flex justify-center md:justify-end">
            {data.founder_image && (
              <div className="relative w-[280px] h-[360px] md:w-[396px] md:h-[511px] border border-[#c5c0c0]">
                <Image src={data.founder_image} alt="Shoe" fill className="object-cover" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Artists */}
      {data.artists.map((artist) => (
        <section key={artist.id} className="max-w-[1280px] mx-auto px-5 md:px-16 pb-16 md:pb-24">
          {/* Row 1: Circle image centered */}
          <div className="flex justify-center mb-6">
            <div className="relative w-[240px] h-[240px] md:w-[324px] md:h-[324px] rounded-full overflow-hidden bg-[#d9d9d9]">
              {artist.image ? (
                <Image src={artist.image} alt={artist.name} fill className="object-cover" />
              ) : null}
            </div>
          </div>

          {/* Row 2: Name centered */}
          <h2 className="font-kavoon text-[#564215] text-[24px] md:text-[32px] leading-tight tracking-[-0.03em] text-center mb-2">
            {artist.name}
          </h2>

          {/* Row 3: Location centered */}
          <p className="font-marvel font-bold text-[#4b4c4b] text-[18px] md:text-[24px] tracking-[0.15em] text-center mb-1">
            {artist.location}
          </p>

          {/* Row 4: Website centered */}
          <p className="font-maven text-[#d33a10] text-[13px] text-center mb-8 md:mb-10">
            <a
              href={artist.website.startsWith("http") ? artist.website : `https://${artist.website}`}
              target="_blank"
              rel="noreferrer"
              className="hover:underline"
            >
              {artist.website}
            </a>
          </p>

          {/* Row 5: Story in two columns */}
          <div className="max-w-[1280px] mx-auto" style={{ columns: 2, columnGap: "3rem" }}>
            {artist.story.split("\n\n").map((para, i) => (
              <p
                key={i}
                className="font-maven text-black text-[13px] md:text-[14px] leading-[28px] md:leading-[30px] tracking-[-0.03em] text-center mb-6 last:mb-0"
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* Footer credit */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          {global.photo_credit}
        </p>
      </div>
    </div>
  );
}
