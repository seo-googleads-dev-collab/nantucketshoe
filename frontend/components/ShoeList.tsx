"use client";

import { useState } from "react";
import ShoeCard from "./ShoeCard";
import ShoeModal from "./ShoeModal";

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

export default function ShoeList({ initialShoes }: { initialShoes: Shoe[] }) {
  const [selectedShoe, setSelectedShoe] = useState<Shoe | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {initialShoes.map((shoe) => (
          <ShoeCard 
            key={shoe.id} 
            shoe={shoe} 
            onClick={() => setSelectedShoe(shoe)} 
          />
        ))}
        {initialShoes.length === 0 && (
          <div className="col-span-full py-20 text-center font-maven text-darkGray">
            No products found in the catalog right now. Check back later!
          </div>
        )}
      </div>

      <ShoeModal 
        shoe={selectedShoe}
        isOpen={!!selectedShoe}
        onClose={() => setSelectedShoe(null)}
      />
    </>
  );
}
