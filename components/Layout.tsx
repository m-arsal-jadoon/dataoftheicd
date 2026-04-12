import React from 'react';
import Link from 'next/link';
import GlobalBreadcrumb from './GlobalBreadcrumb';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
   children: React.ReactNode;
   breadcrumbs?: {
      code?: any;
      category?: any;
      chapter?: any;
      section?: any;
   };
}

export default function Layout({ children, breadcrumbs }: LayoutProps) {
   return (
      <>
         {/* TWO-TIER GLOBAL HEADER */}
         <div className="sticky top-0 z-50 w-full flex flex-col shadow-sm">

            {/* TOP TIER: Blue Navbar */}
            <nav className="bg-blue-600 dark:bg-gray-950 border-b border-transparent dark:border-gray-800 text-white w-full h-14 font-medium flex items-center justify-between px-4 lg:px-8 transition-colors">
               <div className="flex items-center w-full">
                  <Link href="/" className="inline-flex items-center text-xl font-extrabold text-white tracking-tight mr-8 drop-shadow-sm shrink-0">
                     <svg className="w-6 h-6 mr-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                     Dataicd10
                  </Link>
                  <div className="hidden md:flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap text-[13.5px]">
                     <Link href="/icd10cm/2026" className="hover:text-white/80 transition flex items-center">Codes</Link>
                     <Link href="/indexes" className="hover:text-white/80 transition flex items-center">Indexes</Link>
                     <Link href="/converter" className="hover:text-white/80 transition">Conversion</Link>
                     <Link href="/privacy-policy" className="hover:text-white/80 transition">Privacy</Link>
                     <Link href="/disclaimer" className="hover:text-white/80 transition">Disclaimer</Link>
                  </div>
               </div>

               <div className="flex items-center gap-4 shrink-0">
                  <ThemeToggle />
                  <div className="flex md:hidden">
                     <button className="text-white hover:text-white/80 transition-colors focus:outline-none">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                     </button>
                  </div>
               </div>
            </nav>

            {/* BOTTOM TIER: Breadcrumbs */}
            <GlobalBreadcrumb breadcrumbs={breadcrumbs} />
         </div>

         <div className="bg-slate-50/50 dark:bg-[#07070E] min-h-screen transition-colors">
            {children}
         </div>

         {/* PROFESSIONAL FOOTER */}
         <footer className="bg-slate-900 w-full border-t border-slate-800 text-slate-300 py-12 lg:py-16 mt-auto">
            <div className="max-w-[1440px] mx-auto px-4 lg:px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
               {/* Column 1 */}
               <div className="flex flex-col">
                  <h4 className="text-white text-lg font-black tracking-tight mb-4 flex items-center">
                     <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                     dataicd10.com
                  </h4>
                  <p className="text-sm font-medium text-slate-400 leading-relaxed pr-10">
                     The industry standard Dataicd10 database. Real-time mapping, structural pathways, and precision billing analytics.
                  </p>
               </div>

               {/* Column 2 */}
               <div className="flex flex-col">
                  <h4 className="text-white text-[13px] font-black tracking-widest uppercase mb-5">Quick Links</h4>
                  <ul className="flex flex-col gap-3 text-sm font-medium">
                     <li><Link href="/icd10cm/2026" className="hover:text-blue-400 transition-colors">Browse 2026 Chapters</Link></li>
                     <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                     <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact Support</Link></li>
                     <li><Link href="/" className="hover:text-blue-400 transition-colors">Search Engine</Link></li>
                  </ul>
               </div>

               {/* Column 3 */}
               <div className="flex flex-col">
                  <h4 className="text-white text-[13px] font-black tracking-widest uppercase mb-5">Legal & Compliance</h4>
                  <ul className="flex flex-col gap-3 text-sm font-medium">
                     <li><Link href="/disclaimer" className="hover:text-blue-400 transition-colors">Medical Disclaimer</Link></li>
                     <li><Link href="/data-sources" className="hover:text-blue-400 transition-colors">Data Sources & Integrity</Link></li>
                     <li><Link href="/privacy-policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
                     <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms of Service</Link></li>
                  </ul>
               </div>
            </div>

            {/* Disclaimer Alert */}
            <div className="mt-12 mb-6 max-w-[1440px] mx-auto px-4 lg:px-6">
               <p className="text-[11px] text-slate-500 leading-relaxed text-center sm:text-left bg-slate-800/30 p-4 rounded-lg border border-slate-800/60">
                  <strong>Disclaimer:</strong> The materials provided on Dataicd10 are for informational and educational purposes only. This platform is not a diagnostic tool and does not constitute medical advice. Independent verification against authoritative government indices is strictly required prior to finalizing medical claims.
               </p>
            </div>

            {/* Bottom Strip */}
            <div className="pt-8 border-t border-slate-800/80 max-w-[1440px] mx-auto px-4 lg:px-6 flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-slate-500">
               <p>© {new Date().getFullYear()} dataicd10.com. All diagnostic codes generated via CDC guidelines.</p>
               <p className="mt-2 md:mt-0">A Product of <span className="font-bold text-white tracking-tight">makeuser.com</span></p>
            </div>
         </footer>
      </>
   );
}
