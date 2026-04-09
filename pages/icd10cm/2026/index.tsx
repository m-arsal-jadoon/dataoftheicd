import type { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Breadcrumb from '../../../components/Breadcrumb';
import { getAllChapters } from '../../../lib/data-engine/db';

interface Chapter {
  id: string;
  title: string | string[];
}

interface IndexProps {
  chapters: Chapter[];
}

const Icd10Root: NextPage<IndexProps> = ({ chapters }) => {
  const crumbs = [
    { label: 'Home', url: '/' },
    { label: '2026 Codes' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-blue-100">
      <Head>
        <title>ICD-10-CM 2026 Chapters</title>
        <meta name="description" content="Browse ICD-10-CM 2026 codes by chapter." />
      </Head>

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm mt-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
            Browse FY 2026 ICD-10-CM Codes
          </h1>
          <p className="text-lg text-slate-600 mb-10 font-medium">
            Select a chapter below to view code categories and their definitions.
          </p>

          <div className="flex flex-col gap-4">
            {chapters.map((chapter, index) => {
              const chapterTitleStr = Array.isArray(chapter.title) ? chapter.title.join(': ') : chapter.title || 'Unspecified Chapter';
              const cleanTitle = chapterTitleStr.replace(/\([A-Z0-9\-]+\)$/, '').trim();
              
              return (
                <Link
                  key={chapter.id}
                  href={`/icd10cm/2026/chapter/${chapter.id}`}
                  className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 sm:p-6 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all h-full gap-4"
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <div className="hidden sm:flex w-12 h-12 rounded-full bg-blue-50 text-blue-600 items-center justify-center shrink-0 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                    </div>
                    <div>
                      <h2 className="text-[17px] sm:text-[19px] font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-700 transition-colors">
                         Chapter {index + 1}: <span className="text-blue-600 font-extrabold">{chapter.id}</span>
                      </h2>
                      <p className="text-sm sm:text-[15px] font-medium text-slate-500 mt-1 sm:mt-0.5 max-w-2xl">
                         {cleanTitle}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 sm:pl-6 w-full sm:w-auto text-right">
                    <span className="inline-flex w-full sm:w-auto justify-center text-sm font-bold text-blue-600 px-5 py-2.5 sm:py-2 rounded-full sm:bg-blue-50 sm:border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-colors text-center bg-blue-50/50">
                       View Details <span className="ml-2 sm:ml-1 opacity-70">→</span>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticProps: GetStaticProps<IndexProps> = async () => {
  const chapters = getAllChapters() || [];
  return {
    props: { chapters },
  };
};

export default Icd10Root;
