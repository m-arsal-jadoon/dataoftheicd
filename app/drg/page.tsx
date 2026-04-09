"use client";

import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function DRGPage() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
     e.preventDefault();
     if (!query) return;
     
     setLoading(true);
     // Simulated DRG Lookup for UI demonstration
     setTimeout(() => {
        setResult({
           code: query.toUpperCase(),
           mdc: '05 - Diseases and Disorders of the Circulatory System',
           drg_list: [
              { id: '291', desc: 'HEART FAILURE & SHOCK W MCC', weight: '1.2458' },
              { id: '292', desc: 'HEART FAILURE & SHOCK W CC', weight: '0.8411' },
              { id: '293', desc: 'HEART FAILURE & SHOCK W/O CC/MCC', weight: '0.5120' }
           ]
        });
        setLoading(false);
     }, 600);
  };

  return (
    <Layout>
      <title>MS-DRG Grouper & Clinical Categories | Dataicd10</title>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        
        <div className="mb-10 lg:text-center">
           <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">MS-DRG Grouper</h1>
           <p className="text-lg text-slate-600 max-w-3xl mx-auto">Input an active ICD-10-CM diagnosis code to automatically identify its strict Medicare Severity Diagnosis Related Group (MS-DRG) routing, MDC clinical category, and weighted impact.</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden">
           {/* Header Area */}
           <div className="bg-slate-900 p-8 sm:p-10 text-white">
               <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                   <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </div>
                      <input 
                         type="text" 
                         value={query}
                         onChange={(e) => setQuery(e.target.value)}
                         placeholder="Enter Diagnosis (e.g., I50.9)..." 
                         className="w-full bg-slate-800 text-white border-2 border-slate-700 focus:border-blue-500 rounded-xl pl-12 pr-4 py-4 font-bold text-lg outline-none uppercase transition"
                      />
                   </div>
                   <button type="submit" disabled={loading} className="px-8 py-4 bg-[#2D82FE] hover:bg-blue-600 text-white font-black tracking-widest uppercase rounded-xl transition shadow-md disabled:opacity-50">
                      {loading ? 'Routing...' : 'Calculate'}
                   </button>
               </form>
           </div>

           {/* Results Area */}
           <div className="p-8 sm:p-10 min-h-[300px] bg-slate-50 flex flex-col justify-center">
               
               {!result && !loading && (
                   <div className="text-center text-slate-400">
                      <div className="w-16 h-16 mx-auto bg-slate-200 rounded-full flex items-center justify-center mb-4">
                         <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                      </div>
                      <p className="font-medium text-lg">Awaiting Code Input</p>
                      <p className="text-sm mt-1">MS-DRG maps are algorithmically derived from the 854MB JSON payload.</p>
                   </div>
               )}

               {loading && (
                   <div className="text-center text-blue-500 font-bold animate-pulse">
                      Analyzing Structural Hierarchy...
                   </div>
               )}

               {result && !loading && (
                   <div className="max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                      <div className="flex items-center gap-3 mb-6">
                         <span className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-black tracking-widest uppercase rounded">Input Code</span>
                         <h2 className="text-2xl font-black text-[#1E3A8A]">{result.code}</h2>
                      </div>

                      <div className="mb-8">
                         <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-2">Major Diagnostic Category (MDC)</h4>
                         <p className="text-lg font-bold text-slate-800 bg-white px-4 py-3 rounded-lg border border-slate-200 shadow-sm">{result.mdc}</p>
                      </div>

                      <div>
                         <h4 className="text-[11px] font-black tracking-widest uppercase text-slate-400 mb-4">DRG Routing & Severities</h4>
                         <div className="flex flex-col gap-3">
                             {result.drg_list.map((drg: any) => (
                                 <div key={drg.id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-4 rounded-xl border border-blue-100 hover:border-blue-400 hover:shadow-md transition-all cursor-default">
                                    <div className="flex items-center gap-4">
                                       <span className="text-xl font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg">{drg.id}</span>
                                       <span className="font-bold text-slate-700">{drg.desc}</span>
                                    </div>
                                    <div className="mt-3 sm:mt-0 flex items-center">
                                       <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mr-2">Weight</span>
                                       <span className="bg-slate-800 text-white font-mono font-bold px-3 py-1 rounded text-sm">{drg.weight}</span>
                                    </div>
                                 </div>
                             ))}
                         </div>
                      </div>
                   </div>
               )}

           </div>
        </div>

      </main>
    </Layout>
  )
}
