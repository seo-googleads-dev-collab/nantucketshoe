import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-pureWhite/80 border-b border-lightGray">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex-1">
            <Link href="/" className="text-2xl font-kavoon tracking-wider text-earthBrown">
              N-Shoe
            </Link>
          </div>
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-sm font-maven font-medium hover:text-rustOrange transition-colors">HOME</Link>
            <Link href="/shoes" className="text-sm font-maven font-medium hover:text-rustOrange transition-colors">SHOES</Link>
            <Link href="/about" className="text-sm font-maven font-medium hover:text-rustOrange transition-colors">ABOUT</Link>
            <Link href="/rando" className="text-sm font-maven font-medium hover:text-rustOrange transition-colors">RANDO</Link>
          </nav>
          <div className="flex-1 flex justify-end">
            <button className="md:hidden text-charcoal">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <div className="hidden md:block">
              {/* Optional Cart or User Icon */}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
