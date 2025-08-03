"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Translator from "./Translator";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "How it works", href: "#how-it-works" },
  { name: "Explore places", href: "/explore" },
  { name: "About us", href: "#about" },
  { name: "Contact us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const currentPath = usePathname();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Highlight active section when on "/"
  useEffect(() => {
    if (currentPath !== "/") return;

    const sectionIds = navLinks
      .filter((link) => link.href.startsWith("#"))
      .map((link) => link.href.replace("#", ""));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-50% 0px -50% 0px",
        threshold: 0,
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [currentPath]);

  // Close mobile menu on path change
  useEffect(() => {
    setOpen(false);
  }, [currentPath]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    href: string
  ) => {
    e.preventDefault();

    const isAnchor = href.startsWith("#");

    if (href === "/") {
      if (currentPath === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
    } else if (isAnchor) {
      if (currentPath === "/") {
        const id = href.substring(1);
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }

    setOpen(false);
  };

  const isLinkActive = (href: string) => {
    if (href === "/") return currentPath === "/";
    if (href.startsWith("#"))
      return currentPath === "/" && activeSection === href.substring(1);
    return currentPath === href;
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-emerald-900/90 shadow-lg backdrop-blur-md dark:bg-emerald-900/95">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer">
          <Image
            src="/logo.png"
            alt="Eco Tour Logo"
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span className="notranslate text-white text-xl font-semibold select-none">
            Eco Tourism
          </span>
        </Link>

        {/* Desktop Navigation + Translator */}
        <div className="hidden md:flex flex-1 items-center">
          {/* Nav links centered */}
          <div className="flex flex-1 justify-center space-x-8 font-medium text-[16px]">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className={`cursor-pointer transition-colors duration-200 hover:text-white ${
                  isLinkActive(link.href)
                    ? "text-white font-semibold"
                    : "text-emerald-100/80"
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>
          {/* Translator aligned right */}
          <div>
            <Translator />
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            className="p-2 focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Toggle menu"
            onClick={() => setOpen((prev) => !prev)}
          >
            <svg
              className="h-7 w-7 text-gray-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M6 18L18 6M6 6l12 12" : "M4 8h16M4 16h16"}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`border-t border-white/10 bg-emerald-900 shadow md:hidden overflow-hidden transition-max-height duration-300 ease-in-out ${
          open ? "max-h-screen py-4" : "max-h-0"
        }`}
      >
        <div className="flex flex-col space-y-3 px-5">
          <div className="mb-4">
            <Translator />
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`block py-2 text-base font-medium transition-colors hover:text-white rounded ${
                isLinkActive(link.href)
                  ? "text-white font-semibold"
                  : "text-emerald-100/80"
              }`}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
