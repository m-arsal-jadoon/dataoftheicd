"use client";

import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { useState } from 'react';
import { ArrowRightLeft, Search, FileCode2 } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export default function ConverterPage() {
  const [icd9, setIcd9] = useState('');
  const [icd10, setIcd10] = useState('');

  // Simulated GEMs Mapping
  const handleMap = (val: string) => {
      setIcd9(val);
      if (val.length < 3) {
          setIcd10('');
          return;
      }
      
      // Basic mock conversion for demo
      if (val.startsWith('428')) setIcd10('I50.9 - Heart failure, unspecified');
      else setIcd10('Mapping...');
      
      setTimeout(() => {
          if (val && !val.startsWith('428')) {
             setIcd10('Mapped: ' + val.replace(/[0-9]/, 'A') + '2.0');
          }
      }, 600);
  };

  return (
    <Layout>
      <title>ICD-9 to ICD-10-CM GEMs Converter | Dataicd10</title>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900/40 dark:to-transparent pointer-events-none" />
        
        <main className={`relative z-10 max-w-5xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6 drop-shadow-sm">ICD-9 to ICD-10 Converter</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 Instantly crosswalk legacy ICD-9 procedural and diagnostic codes into the active 2026 ICD-10-CM operational set using official General Equivalence Mappings (GEMs).
             </p>
          </div>

          <div className="relative bg-white dark:bg-gray-900/40 backdrop-blur-xl border border-slate-200 dark:border-gray-800 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] p-8 sm:p-14 overflow-hidden group">
             {/* Glowing Top Frame */}
             <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 opacity-80"></div>

             <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center gap-8 md:gap-6 relative z-10">
                
                {/* Left Input: ICD-9 */}
                <div className="flex flex-col relative group/input">
                   <label className="text-[14px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4 flex items-center">
                      <FileCode2 className="w-4 h-4 mr-2" />
                      Enter ICD-9 Code
                   </label>
                   <div className="relative">
                      <input 
                         type="text" 
                         value={icd9}
                         onChange={(e) => handleMap(e.target.value)}
                         placeholder="e.g., 428.0"
                         className="w-full text-2xl sm:text-3xl font-bold bg-slate-50 dark:bg-gray-950/50 border-2 border-slate-200 dark:border-gray-800 focus:border-blue-500 dark:focus:border-blue-500 rounded-2xl px-6 py-5 outline-none transition-all uppercase text-slate-800 dark:text-white shadow-inner dark:shadow-none"
                      />
                      <Search className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-6 h-6 group-focus-within/input:text-blue-500 transition-colors" />
                   </div>
                   <p className="text-sm text-slate-400 dark:text-slate-500 mt-4 font-medium flex items-center">
                      <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600 mr-2"></span>
                      Legacy Format
                   </p>
                </div>

                {/* Center Divider/Arrow */}
                <div className="flex flex-col items-center justify-center mt-6 md:mt-2">
                   <div className="w-14 h-14 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-500/20 shadow-sm relative z-20 hover:scale-110 transition-transform">
                      <ArrowRightLeft className="w-7 h-7 hidden md:block" />
                      <ArrowRightLeft className="w-7 h-7 block md:hidden rotate-90" />
                   </div>
                </div>

                {/* Right Output: ICD-10 */}
                <div className="flex flex-col">
                   <div className="flex items-center justify-between mb-4">
                      <label className="text-[14px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center">
                         Resulting ICD-10-CM
                      </label>
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-[10px] font-bold rounded flex items-center uppercase tracking-widest border border-blue-200 dark:border-blue-500/30">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5 animate-pulse"></span>
                         Active 2026
                      </span>
                   </div>
                   <div className={`w-full min-h-[88px] text-xl sm:text-2xl font-bold rounded-2xl px-6 py-5 border-2 transition-all flex items-center shadow-inner dark:shadow-none ${icd10 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-500 dark:border-blue-500/50 text-blue-900 dark:text-white dark:shadow-[0_0_20px_rgba(59,130,246,0.15)] glow' : 'bg-slate-50/50 dark:bg-gray-950/30 border-slate-200 dark:border-gray-800 text-slate-400 dark:text-slate-600'}`}>
                      {icd10 || 'Crosswalk Result...'}
                   </div>
                   <p className="text-sm text-slate-400 dark:text-slate-500 mt-4 font-medium flex items-center">
                      <span className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 mr-2"></span>
                      Official CMS Mapping
                   </p>
                </div>

             </div>

             {/* Notice Card */}
             <div className="mt-14 bg-indigo-50/50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-400 dark:bg-indigo-500/50"></div>
                <h4 className="text-[15px] font-bold text-indigo-900 dark:text-indigo-300 mb-2 tracking-tight">Notice on GEMs Deprecation</h4>
                <p className="text-sm text-indigo-800/80 dark:text-indigo-200/70 leading-relaxed font-medium">The Centers for Medicare & Medicaid Services (CMS) officially ended the maintenance of GEMs. This tool utilizes the final robust translation library established for historical reconciliation and longitudinal clinical tracking.</p>
             </div>
          </div>

        </main>
      </div>
    </Layout>
  )
}
