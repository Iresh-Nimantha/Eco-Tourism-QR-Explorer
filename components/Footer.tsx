// components/Footer.tsx

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // FIX: Changed background to a deep green and base text to a soft white
    <footer className="relative z-10 bg-emerald-900 text-emerald-200">
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Project Name/Logo */}
          <Link href="/" legacyBehavior>
            {/* FIX: Changed hover color to match the theme */}
            <a className="text-lg font-semibold text-white transition-colors hover:text-emerald-100">
              Eco Tourism
            </a>
          </Link>

          {/* Copyright Notice */}
          <p className="text-sm text-center">
            &copy; {currentYear} Sri Lanka Revealed. All Rights Reserved.
          </p>

          {/* Admin Login Link */}
          <Link href="/admin/login" legacyBehavior>
            {/* FIX: Changed hover color to a brighter white */}
            <a className="text-sm font-medium transition-colors hover:text-white">
              Admin Login
            </a>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;