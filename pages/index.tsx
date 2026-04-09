import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllChapters } from '../lib/data-engine/db';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

// ----------------------------------------
// ANTIGRAVITY MOTION VARIANTS
// ----------------------------------------
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const cardVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

// Custom Highlight Function
const HighlightMatch = ({ text = '', query = '' }: { text: string, query: string }) => {
  if (!query) return <span>{text}</span>;
  const escapedQuery = query.toLowerCase().trim().split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  if (!escapedQuery) return <span>{text}</span>;

  const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === escapedQuery.toLowerCase() ? (
          <span key={i} className="font-extrabold bg-blue-200 text-blue-900 px-0.5 rounded-sm shadow-sm">{part}</span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// ----------------------------------------
// COMPACT RESULT CARD (The 3-Second Rule)
// ----------------------------------------
const ResultCard = React.memo(({ item, googleScore, activeQuery }: { item: any, googleScore: number, activeQuery: string }) => {
    const isBillable = item.is_billable;
    const isExact = googleScore >= 90;
    
    // Formatting Plain-English Snippet
    const plainEnglish = item.plain_english_explanation || 'No plain-English explanation available.';
    const shortSnippet = plainEnglish.length > 60 ? plainEnglish.slice(0, 60) + '...' : plainEnglish;

    return (
        <motion.div variants={cardVariant} className="h-full">
            <Link href={`/code/${item.code_id}`} className="block relative bg-white rounded-xl border border-slate-200/80 shadow-none hover:shadow-xl hover:border-blue-400 transition-all duration-300 group h-full flex flex-col p-5">
                
                {/* Header Row */}
                <div className="flex justify-between items-start mb-2 relative z-10">
                    <h3 className="text-xl sm:text-2xl font-black text-blue-600 tracking-tight transition-colors group-hover:text-blue-700">
                        <HighlightMatch text={item.code_id} query={activeQuery} />
                    </h3>
                    
                    {isBillable ? (
                        <span className="px-2.5 py-1 bg-emerald-100/80 text-emerald-800 text-[10px] uppercase font-bold tracking-widest rounded-full shrink-0 border border-emerald-200/50">
                           Billable
                        </span>
                    ) : (
                        <span className="px-2.5 py-1 bg-slate-50 text-amber-700 text-[10px] uppercase font-bold tracking-widest border border-amber-200/60 rounded-full shrink-0">
                           Category
                        </span>
                    )}
                </div>
                
                {/* Primary Title with Smart Medical Tooltip Trigger */}
                <div className="relative group/tooltip inline-block mb-1 z-20">
                    <p className="text-[15px] font-medium text-slate-700 leading-snug line-clamp-2 transition-colors group-hover/tooltip:text-slate-900 pr-6">
                        <HighlightMatch text={item.title} query={activeQuery} />
                        <span className="absolute top-0 flex right-0 text-slate-400 hover:text-blue-500 transition-colors">
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        </span>
                    </p>
                    
                    {/* Floating Tooltip Box */}
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-[260px] sm:w-[320px] p-3.5 rounded-xl shadow-xl bg-slate-800 text-white text-[13px] font-medium opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-300 pointer-events-none translate-y-2 group-hover/tooltip:translate-y-0 leading-relaxed z-50">
                       {plainEnglish}
                       <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-solid border-t-slate-800 border-t-8 border-x-transparent border-x-8 border-b-0"></div>
                    </div>
                </div>

                {/* EXACT MATCH BADGE */}
                {isExact && (
                    <div className="mt-3">
                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm inline-flex items-center">
                           <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                           Top Match
                        </span>
                    </div>
                )}

                {/* Plain English Snippet (Always Visible) */}
                <p className="text-[13px] text-slate-500 mt-2 font-medium leading-relaxed">
                    {shortSnippet}
                </p>

                {/* HIDDEN DETAILS EXPANSION CONTENT */}
                <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                    <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                       <div className="pt-4 mt-4 border-t border-slate-100 flex flex-col gap-3">
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Full Plain-English Definition</h4>
                              <p className="text-xs text-slate-600 font-medium italic leading-relaxed">
                                  <HighlightMatch text={plainEnglish} query={activeQuery} />
                              </p>
                           </div>
                           
                           <div>
                              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-1">When to use</h4>
                              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                                 Enforce this {isBillable ? 'billable' : 'structural'} hierarchy when a component of "{item.title?.toLowerCase().substring(0,35)}..." acts as the definitive diagnosis.
                              </p>
                           </div>
                       </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
});
ResultCard.displayName = 'ResultCard';

// ----------------------------------------
// THE DATAICD10 CLIENT
// ----------------------------------------
const Home: NextPage<{ chapters: any[] }> = ({ chapters = [] }) => {
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [displayLimit, setDisplayLimit] = useState(12);
  const [billableOnly, setBillableOnly] = useState(false);
  const [recentCodes, setRecentCodes] = useState<any[]>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const executeSearch = async (forcedVal?: string) => {
     const tq = typeof forcedVal === 'string' ? forcedVal : query;
     
     let fetchQueryString = '';
     if (typeof window !== 'undefined') {
         const params = new URLSearchParams(window.location.search);
         if (tq) params.set('q', tq);
         fetchQueryString = params.toString();
     }
     
     // Prevent absolute zero state execution
     if (!fetchQueryString || fetchQueryString === "q=") return;
     
     setIsSearching(true);
     setActiveQuery(tq || 'Filtered Index'); 
     setDisplayLimit(12); 
     
     try {
         const req = await fetch(`/api/search?${fetchQueryString}`);
         const res = await req.json();
         setSearchResults(res.results || []);
         setActiveQuery(tq || 'Filtered Scan');
     } catch(e) {
         console.error("Search Gateway Error", e);
     } finally {
         setIsSearching(false);
     }
  };

  useEffect(() => {
      // Auto-Trigger Database Execution for ANY parameter
      if (searchParams) {
          const hasFilters = searchParams.get('filter') || searchParams.get('gender') || searchParams.get('age') || searchParams.get('billable');
          const hasQ = searchParams.get('q');
          
          if (hasQ || hasFilters) {
              if (hasQ) setQuery(hasQ);
              executeSearch(hasQ || '');
          }
      }
      
      // Load quick access history
      try {
          const recentStr = localStorage.getItem('dataicd10_recent');
          if (recentStr) setRecentCodes(JSON.parse(recentStr));
      } catch(e) {}
  }, [searchParams]);

  useEffect(() => {
    const timer = setTimeout(() => {
       if (query !== activeQuery && query.trim().length > 0) {
           executeSearch(query);
       } else if (query.trim().length === 0 && activeQuery !== '') {
           // Clear results if empty
           setActiveQuery('');
           setSearchResults([]);
       }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, activeQuery]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  const isSearchMode = activeQuery.length > 0 || isSearching;
  
  const filteredResults = billableOnly 
      ? searchResults.filter(res => res.item?.is_billable === true) 
      : searchResults;
      
  const displayedResults = filteredResults.slice(0, displayLimit);

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 ${inter.className} overflow-x-hidden`}>
      <Head>
        <title>Dataicd10 | ICD-10 Directory</title>
        <meta name="description" content="CDC Extracted XML Data Search Engine" />
      </Head>

      <main className="flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/50 via-slate-50 to-slate-50">
        
        <motion.div 
           layout
           initial={false}
           animate={{
              paddingBottom: isSearchMode ? '2rem' : '4rem',
           }}
           transition={{ duration: 0.5, ease: "easeInOut" }}
           className="w-full relative"
        >
            {/* ========================================================= */}
            {/* HERO CONTAINER WITH GLOW & SVG                              */}
            {/* ========================================================= */}
            <div className={`relative w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isSearchMode ? 'py-8' : 'py-20 sm:py-32'} bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 to-transparent overflow-hidden border-b border-slate-200/50`}>
                
                {/* Subtle SVG Medical Grid Pattern */}
                <div 
                   className="absolute inset-0 z-0 opacity-[0.05] text-blue-300" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2h2v2h20v2H22v2.5h18v2H22v2h-2v-2H0v-2h20z' fill='%233B82F6' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                ></div>

                <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto text-center ${isSearchMode ? 'max-w-4xl' : 'max-w-4xl'}`}>
                  <AnimatePresence mode="popLayout">
                      {!isSearchMode && (
                          <motion.div 
                            initial="hidden" animate="visible" exit={{ opacity: 0, y: -20, scale: 0.95 }} variants={staggerContainer}
                            className="space-y-6"
                          >
                            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-slate-900 leading-[1.1] max-w-3xl mx-auto">
                                Find Any ICD-10 Code Instantly
                            </motion.h1>
                            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-500 mt-4 font-medium mx-auto max-w-2xl">
                                Official 2026 updates from CMS and CDC.
                            </motion.p>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* INSTANT MEGA SEARCH BAR */}
                  <motion.div layout className={`w-full mx-auto relative z-30 transition-all duration-500 ${isSearchMode ? 'pt-2 max-w-4xl' : 'pt-10 max-w-3xl'}`}>
                    <div className="relative group flex flex-col sm:flex-row items-center w-full h-auto sm:h-16 rounded-[2rem] sm:rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] focus-within:border-blue-400/50 focus-within:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all overflow-hidden text-left">
                      
                      <div className="hidden sm:flex pl-6 items-center pointer-events-none shrink-0">
                         <svg className={`h-6 w-6 transition-colors ${isSearchMode ? 'text-blue-600' : 'text-blue-500 group-focus-within:text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      
                      <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search 70,000+ ICD-10-CM Codes by keyword or code ID..." 
                        autoComplete="off"
                        spellCheck="false"
                        className="w-full pl-6 sm:pl-4 pr-16 py-5 sm:py-0 h-full text-lg sm:text-xl bg-transparent outline-none text-slate-900 font-bold placeholder-slate-400/80 group-focus-within:placeholder-slate-400 transition-colors"
                      />
                      
                      <div className="hidden sm:flex absolute right-5 items-center justify-center pointer-events-none">
                         <kbd className="inline-flex items-center justify-center px-2 py-1 bg-white text-slate-400 text-xs font-bold rounded shadow-sm border border-slate-200/60 tracking-widest leading-none">
                            ⌘ K
                         </kbd>
                      </div>
                      
                      {/* Mobile search execute button fallback */}
                      <button 
                         onClick={() => executeSearch()}
                         className="sm:hidden w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-4 text-base focus:outline-none tracking-widest uppercase"
                      >
                         Execute Search
                      </button>
                    </div>

                    {/* SHOW BILLABLE CODES ONLY TOGGLE */}
                    <div className="flex items-center justify-center sm:justify-end mt-5 pr-2 w-full mx-auto">
                       <label className="flex items-center space-x-3 cursor-pointer group">
                          <div className="relative rounded-[6px] border-[1.5px] border-slate-300 w-5 h-5 flex items-center justify-center bg-white group-hover:border-emerald-500 transition-colors shadow-sm overflow-hidden">
                             <input 
                                type="checkbox" 
                                className="opacity-0 absolute inset-0 cursor-pointer w-full h-full z-10" 
                                checked={billableOnly} 
                                onChange={(e) => setBillableOnly(e.target.checked)} 
                             />
                             {billableOnly && (
                                 <div className="absolute inset-0 bg-emerald-500 flex items-center justify-center">
                                    <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
                                 </div>
                             )}
                          </div>
                          <span className="text-sm font-bold text-slate-600 group-hover:text-emerald-700 transition-colors tracking-wide select-none">
                              Show Billable Codes Only
                          </span>
                       </label>
                    </div>
                  </motion.div>
                </div>
            </div>

            <div className="w-full px-4 sm:px-6 lg:px-8 max-w-[85rem] mx-auto">

              {/* ========================================================= */}
              {/* MEDICAL GATEWAY DEPTH (4-Column Grid + Alert Box)           */}
              {/* ========================================================= */}
              <AnimatePresence>
                 {!isSearchMode && (
                    <motion.div 
                       initial="hidden" animate="visible" exit={{ opacity: 0, y: -20 }} variants={staggerContainer}
                       className="mt-16 w-full text-left"
                    >
                       
                       {/* ========================================================= */}
                        {/* BROWSE BY CHAPTER SECTION                                   */}
                        {/* ========================================================= */}
                        <motion.div variants={fadeUpVariant} className="mt-8 pt-6">
                            <div className="mb-10 flex items-center justify-between">
                                <h2 className="text-2xl font-black text-[#1E3A8A] font-['Inter'] tracking-tight flex items-center">
                                    <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    Browse by Chapter
                                </h2>
                                <Link href="/icd10cm/2026" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors bg-blue-50 hover:bg-blue-100 px-5 py-2.5 rounded-full hidden sm:inline-block">
                                    View Full Index →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {chapters.map((chapter, index) => {
                                   let rawTitle = Array.isArray(chapter.title) ? chapter.title.join(': ') : chapter.title || '';
                                   let cTitle = rawTitle;
                                   let cRange = chapter.id;
                                   const match = rawTitle.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)$/);
                                   if (match) {
                                      cTitle = rawTitle.split('(')[0].trim();
                                   }

                                   return (
                                    <Link 
                                        key={chapter.id} 
                                        href={`/icd10cm/2026/chapter/${chapter.id}`}
                                        className="group block p-6 bg-white rounded-2xl border border-slate-200/60 shadow-[0_4px_16px_rgb(0,0,0,0.03)] hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 h-full flex flex-col justify-start"
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                          <span className="text-sm font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg tracking-tight uppercase border border-blue-100">Ch {index + 1}</span>
                                          <span className="text-xs font-extrabold text-slate-500 bg-slate-100 px-2.5 py-1.5 rounded-lg border border-slate-200">{cRange}</span>
                                        </div>
                                        <h3 className="text-[15px] font-bold text-slate-800 group-hover:text-blue-600 leading-[1.4] line-clamp-3">
                                            {cTitle}
                                        </h3>
                                    </Link>
                                )})}
                            </div>
                        </motion.div>

                        {/* ========================================================= */}
                        {/* RECENTLY VIEWED WIDGET                                      */}
                        {/* ========================================================= */}
                        {recentCodes.length > 0 && (
                            <motion.div variants={fadeUpVariant} className="mt-16 pt-8 border-t border-slate-200/60 pb-10">
                                <h2 className="text-xl font-bold text-[#1E3A8A] font-['Inter'] tracking-tight flex items-center mb-6">
                                    <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Quick Access History
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {recentCodes.map((c, i) => (
                                        <Link key={i} href={`/icd10cm/2026/code/${c.code_id}`} className="group flex items-center bg-white border border-slate-200/80 hover:border-blue-400 p-3 pr-4 rounded-[12px] shadow-sm hover:shadow-md transition-all">
                                            <span className="font-extrabold text-[#2D82FE] text-[15px] tracking-tight group-hover:text-blue-700 mr-4">{c.code_id}</span>
                                            <div className="flex flex-col">
                                                <p className="text-[11px] font-medium text-slate-600 line-clamp-1 max-w-[200px]">{c.title}</p>
                                                {c.is_billable ? (
                                                    <span className="text-[8px] font-black tracking-widest text-[#1D9A6C] uppercase mt-0.5">Billable</span>
                                                ) : (
                                                    <span className="text-[8px] font-black tracking-widest text-[#D83B5E] uppercase mt-0.5" >Non-Billable</span>
                                                )}
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                 )}
              </AnimatePresence>
            </div>

            {/* Omni-Grid Area (Results) */}
            <AnimatePresence mode="wait">
                {isSearching ? (
                   <motion.div 
                     key="loading-spinner"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="flex flex-col items-center justify-center py-20"
                   >
                      <div className="relative w-20 h-20">
                          <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
                          <div className="absolute inset-4 bg-blue-600 rounded-full animate-pulse shadow-lg flex items-center justify-center">
                             <svg className="w-6 h-6 text-white animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          </div>
                      </div>
                      <h3 className="mt-6 text-lg font-bold text-slate-700">Executing Rapid Lexicon Scan...</h3>
                   </motion.div>
                ) : activeQuery && searchResults.length > 0 ? (
                    <motion.div 
                      key="omni-grid"
                      initial={{ opacity: 0, y: 40 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 40 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-full pt-4 mt-8"
                    >
                        <div className="flex justify-between items-end mb-10 px-2 border-b border-slate-200/60 pb-4">
                             <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center">
                                 <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                 Top Relevant Matches
                             </h2>
                             <span className="text-sm font-bold text-slate-600 bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm">
                               {filteredResults.length} Codes Extracted
                             </span>
                        </div>

                        {/* Rendering via Memoized Card Components */}
                        <motion.div 
                           variants={staggerContainer}
                           initial="hidden"
                           animate="visible"
                           className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start"
                        >
                            {displayedResults.map(({ item, googleScore }, idx) => (
                                <ResultCard 
                                   key={`${item.code_id}-${idx}`} 
                                   item={item} 
                                   googleScore={googleScore} 
                                   activeQuery={activeQuery} 
                                />
                            ))}
                        </motion.div>

                        {/* Interactive Load More Protocol */}
                        {filteredResults.length > displayLimit && (
                            <div className="mt-14 flex justify-center pb-20">
                                <button 
                                   onClick={() => setDisplayLimit((prev) => prev + 12)}
                                   className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 hover:border-blue-400 rounded-full transition-all duration-300 shadow-sm hover:shadow-md uppercase tracking-widest"
                                >
                                   Load More Results
                                   <svg className="w-5 h-5 ml-2 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                                </button>
                            </div>
                        )}
                        
                    </motion.div>
                ) : activeQuery && filteredResults.length === 0 ? (
                    <motion.div 
                       key="no-results"
                       initial={{ opacity: 0, scale: 0.95 }}
                       animate={{ opacity: 1, scale: 1 }}
                       exit={{ opacity: 0, scale: 0.95 }}
                       className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-slate-300 shadow-sm"
                    >
                        <div className="p-5 bg-slate-50 rounded-full mb-6 border border-slate-100">
                            <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Zero Clinical Matches Found</h3>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">Try rephrasing your search or using a broader term.</p>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </motion.div>
      </main>
    </div>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const chapters = getAllChapters() || [];
  return {
    props: { chapters }
  };
};

export default Home;
