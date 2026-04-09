import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'About Dataicd10 - Leading ICD-10 Search Engine',
  description: 'Learn about Dataicd10, our mission, and the team building the industry standard ICD-10 search platform.',
}

export default function AboutPage() {
  return (
    <Layout>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">About Dataicd10</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed text-lg">
            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">The Mission</h2>
            <p>Dataicd10 is an independent, high-performance medical coding search engine designed to optimize the workflow of healthcare professionals, coders, and strict billing compliance teams globally.</p>
            <p>Our mission is to dramatically reduce the time spent identifying complex, highly specific ICD-10-CM pathways by creating an instantaneous hierarchical structure that seamlessly merges strict CDC/CMS structural formats with a proprietary, lightning-fast UI.</p>
            
            <h2 className="text-2xl font-bold text-slate-900 mt-12 mb-6">The Developer</h2>
            
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-start sm:items-center shadow-[0_4px_12px_rgb(0,0,0,0.03)] hover:shadow-md transition-shadow">
               <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm overflow-hidden">
                  <span className="text-3xl font-black text-blue-600 tracking-tighter">MA</span>
               </div>
               <div className="flex flex-col">
                  <h3 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">M. Arsal</h3>
                  <p className="text-blue-600 font-bold text-sm tracking-widest uppercase mb-4">Lead Developer & Architect</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-[15px] font-medium text-slate-600">
                     <a href="mailto:marsaljadoon7@gmail.com" className="flex items-center hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        marsaljadoon7@gmail.com
                     </a>
                     <a href="https://makeuser.com" target="_blank" className="flex items-center hover:text-blue-600 transition-colors">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9M3 12h18"></path></svg>
                        Portfolio: Makeuser.com
                     </a>
                  </div>
               </div>
            </div>

            <p className="mt-8">This project is exclusively powered by <strong>MakeUser.com</strong>, a dedicated tech-solution provider specializing in creating high-performance, robust digital tools and authoritative data infrastructure for the modern web.</p>
            <p>We envision a medical ecosystem where navigating dense diagnostic codebooks is no longer a bottleneck. Through intelligent synonym recognition, clinical pathway tracing, and real-time validation, we provide instant access to the exact medical terminology required for flawless auditing and clinical claims processing.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
