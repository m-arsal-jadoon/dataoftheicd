import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { Target, User, Mail, Globe, BrainCircuit } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'About Dataicd10 - Leading ICD-10 Search Engine',
  description: 'Learn about Dataicd10, our mission, and the team building the industry standard ICD-10 search platform.',
}

export default function AboutPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 dark:to-transparent pointer-events-none" />
        
        <main className={`relative z-10 max-w-6xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">About DataICD10</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 The industry-standard ICD-10 search platform engineered for strict billing compliance and instantaneous pathway resolution.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* The Mission Card */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-emerald-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
               
               <div className="flex items-center gap-5 mb-6">
                   <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-sm border border-emerald-100 dark:border-emerald-500/20">
                       <Target className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Mission</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] space-y-5 font-medium">
                   <p>Dataicd10 is an independent, high-performance medical coding search engine designed to optimize the workflow of healthcare professionals, coders, and strict billing compliance teams globally.</p>
                   <p>Our mission is to dramatically reduce the time spent identifying complex, highly specific ICD-10-CM pathways by creating an instantaneous hierarchical structure that seamlessly merges strict CDC/CMS structural formats with a proprietary, lightning-fast UI.</p>
               </div>
            </div>

            {/* The Vision / Tech Card */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-purple-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500/80 group-hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.5)]"></div>
               
               <div className="flex items-center gap-5 mb-6">
                   <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-sm border border-purple-100 dark:border-purple-500/20">
                       <BrainCircuit className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Vision</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] space-y-5 font-medium">
                   <p>We envision a medical ecosystem where navigating dense diagnostic codebooks is no longer a bottleneck.</p>
                   <p>Through intelligent synonym recognition, clinical pathway tracing, and real-time validation, we provide instant access to the exact medical terminology required for flawless auditing and clinical claims processing.</p>
               </div>
            </div>

            {/* The Developer Card - Full Width */}
            <div className="md:col-span-2 group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-blue-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 group-hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
               
               <div className="flex items-center gap-5 mb-8">
                   <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm border border-blue-100 dark:border-blue-500/20">
                       <User className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">The Developer</h2>
               </div>
               
               <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start lg:items-center">
                   <div className="w-28 h-28 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shrink-0 border-4 border-white dark:border-gray-800 shadow-lg overflow-hidden">
                      <span className="text-4xl font-black text-white tracking-tighter shadow-sm">MA</span>
                   </div>
                   
                   <div className="flex flex-col flex-1">
                      <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">M. Arsal</h3>
                      <p className="text-blue-600 dark:text-blue-400 font-black text-[13px] tracking-widest uppercase mb-6 bg-blue-50 dark:bg-blue-900/20 inline-flex px-3 py-1 rounded w-max border border-blue-100 dark:border-blue-500/20 shadow-sm">Lead Developer & Architect</p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <a href="mailto:marsaljadoon7@gmail.com" className="flex items-center bg-slate-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800 transition-all group/link shadow-sm">
                            <Mail className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 group-hover/link:text-blue-500 transition-colors" />
                            <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">marsaljadoon7@gmail.com</span>
                         </a>
                         <a href="https://makeuser.com" target="_blank" className="flex items-center bg-slate-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-slate-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-white dark:hover:bg-gray-800 transition-all group/link shadow-sm">
                            <Globe className="w-5 h-5 mr-3 text-slate-400 dark:text-slate-500 group-hover/link:text-blue-500 transition-colors" />
                            <span className="text-[15px] font-bold text-slate-700 dark:text-slate-300">makeuser.com</span>
                         </a>
                      </div>
                   </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-slate-100 dark:border-gray-800">
                   <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                       This project is exclusively powered by <strong className="text-slate-900 dark:text-white">MakeUser.com</strong>, a dedicated tech-solution provider specializing in creating high-performance, robust digital tools and authoritative data infrastructure for the modern web.
                   </p>
               </div>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  )
}
