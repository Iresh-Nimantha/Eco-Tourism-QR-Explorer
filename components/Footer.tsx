// src/components/Footer.tsx

import Link from 'next/link';
import Image from 'next/image'; // Import Image component for the logo

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // Main footer container with relative positioning for the absolute background
    <footer className="relative z-10 text-gray-200 overflow-hidden">
      {/* Background Image Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/1.jpg')" }} // Set the background image
        aria-hidden="true" // Hide from screen readers as it's decorative
      ></div>

      {/* Semi-transparent Overlay for Readability */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-80" aria-hidden="true"></div>

      {/* Footer Content - positioned above the background and overlay */}
      <div className="relative mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        {/* Grid layout for the main footer sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16">

          {/* Column 1: Logo and About Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Logo Image */}
            <Image
              src="/logo.png" // Use the provided logo image
              alt="Eco Tourism Logo"
              width={180} // Adjust width as needed
              height={180} // Adjust height as needed
              className="object-contain mb-4 rounded-full shadow-lg" // Added some styling for the logo
            />
            
            
          </div>

          {/* Column 2: Contact Details */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-5">Contact</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-center justify-center md:justify-start gap-3">
                {/* Location Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="3"></circle></svg>
                <span>University Of Colombo Faculty Of Technology</span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                {/* Phone Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-1.11 2.4l-.46.28a15.7 15.7 0 0 0 6.61 6.61l.28-.46a2 2 0 0 1 2.4-1.11 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                <span>Phone: (078 293 2370) </span>
              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                {/* Email Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
    
                  hello@domain.com

              </li>
              <li className="flex items-center justify-center md:justify-start gap-3">
                {/* Skype Icon SVG */}
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400"><path d="M12 2a10 10 0 0 0-9.7 12.4A10.3 10.3 0 0 0 12 22a10 10 0 0 0 9.7-12.4A10.3 10.3 0 0 0 12 2z"></path><path d="M16 10.5c-.92 2.29-2.87 3.63-5.17 3.63-2.17 0-3.93-1.46-3.93-3.63 0-2.17 1.76-3.63 3.93-3.63 2.3 0 4.25 1.34 5.17 3.63z"></path></svg>
                <span>Skype: you_online</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Links */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-5">Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li><Link href="#" className="hover:text-emerald-400 transition-colors">Home</Link></li>
              <li><Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">How it works</Link></li>
              <li><Link href="/explore" className="hover:text-emerald-400 transition-colors">Explore places</Link></li>
              <li><Link href="/#about" className="hover:text-emerald-400 transition-colors">About us </Link></li>
              <li><Link href="/#contact-section" className="hover:text-emerald-400 transition-colors">Contact form</Link></li>
              </ul>
              
          </div>

          {/* Column 4: More Links and Admin Login */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            {/* Invisible header for alignment with previous column's header */}
            <h3 className="text-xl font-semibold text-white mb-5 opacity-0 pointer-events-none">Links</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              {/* Admin Login Link - Retained from your original code */}
              <li className="pt-4"> {/* Added padding top to separate it slightly */}
                <Link href="/admin/login" legacyBehavior>
                  <a className="text-sm font-medium transition-colors hover:text-white text-emerald-200">
                    Admin Login
                  </a>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Notice - Separated and centered at the bottom */}
        <div className="mt-16 pt-8 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {currentYear} Sri Lanka Revealed. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
