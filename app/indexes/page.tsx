import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import { BookA, Dna, Pill } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Global Indexes | Dataicd10',
  description: 'Browse the ICD-10 Alphabetical Index, Table of Neoplasms, and Table of Drugs.',
}

export default function IndexesPage() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900/40 dark:to-transparent pointer-events-none" />

        <main className={`relative z-10 max-w-6xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 drop-shadow-sm">Global Clinical Indexes</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 Navigate the official Alphabetical Index, Neoplasm Table, and Table of Drugs & Chemicals via high-speed sequential pathways.
             </p>
          </div>

          <div className="flex flex-col gap-8">
             
             {/* ALPHABETICAL INDEX */}
             <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-blue-500/50 transition-colors shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 group-hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
                
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-8 flex items-center tracking-tight">
                   <div className="p-3 mr-4 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-sm">
                      <BookA className="w-8 h-8" />
                   </div>
                   Alphabetical Index to Diseases
                </h2>
                
                <div className="flex flex-wrap gap-2.5">
                   {alphabet.map(letter => (
                      <Link key={letter} href={`/?q=${letter.toLowerCase()}`} className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl text-lg font-bold transition-all shadow-sm">
                         {letter}
                      </Link>
                   ))}
                </div>
             </div>

             {/* NEOPLASMS */}
             <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-purple-500/50 transition-colors shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-purple-500/80 group-hover:bg-purple-400 transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center tracking-tight">
                      <div className="p-3 mr-4 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-500/20 shadow-sm">
                         <Dna className="w-8 h-8" />
                      </div>
                      Table of Neoplasms
                   </h2>
                   <Link href="/?q=neoplasm" className="px-6 py-3 flex items-center justify-center bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-500 transition-colors shadow-sm tracking-wide">
                      View Full Table →
                   </Link>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                   {alphabet.map(letter => (
                      <Link key={letter} href={`/?q=neoplasm ${letter.toLowerCase()}`} className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/30 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 rounded-xl text-lg font-bold transition-all shadow-sm">
                         {letter}
                      </Link>
                   ))}
                </div>
             </div>

             {/* DRUGS AND CHEMICALS */}
             <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-emerald-500/50 transition-colors shadow-sm hover:shadow-xl overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white flex items-center tracking-tight">
                      <div className="p-3 mr-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
                         <Pill className="w-8 h-8" />
                      </div>
                      Table of Drugs and Chemicals
                   </h2>
                   <Link href="/?q=drug" className="px-6 py-3 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-sm tracking-wide">
                      View Full Table →
                   </Link>
                </div>
                
                <div className="flex flex-wrap gap-2.5">
                   {alphabet.map(letter => (
                      <Link key={letter} href={`/?q=drug ${letter.toLowerCase()}`} className="w-12 h-12 flex flex-col items-center justify-center bg-slate-50 dark:bg-gray-800/80 border border-slate-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-xl text-lg font-bold transition-all shadow-sm">
                         {letter}
                      </Link>
                   ))}
                </div>
             </div>

          </div>
        </main>
      </div>
    </Layout>
  )
}
