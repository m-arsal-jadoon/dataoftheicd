export const runtime = 'edge';
import type { GetStaticProps, GetStaticPaths, NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { getAllCodes, RelationalIcdRecord } from '../../lib/data-engine/db';

interface CategoryProps {
  categoryCode: string;
  categoryTitle: string;
  chapterTitle: string;
  nodes: RelationalIcdRecord[];
}

const CategoryPage: NextPage<CategoryProps> = ({ categoryCode, categoryTitle, chapterTitle, nodes }) => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <Head>
        <title>Category {categoryCode} - {categoryTitle} | Medical Directory</title>
      </Head>
      
      {/* Category Header Area */}
      <div className="max-w-[85rem] mx-auto mb-10">
         <div className="flex items-center gap-4 mb-6">
            <Link href="/" className="inline-flex items-center text-xs font-black tracking-widest text-slate-400 hover:text-blue-600 transition-colors uppercase">
               Dataicd10
            </Link>
            <span className="text-slate-300">/</span>
            <Link href="/chapter" className="inline-flex items-center text-xs font-black tracking-widest text-slate-400 hover:text-blue-600 transition-colors uppercase">
               Taxonomy
            </Link>
         </div>

         <div className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-lg text-xs font-bold text-indigo-700 tracking-widest uppercase mb-4 shadow-sm">
            Clinical Category Node
         </div>
         <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1E3A8A] tracking-tight mb-4">{categoryCode}</h1>
         <h2 className="text-xl sm:text-2xl text-slate-700 font-bold mb-2 leading-snug max-w-4xl">{categoryTitle}</h2>
         <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-2">{chapterTitle}</p>
         
         <hr className="mt-8 border-slate-200" />
      </div>

      {/* Deep Link Grid */}
      <div className="max-w-[85rem] mx-auto">
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {nodes.map(node => (
               <Link key={node.code} href={`/code/${node.code.toLowerCase()}`} className="bg-white rounded-xl p-5 border border-slate-200 hover:shadow-lg hover:border-indigo-300 transition-all group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[14px] font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase">
                        {node.code}
                     </span>
                     {node.billable_flag && (
                         <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] flex-shrink-0 mt-1"></span>
                     )}
                  </div>
                  <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mt-auto font-medium group-hover:text-slate-700 transition-colors">
                     {node.short_title || node.long_title}
                  </p>
               </Link>
            ))}
         </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
    // Only build top traffic categories strictly, fallback others to avoid 35k node timeouts
    return {
        paths: [],
        fallback: 'blocking'
    }
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (context) => {
  const categoryParam = context.params?.category_id as string;
  if (!categoryParam) return { notFound: true };
  const targetCategory = categoryParam.toUpperCase();
  
  const allCodes = getAllCodes();
  const nodes = allCodes.filter(c => (c.category_code || c.code_id?.substring(0,3)?.toUpperCase()) === targetCategory);

  if (nodes.length === 0) return { notFound: true };

  // Assume the root category parent possesses the best overarching title
  const rootNode = nodes.find(c => c.code === targetCategory) || nodes[0];
  const chapterTitle = Array.isArray(rootNode.chapter_title) ? rootNode.chapter_title[0] : rootNode.chapter_title;

  return {
    props: { 
        categoryCode: targetCategory,
        categoryTitle: rootNode.long_title || rootNode.short_title || rootNode.title,
        chapterTitle: chapterTitle || "Unspecified Medical Hierarchy",
        nodes: nodes.filter(c => c.code !== targetCategory) // List all sub-children distinct from root
    }
  };
};

export default CategoryPage;
