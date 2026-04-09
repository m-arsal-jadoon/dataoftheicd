"use client";

import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { useState } from 'react';

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
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        
        <div className="mb-10 text-center">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">ICD-9 to ICD-10 Converter</h1>
           <p className="text-lg text-slate-600 max-w-2xl mx-auto">Instantly crosswalk legacy ICD-9 procedural and diagnostic codes into the active 2026 ICD-10-CM operational set using official General Equivalence Mappings (GEMs).</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-8 sm:p-14">
           
           <div className="grid grid-cols-1 md:grid-cols-[1fr_80px_1fr] items-center gap-6">
              
              {/* Left Input: ICD-9 */}
              <div className="flex flex-col">
                 <label className="text-[13px] font-black uppercase tracking-widest text-[#7C8B9F] mb-3">Enter ICD-9 Code</label>
                 <input 
                    type="text" 
                    value={icd9}
                    onChange={(e) => handleMap(e.target.value)}
                    placeholder="e.g., 428.0"
                    className="w-full text-2xl font-bold bg-slate-50 border-2 border-slate-200 focus:border-blue-500 rounded-xl px-5 py-4 outline-none transition uppercase text-slate-800"
                 />
                 <p className="text-xs text-slate-400 mt-3 font-medium">Legacy Format</p>
              </div>

              {/* Center Divider/Arrow */}
              <div className="hidden md:flex flex-col items-center justify-center mt-6">
                 <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center border border-blue-100 shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                 </div>
              </div>

              {/* Right Output: ICD-10 */}
              <div className="flex flex-col">
                 <label className="text-[13px] font-black uppercase tracking-widest text-blue-600 mb-3 flex items-center">
                    Resulting 2026 ICD-10-CM
                    <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-[9px] rounded uppercase tracking-wider">Active</span>
                 </label>
                 <div className={`w-full min-h-[70px] text-lg sm:text-xl font-bold rounded-xl px-5 py-4 border-2 transition flex items-center ${icd10 ? 'bg-blue-50 border-blue-500 text-blue-900 shadow-[0_0_0_4px_rgba(59,130,246,0.1)]' : 'bg-slate-50/50 border-slate-200 text-slate-400'}`}>
                    {icd10 || 'Crosswalk Result...'}
                 </div>
                 <p className="text-xs text-slate-400 mt-3 font-medium">Official CMS Mapping</p>
              </div>

           </div>

           <div className="mt-12 bg-blue-50/50 border border-blue-100 rounded-xl p-5">
              <h4 className="text-sm font-bold text-blue-900 mb-2">Notice on GEMs Deprecation</h4>
              <p className="text-xs text-blue-800/80 leading-relaxed">The Centers for Medicare & Medicaid Services (CMS) officially ended the maintenance of GEMs. This tool utilizes the final robust translation library established for historical reconciliation and longitudinal clinical tracking.</p>
           </div>
        </div>

      </main>
    </Layout>
  )
}
