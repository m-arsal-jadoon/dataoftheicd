import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Terms of Service | Dataicd10',
  description: 'Official Terms of Service for Dataicd10.com.',
}

export default function TermsPage() {
  return (
    <Layout>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Terms of Service</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed text-[15px]">
            <p><strong>Last Updated: {new Date().getFullYear()}</strong></p>
            <p>By accessing or using DataICD10.com, you agree to be bound by these Terms of Service. If you do not agree, strictly refrain from utilizing the data engine.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">1. Database Utilization</h2>
            <p>Our platform indexes an active 854MB database containing tens of thousands of ICD-10-CM codes. You are granted a limited, non-exclusive, non-transferable license to access this taxonomy strictly for your personal, educational, or internal administrative workflow usage.</p>

            <h2 className="text-xl font-bold text-rose-800 mt-8 mb-3 flex items-center">
               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
               2. Prohibition on Automated Scraping
            </h2>
            <p className="bg-rose-50 text-rose-900 p-4 border border-rose-200 rounded-lg font-medium">
               We strictly prohibit automated scraping, indexing bots, offline data cloning, or any form of data mining of our ICD-10 records. Extraction scripts querying the active 854MB payload structurally degrade our servers and will result in permanent automated IP bans.
            </p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">3. Intellectual Property & Ownership</h2>
            <p>All unique UI designs, structural layout maps, rapid-search algorithms, and the underlying <strong>DataICD10 Engine</strong> are the exclusive property of <strong>makeuser.com</strong>. The raw ICD-10-CM data itself retains its status as public domain property of the CDC and CMS.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">4. Limitation of Service</h2>
            <p>We reserve the right to modify, suspend, or terminate access to the site at any time without notice. We provide the search engine on an "AS-IS" basis with no implicit warranty regarding 100% server uptime.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
