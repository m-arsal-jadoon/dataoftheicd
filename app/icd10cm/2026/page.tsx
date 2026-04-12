import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import Layout from '../../../components/Layout';

export const metadata = {
  title: 'ICD-10-CM 2026 — Browse All Chapters | DataICD10',
  description:
    'Browse all 22 official ICD-10-CM 2026 medical chapters. Navigate from high-level chapter ranges down to billable diagnosis codes. Powered by the CDC FY2026 tabular dataset.',
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface Chapter {
  id: string;       // e.g. "A00-B99"
  title: string;    // full title including range
  label: string;    // title without the parenthetical range
  codeCount: number;
  firstCode: string; // first letter, e.g. "A"
}

// ─── Chapter icon map (one emoji per chapter, purely decorative) ──────────────
const CHAPTER_ICONS: Record<string, string> = {
  'A': '🦠', 'C': '🔬', 'D': '🩸', 'E': '⚗️',
  'F': '🧠', 'G': '🫀', 'H': '👁️', 'I': '❤️',
  'J': '🫁', 'K': '🫃', 'L': '🩹', 'M': '🦴',
  'N': '🫘', 'O': '🍼', 'P': '👶', 'Q': '🧬',
  'R': '📊', 'S': '🩺', 'V': '🚨', 'Z': '📋', 'U': '🆕',
};

// ─── Chapter gradient map ─────────────────────────────────────────────────────
const CHAPTER_GRADIENTS: Record<string, string> = {
  'A': 'from-emerald-500 to-teal-600',
  'C': 'from-purple-500 to-violet-600',
  'D': 'from-red-500 to-rose-600',
  'E': 'from-amber-500 to-orange-600',
  'F': 'from-indigo-500 to-blue-600',
  'G': 'from-pink-500 to-rose-500',
  'H': 'from-cyan-500 to-sky-600',
  'I': 'from-red-600 to-pink-600',
  'J': 'from-sky-500 to-blue-500',
  'K': 'from-lime-500 to-green-600',
  'L': 'from-orange-400 to-amber-500',
  'M': 'from-stone-500 to-slate-600',
  'N': 'from-violet-500 to-purple-600',
  'O': 'from-pink-400 to-fuchsia-500',
  'P': 'from-yellow-400 to-amber-500',
  'Q': 'from-teal-500 to-emerald-600',
  'R': 'from-slate-500 to-gray-600',
  'S': 'from-blue-500 to-indigo-600',
  'V': 'from-orange-500 to-red-500',
  'Z': 'from-gray-500 to-slate-600',
  'U': 'from-fuchsia-500 to-purple-600',
};

// ─── Data Loading (Server Component — runs at build/request time) ─────────────
function loadChapters(): { chapters: Chapter[]; error: string | null } {
  try {
    const dbPath = path.join(process.cwd(), 'data', 'master_icd10.json');

    if (!fs.existsSync(dbPath)) {
      return {
        chapters: [],
        error: 'Database file not found. Please run the build pipeline first.',
      };
    }

    const raw = fs.readFileSync(dbPath, 'utf-8');
    if (!raw || raw.trim() === '') {
      return { chapters: [], error: 'Database file is empty.' };
    }

    const records: any[] = JSON.parse(raw);
    if (!Array.isArray(records) || records.length === 0) {
      return { chapters: [], error: 'Database contains no records.' };
    }

    // Aggregate chapters from the flat records
    const chaptersMap = new Map<string, Chapter>();

    for (const rec of records) {
      const titleStr: string = Array.isArray(rec.chapter_title)
        ? rec.chapter_title.join(': ')
        : rec.chapter_title || '';

      if (!titleStr) continue;

      // Extract the code range, e.g. "A00-B99" from "(A00-B99)"
      const rangeMatch = titleStr.match(/\(([A-Z]\d{2}-[A-Z0-9]{2,3})\)$/);
      const id = rangeMatch ? rangeMatch[1] : titleStr;
      const label = titleStr.replace(/\s*\([^)]+\)\s*$/, '').trim();
      const firstCode = id.charAt(0).toUpperCase();

      if (!chaptersMap.has(id)) {
        chaptersMap.set(id, {
          id,
          title: titleStr,
          label,
          codeCount: 0,
          firstCode,
        });
      }
      chaptersMap.get(id)!.codeCount++;
    }

    // Sort by first letter of the range (official CDC order)
    const chapters = Array.from(chaptersMap.values()).sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    return { chapters, error: null };
  } catch (err: any) {
    console.error('[ICD10 Dir Page] Failed to load chapters:', err?.message);
    return {
      chapters: [],
      error: 'An unexpected error occurred while loading the chapter data.',
    };
  }
}

// ─── Page Component ───────────────────────────────────────────────────────────
export default function ICD10DirectoryPage() {
  const { chapters, error } = loadChapters();
  const totalCodes = chapters.reduce((sum, c) => sum + c.codeCount, 0);

  return (
    <Layout breadcrumbs={{}}>
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-10 lg:py-14 font-sans">

        {/* ── PAGE HERO ─────────────────────────────────────────── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[10px] font-extrabold text-blue-600 tracking-[0.18em] uppercase border border-blue-100">
              Official CDC Dataset
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-extrabold text-slate-500 tracking-[0.18em] uppercase border border-slate-200">
              FY 2026
            </span>
          </div>

          <h1 className="text-[32px] lg:text-[44px] font-black text-slate-900 leading-tight tracking-tighter mb-3">
            ICD-10-CM 2026
            <span className="text-blue-600"> Chapter Directory</span>
          </h1>
          <p className="text-slate-500 text-[15px] font-medium max-w-2xl leading-relaxed">
            Browse all official ICD-10-CM chapters for fiscal year 2026. Navigate from
            chapter ranges to sections, categories, and individual billable codes.
          </p>

          {/* Stats bar */}
          {!error && chapters.length > 0 && (
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
                <span className="text-[22px] font-black text-blue-600">{chapters.length}</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                  Chapters
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
                <span className="text-[22px] font-black text-slate-800">{totalCodes.toLocaleString()}</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                  Total Codes
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-slate-200 shadow-sm">
                <span className="text-[22px] font-black text-emerald-600">2026</span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest leading-tight">
                  Fiscal Year
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── ERROR STATE ──────────────────────────────────────────── */}
        {error && (
          <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-10 text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              </svg>
            </div>
            <h2 className="text-[20px] font-black text-slate-800 mb-2">Data Currently Unavailable</h2>
            <p className="text-slate-500 text-[14px] font-medium max-w-md mx-auto">{error}</p>
            <Link
              href="/"
              className="mt-6 inline-block px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Return to Home
            </Link>
          </div>
        )}

        {/* ── EMPTY STATE ───────────────────────────────────────────── */}
        {!error && chapters.length === 0 && (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-16 text-center">
            <p className="text-slate-400 text-[15px] font-semibold">No chapters found in the database.</p>
          </div>
        )}

        {/* ── CHAPTER GRID ──────────────────────────────────────────── */}
        {!error && chapters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {chapters.map((chapter, idx) => {
              const gradient = CHAPTER_GRADIENTS[chapter.firstCode] ?? 'from-blue-500 to-indigo-600';
              const icon = CHAPTER_ICONS[chapter.firstCode] ?? '📋';
              const encodedId = encodeURIComponent(chapter.id);

              return (
                <Link
                  key={chapter.id}
                  href={`/icd10cm/2026/chapter/${encodedId}`}
                  className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm
                             hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:border-blue-200
                             hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Gradient accent bar */}
                  <div className={`h-1.5 w-full bg-gradient-to-r ${gradient} group-hover:h-2 transition-all duration-200`} />

                  <div className="p-5 flex flex-col flex-1">
                    {/* Icon + range badge */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}>
                        {icon}
                      </div>
                      <span className="mt-0.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 text-[10px] font-extrabold text-slate-600 tracking-widest uppercase whitespace-nowrap">
                        {chapter.id}
                      </span>
                    </div>

                    {/* Chapter label */}
                    <p className="text-[13.5px] font-bold text-slate-800 leading-snug flex-1 group-hover:text-slate-900 transition-colors line-clamp-3">
                      {chapter.label}
                    </p>

                    {/* Footer: code count + arrow */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        {chapter.codeCount.toLocaleString()} codes
                      </span>
                      <svg
                        className="w-4 h-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-150"
                        fill="none" stroke="currentColor" viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* ── BOTTOM INFO STRIP ──────────────────────────────────────── */}
        {!error && chapters.length > 0 && (
          <div className="mt-12 p-5 bg-white rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-[12px] font-bold text-slate-700 mb-0.5">About this dataset</p>
              <p className="text-[11.5px] text-slate-500 font-medium leading-relaxed">
                Data sourced from the CDC ICD-10-CM FY2026 tabular file (effective October 1, 2025 — September 30, 2026).
                For clinical use, always verify against the official CMS and CDC publications.
              </p>
            </div>
          </div>
        )}

      </main>
    </Layout>
  );
}
