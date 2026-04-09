import Link from 'next/link';
import { getAllChapters, getAllCodes } from '../../../../../lib/data-engine/db';
import Layout from '../../../../../components/Layout';

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const chapters = getAllChapters() || [];
  const chapter = chapters.find(c => (c.id || "").toLowerCase() === decodedSlug);

  if (!chapter) {
    return (
      <Layout breadcrumbs={{}}>
         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-[500px]">
               <h1 className="text-4xl font-black text-slate-800 mb-2">Chapter Not Found</h1>
               <p className="text-slate-500 font-medium mb-8">We could not locate the chapter range: <strong className="text-slate-900 border border-slate-200 px-2 py-1 rounded bg-slate-50 ml-1">{rawSlug}</strong></p>
               <Link href="/" className="inline-block px-8 py-3 bg-[#2D82FE] hover:bg-blue-700 text-white font-bold rounded-lg transition-colors">Return to Directory</Link>
            </div>
         </div>
      </Layout>
    );
  }

  // Fetch all 3-letter categories valid for this chapter
  const allCodes = getAllCodes();
  const categories = allCodes.filter(c => {
    let titleStr = Array.isArray(c.chapter_title) ? c.chapter_title.join(': ') : c.chapter_title;
    const match = titleStr?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)/);
    const mId = match ? match[1] : titleStr;
    return (mId?.toLowerCase() === decodedSlug) && (c.code_id.length === 3);
  }).sort((a,b) => a.code_id.localeCompare(b.code_id, undefined, {numeric: true}));

  return (
    <Layout breadcrumbs={{ chapter: chapter }}>
      {/* CATEGORY DASHBOARD CONTENT */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-10 lg:py-16 font-sans">
         <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-[#E2E8F0] shadow-sm">
            
            {/* HERO SECTION */}
            <div className="mb-1 flex flex-col items-start relative">
               
               {/* Quick Badge */}
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-[4px] rounded bg-[#EBF3FF] text-[9.5px] font-extrabold text-[#2D82FE] tracking-[0.15em] uppercase border border-[#D5E5FF]">
                     ICD-10 Chapter Range {chapter.id}
                  </span>
               </div>

               {/* Main Title */}
               <h1 className="text-[36px] lg:text-[44px] font-black text-[#1D2939] leading-tight tracking-tighter mb-2 pr-10">
                  {chapter.title.split('(')[0].trim()}
               </h1>
               
               <p className="text-[14px] font-medium text-[#7C8B9F] mb-6 tracking-tight">
                  Comprehensive block of valid target categories.
               </p>
               
               {/* Secondary Toolbar (Title & Counter) */}
               <div className="w-full flex items-center justify-between border-b border-[#E2E8F0] pb-4 mt-6 mb-8">
                  <h2 className="text-[11px] font-black tracking-widest text-[#94A3B8] uppercase">
                     Browse Root Categories
                  </h2>
                  <span className="px-3 py-1.5 rounded-[4px] bg-[#F8FAFC] text-[10px] font-black text-[#64748B] tracking-widest uppercase border border-[#E2E8F0]">
                     {categories.length} CATEGORIES
                  </span>
               </div>
            </div>

            {/* 4-COLUMN GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {categories.map((c) => (
                  <Link
                     key={c.code_id}
                     href={`/icd10cm/2026/category/${c.code_id}`}
                     className="group p-5 bg-[#FAFBFD] rounded-[14px] border border-slate-200/80 hover:bg-white hover:border-[#2D82FE]/60 hover:shadow-[0_4px_16px_rgba(45,130,254,0.08)] transition-all flex flex-col justify-start min-h-[110px]"
                  >
                     <div className="flex items-center justify-center mb-2.5">
                        <span className="font-extrabold text-[#2D82FE] text-[18px] tracking-tight group-hover:text-blue-700 transition-colors text-center">{c.code_id}</span>
                     </div>
                     <p className="text-[11.5px] font-bold text-slate-700 line-clamp-4 leading-relaxed group-hover:text-slate-900 transition-colors text-center w-full">
                        {c.title}
                     </p>
                  </Link>
               ))}
            </div>

            {categories.length === 0 && (
               <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-5">
                  <p className="text-[#64748B] font-medium text-[14px]">No root categories mapped exclusively to this chapter.</p>
               </div>
            )}

         </div>

      </main>
    </Layout>
  );
}
