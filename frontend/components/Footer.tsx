export default function Footer() {
  return (
    <footer className="bg-nearBlack text-offWhite py-12 mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="font-kavoon text-2xl tracking-widest text-creamWhite">N-Shoe</div>
          <div className="text-sm font-maven text-lightGray">
            &copy; {new Date().getFullYear()} N-Shoe. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm font-maven">
            <a href="#" className="hover:text-rustOrange transition-colors">Privacy</a>
            <a href="#" className="hover:text-rustOrange transition-colors">Terms</a>
            <a href="/about" className="hover:text-rustOrange transition-colors">About Us</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
