"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import PageNav from "@/components/PageNav";
import { fetchAPI } from "@/lib/strapi";
import { useSiteGlobal } from "@/lib/SiteGlobalContext";

type ContactData = {
  title: string;
  description: string;
  email: string;
};

const FALLBACK: ContactData = {
  title: "Contact Us",
  description:
    "For inquiries about our limited edition shoes, collaborations, or press, reach out below.",
  email: "hello@nantucketshoeco.com",
};

export default function ContactPage() {
  const global = useSiteGlobal();
  const [data, setData] = useState<ContactData>(FALLBACK);

  useEffect(() => {
    fetchAPI("/contact-page", {})
      .then((res: any) => {
        if (res?.data) {
          const d = res.data;
          setData({
            title: d.title || FALLBACK.title,
            description: d.description || FALLBACK.description,
            email: d.email || FALLBACK.email,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      <PageNav />

      <section className="max-w-[622px] mx-auto px-6 py-24 text-center">
        <motion.h1
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-kavoon text-[#564215] text-[40px] tracking-[-0.03em] leading-[58px] mb-6"
        >
          {data.title}
        </motion.h1>
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-maven text-[#4b4c4b] text-[14px] leading-[30px] tracking-[-0.03em] mb-10"
        >
          {data.description}
        </motion.p>
        <motion.a
          href={`mailto:${data.email}`}
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-maven font-semibold text-[13px] tracking-[0.15em] text-[#d33a10] border-b border-[#d33a10] pb-0.5 hover:text-[#564215] hover:border-[#564215] transition-colors"
        >
          {data.email}
        </motion.a>
      </section>

      {/* Footer credit */}
      <div className="py-5 px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[13px] tracking-[0.05em]">
          {global.photo_credit}
        </p>
      </div>
    </div>
  );
}
