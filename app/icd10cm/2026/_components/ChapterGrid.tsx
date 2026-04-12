'use client';

import { useState, useMemo, useRef } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
export interface Chapter {
  id: string;
  title: string;
  label: string;
  codeCount: number;
}

interface ChapterMeta {
  emoji: string;
  description: string;
  color: string;          // hex for inline styles (glow, border)
  borderHover: string;    // full Tailwind hover class — must be literal for JIT
  featured: boolean;      // spans 2 cols on xl
}

// ─── Per-chapter metadata ─────────────────────────────────────────────────────
// ALL hover class strings must appear literally here so Tailwind JIT includes them.
const META: Record<string, ChapterMeta> = {
  'A00-B99': {
    emoji: '🦠',
    description: 'Bacterial, viral, fungal and parasitic infections — from cholera and tuberculosis to HIV and COVID-19.',
    color: '#10b981',
    borderHover: 'hover:border-emerald-500/50',
    featured: true,
  },
  'C00-D49': {
    emoji: '🔬',
    description: 'All malignant and benign neoplasms across every tissue type, including primary and secondary tumors.',
    color: '#8b5cf6',
    borderHover: 'hover:border-violet-500/50',
    featured: false,
  },
  'D50-D89': {
    emoji: '🩸',
    description: 'Anemia, coagulation disorders, immune deficiencies, and diseases of white blood cells.',
    color: '#f43f5e',
    borderHover: 'hover:border-rose-500/50',
    featured: false,
  },
  'E00-E89': {
    emoji: '⚗️',
    description: 'Diabetes, thyroid disorders, obesity, electrolyte imbalances, and metabolic syndromes.',
    color: '#f59e0b',
    borderHover: 'hover:border-amber-500/50',
    featured: false,
  },
  'F01-F99': {
    emoji: '🧠',
    description: 'Mental illnesses, substance use disorders, psychosis, anxiety, depression, and neurodevelopmental conditions.',
    color: '#6366f1',
    borderHover: 'hover:border-indigo-500/50',
    featured: true,
  },
  'G00-G99': {
    emoji: '⚡',
    description: 'Epilepsy, migraine, Parkinson\'s, neuropathy, and all other neurological disorders.',
    color: '#06b6d4',
    borderHover: 'hover:border-cyan-500/50',
    featured: false,
  },
  'H00-H59': {
    emoji: '👁️',
    description: 'Cataracts, glaucoma, retinal disorders, conjunctivitis, and all diseases of the eye.',
    color: '#0ea5e9',
    borderHover: 'hover:border-sky-500/50',
    featured: false,
  },
  'H60-H95': {
    emoji: '🔊',
    description: 'Hearing loss, otitis media, tinnitus, and mastoid diseases affecting the ear.',
    color: '#a855f7',
    borderHover: 'hover:border-purple-500/50',
    featured: false,
  },
  'I00-I99': {
    emoji: '❤️',
    description: 'Heart failure, hypertension, stroke, coronary artery disease, and vascular conditions.',
    color: '#ef4444',
    borderHover: 'hover:border-red-500/50',
    featured: true,
  },
  'J00-J99': {
    emoji: '💨',
    description: 'Asthma, COPD, pneumonia, influenza, pulmonary embolism, and all respiratory illnesses.',
    color: '#14b8a6',
    borderHover: 'hover:border-teal-500/50',
    featured: false,
  },
  'K00-K95': {
    emoji: '🫃',
    description: 'GERD, peptic ulcers, Crohn\'s, IBS, liver disease, and all digestive system disorders.',
    color: '#84cc16',
    borderHover: 'hover:border-lime-500/50',
    featured: false,
  },
  'L00-L99': {
    emoji: '🩹',
    description: 'Dermatitis, psoriasis, cellulitis, wound infections, and subcutaneous tissue diseases.',
    color: '#fb923c',
    borderHover: 'hover:border-orange-500/50',
    featured: false,
  },
  'M00-M99': {
    emoji: '🦴',
    description: 'Arthritis, osteoporosis, back pain, musculoskeletal injuries, and connective tissue diseases.',
    color: '#94a3b8',
    borderHover: 'hover:border-slate-400/50',
    featured: true,
  },
  'N00-N99': {
    emoji: '🫘',
    description: 'Kidney disease, UTIs, prostate disorders, and all genitourinary system conditions.',
    color: '#3b82f6',
    borderHover: 'hover:border-blue-500/50',
    featured: false,
  },
  'O00-O9A': {
    emoji: '🤱',
    description: 'Prenatal complications, labor, delivery, obstetric hemorrhage, and postpartum conditions.',
    color: '#ec4899',
    borderHover: 'hover:border-pink-500/50',
    featured: false,
  },
  'P00-P96': {
    emoji: '👶',
    description: 'Conditions specific to newborns — birth trauma, perinatal infections, and prematurity complications.',
    color: '#eab308',
    borderHover: 'hover:border-yellow-500/50',
    featured: false,
  },
  'Q00-QA0': {
    emoji: '🧬',
    description: 'Chromosomal abnormalities, congenital heart defects, cleft palate, and structural birth defects.',
    color: '#34d399',
    borderHover: 'hover:border-emerald-400/50',
    featured: false,
  },
  'R00-R99': {
    emoji: '📊',
    description: 'Symptoms, signs, and abnormal lab findings not classified elsewhere — the diagnostic catch-alls.',
    color: '#9ca3af',
    borderHover: 'hover:border-gray-400/50',
    featured: false,
  },
  'S00-T88': {
    emoji: '🩺',
    description: 'All traumatic injuries, burns, poisonings, fractures, dislocations, and their sequelae.',
    color: '#f97316',
    borderHover: 'hover:border-orange-500/50',
    featured: true,
  },
  'V00-Y99': {
    emoji: '⚠️',
    description: 'Motor vehicle accidents, falls, assaults, self-harm, and all external causes of injury.',
    color: '#dc2626',
    borderHover: 'hover:border-red-600/50',
    featured: false,
  },
  'Z00-Z99': {
    emoji: '📋',
    description: 'Preventive visits, vaccination status, family history, social determinants, and administrative reasons.',
    color: '#64748b',
    borderHover: 'hover:border-slate-500/50',
    featured: false,
  },
  'U00-U85': {
    emoji: '🆕',
    description: 'Provisional codes for emergency use, including COVID-19 variants and novel conditions.',
    color: '#d946ef',
    borderHover: 'hover:border-fuchsia-500/50',
    featured: false,
  },
};

const FALLBACK_META: ChapterMeta = {
  emoji: '📋',
  description: 'A group of related diagnostic codes for this medical chapter.',
  color: '#6366f1',
  borderHover: 'hover:border-indigo-500/50',
  featured: false,
};

function getMeta(id: string): ChapterMeta {
  return META[id] ?? FALLBACK_META;
}

// ─── Props ────────────────────────────────────────────────────────────────────
interface Props {
  chapters: Chapter[];
  totalCodes: number;
  error: string | null;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ChapterGrid({ chapters, totalCodes, error }: Props) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return chapters;
    return chapters.filter((c) => {
      const meta = getMeta(c.id);
      return (
        c.id.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        meta.description.toLowerCase().includes(q)
      );
    });
  }, [chapters, query]);

  const isSearching = query.trim().length > 0;

  return (
    <div className="min-h-screen" style={{ background: '#07070E' }}>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 pt-12 pb-6">
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase border"
            style={{ color: '#10b981', borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.08)' }}
          >
            CDC Official Dataset
          </span>
          <span
            className="px-3 py-1 rounded-full text-[10px] font-extrabold tracking-[0.2em] uppercase border"
            style={{ color: '#94a3b8', borderColor: 'rgba(148,163,184,0.2)', background: 'rgba(148,163,184,0.05)' }}
          >
            FY 2026
          </span>
        </div>

        <h1 className="text-[36px] sm:text-[52px] font-black leading-[1.05] tracking-tighter mb-4">
          <span className="text-white">ICD-10-CM</span>{' '}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%)' }}
          >
            2026 Chapters
          </span>
        </h1>
        <p className="text-[15px] font-medium max-w-2xl leading-relaxed" style={{ color: '#94a3b8' }}>
          Navigate all 22 official ICD-10-CM chapters — from broad disease categories to granular
          billable diagnosis codes. Sourced directly from the CDC FY2026 tabular file.
        </p>

        {/* Stats row */}
        {!error && chapters.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {[
              { value: chapters.length, label: 'Chapters', color: '#3b82f6' },
              { value: totalCodes.toLocaleString(), label: 'Total Codes', color: '#10b981' },
              { value: '2026', label: 'Fiscal Year', color: '#8b5cf6' },
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
        )}
      </div>

      {/* ── STICKY SEARCH BAR ────────────────────────────────────────── */}
      {!error && chapters.length > 0 && (
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
                placeholder="Filter by code (A00) or keyword (cholera, heart, skin)…"
                className="w-full pl-11 pr-10 py-3 rounded-xl text-[13.5px] font-medium outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  color: '#e2e8f0',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)';
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
                ? `${filtered.length} of ${chapters.length} chapters`
                : `${chapters.length} chapters`}
            </span>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT AREA ────────────────────────────────────────── */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 pb-16">

        {/* Error State */}
        {error && (
          <div
            className="rounded-2xl p-10 text-center border"
            style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.15)' }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"
              style={{ background: 'rgba(239,68,68,0.1)' }}
            >
              ⚠️
            </div>
            <h2 className="text-[18px] font-black text-white mb-2">Data Currently Unavailable</h2>
            <p className="text-[13px] font-medium max-w-sm mx-auto mb-6" style={{ color: '#94a3b8' }}>{error}</p>
            <Link
              href="/"
              className="inline-block px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-80"
              style={{ background: '#3b82f6' }}
            >
              Return to Home
            </Link>
          </div>
        )}

        {/* Empty / No results State */}
        {!error && filtered.length === 0 && (
          <div
            className="rounded-2xl p-16 text-center border border-dashed"
            style={{ borderColor: 'rgba(255,255,255,0.07)' }}
          >
            <p className="text-[15px] font-semibold" style={{ color: '#475569' }}>
              {isSearching ? `No chapters matching "${query}"` : 'No chapters found in the database.'}
            </p>
            {isSearching && (
              <button
                onClick={() => setQuery('')}
                className="mt-3 text-[13px] font-bold transition-opacity hover:opacity-80"
                style={{ color: '#6366f1' }}
              >
                Clear filter →
              </button>
            )}
          </div>
        )}

        {/* ── BENTO GRID ─────────────────────────────────────────────── */}
        {!error && filtered.length > 0 && (
          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            style={{ gridAutoFlow: 'dense' }}
          >
            {filtered.map((chapter) => {
              const meta = getMeta(chapter.id);
              const encodedId = encodeURIComponent(chapter.id);

              return (
                <Link
                  key={chapter.id}
                  href={`/icd10cm/2026/chapter/${encodedId}`}
                  className={[
                    'group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-300',
                    'hover:scale-[1.015] hover:-translate-y-0.5',
                    meta.borderHover,
                    // Featured chapters span 2 cols on xl (only in non-search mode)
                    !isSearching && meta.featured ? 'xl:col-span-2' : '',
                  ].join(' ')}
                  style={{
                    background: 'rgba(255,255,255,0.025)',
                    borderColor: 'rgba(255,255,255,0.07)',
                    minHeight: !isSearching && meta.featured ? '200px' : '168px',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow =
                      `0 0 40px ${meta.color}22, 0 8px 24px rgba(0,0,0,0.3)`;
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.025)';
                  }}
                >
                  {/* Left accent line */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl transition-all duration-300 group-hover:w-1"
                    style={{ background: meta.color, boxShadow: `0 0 12px ${meta.color}80` }}
                  />

                  {/* Subtle radial glow in top-right corner */}
                  <div
                    className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at top right, ${meta.color}18 0%, transparent 70%)`,
                    }}
                  />

                  <div className="relative pl-6 pr-5 pt-5 pb-5 flex flex-col flex-1">
                    {/* Top row: icon + badge */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      {/* Icon box */}
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center text-[22px] flex-shrink-0 transition-transform duration-200 group-hover:scale-110"
                        style={{
                          background: `${meta.color}18`,
                          border: `1px solid ${meta.color}30`,
                        }}
                      >
                        {meta.emoji}
                      </div>

                      {/* Code range badge */}
                      <span
                        className="mt-1 px-2.5 py-1 rounded-lg text-[9.5px] font-extrabold tracking-[0.14em] uppercase whitespace-nowrap font-mono"
                        style={{
                          color: meta.color,
                          background: `${meta.color}12`,
                          border: `1px solid ${meta.color}25`,
                        }}
                      >
                        {chapter.id}
                      </span>
                    </div>

                    {/* Chapter title */}
                    <p
                      className="text-[13.5px] font-bold leading-snug mb-2 transition-colors duration-200 group-hover:text-white line-clamp-2"
                      style={{ color: '#e2e8f0' }}
                    >
                      {chapter.label}
                    </p>

                    {/* Plain English description */}
                    <p
                      className="text-[11.5px] leading-relaxed font-medium mb-auto line-clamp-2"
                      style={{ color: '#64748b' }}
                    >
                      {meta.description}
                    </p>

                    {/* Footer row */}
                    <div
                      className="mt-4 pt-3 flex items-center justify-between"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <span className="text-[10.5px] font-bold uppercase tracking-widest" style={{ color: '#475569' }}>
                        {chapter.codeCount.toLocaleString()} codes
                      </span>
                      <div
                        className="flex items-center gap-1 text-[11px] font-bold transition-all duration-200 group-hover:gap-2"
                        style={{ color: meta.color }}
                      >
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase tracking-wider">Browse</span>
                        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── FOOTER STRIP ───────────────────────────────────────────── */}
        {!error && chapters.length > 0 && (
          <div
            className="mt-12 p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center gap-4"
            style={{
              background: 'rgba(255,255,255,0.02)',
              borderColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              ℹ️
            </div>
            <p className="text-[11.5px] font-medium leading-relaxed" style={{ color: '#64748b' }}>
              <span className="font-bold" style={{ color: '#94a3b8' }}>CDC FY2026 ICD-10-CM dataset</span>
              {' '}— effective October 1, 2025 through September 30, 2026.
              For clinical use, always verify against official CMS and CDC publications.
              This platform is for informational and educational purposes only.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
