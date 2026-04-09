import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Navbar = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Browse Categories', href: '/icd10cm/2026' },
    { name: 'Fiscal Year 2026', href: '/#fy2026' },
    { name: 'About', href: '/#about' },
  ];

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [router.asPath]);

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all shadow-sm">
      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
              <span className="text-xl sm:text-2xl font-bold text-blue-600 tracking-tight">
                Dataicd10
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center justify-center flex-1 mx-8 gap-8">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || router.asPath === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-[15px] font-semibold transition-all relative py-2 ${
                    isActive ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Desktop Action Button (CTA) */}
          <div className="hidden lg:flex items-center shrink-0">
            <button className="border-2 border-blue-600 text-blue-600 rounded-lg px-5 py-2.5 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 tracking-wide">
               Get Data Export
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-600 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-1"
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-xl border-b border-slate-200 shadow-xl overflow-hidden">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => {
              const isActive = router.pathname === link.href || router.asPath === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg text-base font-bold transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 px-4">
              <button className="w-full border-2 border-blue-600 text-blue-600 rounded-xl px-5 py-3 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all shadow-sm active:scale-95 tracking-wide flex items-center justify-center">
                 <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                 Get Data Export
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
