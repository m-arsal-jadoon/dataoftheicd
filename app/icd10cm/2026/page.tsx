import fs from 'fs';
import path from 'path';
import Layout from '../../../components/Layout';
import ChapterGrid, { type Chapter } from './_components/ChapterGrid';

// ─── SEO Metadata ─────────────────────────────────────────────────────────────
export const metadata = {
  title: 'ICD-10-CM 2026 — Browse All 22 Chapters | DataICD10',
  description:
    'Explore all 22 official ICD-10-CM 2026 medical chapters — from infectious diseases to injuries. Navigate chapters, sections, categories, and 98,000+ billable codes. Powered by the CDC FY2026 tabular dataset.',
};

// ─── Production-Safe Data Loading (Server Component) ─────────────────────────
function loadChapters(): { chapters: Chapter[]; totalCodes: number; error: string | null } {
  try {
    // Absolute path — works on Linux (Vercel/Hostinger) and Windows alike
    const dbPath = path.join(process.cwd(), 'data', 'master_icd10.json');

    if (!fs.existsSync(dbPath)) {
      console.error('[ICD-10 Dir] master_icd10.json not found at:', dbPath);
      return {
        chapters: [],
        totalCodes: 0,
        error: 'Database file not found. Ensure the build pipeline has been run.',
      };
    }

    const raw = fs.readFileSync(dbPath, 'utf-8');
    if (!raw?.trim()) {
      return { chapters: [], totalCodes: 0, error: 'Database file is empty.' };
    }

    const records: any[] = JSON.parse(raw);
    if (!Array.isArray(records) || records.length === 0) {
      return { chapters: [], totalCodes: 0, error: 'Database contains no records.' };
    }

    // Aggregate unique chapters from the flat record list
    const chaptersMap = new Map<string, Chapter>();

    for (const rec of records) {
      // chapter_title can occasionally be an array in older pipeline versions
      const titleStr: string = Array.isArray(rec.chapter_title)
        ? rec.chapter_title.join(': ')
        : rec.chapter_title || '';

      if (!titleStr) continue;

      // Handle standard ranges (A00-B99), alpha-suffix ranges (O00-O9A, Q00-QA0)
      const rangeMatch = titleStr.match(/\(([A-Z]\d{2}-[A-Z][0-9A-Z]{1,2})\)$/);
      const id = rangeMatch ? rangeMatch[1] : titleStr.slice(0, 40);
      const label = titleStr.replace(/\s*\([^)]+\)\s*$/, '').trim();

      if (!chaptersMap.has(id)) {
        chaptersMap.set(id, { id, title: titleStr, label, codeCount: 0 });
      }
      chaptersMap.get(id)!.codeCount++;
    }

    // Official CDC order: sort by first letter then numeric range start
    const chapters = Array.from(chaptersMap.values()).sort((a, b) =>
      a.id.localeCompare(b.id)
    );

    const totalCodes = chapters.reduce((sum, c) => sum + c.codeCount, 0);

    return { chapters, totalCodes, error: null };
  } catch (err: any) {
    console.error('[ICD-10 Dir] Fatal error loading chapters:', err?.message ?? err);
    return {
      chapters: [],
      totalCodes: 0,
      error: 'An unexpected error occurred while loading the chapter data.',
    };
  }
}

// ─── Page (Server Component) ──────────────────────────────────────────────────
export default function ICD10DirectoryPage() {
  const { chapters, totalCodes, error } = loadChapters();

  return (
    <Layout breadcrumbs={{}}>
      <ChapterGrid chapters={chapters} totalCodes={totalCodes} error={error} />
    </Layout>
  );
}
