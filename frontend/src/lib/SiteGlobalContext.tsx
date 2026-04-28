"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchAPI, getStrapiMedia } from "@/lib/strapi";

type NavLink = { label: string; href: string };

type SiteGlobal = {
  photo_credit: string;
  logo: string;
  nav_links: NavLink[];
  site_title: string;
  site_description: string;
  explore_collection_text: string;
  image_coming_soon_text: string;
  add_to_cart_text: string;
  about_artist_label: string;
  default_edition_label: string;
};

const DEFAULTS: SiteGlobal = {
  photo_credit: "PHOTO BY NANTUCKET'S DAN LEMAITRE",
  logo: "/images/logo-card.png",
  nav_links: [
    { label: "HOME", href: "/" },
    { label: "SHOES", href: "/shoes" },
    { label: "ABOUT", href: "/about" },
    { label: "CONTACT", href: "/contact" },
    { label: "RANDO", href: "/rando" },
  ],
  site_title: "N-Shoe | Premium Footwear",
  site_description: "Experience the romance and cocoon of luxury shoes.",
  explore_collection_text: "EXPLORE COLLECTION →",
  image_coming_soon_text: "IMAGE COMING SOON",
  add_to_cart_text: "ADD TO CART",
  about_artist_label: "ABOUT THE ARTIST",
  default_edition_label: "Limited Edition 100",
};

const SiteGlobalCtx = createContext<SiteGlobal>(DEFAULTS);

export function useSiteGlobal() {
  return useContext(SiteGlobalCtx);
}

export function SiteGlobalProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteGlobal>(DEFAULTS);

  useEffect(() => {
    fetchAPI("/site-global", {
      populate: { logo: true, nav_links: true },
    })
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            photo_credit: d.photo_credit || DEFAULTS.photo_credit,
            logo: getStrapiMedia(d.logo?.url ?? null) ?? DEFAULTS.logo,
            nav_links:
              Array.isArray(d.nav_links) && d.nav_links.length > 0
                ? d.nav_links.map((l: any) => ({
                    label: l.label || "",
                    href: l.href || "/",
                  }))
                : DEFAULTS.nav_links,
            site_title: d.site_title || DEFAULTS.site_title,
            site_description: d.site_description || DEFAULTS.site_description,
            explore_collection_text: d.explore_collection_text || DEFAULTS.explore_collection_text,
            image_coming_soon_text: d.image_coming_soon_text || DEFAULTS.image_coming_soon_text,
            add_to_cart_text: d.add_to_cart_text || DEFAULTS.add_to_cart_text,
            about_artist_label: d.about_artist_label || DEFAULTS.about_artist_label,
            default_edition_label: d.default_edition_label || DEFAULTS.default_edition_label,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <SiteGlobalCtx.Provider value={data}>{children}</SiteGlobalCtx.Provider>
  );
}
