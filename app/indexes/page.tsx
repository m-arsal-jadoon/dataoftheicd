import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Global Indexes | Dataicd10',
  description: 'Browse the ICD-10 Alphabetical Index, Table of Neoplasms, and Table of Drugs.',
}

export default function IndexesPage() {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <Layout>
      <main className={`max-w-[1200px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        
        <div className="mb-10">
           <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Global Clinical Indexes</h1>
           <p className="text-lg text-slate-600">Navigate the official Alphabetical Index, Neoplasm Table, and Table of Drugs & Chemicals via alphabetical ribbons.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           
           {/* ALPHABETICAL INDEX */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                 <svg className="w-6 h-6 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"></path></svg>
                 Alphabetical Index to Diseases
              </h2>
              <div className="flex flex-wrap gap-2">
                 {alphabet.map(letter => (
                    <Link key={letter} href={`/?q=${letter.toLowerCase()}`} className="w-10 h-10 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600 rounded-lg text-lg font-bold text-slate-700 transition">
                       {letter}
                    </Link>
                 ))}
              </div>
           </div>

           {/* NEOPLASMS */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                 <svg className="w-6 h-6 mr-3 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                 Table of Neoplasms
              </h2>
              <div className="flex flex-wrap gap-2">
                 {alphabet.map(letter => (
                    <Link key={letter} href={`/?q=neoplasm ${letter.toLowerCase()}`} className="w-10 h-10 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-lg font-bold text-slate-700 transition">
                       {letter}
                    </Link>
                 ))}
                 <Link href="/?q=neoplasm" className="px-4 h-10 flex items-center justify-center bg-indigo-600 text-white font-bold rounded-lg ml-2 hover:bg-indigo-700 transition">View Full Table →</Link>
              </div>
           </div>

           {/* DRUGS AND CHEMICALS */}
           <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm col-span-1 lg:col-span-3">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center">
                 <svg className="w-6 h-6 mr-3 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                 Table of Drugs and Chemicals
              </h2>
              <div className="flex flex-wrap gap-2">
                 {alphabet.map(letter => (
                    <Link key={letter} href={`/?q=drug ${letter.toLowerCase()}`} className="w-10 h-10 flex flex-col items-center justify-center bg-slate-50 border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-lg font-bold text-slate-700 transition">
                       {letter}
                    </Link>
                 ))}
                 <Link href="/?q=drug" className="px-4 h-10 flex items-center justify-center bg-emerald-600 text-white font-bold rounded-lg ml-2 hover:bg-emerald-700 transition">View Full Table →</Link>
              </div>
           </div>

        </div>
      </main>
    </Layout>
  )
}
