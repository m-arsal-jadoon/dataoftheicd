import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getAllChapters } from '../lib/data-engine/db';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

const inter = Inter({ subsets: ['latin'], display: 'swap' });

interface ChapterMeta {
  emoji: string;
  description: string;
  color: string;
  borderHover: string;
}

const META: Record<string, ChapterMeta> = {
  'A00-B99': { emoji: '🦠', description: 'Bacterial, viral, fungal and parasitic infections — from cholera and tuberculosis to HIV and COVID-19.', color: '#10b981', borderHover: 'hover:border-emerald-500/50' },
  'C00-D49': { emoji: '🔬', description: 'All malignant and benign neoplasms across every tissue type, including primary and secondary tumors.', color: '#8b5cf6', borderHover: 'hover:border-violet-500/50' },
  'D50-D89': { emoji: '🩸', description: 'Anemia, coagulation disorders, immune deficiencies, and diseases of white blood cells.', color: '#f43f5e', borderHover: 'hover:border-rose-500/50' },
  'E00-E89': { emoji: '⚗️', description: 'Diabetes, thyroid disorders, obesity, electrolyte imbalances, and metabolic syndromes.', color: '#f59e0b', borderHover: 'hover:border-amber-500/50' },
  'F01-F99': { emoji: '🧠', description: 'Mental illnesses, substance use disorders, psychosis, anxiety, depression, and neurodevelopmental conditions.', color: '#6366f1', borderHover: 'hover:border-indigo-500/50' },
  'G00-G99': { emoji: '⚡', description: 'Epilepsy, migraine, Parkinson\'s, neuropathy, and all other neurological disorders.', color: '#06b6d4', borderHover: 'hover:border-cyan-500/50' },
  'H00-H59': { emoji: '👁️', description: 'Cataracts, glaucoma, retinal disorders, conjunctivitis, and all diseases of the eye.', color: '#0ea5e9', borderHover: 'hover:border-sky-500/50' },
  'H60-H95': { emoji: '🔊', description: 'Hearing loss, otitis media, tinnitus, and mastoid diseases affecting the ear.', color: '#a855f7', borderHover: 'hover:border-purple-500/50' },
  'I00-I99': { emoji: '❤️', description: 'Heart failure, hypertension, stroke, coronary artery disease, and vascular conditions.', color: '#ef4444', borderHover: 'hover:border-red-500/50' },
  'J00-J99': { emoji: '💨', description: 'Asthma, COPD, pneumonia, influenza, pulmonary embolism, and all respiratory illnesses.', color: '#14b8a6', borderHover: 'hover:border-teal-500/50' },
  'K00-K95': { emoji: '🫃', description: 'GERD, peptic ulcers, Crohn\'s, IBS, liver disease, and all digestive system disorders.', color: '#84cc16', borderHover: 'hover:border-lime-500/50' },
  'L00-L99': { emoji: '🩹', description: 'Dermatitis, psoriasis, cellulitis, wound infections, and subcutaneous tissue diseases.', color: '#fb923c', borderHover: 'hover:border-orange-500/50' },
  'M00-M99': { emoji: '🦴', description: 'Arthritis, osteoporosis, back pain, musculoskeletal injuries, and connective tissue diseases.', color: '#94a3b8', borderHover: 'hover:border-slate-400/50' },
  'N00-N99': { emoji: '🫘', description: 'Kidney disease, UTIs, prostate disorders, and all genitourinary system conditions.', color: '#3b82f6', borderHover: 'hover:border-blue-500/50' },
  'O00-O9A': { emoji: '🤱', description: 'Prenatal complications, labor, delivery, obstetric hemorrhage, and postpartum conditions.', color: '#ec4899', borderHover: 'hover:border-pink-500/50' },
  'P00-P96': { emoji: '👶', description: 'Conditions specific to newborns — birth trauma, perinatal infections, and prematurity complications.', color: '#eab308', borderHover: 'hover:border-yellow-500/50' },
  'Q00-QA0': { emoji: '🧬', description: 'Chromosomal abnormalities, congenital heart defects, cleft palate, and structural birth defects.', color: '#34d399', borderHover: 'hover:border-emerald-400/50' },
  'R00-R99': { emoji: '📊', description: 'Symptoms, signs, and abnormal lab findings not classified elsewhere — the diagnostic catch-alls.', color: '#9ca3af', borderHover: 'hover:border-gray-400/50' },
  'S00-T88': { emoji: '🩺', description: 'All traumatic injuries, burns, poisonings, fractures, dislocations, and their sequelae.', color: '#f97316', borderHover: 'hover:border-orange-500/50' },
  'V00-Y99': { emoji: '⚠️', description: 'Motor vehicle accidents, falls, assaults, self-harm, and all external causes of injury.', color: '#dc2626', borderHover: 'hover:border-red-600/50' },
  'Z00-Z99': { emoji: '📋', description: 'Preventive visits, vaccination status, family history, social determinants, and administrative reasons.', color: '#64748b', borderHover: 'hover:border-slate-500/50' },
  'U00-U85': { emoji: '🆕', description: 'Provisional codes for emergency use, including COVID-19 variants and novel conditions.', color: '#d946ef', borderHover: 'hover:border-fuchsia-500/50' },
};

const FALLBACK_META: ChapterMeta = {
  emoji: '📋',
  description: 'A group of related diagnostic codes for this medical chapter.',
  color: '#6366f1',
  borderHover: 'hover:border-indigo-500/50',
};

function getMeta(id: string): ChapterMeta {
  return META[id] ?? FALLBACK_META;
}

// ----------------------------------------
// CODE STYLE MAPPER (FOR BENTO UI)
// ----------------------------------------
const CHAPTER_COLORS: Record<string, string> = {
  'A': '#10b981', 'C': '#8b5cf6', 'D': '#f43f5e', 'E': '#f59e0b',
  'F': '#6366f1', 'G': '#06b6d4', 'H': '#0ea5e9', 'I': '#ef4444',
  'J': '#14b8a6', 'K': '#84cc16', 'L': '#fb923c', 'M': '#94a3b8',
  'N': '#3b82f6', 'O': '#ec4899', 'P': '#eab308', 'Q': '#34d399',
  'R': '#9ca3af', 'S': '#f97316', 'V': '#dc2626', 'Z': '#64748b',
  'U': '#d946ef',
};

const CHAPTER_GRADIENTS: Record<string, string> = {
  'A': 'from-emerald-500 to-teal-600', 'C': 'from-purple-500 to-violet-600',
  'D': 'from-red-500 to-rose-600', 'E': 'from-amber-500 to-orange-600',
  'F': 'from-indigo-500 to-blue-600', 'G': 'from-cyan-500 to-sky-600',
  'H': 'from-sky-500 to-blue-600', 'I': 'from-red-600 to-pink-600',
  'J': 'from-teal-500 to-emerald-600', 'K': 'from-lime-500 to-green-600',
  'L': 'from-orange-400 to-amber-500', 'M': 'from-slate-500 to-gray-600',
  'N': 'from-blue-500 to-indigo-600', 'O': 'from-pink-400 to-fuchsia-500',
  'P': 'from-yellow-400 to-amber-500', 'Q': 'from-emerald-400 to-teal-500',
  'R': 'from-gray-400 to-slate-500', 'S': 'from-orange-500 to-red-500',
  'V': 'from-red-600 to-rose-700', 'Z': 'from-slate-500 to-gray-600',
  'U': 'from-fuchsia-500 to-purple-600',
};

const EMOJI_MAP: { range: string, emoji: string }[] = [
  { range: 'A00-B99', emoji: '🦠' }, { range: 'C00-D49', emoji: '🔬' },
  { range: 'D50-D89', emoji: '🩸' }, { range: 'E00-E89', emoji: '⚗️' },
  { range: 'F00-F99', emoji: '🧠' }, { range: 'G00-G99', emoji: '⚡' },
  { range: 'H00-H59', emoji: '👁️' }, { range: 'H60-H95', emoji: '🔊' },
  { range: 'I00-I99', emoji: '❤️' }, { range: 'J00-J99', emoji: '💨' },
  { range: 'K00-K95', emoji: '🫃' }, { range: 'L00-L99', emoji: '🩹' },
  { range: 'M00-M99', emoji: '🦴' }, { range: 'N00-N99', emoji: '🫘' },
  { range: 'O00-O9A', emoji: '🤱' }, { range: 'P00-P96', emoji: '👶' },
  { range: 'Q00-Q99', emoji: '🧬' }, { range: 'R00-R99', emoji: '📊' },
  { range: 'S00-T88', emoji: '🩺' }, { range: 'V00-Y99', emoji: '⚠️' },
  { range: 'Z00-Z99', emoji: '📋' }, { range: 'U00-U85', emoji: '🆕' }
];

function getEmoji(code: string): string {
    if (!code) return '📋';
    const letter = code.charAt(0).toUpperCase();
    let num = 0;
    const numStr = code.replace(/[^0-9]/g, '');
    if (numStr) num = parseInt(numStr.substring(0,2), 10);
    for (const entry of EMOJI_MAP) {
        const [start, end] = entry.range.split('-');
        const startLetter = start.charAt(0);
        const endLetter = end.charAt(0);
        const startNum = parseInt(start.substring(1, 3), 10);
        const endNum = parseInt(end.substring(1, 3), 10);
        if (letter > startLetter && letter < endLetter) return entry.emoji;
        if (startLetter === endLetter && letter === startLetter) {
             if (num >= startNum && num <= endNum) return entry.emoji;
        } else if (letter === startLetter || letter === endLetter) {
             if (letter === startLetter && num >= startNum) return entry.emoji;
             if (letter === endLetter && num <= endNum) return entry.emoji;
        }
    }
    return '📋';
}

function getStylesForCode(code: string) {
    const letter = code ? code.charAt(0).toUpperCase() : 'A';
    return {
       emoji: getEmoji(code),
       color: CHAPTER_COLORS[letter] || '#6366f1',
       gradientClass: CHAPTER_GRADIENTS[letter] || 'from-indigo-500 to-blue-600'
    };
}

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

// Custom Highlight Function Using Fuse.js Indices
const HighlightFuseMatch = ({ text = '', query = '', matches = [], matchKey = '' }: { text: string, query: string, matches?: any[], matchKey?: string }) => {
    if (matches && matches.length > 0 && matchKey) {
        const fieldMatch = matches.find((m: any) => m.key === matchKey);
        if (fieldMatch && fieldMatch.indices) {
            let lastIndex = 0;
            const parts: any[] = [];
            fieldMatch.indices.forEach(([start, end]: [number, number]) => {
                if (start > lastIndex) parts.push({ text: text.substring(lastIndex, start), hl: false });
                parts.push({ text: text.substring(start, end + 1), hl: true });
                lastIndex = end + 1;
            });
            if (lastIndex < text.length) parts.push({ text: text.substring(lastIndex), hl: false });
            return (
                <span>
                    {parts.map((p, i) =>
                        p.hl ? <span key={`hl-${i}`} className="font-extrabold bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 px-0.5 rounded-sm shadow-sm">{p.text}</span> : <span key={`txt-${i}`}>{p.text}</span>
                    )}
                </span>
            );
        }
    }

    if (!query) return <span>{text}</span>;
    const escapedQuery = query.toLowerCase().trim().split(' ')[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!escapedQuery) return <span>{text}</span>;

    const parts = text.split(new RegExp(`(${escapedQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === escapedQuery.toLowerCase() ? (
            <span key={i} className="font-extrabold bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-200 px-0.5 rounded-sm shadow-sm">{part}</span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    );
};

// ----------------------------------------
// COMPACT RESULT CARD (Dark-Mode Bento)
// ----------------------------------------
const ResultCard = React.memo(({ item, score, matches = [], activeQuery }: { item: any, score: number, matches?: any[], activeQuery: string }) => {
    const isBillable = item.is_billable;
    const isExact = score <= 0.05;
    const { emoji, color, gradientClass } = getStylesForCode(item.code_id);
    
    // Formatting Plain-English Snippet
    const plainEnglish = item.plain_english_explanation || 'No plain-English explanation available.';
    const shortSnippet = plainEnglish.length > 60 ? plainEnglish.slice(0, 60) + '...' : plainEnglish;

    return (
        <motion.div variants={cardVariant} className="h-full">
            <Link href={`/icd10cm/2026/code/${item.code_id}`} className="group relative p-5 sm:p-6 border border-slate-200 dark:border-slate-800 rounded-[2rem] transition-all duration-300 flex flex-col h-full overflow-hidden hover:-translate-y-1 bg-white dark:bg-[#0A0A12] shadow-sm hover:shadow-xl"
               onMouseEnter={(e) => {
                 const t = e.currentTarget as HTMLElement;
                 t.style.boxShadow = `0 0 20px ${color}15, 0 8px 24px rgba(0,0,0,0.15)`;
                 t.style.borderColor = `${color}40`;
               }}
               onMouseLeave={(e) => {
                 const t = e.currentTarget as HTMLElement;
                 t.style.boxShadow = '';
                 t.style.borderColor = '';
               }}>
                
                {/* Decorative Drop Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-tr-[2rem]" style={{ background: `radial-gradient(circle at top right, ${color}15 0%, transparent 70%)` }} />
                
                <div className="relative z-10 flex flex-col h-full">
                   {/* Top Header Row */}
                   <div className="flex items-start justify-between mb-5">
                       <div className="flex items-start gap-4">
                           <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-[24px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110" 
                                style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                               {emoji}
                           </div>
                           <div className="flex flex-col">
                               <span className={`font-black text-[24px] leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-r ${gradientClass}`}>
                                  <HighlightFuseMatch text={item.code_id} query={activeQuery} matches={matches} matchKey="code_id" />
                               </span>
                               {isExact && (
                                  <span className="text-[9px] font-black tracking-widest uppercase mt-2 px-2 py-0.5 rounded flex items-center w-max shadow-sm" style={{ color: color, background: `${color}15`, border: `1px solid ${color}30` }}>
                                     <svg className="w-2.5 h-2.5 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                                     Top Match
                                  </span>
                               )}
                           </div>
                       </div>
                       {isBillable ? (
                          <span className="px-2 py-1 rounded bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-[9px] font-black uppercase tracking-widest shadow-sm">BILLABLE</span>
                       ) : (
                          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-rose-500/10 text-slate-600 dark:text-rose-400 border border-slate-300 dark:border-rose-500/30 text-[9px] font-black uppercase tracking-widest">CATEGORY</span>
                       )}
                   </div>

                   {/* Title and Snippet */}
                   <p className="text-[14px] font-bold text-slate-800 dark:text-slate-200 leading-snug line-clamp-2 mb-2 transition-colors">
                      <HighlightFuseMatch text={item.title} query={activeQuery} matches={matches} matchKey="title" />
                   </p>
                   
                   <p className="text-[12px] font-medium text-slate-500 dark:text-slate-400 line-clamp-2 mt-auto leading-relaxed">
                      {shortSnippet}
                   </p>
                   
                   {/* Advanced Expansion (On Hover) */}
                   <div className="grid grid-rows-[0fr] group-hover:grid-rows-[1fr] transition-[grid-template-rows] duration-300 ease-in-out">
                       <div className="overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                              <div>
                                 <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1">Full Plain-English Definition</h4>
                                 <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium italic leading-relaxed">
                                     <HighlightFuseMatch text={plainEnglish} query={activeQuery} matches={matches} matchKey="plain_english_explanation" />
                                 </p>
                              </div>
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
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [displayLimit, setDisplayLimit] = useState(12);
  const [billableOnly, setBillableOnly] = useState(false);
  const [recentCodes, setRecentCodes] = useState<any[]>([]);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Load quick access history
  useEffect(() => {
      try {
          const recentStr = localStorage.getItem('dataicd10_recent');
          if (recentStr) setRecentCodes(JSON.parse(recentStr));
      } catch(e) {}
  }, []);

  // Debouncing logic
  useEffect(() => {
    const timer = setTimeout(() => {
       if (query.trim() !== debouncedQuery) {
          setDebouncedQuery(query.trim());
          setDisplayLimit(12);
       }
    }, 300);
    return () => clearTimeout(timer);
  }, [query, debouncedQuery]);

  // Construct SWR Key dynamically
  let fetchQueryString = '';
  if (debouncedQuery) {
     const params = new URLSearchParams();
     params.set('q', debouncedQuery);
     fetchQueryString = params.toString();
  }

  // Fast Automatic Fetching + Caching (SWR)
  const { data, isLoading } = useSWR(
     fetchQueryString ? `/api/search?${fetchQueryString}` : null,
     fetcher,
     { keepPreviousData: true, revalidateOnFocus: false }
  );

  const searchResults = data?.didYouMean ? [] : (data?.results || []);
  const didYouMeanItem = data?.didYouMean && data?.results?.length > 0 ? data.results[0].item : null;
  const isSearching = isLoading && !data;
  const activeQuery = debouncedQuery;

  const executeSearch = (forcedVal?: string) => {
     if (forcedVal) setQuery(forcedVal);
  };

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
    <div className={`min-h-screen bg-slate-50 dark:bg-[#07070E] text-slate-800 dark:text-slate-200 ${inter.className} overflow-x-hidden`}>
      <Head>
        <title>Dataicd10 | ICD-10 Directory</title>
        <meta name="description" content="CDC Extracted XML Data Search Engine" />
      </Head>

      <main className="flex flex-col items-center justify-start min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-100/50 via-slate-50 to-slate-50 dark:from-[#0A0A12] dark:via-[#07070E] dark:to-[#07070E]">
        
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
            <div className={`relative w-full flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isSearchMode ? 'py-8' : 'py-20 sm:py-32'} bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-50 to-transparent dark:from-[#0A0A12] dark:to-transparent overflow-hidden border-b border-slate-200/50 dark:border-white/5`}>
                
                {/* Subtle SVG Medical Grid Pattern */}
                <div 
                   className="absolute inset-0 z-0 opacity-[0.05] dark:opacity-[0.02] text-blue-500" 
                   style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20.5V18H0v-2h20v-2h2v2h20v2H22v2.5h18v2H22v2h-2v-2H0v-2h20z' fill='currentColor' fill-rule='evenodd'/%3E%3C/svg%3E")` }}
                ></div>

                <div className={`relative z-10 w-full px-4 sm:px-6 lg:px-8 mx-auto text-center ${isSearchMode ? 'max-w-4xl' : 'max-w-4xl'}`}>
                  <AnimatePresence mode="popLayout">
                      {!isSearchMode && (
                          <motion.div 
                            initial="hidden" animate="visible" exit={{ opacity: 0, y: -20, scale: 0.95 }} variants={staggerContainer}
                            className="space-y-6"
                          >
                            <motion.h1 variants={fadeUpVariant} className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[1.1] max-w-3xl mx-auto drop-shadow-sm dark:drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                                Find Any ICD-10 Code Instantly
                            </motion.h1>
                            <motion.p variants={fadeUpVariant} className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mt-4 font-medium mx-auto max-w-2xl">
                                Official 2026 updates from CMS and CDC.
                            </motion.p>
                          </motion.div>
                      )}
                  </AnimatePresence>

                  {/* INSTANT MEGA SEARCH BAR */}
                  <motion.div layout className={`w-full mx-auto relative z-30 transition-all duration-500 ${isSearchMode ? 'pt-2 max-w-4xl' : 'pt-10 max-w-3xl'}`}>
                    
                    {/* Dynamic 'Searching For' Status */}
                    {isSearchMode && activeQuery && (
                       <div className="absolute -top-7 left-6 flex items-center text-[10.5px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 z-40">
                           <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]"></span>
                           Searching for: <span className="ml-1.5 text-slate-800 dark:text-white">"{activeQuery}"</span>
                       </div>
                    )}

                    <div className="relative group flex flex-col sm:flex-row items-center w-full h-auto sm:h-16 rounded-[2rem] sm:rounded-full bg-white/70 dark:bg-[#07070E]/50 backdrop-blur-xl border border-slate-200/80 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] focus-within:border-blue-400/50 dark:focus-within:border-blue-500/50 focus-within:shadow-[0_20px_60px_-15px_rgba(59,130,246,0.3)] transition-all overflow-hidden text-left p-1 sm:p-0 z-30">
                      
                      <div className="hidden sm:flex pl-6 items-center pointer-events-none shrink-0">
                         <svg className={`h-6 w-6 transition-colors ${isSearchMode ? 'text-blue-500' : 'text-slate-400 group-focus-within:text-blue-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      
                      <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search 70,000+ ICD-10-CM Codes..." 
                        autoComplete="off"
                        spellCheck="false"
                        className="w-full pl-6 sm:pl-4 pr-16 py-4 sm:py-0 h-full text-lg sm:text-xl bg-transparent outline-none text-slate-900 dark:text-white font-black tracking-tight placeholder-slate-400/80 dark:placeholder-slate-500/80 group-focus-within:placeholder-slate-400 transition-colors"
                      />
                      
                      <div className="hidden sm:flex absolute right-4 items-center justify-center pointer-events-none">
                         <kbd className="inline-flex items-center justify-center px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-[10px] font-black rounded-lg shadow-sm tracking-widest leading-none border border-slate-200/60 dark:border-slate-700/60">
                            RET
                         </kbd>
                      </div>
                      
                      {/* Mobile search execute button fallback */}
                      <button 
                         onClick={() => executeSearch()}
                         className="sm:hidden w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-bold py-4 text-[13px] tracking-widest uppercase rounded-2xl mt-1"
                      >
                         Execute
                      </button>
                    </div>

                    {/* SHOW BILLABLE CODES ONLY TOGGLE SWITCH */}
                    <div className="flex items-center justify-center sm:justify-end mt-5 pr-4 w-full mx-auto relative z-30">
                       <button 
                          onClick={() => setBillableOnly(!billableOnly)}
                          className="flex items-center space-x-3 cursor-pointer group focus:outline-none"
                       >
                          <div className={`relative w-11 h-[24px] rounded-full transition-colors duration-300 ease-in-out border ${billableOnly ? 'bg-emerald-500/20 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.2)]' : 'bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700'}`}>
                              <motion.div 
                                 layout
                                 className={`absolute top-[2px] bottom-[2px] w-[18px] h-[18px] rounded-full shadow-sm bg-white border ${billableOnly ? 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'border-slate-300 dark:border-slate-600'}`}
                                 animate={{ left: billableOnly ? 'calc(100% - 20px)' : '2px' }}
                                 transition={{ type: "spring", stiffness: 500, damping: 30 }}
                              />
                          </div>
                          <span className={`text-[11px] font-black uppercase tracking-widest transition-colors select-none ${billableOnly ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`}>
                              Billable Codes Only
                          </span>
                       </button>
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
                        <motion.div variants={fadeUpVariant} className="mt-8 pt-10 rounded-[2.5rem] p-6 sm:p-10" style={{ background: '#07070E' }}>
                            <div className="mb-10 flex items-center justify-between border-b border-slate-800 pb-6">
                                <h2 className="text-2xl sm:text-3xl font-black text-white font-['Inter'] tracking-tight flex items-center">
                                    <svg className="w-8 h-8 mr-4 text-blue-500 drop-shadow-[0_0_12px_rgba(59,130,246,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                    Browse Official Chapters
                                </h2>
                                <Link href="/icd10cm/2026" className="text-[13px] font-bold text-white hover:text-blue-200 transition-colors bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 px-5 py-2.5 rounded-full hidden sm:inline-block">
                                    View Full Index →
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" style={{ gridAutoFlow: 'dense' }}>
                                {chapters.map((chapter) => {
                                   let rawTitle = Array.isArray(chapter.title) ? chapter.title.join(': ') : chapter.title || '';
                                   let cLabel = rawTitle.replace(/\s*\([^)]+\)\s*$/, '').trim();
                                   const meta = getMeta(chapter.id);
                                   const encodedId = encodeURIComponent(chapter.id);

                                   return (
                                     <Link 
                                         key={chapter.id} 
                                         href={`/icd10cm/2026/chapter/${encodedId}`}
                                         className={['group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:scale-[1.015] hover:-translate-y-0.5', meta.borderHover].join(' ')}
                                         style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)', minHeight: '168px' }}
                                         onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${meta.color}22, 0 8px 24px rgba(0,0,0,0.3)`; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                                         onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)'; }}
                                     >
                                         <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-300 group-hover:w-1" style={{ background: meta.color, boxShadow: `0 0 12px ${meta.color}80` }} />
                                         <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl" style={{ background: `radial-gradient(circle at top right, ${meta.color}18 0%, transparent 70%)` }} />
                                         
                                         <div className="relative pl-6 pr-5 pt-5 pb-5 flex flex-col flex-1">
                                            <div className="flex items-start justify-between gap-2 mb-3">
                                               <div className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110" style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
                                                  {meta.emoji}
                                               </div>
                                               <span className="mt-1 px-2.5 py-1 rounded-lg text-[9.5px] font-extrabold tracking-[0.14em] uppercase whitespace-nowrap font-mono" style={{ color: meta.color, background: `${meta.color}12`, border: `1px solid ${meta.color}25` }}>
                                                  {chapter.id}
                                               </span>
                                            </div>
                                            
                                            <p className="text-[13.5px] font-bold leading-snug mb-2 transition-colors duration-200 group-hover:text-white line-clamp-2" style={{ color: '#e2e8f0' }}>{cLabel}</p>
                                            <p className="text-[11.5px] leading-relaxed font-medium mb-auto line-clamp-2" style={{ color: '#64748b' }}>{meta.description}</p>
                                            
                                            <div className="mt-4 pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                               <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
                                                  {(chapter.codeCount || 0).toLocaleString()} codes
                                               </span>
                                               <div className="flex items-center gap-1 text-[11px] font-bold transition-all duration-200 group-hover:gap-2" style={{ color: meta.color }}>
                                                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase tracking-wider">Browse</span>
                                                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                                               </div>
                                            </div>
                                         </div>
                                     </Link>
                                 )})}
                            </div>
                        </motion.div>

                        {/* ========================================================= */}
                        {/* RECENTLY VIEWED WIDGET                                      */}
                        {/* ========================================================= */}
                        {recentCodes.length > 0 && (
                            <motion.div variants={fadeUpVariant} className="mt-16 pt-8 border-t border-slate-200/60 dark:border-white/10 pb-10">
                                <h2 className="text-xl font-bold text-[#1E3A8A] dark:text-blue-400 font-['Inter'] tracking-tight flex items-center mb-6">
                                    <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                    Quick Access History
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    {recentCodes.map((c, i) => (
                                        <Link key={i} href={`/icd10cm/2026/code/${c.code_id}`} className="group flex items-center bg-white dark:bg-[#0A0A12] border border-slate-200/80 dark:border-slate-800 hover:border-blue-400 p-3 pr-4 rounded-[12px] shadow-sm hover:shadow-md transition-all">
                                            <span className="font-extrabold text-[#2D82FE] text-[15px] tracking-tight group-hover:text-blue-700 dark:group-hover:text-blue-400 mr-4">{c.code_id}</span>
                                            <div className="flex flex-col">
                                                <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 line-clamp-1 max-w-[200px]">{c.title}</p>
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
                     key="loading-shimmer"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     exit={{ opacity: 0 }}
                     className="w-full pt-4 mt-8 flex flex-col items-center justify-center min-h-[40vh]"
                   >
                       {/* High-Tech Radar Scanning SVG */}
                       <div className="relative flex items-center justify-center mb-8">
                           <div className="absolute w-32 h-32 rounded-full border-[1.5px] border-blue-500/20 dark:border-blue-500/30 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                           <div className="absolute w-20 h-20 rounded-full border border-blue-400/40 dark:border-blue-500/50 animate-[ping_1.5s_cubic-bezier(0,0,0.2,1)_infinite] animation-delay-300"></div>
                           <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 rounded-full flex items-center justify-center z-10 border border-blue-200 dark:border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                               <svg className="w-6 h-6 text-blue-600 dark:text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0 0v-9m0-9v3m-7.071 2.929l2.121 2.121m12.021 1.929l-2.121-2.121" /></svg>
                           </div>
                       </div>
                       
                       <h3 className="text-xl font-black tracking-tight text-slate-800 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mb-2">Executing Deep Lexicon Scan</h3>
                       <p className="text-[13px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest text-center animate-pulse">Scanning 70,000+ Codes...</p>
                       
                       {/* Skeleton Shimmer Grid */}
                       <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-12 w-full">
                           {[1, 2, 3, 4, 5, 6].map((i) => (
                               <div key={i} className="rounded-[2rem] border border-slate-200 dark:border-white/5 bg-white/50 dark:bg-[#0A0A12] p-6 flex flex-col h-[280px] animate-pulse relative">
                                   <div className="flex gap-4 items-center mb-6">
                                       <div className="w-12 h-12 rounded-2xl bg-slate-200 dark:bg-white/5" />
                                       <div className="flex flex-col gap-2">
                                           <div className="w-24 h-6 rounded-md bg-slate-200 dark:bg-white/5" />
                                           <div className="w-16 h-3 rounded-md bg-slate-200 dark:bg-white/5" />
                                       </div>
                                   </div>
                                   <div className="w-full h-4 rounded bg-slate-200 dark:bg-white/5 mb-3" />
                                   <div className="w-5/6 h-4 rounded bg-slate-200 dark:bg-white/5 mb-6" />
                                   <div className="w-full h-8 rounded-lg bg-slate-200 dark:bg-white/5 mt-auto" />
                               </div>
                           ))}
                       </div>
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
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 px-2 border-b border-slate-200/60 dark:border-slate-800 pb-4">
                             <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white flex items-center mb-4 sm:mb-0">
                                 <svg className="w-7 h-7 mr-3 text-blue-600 dark:text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                                 Top Relevant Matches
                             </h2>
                             <div className="flex items-center">
                                 <span className="text-[11px] font-black uppercase tracking-widest text-slate-600 dark:text-blue-300 bg-white dark:bg-blue-900/30 px-3 py-1.5 rounded-full border border-slate-200 dark:border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                                   <span className="text-blue-600 dark:text-blue-400 mr-1">{filteredResults.length}</span> Matrix Codes Extracted
                                 </span>
                             </div>
                        </div>

                        {/* Rendering via Memoized Card Components */}
                        <motion.div 
                           variants={staggerContainer}
                           initial="hidden"
                           animate="visible"
                           className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-start"
                        >
                            {displayedResults.map(({ item, score, matches }, idx) => (
                                <ResultCard 
                                   key={`${item.code_id}-${idx}`} 
                                   item={item} 
                                   score={score}
                                   matches={matches} 
                                   activeQuery={activeQuery} 
                                />
                            ))}
                        </motion.div>

                        {/* Interactive Load More Protocol */}
                        {filteredResults.length > displayLimit && (
                            <div className="mt-14 flex justify-center pb-20">
                                <button 
                                   onClick={() => setDisplayLimit((prev) => prev + 12)}
                                   className="group relative inline-flex items-center justify-center px-8 py-3.5 text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 bg-white dark:bg-[#0A0A12] border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-500 rounded-full transition-all duration-300 shadow-sm hover:shadow-md uppercase tracking-widest"
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
                       className="flex flex-col items-center justify-center py-24 text-center bg-white dark:bg-[#0A0A12] rounded-[2rem] border border-dashed border-slate-300 dark:border-slate-800 shadow-sm mt-8 transition-colors width-full px-6"
                    >
                        {didYouMeanItem ? (
                           <>
                             <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Did you mean <span className="text-blue-600 dark:text-blue-400">{didYouMeanItem.title}</span>?</h3>
                             <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-md mx-auto mb-8">We found a very close match for your query. Click below to view the structural component.</p>
                             <button
                               onClick={() => executeSearch(didYouMeanItem.title)}
                               className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-all"
                             >
                               Search {didYouMeanItem.code_id}
                               <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                             </button>
                           </>
                        ) : (
                           <>
                             <div className="relative mb-8">
                                <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl animate-pulse"></div>
                                <div className="p-6 bg-slate-50 dark:bg-[#07070E] rounded-full border border-slate-100 dark:border-slate-800 relative z-10 shadow-[0_0_25px_rgba(0,0,0,0.1)] hover:scale-105 transition-transform duration-500">
                                    <svg className="w-14 h-14 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                </div>
                             </div>
                             <h3 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-3">Zero Clinical Matches Found</h3>
                             <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-md mx-auto">The diagnostic index returned no matches for your query. Try rephrasing your search or using a broader anatomical term.</p>
                           </>
                        )}
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
