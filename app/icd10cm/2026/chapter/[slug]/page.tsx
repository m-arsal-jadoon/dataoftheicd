import Link from 'next/link';
import { getAllChapters, getAllCodes } from '../../../../../lib/data-engine/db';
import Layout from '../../../../../components/Layout';
import CategoryGrid, { type CategoryRecord, type ChapterDetails } from './_components/CategoryGrid';

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const chapters = getAllChapters() || [];
  const chapterRow = chapters.find(c => (c.id || "").toLowerCase() === decodedSlug);

  if (!chapterRow) {
    return (
      <Layout breadcrumbs={{}}>
         <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#07070E' }}>
            <div className="text-center p-10 rounded-2xl shadow-sm border max-w-[500px]" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
               <h1 className="text-3xl font-black text-white mb-2">Chapter Not Found</h1>
               <p className="font-medium mb-8" style={{ color: '#94a3b8' }}>We could not locate the chapter range: <strong className="px-2 py-1 rounded ml-1" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>{rawSlug}</strong></p>
               <Link href="/icd10cm/2026" className="inline-block px-8 py-3 font-bold rounded-xl transition-all hover:opacity-80 text-white" style={{ background: '#3b82f6' }}>
                  Return to Directory
               </Link>
            </div>
         </div>
      </Layout>
    );
  }

  const chapter: ChapterDetails = {
    id: chapterRow.id,
    title: chapterRow.title
  };

  // Fetch all 3-letter categories valid for this chapter
  const allCodes = getAllCodes();
  const categories: CategoryRecord[] = allCodes.filter(c => {
    let titleStr = Array.isArray(c.chapter_title) ? c.chapter_title.join(': ') : c.chapter_title;
    const match = titleStr?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)/);
    const mId = match ? match[1] : titleStr;
    return (mId?.toLowerCase() === decodedSlug) && (c.code_id.length === 3);
  }).map(c => ({
    code_id: c.code_id,
    title: c.title
  })).sort((a,b) => a.code_id.localeCompare(b.code_id, undefined, {numeric: true}));

  return (
    <Layout breadcrumbs={{ chapter: chapterRow }}>
      <CategoryGrid chapter={chapter} categories={categories} />
    </Layout>
  );
}
