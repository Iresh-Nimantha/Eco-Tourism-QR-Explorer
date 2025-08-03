import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { name: "Home", href: "/" },
  { name: "How it works", href: "/#how-it-works" },
  { name: "Explore places", href: "/explore" },
  { name: "About us", href: "/#about" },
  { name: "Contact Form", href: "/#contact-section" },
  
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white/95 backdrop-blur-md shadow-sm fixed w-full z-30 top-0 left-0 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/">
          <div className="flex items-center space-x-3">
            <Image
              src="/logo.png"     // <-- You can also use /logo.svg
              alt="Eco Tour Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="sr-only">Eco Tour QR</span>
          </div>
        </Link>

        {/* Center: Navigation (desktop only) */}
        <div className="hidden md:flex flex-1 justify-center">
          <div className="flex space-x-8 text-gray-700 font-medium text-[16px]">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href}>
                <span className="hover:text-green-600 cursor-pointer transition-all duration-200">
                  {link.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Hamburger for mobile */}
        <div className="md:hidden">
          <button
            className="p-2"
            aria-label="Open menu"
            onClick={() => setOpen(x => !x)}
          >
            <svg className="h-7 w-7 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="md:hidden bg-white shadow flex flex-col space-y-3 py-4 px-5 text-gray-700">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
              <span className="block text-base py-2 hover:text-green-600 font-medium">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
