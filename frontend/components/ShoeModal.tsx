"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

interface Shoe {
  id: number;
  slug: string;
  name: string;
  price: number;
  description: string;
  image: string;
  sizes: number[];
  category?: string;
  inStock: boolean;
}

interface ModalProps {
  shoe: Shoe | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ShoeModal({ shoe, isOpen, onClose }: ModalProps) {
  const [selectedSize, setSelectedSize] = useState<number | null>(null);

  return (
    <AnimatePresence>
      {isOpen && shoe && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-deepBlack/80 z-[100] backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, y: "100%", scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: "100%", scale: 0.9 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className="fixed inset-4 md:inset-10 z-[101] bg-pureWhite overflow-hidden rounded-2xl shadow-2xl flex flex-col md:flex-row"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-offWhite/80 backdrop-blur-md rounded-full flex items-center justify-center text-charcoal hover:bg-earthBrown hover:text-pureWhite transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Left/Top: Image Area */}
            <div className="relative w-full h-1/2 md:h-full md:w-3/5 bg-lightGray/10 flex items-center justify-center p-8 border-b md:border-b-0 md:border-r border-lightGray">
              <motion.div
                layoutId={`shoe-image-${shoe.id}`}
                className="relative w-full h-full max-h-[60vh]"
              >
                <Image
                  src={shoe.image}
                  alt={shoe.name}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  priority
                />
              </motion.div>
            </div>

            {/* Right/Bottom: Content Area */}
            <div className="w-full h-1/2 md:h-full md:w-2/5 p-8 md:p-12 overflow-y-auto flex flex-col justify-center">
              {shoe.category && (
                <span className="text-sm tracking-widest text-rustOrange font-marvel uppercase mb-4 block">
                  {shoe.category}
                </span>
              )}
              
              <h2 className="text-3xl md:text-5xl font-baskerville text-deepBlack mb-4">
                {shoe.name}
              </h2>
              
              <div className="text-2xl font-maven font-medium text-earthBrown mb-8">
                ${shoe.price.toFixed(2)}
              </div>

              <div 
                className="prose prose-stone mb-8 font-maven text-darkGray max-w-none"
                dangerouslySetInnerHTML={{ __html: shoe.description }}
              />

              <div className="mb-8">
                <h3 className="text-sm font-semibold tracking-wider text-charcoal mb-3 uppercase">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {shoe.sizes?.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-full border flex items-center justify-center font-maven transition-all
                        ${selectedSize === size 
                          ? 'bg-earthBrown text-pureWhite border-earthBrown scale-110' 
                          : 'border-lightGray hover:border-earthBrown text-deepBlack'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-8 border-t border-lightGray">
                <button 
                  disabled={!shoe.inStock}
                  className={`w-full py-5 px-8 rounded-full font-marvel font-bold text-lg tracking-widest uppercase transition-all
                    ${shoe.inStock 
                      ? 'bg-nearBlack text-pureWhite hover:bg-rustOrange shadow-lg hover:shadow-xl' 
                      : 'bg-lightGray text-charcoal cursor-not-allowed'}`}
                >
                  {shoe.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
