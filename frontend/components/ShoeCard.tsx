import Image from "next/image";

interface Shoe {
  id: number;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
}

export default function ShoeCard({
  shoe,
  onClick,
}: {
  shoe: Shoe;
  onClick: (shoe: Shoe) => void;
}) {
  return (
    <div
      onClick={() => onClick(shoe)}
      className="group cursor-pointer relative flex flex-col items-center bg-offWhite p-6 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 rounded-sm"
    >
      <div className="relative w-full aspect-square mb-6 overflow-hidden bg-lightGray/20 rounded-md">
        <Image
          src={shoe.image}
          alt={shoe.name}
          fill
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="flex flex-col text-center space-y-2">
        {shoe.category && (
          <span className="text-xs uppercase tracking-widest text-charcoal/70 font-marvel">
            {shoe.category}
          </span>
        )}
        <h3 className="font-baskerville text-lg text-deepBlack line-clamp-1">
          {shoe.name}
        </h3>
        <p className="font-maven text-earthBrown font-medium">
          ${shoe.price.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
