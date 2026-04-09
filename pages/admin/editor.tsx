import React, { useState } from 'react';
import Head from 'next/head';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export default function AdminEditor() {
    const [searchCode, setSearchCode] = useState('');
    const [searchStatus, setSearchStatus] = useState<string | null>(null);
    const [activeNode, setActiveNode] = useState<any>(null);

    const [plainEnglish, setPlainEnglish] = useState('');
    const [compareTargets, setCompareTargets] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setSearchStatus("Searching...");
        setActiveNode(null);
        
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(searchCode)}`);
            const data = await res.json();
            
            if (data.results && data.results.length > 0) {
                // Find Exact Match intentionally
                const exact = data.results.find((r: any) => 
                     (r.item.code_id || r.item.code || "").toLowerCase() === searchCode.toLowerCase()
                );
                
                if (exact) {
                    setActiveNode(exact.item);
                    setPlainEnglish(exact.item.plain_english_explanation || '');
                    setCompareTargets((exact.item.compare_targets || []).join(', '));
                    setSearchStatus(null);
                } else {
                    setSearchStatus("Code structurally valid but not found in Exact matching.");
                }
            } else {
                setSearchStatus("Code not found.");
            }
        } catch (err) {
            setSearchStatus("Error connecting to search engine.");
        }
    };

    const handleSave = async () => {
        if (!activeNode) return;
        setIsSaving(true);
        setSearchStatus(null);

        try {
            const payload = {
                code: activeNode.code_id || activeNode.code,
                plain_english_explanation: plainEnglish,
                compare_targets: compareTargets
            };

            const response = await fetch('/api/admin/save-edit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();
            if (response.ok) {
                setSearchStatus("✅ Successfully saved to the CMS dictionary. Run standard build compiler to inject.");
            } else {
                setSearchStatus("❌ Error: " + data.message);
            }
        } catch (e) {
            setSearchStatus("❌ Communication error.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`min-h-screen bg-slate-50 text-slate-900 ${inter.className}`}>
            <Head>
                <title>CMS Editor | Dataicd10 Admin</title>
            </Head>

            <header className="bg-white border-b border-slate-200 py-6 shadow-sm">
                 <div className="max-w-4xl mx-auto px-6 flex items-center justify-between">
                     <h1 className="text-xl font-black text-slate-800 tracking-tight">Admin<span className="text-blue-600"> CMS Override Engine</span></h1>
                     <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-full text-xs font-bold tracking-widest uppercase">Secret Route</span>
                 </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-12">
               
               <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mb-8">
                   <div className="p-8 border-b border-slate-100 bg-slate-50/50">
                       <h2 className="text-lg font-bold text-slate-800 mb-4">Node Target Acquisition</h2>
                       <form onSubmit={handleSearch} className="flex gap-4 max-w-lg">
                           <input 
                               type="text" 
                               value={searchCode}
                               onChange={e => setSearchCode(e.target.value)}
                               placeholder="Enter strict code ID (e.g. E11.9)"
                               className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold"
                           />
                           <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold text-sm tracking-wide hover:bg-blue-700 transition-colors">
                               Locate
                           </button>
                       </form>
                       {searchStatus && (
                           <p className="mt-4 text-sm font-semibold text-slate-500">{searchStatus}</p>
                       )}
                   </div>
               </div>

               {activeNode && (
                   <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <div className="p-8 border-b border-slate-100 flex items-start justify-between">
                           <div>
                               <p className="text-[10px] font-black tracking-widest text-blue-500 uppercase mb-2">Active Target Loaded</p>
                               <h2 className="text-3xl font-black text-slate-900 mb-2">{activeNode.code_id || activeNode.code}</h2>
                               <p className="text-sm font-medium text-slate-600 max-w-2xl">{activeNode.title || activeNode.short_title}</p>
                           </div>
                       </div>

                       <div className="p-8 space-y-8 bg-slate-50/30">
                           
                           <div>
                               <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                   Plain English Explanation (Layman's Terms)
                               </label>
                               <textarea
                                   value={plainEnglish}
                                   onChange={e => setPlainEnglish(e.target.value)}
                                   placeholder="e.g., This code is used specifically for Type 2 Diabetes patients without any registered organ complications."
                                   rows={5}
                                   className="w-full bg-white border border-slate-300 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 resize-y"
                               />
                               <p className="mt-3 text-xs text-slate-500 font-medium">This text will be injected directly into the API and searched dynamically via FlexSearch.</p>
                           </div>

                           <div>
                               <label className="block text-xs font-black tracking-widest text-slate-500 uppercase mb-3">
                                   Differential Compare Targets (Comma Separated)
                               </label>
                               <input
                                   type="text"
                                   value={compareTargets}
                                   onChange={e => setCompareTargets(e.target.value)}
                                   placeholder="e.g., E11.8, E10.9, E13.9"
                                   className="w-full bg-white border border-slate-300 rounded-xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                               />
                               <p className="mt-3 text-xs text-slate-500 font-medium">Replaces structural child siblings with these explicit forced comparisons if array is populated.</p>
                           </div>

                           <div className="pt-6 border-t border-slate-200 flex justify-end">
                               <button 
                                   onClick={handleSave}
                                   disabled={isSaving}
                                   className="bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 px-8 py-3.5 rounded-xl font-black text-sm tracking-widest uppercase transition-colors shadow-sm"
                               >
                                   {isSaving ? "Writing..." : "Commit Override"}
                               </button>
                           </div>

                       </div>
                   </div>
               )}

            </main>
        </div>
    );
}
