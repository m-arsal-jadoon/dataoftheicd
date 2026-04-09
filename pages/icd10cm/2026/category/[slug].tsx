// Router Refresh Trigger
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { getAllCodes, getCodesByCategory, RelationalIcdRecord } from '../../../../lib/data-engine/db';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

interface CategoryPageProps {
  category: RelationalIcdRecord;
  codes: RelationalIcdRecord[];
}

const CategoryPage: NextPage<any> = (props) => {
  const router = useRouter();
  const [navQuery, setNavQuery] = useState('');

  if (router.isFallback) {
      return (
         <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Accessing Category Scope...</h2>
            <p className="text-slate-500 font-medium text-sm mt-2">Checking master registry for category groupings</p>
         </div>
      );
  }

  if (props.error === 'not-found') {
      return (
         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-[500px]">
               <h1 className="text-4xl font-black text-slate-800 mb-2">Category Not Found</h1>
               <p className="text-slate-500 font-medium mb-8">We could not locate the ICD-10 Category block for: <strong className="text-slate-900 border border-slate-200 px-2 py-1 rounded bg-slate-50 ml-1">{props.requestedSlug}</strong></p>
               <Link href="/" className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">Return to Directory</Link>
            </div>
         </div>
      );
  }

  const { category, codes } = props;
  const chapterId = category.chapter_range ? (Array.isArray(category.chapter_range) ? category.chapter_range[0] : category.chapter_range) : '';
  const chapterTitleStr = Array.isArray(category.chapter_title) ? category.chapter_title.join(': ') : (category.chapter_title || '');
  
  // Sort codes numerically
  const sortedCodes = [...codes].sort((a: any, b: any) => a.code_id.localeCompare(b.code_id, undefined, { numeric: true }));

  return (
    <div className={`min-h-screen bg-white text-slate-800 ${inter.className} selection:bg-blue-100 overflow-x-hidden`}>
      <Head>
        <title>Category {category.code_id} - ICD-10 2026 Diagnosis Codes</title>
        <meta name="description" content={`ICD-10 codes under category ${category.code_id}: ${category.title}`} />
      </Head>



      {/* ========================================================= */}
      {/* CATEGORY DASHBOARD CONTENT                                  */}
      {/* ========================================================= */}
      <main className="max-w-[1440px] mx-auto px-4 lg:px-6 py-10 lg:py-16">
         
         <div className="bg-white rounded-[24px] p-6 sm:p-10 border border-[#E2E8F0] shadow-sm">
            
            {/* HERO SECTION */}
            <div className="mb-1 flex flex-col items-start relative">
               
               {/* Quick Badge */}
               <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-[3px] rounded bg-[#EBF3FF] text-[9.5px] font-extrabold text-[#2D82FE] tracking-widest uppercase border border-[#D5E5FF]">
                     CATEGORY {category.code_id}
                  </span>
               </div>

               {/* Main Title */}
               <h1 className="text-[36px] lg:text-[44px] font-black text-[#1D2939] leading-tight tracking-tighter mb-2">
                  {category.title}
               </h1>

               {/* Meta line */}
               {chapterId && (
                  <p className="text-[12.5px] font-semibold text-[#94A3B8] mb-6">
                     From Chapter: {chapterId} - {chapterTitleStr}
                  </p>
               )}
               
               {/* Secondary Toolbar (Title & Counter) */}
               <div className="w-full flex items-center justify-between border-b border-[#E2E8F0] pb-4 mt-6 mb-8">
                  <h2 className="text-[11px] font-black tracking-widest text-[#94A3B8] uppercase">
                     Direct Diagnosis Codes
                  </h2>
                  <span className="px-3 py-1.5 rounded-[4px] bg-[#F8FAFC] text-[10px] font-black text-[#64748B] tracking-widest uppercase border border-[#E2E8F0]">
                     {sortedCodes.length} CODES
                  </span>
               </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
               {sortedCodes.map((code: any) => (
                  <Link
                     key={code.code_id}
                     href={`/icd10cm/2026/code/${code.code_id}`}
                     className="group p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-[0_4px_12px_rgba(0,0,0,0.05)] transition-all flex flex-col justify-start min-h-[110px]"
                  >
                     <div className="flex items-start justify-between mb-2">
                        <span className="font-extrabold text-[#2D82FE] text-[16px] tracking-tight group-hover:text-blue-700 transition-colors">{code.code_id}</span>
                        {code.billable_flag === "1" || code.billable_flag === true || code.is_billable === true || code.billable === true ? (
                           <span className="px-1.5 py-[1px] rounded-[3px] bg-[#E6F8F0] text-[6.5px] font-black text-[#1D9A6C] tracking-widest uppercase border border-[#C6F0DF]">BILLABLE</span>
                        ) : (
                           <span className="px-1.5 py-[1px] rounded-[3px] bg-[#FFE9EB] text-[6.5px] font-black text-[#D83B5E] tracking-widest uppercase border border-[#FDC2CF]">NON-BILLABLE</span>
                        )}
                     </div>
                     <p className="text-[11px] font-medium text-slate-600 line-clamp-4 leading-snug group-hover:text-slate-900 transition-colors pr-2">
                        {code.title}
                     </p>
                  </Link>
               ))}
            </div>

            {sortedCodes.length === 0 && (
               <div className="p-10 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 mt-5">
                  <p className="text-slate-500 font-medium text-sm">No specific sub-codes found.</p>
               </div>
            )}

         </div>

      </main>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<CategoryPageProps | { error: string, requestedSlug: string }> = async (context) => {
  const rawSlug = context.params?.slug as string;
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const allCodes = getAllCodes() || [];
  const category = allCodes.find(c => c.code_id.toLowerCase() === decodedSlug);

  if (!category) return { props: { error: 'not-found', requestedSlug: rawSlug } };

  const codes = getCodesByCategory(decodedSlug);

  return {
    props: {
      category,
      codes
    }
  };
};

export default CategoryPage;
