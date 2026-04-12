import Link from 'next/link';
import { getCategoriesByChapter } from '../../../../../lib/data-engine/db';
import Layout from '../../../../../components/Layout';
import CategoryGrid, { type CategoryRecord, type SectionDetails } from './_components/CategoryGrid';

export default async function SectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const categoriesRecords = getCategoriesByChapter(decodedSlug);

  if (!categoriesRecords || categoriesRecords.length === 0) {
    return (
      <Layout breadcrumbs={{}}>
         <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#07070E' }}>
            <div className="text-center p-10 rounded-2xl shadow-sm border max-w-[500px]" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
               <h1 className="text-3xl font-black text-white mb-2">Section Not Found</h1>
               <p className="font-medium mb-8" style={{ color: '#94a3b8' }}>We could not locate the section block: <strong className="px-2 py-1 rounded ml-1" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>{rawSlug}</strong></p>
               <Link href="/icd10cm/2026" className="inline-block px-8 py-3 font-bold rounded-xl transition-all hover:opacity-80 text-white" style={{ background: '#3b82f6' }}>
                  Return to Directory
               </Link>
            </div>
         </div>
      </Layout>
    );
  }

  const sectionId = decodedSlug.toUpperCase();
  const rawChapterTitle = categoriesRecords[0]?.chapter_title;
  const chapterTitleStr = Array.isArray(rawChapterTitle) ? rawChapterTitle.join(': ') : rawChapterTitle || '';

  const chapterMatch = chapterTitleStr.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)$/);
  const chapterId = chapterMatch ? chapterMatch[1] : '';

  const section: SectionDetails = {
    id: sectionId,
    chapter_id: chapterId,
    chapter_title: chapterTitleStr
  };

  const categories: CategoryRecord[] = categoriesRecords.map((c: any) => ({
    code_id: c.code_id,
    title: c.title
  })).sort((a: any, b: any) => a.code_id.localeCompare(b.code_id, undefined, {numeric: true}));

  return (
    <Layout breadcrumbs={{ section: { id: sectionId, chapter_title: chapterTitleStr } }}>
      <CategoryGrid section={section} categories={categories} />
    </Layout>
  );
}
