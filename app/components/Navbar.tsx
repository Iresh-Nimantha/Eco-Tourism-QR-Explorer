// components/Navbar.tsx
"use client"; 

import { useState } from "react";
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // 1. Import useRouter

const navLinks = [
    { name: "Home", href: "/" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "Explore places", href: "/explore" },
    { name: "About us", href: "/#about" },
    // You'll need to create a /contact page for this link to work
    // { name: "Contact us", href: "/contact" },
];

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const router = useRouter(); // 2. Get router instance
    const currentPath = router.pathname;

    return (
        // --- FIX: Updated navbar theme to dark green ---
        <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-emerald-900/90 shadow-lg backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
                {/* Left: Logo */}
                <Link href="/" className="text-lg font-semibold text-white hover:text-emerald-100">
                    <div className="flex items-center space-x-3">
                        <Image
                            src="/logo.png"
                            alt="Eco Tour Logo"
                            width={40}
                            height={40}
                            className="object-contain"
                        />
                        <span className="sr-only">Eco Tour QR</span>
                    </div>
                </Link>

                {/* Center: Navigation (desktop only) */}
                <div className="hidden flex-1 justify-center md:flex">
                    <div className="flex space-x-8 font-medium text-[16px]">
                        {navLinks.map(link => {
                            const isActive = currentPath === link.href;
                            return (
                                <Link key={link.href} href={link.href}>
                                    {/* --- FIX: Updated link styles with active state --- */}
                                    <span className={`cursor-pointer transition-all duration-200 hover:text-white ${
                                        isActive ? 'text-white' : 'text-emerald-100/80'
                                    }`}>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Hamburger for mobile */}
                <div className="md:hidden">
                    <button
                        className="p-2"
                        aria-label="Open menu"
                        onClick={() => setOpen(x => !x)}
                    >
                        {/* --- FIX: Changed icon color for dark background --- */}
                        <svg className="h-7 w-7 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d={open ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile dropdown */}
            {open && (
                // --- FIX: Updated mobile menu theme ---
                <div className="border-t border-white/10 bg-emerald-900 shadow md:hidden">
                    <div className="flex flex-col space-y-3 py-4 px-5">
                        {navLinks.map((link) => {
                            const isActive = currentPath === link.href;
                            return (
                                <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                                    <span className={`block py-2 text-base font-medium transition-colors hover:text-white ${
                                        isActive ? 'text-white' : 'text-emerald-100/80'
                                    }`}>
                                        {link.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}