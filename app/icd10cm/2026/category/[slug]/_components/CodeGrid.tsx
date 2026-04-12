'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface SerializedRecord {
  code_id: string;
  title: string;
  billable: boolean;
}

export interface CategoryDetails {
  code_id: string;
  title: string;
  chapter_id: string;
  chapter_title: string;
}

interface Props {
  category: CategoryDetails;
  codes: SerializedRecord[];
}

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

// ─── Component ────────────────────────────────────────────────────────────────
export default function CodeGrid({ category, codes }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return codes;
    return codes.filter((c) => {
      return (
        c.code_id.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
      );
    });
  }, [codes, query]);

  const isSearching = query.trim().length > 0;
  
  // Extract the first letter from the category ID (e.g., 'A' from 'A00') for its theme
  const firstLetter = category.code_id.charAt(0).toUpperCase();
  const themeColor = CHAPTER_COLORS[firstLetter] || '#6366f1';
  const gradientClass = CHAPTER_GRADIENTS[firstLetter] || 'from-indigo-500 to-blue-600';

  return (
    <div className="min-h-screen" style={{ background: '#07070E' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-12 pb-6">
        {category.chapter_id && (
           <Link href={`/icd10cm/2026/chapter/${encodeURIComponent(category.chapter_id)}`} className="inline-flex items-center text-[12px] font-bold text-slate-400 hover:text-white transition-colors mb-6 group">
             <svg className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
             Back to Chapter {category.chapter_id}
           </Link>
        )}
        
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase border"
            style={{ color: themeColor, borderColor: `${themeColor}40`, background: `${themeColor}15` }}
          >
            CATEGORY {category.code_id}
          </span>
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase border"
            style={{ color: '#94a3b8', borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(148,163,184,0.05)' }}
          >
            FY 2026
          </span>
        </div>

        <h1 className="text-[32px] sm:text-[44px] font-black leading-[1.1] tracking-tighter mb-4 text-white">
          {category.title}
        </h1>
        
        {category.chapter_title && (
           <p className="text-[14px] font-bold max-w-3xl leading-relaxed mb-6" style={{ color: themeColor }}>
             Part of: {category.chapter_title}
           </p>
        )}

        {/* Stats row */}
        <div className="mt-8 flex flex-wrap gap-4">
          {[
            { value: codes.length, label: 'Direct Codes', color: themeColor },
            { value: codes.filter(c => c.billable).length, label: 'Billable Specifics', color: '#10b981' },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className="flex items-center gap-3 px-5 py-3 rounded-2xl border"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <div className="w-2 h-2 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
              <span className="text-[20px] font-black" style={{ color }}>{value}</span>
              <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── STICKY SEARCH BAR ────────────────────────────────────────── */}
      {codes.length > 0 && (
        <div
          className="sticky top-0 z-30 py-4 px-4 lg:px-8"
          style={{
            background: 'rgba(7,7,14,0.85)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <div className="max-w-[1440px] mx-auto flex items-center gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-xl">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
                style={{ color: '#64748b' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filter specific codes (e.g., A00.1) or keywords..."
                className="w-full pl-11 pr-10 py-3 rounded-xl text-[13.5px] font-medium outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e2e8f0',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = `${themeColor}80`;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${themeColor}20`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center transition-colors"
                  style={{ color: '#64748b', background: 'rgba(255,255,255,0.08)' }}
                  aria-label="Clear search"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Results count */}
            <span className="hidden sm:block text-[12px] font-bold whitespace-nowrap" style={{ color: '#475569' }}>
              {isSearching
                ? `${filtered.length} of ${codes.length} codes`
                : `${codes.length} codes`}
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-16">

        {/* Empty / No results State */}
        {filtered.length === 0 && (
          <div
            className="rounded-2xl p-16 text-center border border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <p className="text-[15px] font-semibold" style={{ color: '#475569' }}>
              {codes.length === 0 ? 'No specific diagnosis codes found under this category.' : `No codes matching "${query}"`}
            </p>
            {isSearching && (
              <button
                onClick={() => setQuery('')}
                className="mt-3 text-[13px] font-bold transition-opacity hover:opacity-80"
                style={{ color: themeColor }}
              >
                Clear filter →
              </button>
            )}
          </div>
        )}

        {/* ── BENTO GRID ─────────────────────────────────────────────── */}
        {filtered.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {filtered.map((c) => {
              return (
                <Link
                  key={c.code_id}
                  href={`/icd10cm/2026/code/${c.code_id}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    borderColor: 'rgba(255,255,255,0.06)',
                    minHeight: '140px'
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 0 30px ${themeColor}15, 0 8px 24px rgba(0,0,0,0.2)`;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                    (e.currentTarget as HTMLElement).style.borderColor = `${themeColor}40`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div className="p-5 flex flex-col flex-1 h-full relative z-10">
                    
                    {/* Header Row: Code ID + Billable Badge */}
                    <div className="flex items-start justify-between mb-3 gap-2">
                       <span className="font-extrabold text-[18px] tracking-tight transition-colors" style={{ color: themeColor }}>
                          {c.code_id}
                       </span>
                       
                       {c.billable ? (
                         <span className="px-2 py-[2px] rounded uppercase text-[8.5px] font-black tracking-widest border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">BILLABLE</span>
                       ) : (
                         <span className="px-2 py-[2px] rounded uppercase text-[8.5px] font-black tracking-widest border border-rose-500/30 text-rose-400 bg-rose-500/10">NON-BILLABLE</span>
                       )}
                    </div>
                    
                    {/* Description */}
                     <p className="text-[12.5px] font-medium leading-relaxed line-clamp-4 w-full transition-colors group-hover:text-white" style={{ color: '#94a3b8' }}>
                        {c.title}
                     </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
