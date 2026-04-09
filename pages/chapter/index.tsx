import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllCodes } from '../../lib/data-engine/db';

interface ChapterProps {
  chapters: Array<{
    id: string;
    title: string;
    codeCount: number;
    range: string;
  }>;
}

const ChapterIndex: NextPage<ChapterProps> = ({ chapters }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <Head>
        <title>ICD-10-CM Chapters | Comprehensive Medical Taxonomy Gateway</title>
        <meta name="description" content="Browse all 22 official CDC ICD-10-CM chapters representing over 73,000 distinct diagnostic pathways." />
      </Head>
      
      {/* Subtle Header Area */}
      <div className="max-w-[85rem] mx-auto mb-10">
         <Link href="/" className="inline-flex items-center text-xs font-black tracking-widest text-slate-400 hover:text-blue-600 transition-colors uppercase mb-6">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
            Dataicd10 Gateway
         </Link>
         <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A8A] tracking-tight">ICD-10-CM Master Taxonomy</h1>
         <p className="mt-4 text-lg text-slate-600 font-medium max-w-3xl">Explore the absolute foundation of clinical diagnostics. The taxonomy is divided into 22 strict official CDC classifications, hierarchically structured for deep crawl indexing.</p>
         <hr className="mt-8 border-slate-200" />
      </div>

      {/* Enterprise Grid Layout */}
      <div className="max-w-[85rem] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {chapters.map((chapter) => (
            <Link key={chapter.id} href={`/chapter/${encodeURIComponent(chapter.id)}`} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/60 shadow-[0_4px_20px_-15px_rgba(0,0,0,0.1)] hover:shadow-xl hover:-translate-y-1 hover:border-blue-300 transition-all duration-300 flex flex-col h-full group">
              <div className="flex justify-between items-start mb-4">
                 <span className="text-[11px] font-black bg-slate-100 text-slate-500 px-2.5 py-1 rounded inline-block shadow-sm tracking-widest uppercase border border-slate-200">
                   Chap {chapter.id}
                 </span>
                 <span className="text-[11px] font-black bg-blue-50 text-blue-600 px-2.5 py-1 rounded inline-block shadow-sm tracking-widest uppercase border border-blue-100">
                   {chapter.range}
                 </span>
              </div>
              <h2 className="text-[17px] font-bold text-slate-800 group-hover:text-[#1E3A8A] transition-colors mb-6 leading-relaxed line-clamp-3">
                {chapter.title}
              </h2>
              <div className="mt-auto text-[13px] font-bold text-slate-400 group-hover:text-blue-500 transition-colors flex items-center">
                {chapter.codeCount.toLocaleString()} Nodes Indexed 
                <svg className="w-4 h-4 ml-1.5 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<ChapterProps> = async () => {
  const allCodes = getAllCodes();
  
  const chapterMap = new Map<string, { id: string, title: string, codeCount: number, range: string }>();
  
  allCodes.forEach((code: any) => {
    const cId = Array.isArray(code.chapter_id) ? code.chapter_id[0] : code.chapter_id;
    const cTitle = Array.isArray(code.chapter_title) ? code.chapter_title[0] : code.chapter_title;
    const range = Array.isArray(code.chapter_range) ? code.chapter_range[0] : (code.chapter_range || "Unknown");
    
    // Ignore invalid codes
    if (cId && cId !== 'Unknown' && cTitle) {
      if (!chapterMap.has(cId)) {
        chapterMap.set(cId, { id: String(cId).replace('Chapter ', ''), title: String(cTitle), codeCount: 1, range: String(range) });
      } else {
        const existing = chapterMap.get(cId)!;
        existing.codeCount += 1;
      }
    }
  });

  const chapters = Array.from(chapterMap.values()).sort((a, b) => {
      const numA = parseInt(a.id);
      const numB = parseInt(b.id);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.id.localeCompare(b.id);
  });

  return {
    props: { chapters }
  };
};

export default ChapterIndex;
