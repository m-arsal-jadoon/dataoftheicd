import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { Database, Ban, Copyright, AlertTriangle } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Terms of Service | Dataicd10',
  description: 'Official Terms of Service for Dataicd10.com.',
}

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900/40 dark:to-transparent pointer-events-none" />
        
        <main className={`relative z-10 max-w-6xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">Terms of Service</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 Last Updated: {new Date().getFullYear()}. <br className="hidden sm:block" />By accessing or using DataICD10.com, you agree to be bound by these Terms of Service.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* 1. Database Utilization */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 group-hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                       <Database className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1. Database Utilization</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>Our platform indexes an active 854MB database containing tens of thousands of ICD-10-CM codes. You are granted a limited, non-exclusive, non-transferable license to access this taxonomy strictly for your personal, educational, or internal administrative workflow usage.</p>
               </div>
            </div>

            {/* 2. Automated Scraping */}
            <div className="group relative bg-rose-50/50 dark:bg-rose-950/20 backdrop-blur-sm border border-rose-200 dark:border-rose-900/50 rounded-3xl p-8 hover:border-rose-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500/80 group-hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-500/30">
                       <Ban className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-rose-900 dark:text-rose-100 tracking-tight">2. Prohibition on Scraping</h2>
               </div>
               
               <div className="bg-white dark:bg-rose-900/20 p-5 rounded-xl border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 leading-relaxed text-[15px] font-bold">
                   We strictly prohibit automated scraping, indexing bots, offline data cloning, or any form of data mining of our ICD-10 records. Extraction scripts querying the active payload structurally degrade our servers and will result in permanent automated IP bans.
               </div>
            </div>

            {/* 3. Intellectual Property */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-purple-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500/80 group-hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20">
                       <Copyright className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">3. Intellectual Property</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium space-y-4">
                   <p>All unique UI designs, structural layout maps, rapid-search algorithms, and the underlying <strong className="text-purple-600 dark:text-purple-400">DataICD10 Engine</strong> are the exclusive property of <strong>makeuser.com</strong>.</p>
                   <p>The raw ICD-10-CM data itself retains its status as public domain property of the CDC and CMS.</p>
               </div>
            </div>

            {/* 4. Limitation of Service */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-amber-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500/80 group-hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                       <AlertTriangle className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">4. Limitation of Service</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>We reserve the right to modify, suspend, or terminate access to the site at any time without notice. We provide the search engine on an "AS-IS" basis with no implicit warranty regarding 100% server uptime.</p>
               </div>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  )
}
