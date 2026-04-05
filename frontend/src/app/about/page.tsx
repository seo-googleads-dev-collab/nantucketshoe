"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import HeroNav from "@/components/HeroNav";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";

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
  founder_story: string;
  artists: Artist[];
};

const FALLBACK: AboutData = {
  hero_image: "/images/about-hero.jpg",
  founder_story:
    "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born (shoes on the right). Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the genius of its artists, Leighton's role is to coach, cajole and sometimes barks at his illustrators and otherwise keeps the stories behind the shoes true to Nantucket and the crazy people who make a sand bar 25 miles out to sea a home and a crossroads.",
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
      location: "Manilla, Phillippines",
      website: "www.website",
      story:
        "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born. Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the art of its illustrators. Leighton coaches, cajoles and barks at his artists and keeps the stories behind the art genuine and true.",
      image: null,
    },
    {
      id: 3,
      name: "Artist Three",
      location: "Manilla, Phillippines",
      website: "www.website",
      story:
        "Nantucket Shoe was founded by Leighton Collis on his adopted hometown. Nantucket. An advertising creative director and early tech work, Leighton and his teams created the first LasVegas.com, the last Saab sports car website and countless good and awful ad campaigns. A restless creator, he has developed historic preservation projects, including Hotel Ginger on Martha's Vineyard (shoes on the left). It was for the Hotel Ginger team that he designed his first art shoe and a fascination was born. Advertising, architecture and shoes demand inspiration and collaboration. Nantucket Shoe exists through the art of its illustrators. Leighton coaches, cajoles and barks at his artists and keeps the stories behind the art genuine and true.",
      image: null,
    },
  ],
};

export default function AboutPage() {
  const [data, setData] = useState<AboutData>(FALLBACK);

  useEffect(() => {
    fetchAPI("/about-page", { populate: { hero_image: true, artists: { populate: "*" } } })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            hero_image: getStrapiMedia(d.hero_image?.url ?? null) ?? FALLBACK.hero_image,
            founder_story: d.founder_story || FALLBACK.founder_story,
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
      {/* HERO starry-night */}
      <section className="relative w-full overflow-hidden h-[320px] md:h-[520px]">
        {data.hero_image && (
          <Image src={data.hero_image} alt="" fill className="object-cover object-center" priority />
        )}
        <HeroNav linkColor="#ffffff" hamburgerColor="#ffffff" />
      </section>

      {/* Founder story */}
      <section className="max-w-[900px] mx-auto px-5 md:px-10 py-14 md:py-20">
        <p className="font-maven text-[#413c3c] text-[13px] md:text-[14px] leading-[26px] md:leading-[28px] text-center">
          {data.founder_story}
        </p>
      </section>

      {/* Artists */}
      {data.artists.map((artist) => (
        <section key={artist.id} className="max-w-[1100px] mx-auto px-5 md:px-10 pb-14 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-14 items-start">
            {/* Circular image */}
            <div className="relative w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full overflow-hidden bg-[#d9d9d9] mx-auto md:mx-0">
              {artist.image ? (
                <Image src={artist.image} alt={artist.name} fill className="object-cover" />
              ) : null}
            </div>
            {/* Text column */}
            <div>
              <div className="text-center md:text-right mb-6">
                <h3 className="font-maven font-semibold text-[#413c3c] text-[18px] md:text-[20px]">
                  {artist.location}
                </h3>
                <p className="font-maven text-[#d33a10] text-[13px] mt-3">
                  <a
                    href={artist.website.startsWith("http") ? artist.website : `https://${artist.website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                  >
                    {artist.website}
                  </a>
                </p>
              </div>
              <p className="font-maven text-[#413c3c] text-[13px] md:text-[14px] leading-[26px] md:leading-[28px]">
                {artist.story}
              </p>
            </div>
          </div>
        </section>
      ))}

      {/* Footer credit */}
      <div className="py-5 px-4 md:px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[11px] md:text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>
    </div>
  );
}
