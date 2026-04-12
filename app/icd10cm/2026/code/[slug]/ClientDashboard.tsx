"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';

// ─── Shared Theme Map (Matches Chapter/Category Grid) ─────────────────────────
const CHAPTER_COLORS: Record<string, string> = {
  'A': '#10b981', 'C': '#8b5cf6', 'D': '#f43f5e', 'E': '#f59e0b',
  'F': '#6366f1', 'G': '#06b6d4', 'H': '#0ea5e9', 'I': '#ef4444',
  'J': '#14b8a6', 'K': '#84cc16', 'L': '#fb923c', 'M': '#94a3b8',
  'N': '#3b82f6', 'O': '#ec4899', 'P': '#eab308', 'Q': '#34d399',
  'R': '#9ca3af', 'S': '#f97316', 'V': '#dc2626', 'Z': '#64748b',
  'U': '#d946ef',
};

const CHAPTER_GRADIENTS: Record<string, string> = {
  'A': 'from-emerald-500 to-teal-600',
  'C': 'from-purple-500 to-violet-600',
  'D': 'from-red-500 to-rose-600',
  'E': 'from-amber-500 to-orange-600',
  'F': 'from-indigo-500 to-blue-600',
  'G': 'from-cyan-500 to-sky-600',
  'H': 'from-sky-500 to-blue-600',
  'I': 'from-red-600 to-pink-600',
  'J': 'from-teal-500 to-emerald-600',
  'K': 'from-lime-500 to-green-600',
  'L': 'from-orange-400 to-amber-500',
  'M': 'from-slate-500 to-gray-600',
  'N': 'from-blue-500 to-indigo-600',
  'O': 'from-pink-400 to-fuchsia-500',
  'P': 'from-yellow-400 to-amber-500',
  'Q': 'from-emerald-400 to-teal-500',
  'R': 'from-gray-400 to-slate-500',
  'S': 'from-orange-500 to-red-500',
  'V': 'from-red-600 to-rose-700',
  'Z': 'from-slate-500 to-gray-600',
  'U': 'from-fuchsia-500 to-purple-600',
};


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
  }, [codeData, rawTitle, isBillable]);

  const firstLetter = codeData.code_id ? codeData.code_id.charAt(0).toUpperCase() : 'A';
  const themeColor = CHAPTER_COLORS[firstLetter] || '#6366f1';
  const gradientClass = CHAPTER_GRADIENTS[firstLetter] || 'from-indigo-500 to-blue-600';

  return (
    <div className="min-h-[80vh] selection:bg-blue-900/30 overflow-x-hidden font-sans" style={{ background: '#07070E' }}>
      {/* ========================================================= */}
      {/* 2. GRID-BASED DASHBOARD (1 SCREEN VIEW)                   */}
      {/* ========================================================= */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10 lg:py-16">
         
         <div className="flex items-center gap-2 mb-8">
             <Link href={`/icd10cm/2026/category/${encodeURIComponent(parentId)}`} className="inline-flex items-center text-[12px] font-bold text-slate-400 hover:text-white transition-colors group">
               <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
               Back to Category {parentId}
             </Link>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-12 gap-x-8 lg:gap-x-12 gap-y-16">
            
            {/* COLUMN 1: Main Content Header & Alternatives (approx 45% -> col-span-5) */}
            <div className="md:col-span-12 lg:col-span-5 flex flex-col relative pr-0 lg:pr-4">
               
               {/* Quick Actions - Floating Right inside the col */}
               <div className="absolute right-0 top-0 flex flex-col gap-4 text-slate-500 z-20">
                  <button onClick={() => navigator.clipboard.writeText(codeData.code_id)} className="hover:text-white transition p-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]" title="Copy Code">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                  </button>
                  <button onClick={() => window.print()} className="hover:text-white transition p-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]" title="Print Details">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                  </button>
                  <button onClick={() => { if(navigator.share) navigator.share({url: window.location.href}); else alert('Copied Link!'); }} className="hover:text-white transition p-2 rounded-xl border border-transparent hover:border-slate-800 hover:bg-slate-800/50 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]" title="Share Code">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  </button>
               </div>

               {/* Badges */}
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-[3px] rounded uppercase text-[9.5px] font-black tracking-widest border border-slate-700 text-slate-400 bg-slate-800/30">
                     FY 2026
                  </span>
                  {isBillable ? (
                     <span className="px-2.5 py-[3px] rounded uppercase text-[9.5px] font-black tracking-widest border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        BILLABLE
                     </span>
                  ) : (
                     <span className="px-2.5 py-[3px] rounded uppercase text-[9.5px] font-black tracking-widest border border-rose-500/30 text-rose-400 bg-rose-500/10 flex items-center shadow-[0_0_10px_rgba(244,63,94,0.1)]">
                        <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                        NON-BILLABLE
                     </span>
                  )}
               </div>

               {/* Main Title Block */}
               <h1 className={`text-[64px] lg:text-[76px] font-black leading-[1] tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
                   {codeData.code_id}
               </h1>
               
               {!isBillable && (
                  <div className="bg-rose-500/10 border-l-[3px] border-rose-500 p-4 mb-6 rounded-r-xl max-w-[90%] shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]">
                     <p className="text-[13px] font-bold text-rose-300">
                        This header code is strictly structural. Claims require a more specific sub-code below.
                     </p>
                  </div>
               )}
               <h2 className="text-[20px] font-bold text-white leading-snug mb-8 w-[90%] tracking-tight pr-10">
                  {rawTitle}
               </h2>

               {/* Editorial Plain English Box */}
               {codeData.plain_english_explanation && (
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-5 mb-10 w-full sm:w-[95%] shadow-[inset_0_0_40px_rgba(255,255,255,0.01)] backdrop-blur-sm">
                     <div className="flex items-center gap-2 mb-3">
                        <div className="w-5 h-5 rounded flex items-center justify-center p-1" style={{ background: `${themeColor}20`, color: themeColor }}>
                           <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h4 className="text-[10px] uppercase tracking-widest font-black" style={{ color: themeColor }}>Editorial Plain English Notes</h4>
                     </div>
                     <p className="text-[13px] font-medium text-slate-300 leading-relaxed">
                        {codeData.plain_english_explanation}
                     </p>
                  </div>
               )}

               {/* Alternatives Bento Grid */}
               {alternatives.length > 0 && (
                  <div className="pt-2 w-full lg:w-[110%] relative z-10">
                     <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-4">Specific Sub-codes</h3>
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
                        {(showAllRelated ? alternatives : alternatives.slice(0, 6)).map((c: any) => {
                           const cBillable = c.billable_flag === "1" || c.billable_flag === true || c.is_billable === true || c.billable === true;
                           return (
                               <Link key={c.code_id} href={`/icd10cm/2026/code/${c.code_id}`} className={`group relative p-3.5 border border-slate-800 rounded-2xl transition-all flex flex-col justify-between min-h-[95px] overflow-hidden hover:-translate-y-0.5`} style={{ background: 'rgba(255,255,255,0.02)' }}
                               onMouseEnter={(e) => {
                                 const t = e.currentTarget as HTMLElement;
                                 t.style.boxShadow = `0 0 20px ${themeColor}10, 0 4px 12px rgba(0,0,0,0.4)`;
                                 t.style.background = 'rgba(255,255,255,0.04)';
                                 t.style.borderColor = `${themeColor}40`;
                               }}
                               onMouseLeave={(e) => {
                                 const t = e.currentTarget as HTMLElement;
                                 t.style.boxShadow = 'none';
                                 t.style.background = 'rgba(255,255,255,0.02)';
                                 t.style.borderColor = 'rgba(255,255,255,0.1)';
                               }}>
                                  <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tr-2xl" style={{ background: `radial-gradient(circle at top right, ${themeColor}20 0%, transparent 70%)` }} />
                                  <div className="relative z-10">
                                     <div className="flex items-start justify-between mb-2">
                                        <span className="font-extrabold text-[15.5px] tracking-tight transition-colors" style={{ color: themeColor }}>{c.code_id}</span>
                                        {cBillable ? (
                                           <span className="px-[5px] py-[1.5px] rounded border border-emerald-500/30 text-emerald-500 bg-emerald-500/10 text-[6px] font-black uppercase tracking-widest mt-0.5 shadow-[0_0_8px_rgba(16,185,129,0.15)]">BILLABLE</span>
                                        ) : (
                                           <span className="px-[5px] py-[1.5px] rounded border border-rose-500/30 text-rose-500 bg-rose-500/10 text-[6px] font-black uppercase tracking-widest mt-0.5">NON-BILLABLE</span>
                                        )}
                                     </div>
                                     <p className="text-[10.5px] font-medium text-slate-400 line-clamp-3 leading-snug group-hover:text-slate-200 transition-colors pr-1">{c.title}</p>
                                  </div>
                               </Link>
                           );
                        })}
                     </div>
                     {alternatives.length > 6 && !showAllRelated && (
                        <button onClick={() => setShowAllRelated(true)} className="mt-5 text-[11px] font-bold flex items-center transition-opacity hover:opacity-80" style={{ color: themeColor }}>
                           Show {alternatives.length - 6} more codes <span className="ml-1 mt-0.5">↓</span>
                        </button>
                     )}
                  </div>
               )}
            </div>

            {/* COLUMN 2: Synonyms & Search Pathways (approx 20% -> col-span-3) */}
            <div className="md:col-span-12 lg:col-span-3 pl-0 lg:pl-10 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-5">Synonyms & Search Pathways</h3>
               <div className="flex flex-col gap-3 items-start w-[85%]">
                  {Array.from(clinicalPathways).map((pathway: any, i) => (
                     <Link key={i} href={`/?q=${encodeURIComponent(pathway)}`} className="inline-block px-4 py-2 bg-slate-800/30 text-slate-300 font-bold text-[10.5px] rounded-full border border-slate-700/50 hover:text-white transition-all text-left break-words w-full shadow-sm"
                     onMouseEnter={(e) => {
                        const t = e.currentTarget as HTMLElement;
                        t.style.borderColor = themeColor;
                        t.style.boxShadow = `0 0 10px ${themeColor}15`;
                     }}
                     onMouseLeave={(e) => {
                        const t = e.currentTarget as HTMLElement;
                        t.style.borderColor = 'rgba(255,255,255,0.1)';
                        t.style.boxShadow = 'none';
                     }}>
                        {pathway}
                     </Link>
                  ))}
               </div>
            </div>

            {/* COLUMN 3: Version Logging (approx 15% -> col-span-2) */}
            <div className="md:col-span-12 sm:col-span-6 lg:col-span-2 pl-0 lg:pl-4 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-5">Version Logging</h3>
               <div className="flex flex-col gap-7 relative before:content-[''] before:absolute before:left-[11.5px] before:top-[14px] before:bottom-4 before:w-[1px] before:bg-slate-700">
                  <div className="relative pl-8 group">
                     <span className="absolute left-[-2px] top-0 w-[28px] h-[28px] bg-[#07070E] border border-[1.5px] rounded-full flex items-center justify-center z-10 p-[4px] shadow-[0_0_15px_rgba(16,185,129,0.15)]" style={{ borderColor: '#10b981' }}>
                        <span className="w-full h-full rounded-full" style={{ background: '#10b981' }}></span>
                     </span>
                     <p className="text-[11.5px] font-extrabold text-white leading-none mb-1.5 mt-0.5">FY 2026</p>
                     <p className="text-[9.5px] font-bold text-emerald-500">Active Protocol</p>
                  </div>
                  {[2025, 2024].map((year) => (
                     <div key={year} className="relative pl-8 opacity-60">
                        <span className="absolute left-[8px] top-1 w-[7px] h-[7px] bg-slate-600 rounded-full z-10 ring-[6px] ring-[#07070E]"></span>
                        <p className="text-[11.5px] font-bold text-slate-400 leading-none mt-1">FY {year}</p>
                     </div>
                  ))}
               </div>
            </div>

            {/* COLUMN 4: Hierarchy (approx 20% -> col-span-2) */}
            <div className="md:col-span-12 sm:col-span-6 lg:col-span-2 pl-0 lg:pl-4 mt-8 lg:mt-0">
               <h3 className="text-[10px] font-black tracking-widest text-slate-500 uppercase mb-6">Hierarchy</h3>
               <div className="pl-[14px] border-l border-dashed border-slate-700 flex flex-col gap-6 relative">
                  <div className="relative">
                     <span className="absolute -left-[16px] w=[4px] h-[4px] min-w-[4px] min-h-[4px] bg-slate-600 rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em] mb-1">Chapter</p>
                     <p className="text-[10.5px] font-medium text-slate-400 line-clamp-3 leading-[1.35]">{chapterStr}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[16px] w=[4px] h-[4px] min-w-[4px] min-h-[4px] bg-slate-600 rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em] mb-1">Section</p>
                     <p className="text-[10.5px] font-medium text-slate-400 line-clamp-3 leading-[1.35]">{sectionStr}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[16px] w=[4px] h-[4px] min-w-[4px] min-h-[4px] bg-slate-600 rounded-full top-1.5" />
                     <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.1em] mb-1">Category</p>
                     <p className="text-[11.5px] font-bold text-slate-300 line-clamp-1">{parentId}</p>
                  </div>
                  <div className="relative">
                     <span className="absolute -left-[17.5px] w-[7px] h-[7px] min-w-[7px] min-h-[7px] rounded-full top-1 ring-[4px] ring-[#07070E]" style={{ background: themeColor, boxShadow: `0 0 10px ${themeColor}80` }} />
                     <p className="text-[8px] font-black uppercase tracking-[0.1em] mb-1.5" style={{ color: themeColor }}>Selected</p>
                     <p className="text-[13px] font-black text-white">{codeData.code_id}</p>
                  </div>
               </div>
            </div>

         </div>
         
         {/* Compliance Disclaimer */}
         <div className="mt-16 pt-8 border-t border-slate-800/50 flex flex-col items-center">
            <p className="text-[10px] sm:text-[11px] font-medium text-slate-500 max-w-4xl text-center leading-relaxed">
               <strong className="text-slate-400">Medical Disclaimer:</strong> The diagnostic data, structured hierarchy, and procedural information presented above are for educational purposes only. DataICD10.com is strictly a reference platform and does NOT substitute official diagnostic directives. Professionals must consult and verify all codes against official active CMS (Centers for Medicare & Medicaid Services) and CDC master indices before legal claim submission or definitive clinical diagnosis. Please review our <Link href="/disclaimer" className="text-slate-400 hover:text-slate-200 transition-colors">Full Disclaimer</Link> and <Link href="/privacy-policy" className="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</Link> for more details.
            </p>
         </div>

      </main>
    </div>
  );
}
