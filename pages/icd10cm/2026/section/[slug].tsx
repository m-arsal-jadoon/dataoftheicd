import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Breadcrumb from '../../../../components/Breadcrumb';
import { getCategoriesByChapter, RelationalIcdRecord, getAllCodes } from '../../../../lib/data-engine/db';

interface SectionPageProps {
  sectionId: string;
  categories: RelationalIcdRecord[];
}

const SectionPage: NextPage<any> = (props) => {
  const router = useRouter();

  if (router.isFallback) {
      return (
         <div className="min-h-screen bg-white flex flex-col items-center justify-center p-10">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">Accessing Section Block...</h2>
         </div>
      );
  }

  if (props.error === 'not-found') {
      return (
         <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-[500px]">
               <h1 className="text-4xl font-black text-slate-800 mb-2">Section Not Found</h1>
               <p className="text-slate-500 font-medium mb-8">We could not locate the ICD-10 Category block for: <strong className="text-slate-900 border border-slate-200 px-2 py-1 rounded bg-slate-50 ml-1">{props.requestedSlug}</strong></p>
               <Link href="/" className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors">Return to Directory</Link>
            </div>
         </div>
      );
  }

  const { sectionId, categories } = props;
  const crumbs = [
    { label: 'Home', url: '/' },
    { label: '2026 Codes', url: '/icd10cm/2026' },
    { label: `Section ${sectionId}` },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] text-slate-800 transition-colors duration-300 selection:bg-blue-100">
      <Head>
        <title>Section {sectionId} - ICD-10 2026 Categories</title>
        <meta name="description" content={`Categories under ICD-10 Section ${sectionId}`} />
      </Head>

      <div className="max-w-[85rem] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="bg-white dark:bg-gray-900/20 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-gray-800 shadow-sm mt-6 transition-all duration-300">
          <div className="mb-10">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold tracking-widest text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 rounded-full uppercase transition-colors duration-300">
              Section Code Block
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight transition-colors duration-300">
              Diseases and Conditions: {sectionId}
            </h1>
          </div>

          <h2 className="text-lg font-black tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-6 transition-colors duration-300">Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat: any) => (
              <Link
                key={cat.code_id}
                href={`/icd10cm/2026/category/${cat.code_id}`}
                className="group block p-5 bg-white dark:bg-gray-900/50 backdrop-blur-md rounded-xl border border-slate-200 dark:border-gray-800 hover:border-emerald-400 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-300 h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-2">
                   <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-500 transition-colors group-hover:text-emerald-800 dark:group-hover:text-emerald-400 tracking-tight">
                     {cat.code_id}
                   </h3>
                   {!cat.is_billable && (
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded transition-colors duration-300">Category</span>
                   )}
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 line-clamp-3 mt-auto transition-colors duration-300">
                  {cat.title}
                </p>
              </Link>
            ))}
          </div>
          {categories.length === 0 && (
            <p className="text-slate-500 font-medium">No categories found for this block.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: true };
};

export const getStaticProps: GetStaticProps<SectionPageProps | { error: string, requestedSlug: string }> = async (context) => {
  const rawSlug = context.params?.slug as string;
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const categories = getCategoriesByChapter(decodedSlug);

  if (!categories || categories.length === 0) {
     return { props: { error: 'not-found', requestedSlug: rawSlug } };
  }

  return {
    props: {
        sectionId: decodedSlug.toUpperCase(),
        chapterTitle: categories[0]?.chapter_title || null,
        categories
    }
  };
};

export default SectionPage;
