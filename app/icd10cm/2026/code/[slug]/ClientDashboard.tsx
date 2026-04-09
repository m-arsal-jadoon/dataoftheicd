"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Inter } from 'next/font/google'; 

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function ClientDashboard({ codeData, relations, rawTitle, clinicalPathways, alternatives, chapterStr, sectionStr, parentId }: any) {
  const [showAllRelated, setShowAllRelated] = useState(false);
  const isBillable = codeData.billable_flag === "1" || codeData.billable_flag === true || codeData.is_billable === true || codeData.billable === true;

  useEffect(() => {
     if (typeof window !== 'undefined' && codeData?.code_id) {
         try {
             const recentStr = localStorage.getItem('dataicd10_recent');
             let recent = recentStr ? JSON.parse(recentStr) : [];
             recent = recent.filter((c: any) => c.code_id !== codeData.code_id);
             recent.unshift({ code_id: codeData.code_id, title: rawTitle, is_billable: isBillable });
             if (recent.length > 5) recent = recent.slice(0, 5);
             localStorage.setItem('dataicd10_recent', JSON.stringify(recent));
         } catch(e) {}
     }
  }, [codeData]);

  return (
    <div className={`min-h-[80vh] bg-white text-slate-800 ${inter.className} selection:bg-blue-100 overflow-x-hidden`}>
      {/* ========================================================= */}
      {/* 2. GRID-BASED DASHBOARD (1 SCREEN VIEW)                   */}
      {/* ========================================================= */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-10 lg:py-16">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-16">
            
            {/* COLUMN 1: Main Content Header & Alternatives (approx 45% -> col-span-5) */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col relative pr-0 lg:pr-4">
               
               {/* Quick Actions - Floating Right inside the col */}
               <div className="absolute right-0 top-12 flex flex-col gap-4 text-slate-400">
                  <button onClick={() => navigator.clipboard.writeText(codeData.code_id)} className="hover:text-purple-600 transition hover:bg-slate-50 p-1.5 rounded-full" title="Copy">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                  <button onClick={() => window.print()} className="hover:text-purple-600 transition hover:bg-slate-50 p-1.5 rounded-full" title="Print">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  </button>
                  <button onClick={() => { if(navigator.share) navigator.share({url: window.location.href}); else alert('Copied!'); }} className="hover:text-purple-600 transition hover:bg-slate-50 p-1.5 rounded-full" title="Share">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  </button>
               </div>

               {/* Badges */}
               <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-[3px] rounded bg-[#E4E9EF] text-[9.5px] font-extrabold text-[#5B6D86] tracking-widest uppercase border border-[#E4E9EF]">
                     FY 2026
                  </span>
                  {isBillable ? (
                     <span className="px-2.5 py-[3px] rounded-full bg-[#E6F8F0] text-[9px] font-black text-[#1D9A6C] tracking-widest uppercase border border-[#C6F0DF] flex items-center">
                        <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        BILLABLE
                     </span>
                  ) : (
                     <span className="px-2.5 py-[3px] rounded-full bg-[#FFE9EB] text-[9px] font-black text-[#D83B5E] tracking-widest uppercase border border-[#FDC2CF] flex items-center">
                        <svg className="w-2.5 h-2.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        NON-BILLABLE
                     </span>
                  )}
               </div>

               {/* Main Title Block */}
               <div className="flex items-center gap-4 mb-5">
                  <h1 className="text-[60px] lg:text-[76px] font-black text-[#1D2939] leading-[1] tracking-tighter">
                     {codeData.code_id}
                  </h1>
                  {isBillable ? (
                     <span className="px-4 py-2 mt-4 rounded-lg bg-[#E6F8F0] text-[18px] font-black text-[#1D9A6C] tracking-widest uppercase border border-[#C6F0DF] hidden sm:inline-block">BILLABLE</span>
                   ) : (
                     <span className="px-4 py-2 mt-4 rounded-lg bg-[#FFE9EB] text-[18px] font-black text-[#D83B5E] tracking-widest uppercase border border-[#FDC2CF] hidden sm:inline-block">NON-BILLABLE</span>
                   )}
               </div>
               
               {!isBillable && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 -mt-2 rounded-r-lg max-w-[90%]">
                     <p className="text-sm font-bold text-red-800">
                        This header code is strictly structural. Claims require a more specific sub-code.
                     </p>
                  </div>
               )}
               <h2 className="text-[20px] font-bold text-[#344054] leading-snug mb-8 w-[90%] tracking-tight pr-10">
                  {rawTitle}
               </h2>

               {/* Editorial Plain English Box */}
               {codeData.plain_english_explanation && (
                  <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 mb-10 w-full sm:w-[95%]">
                     <div className="flex items-center gap-1.5 mb-2.5">
                        <svg className="w-[14px] h-[14px] text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <h4 className="text-[9.5px] uppercase tracking-widest font-black text-blue-800/80">Editorial Plain English Notes</h4>
                     </div>
                     <p className="text-[13px] font-medium text-slate-700 leading-relaxed">
                        {codeData.plain_english_explanation}
                     </p>
                  </div>
               )}

               {/* Alternatives Grid */}
               {alternatives.length > 0 && (
                  <div className="pt-2 w-full lg:w-[110%] relative z-10">
                     <h3 className="text-[10px] font-black tracking-widest text-[#94A3B8] uppercase mb-4">Alternatives</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
                        {(showAllRelated ? alternatives : alternatives.slice(0, 6)).map((c: any) => (
                           <Link key={c.code_id} href={`/icd10cm/2026/code/${c.code_id}`} className="group p-3 border border-slate-200 hover:border-blue-400 bg-white shadow-[0_2px_4px_rgba(0,0,0,0.02)] rounded-[10px] transition-all relative flex flex-col justify-between min-h-[90px]">
                              <div>
                                 <div className="flex items-start justify-between mb-1">
                                    <span className="font-extrabold text-[#2D82FE] text-[15px] tracking-tight">{c.code_id}</span>
                                    {c.billable_flag === "1" || c.billable_flag === true || c.is_billable === true || c.billable === true ? (
                                       <span className="px-1.5 py-[1px] rounded-[3px] bg-[#E6F8F0] text-[6.5px] font-black text-[#1D9A6C] tracking-widest uppercase border border-[#C6F0DF]">BILLABLE</span>
                                    ) : (
                                       <span className="px-1.5 py-[1px] rounded-[3px] bg-[#FFE9EB] text-[6.5px] font-black text-[#D83B5E] tracking-widest uppercase border border-[#FDC2CF]">NON-BILLABLE</span>
                                    )}
                                 </div>
                                 <p className="text-[10px] font-medium text-slate-600 line-clamp-3 leading-[1.3] group-hover:text-slate-900 transition-colors pr-2">{c.title}</p>
                              </div>
                           </Link>
                        ))}
                     </div>
                     {alternatives.length > 6 && !showAllRelated && (
                        <button onClick={() => setShowAllRelated(true)} className="mt-5 text-[11px] font-bold text-blue-600 hover:text-blue-800 flex items-center">
                           Show {alternatives.length - 6} more codes <span className="ml-1">↓</span>
                        </button>
                     )}
                  </div>
               )}
            </div>

            {/* COLUMN 2: Synonyms & Search Pathways (approx 20% -> col-span-3) */}
            <div className="md:col-span-12 lg:col-span-3 pl-0 lg:pl-10 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-[#94A3B8] uppercase mb-5">Synonyms & Search Pathways</h3>
               <div className="flex flex-col gap-3 items-start w-[85%]">
                  {Array.from(clinicalPathways).map((pathway: any, i) => (
                     <Link key={i} href={`/?q=${encodeURIComponent(pathway)}`} className="inline-block px-4 py-2 bg-white text-[#2D82FE] font-bold text-[10.5px] rounded-full border border-slate-200 hover:border-blue-300 hover:shadow-sm transition-all text-left break-words w-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
                        {pathway}
                     </Link>
                  ))}
               </div>
            </div>

            {/* COLUMN 3: Version Logging (approx 15% -> col-span-2) */}
            <div className="md:col-span-12 sm:col-span-6 lg:col-span-2 pl-0 lg:pl-4 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-[#94A3B8] uppercase mb-5">Version Logging</h3>
               <div className="flex flex-col gap-7 relative before:content-[''] before:absolute before:left-[11px] before:top-[14px] before:bottom-4 before:w-[1.5px] before:bg-[#E2E8F0]">
                  <div className="relative pl-8 group">
                     <span className="absolute left-[-2px] top-0.5 w-[26.5px] h-[26.5px] bg-white border-[2px] border-[#22C55E] rounded-full flex items-center justify-center z-10 p-[4px] shadow-sm">
                        <span className="w-full h-full bg-[#22C55E] rounded-full"></span>
                     </span>
                     <p className="text-[11.5px] font-extrabold text-[#111827] leading-none mb-1">FY 2026</p>
                     <p className="text-[9.5px] font-bold text-[#22C55E]">Active Protocol</p>
                  </div>
                  {[2025, 2024].map((year) => (
                     <div key={year} className="relative pl-8 opacity-80">
                        <span className="absolute left-[8px] top-1.5 w-[7px] h-[7px] bg-[#CBD5E1] rounded-full z-10 ring-[5px] ring-white"></span>
                        <p className="text-[11.5px] font-bold text-[#64748B] leading-none mt-1">FY {year}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* COLUMN 4: Hierarchy (approx 20% -> col-span-2) */}
            <div className="md:col-span-12 sm:col-span-6 lg:col-span-2 pl-0 lg:pl-4 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-[#94A3B8] uppercase mb-6">Hierarchy</h3>
               <div className="pl-[14px] border-l-[1.5px] border-dotted border-[#CBD5E1] flex flex-col gap-7 relative opacity-90">
                  <div className="relative">
                     <span className="absolute -left-[16.5px] w-[4px] h-[4px] bg-[#CBD5E1] rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Chapter</p>
                     <p className="text-[10.5px] font-medium text-[#475467] line-clamp-3 leading-[1.35]">{chapterStr}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[16.5px] w-[4px] h-[4px] bg-[#CBD5E1] rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Section</p>
                     <p className="text-[10.5px] font-medium text-[#475467] line-clamp-3 leading-[1.35]">{sectionStr}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[16.5px] w-[4px] h-[4px] bg-[#CBD5E1] rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-[#94A3B8] uppercase tracking-[0.1em] mb-1">Category</p>
                     <p className="text-[11.5px] font-bold text-[#475467] line-clamp-1">{parentId}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[18.25px] w-[7px] h-[7px] bg-[#2D82FE] rounded-full top-1 ring-[3px] ring-white shadow-[0_0_0_5px_rgba(45,130,254,0.1)]" />
                     <p className="text-[8px] font-black text-[#2D82FE] uppercase tracking-[0.1em] mb-1">Selected</p>
                     <p className="text-[13px] font-black text-[#1D2939]">{codeData.code_id}</p>
                  </div>
               </div>
            </div>

         </div>
         
         {/* Compliance Disclaimer */}
         <div className="mt-16 pt-8 border-t border-slate-100 flex flex-col items-center">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-400 max-w-4xl text-center leading-relaxed">
               <strong>Medical Disclaimer:</strong> The diagnostic data, structured hierarchy, and procedural information presented above are for educational purposes only. DataICD10.com is strictly a reference platform and does NOT substitute official diagnostic directives. Professionals must consult and verify all codes against official active CMS (Centers for Medicare & Medicaid Services) and CDC master indices before legal claim submission or definitive clinical diagnosis. Please review our <Link href="/disclaimer" className="text-blue-500 hover:underline">Full Disclaimer</Link> and <Link href="/privacy-policy" className="text-blue-500 hover:underline">Privacy Policy</Link> for more details.
            </p>
         </div>

      </main>
    </div>
  );
}
