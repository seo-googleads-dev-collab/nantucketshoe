"use client";

import { motion } from "framer-motion";
import PageNav from "@/components/PageNav";

export default function ContactPage() {
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
          Contact Us
        </motion.h1>
        <motion.p
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-maven text-[#4b4c4b] text-[14px] leading-[30px] tracking-[-0.03em] mb-10"
        >
          For inquiries about our limited edition shoes, collaborations, or press, reach out below.
        </motion.p>
        <motion.a
          href="mailto:hello@nantucketshoeco.com"
          initial={false}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="font-maven font-semibold text-[13px] tracking-[0.15em] text-[#d33a10] border-b border-[#d33a10] pb-0.5 hover:text-[#564215] hover:border-[#564215] transition-colors"
        >
          hello@nantucketshoeco.com
        </motion.a>
      </section>

      {/* Footer credit */}
      <div className="py-5 px-10 flex justify-end border-t border-[#d9d9d9]">
        <p className="font-maven font-medium text-[#d33a10] text-[13px] tracking-[0.05em]">
          PHOTO BY NANTUCKET&apos;S DAN LEMAITRE
        </p>
      </div>
    </div>
  );
}
