import Link from 'next/link';
import Layout from '../components/Layout';

export default function NotFound() {
  return (
    <Layout breadcrumbs={{}}>
      <div className="min-h-[80vh] bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-200 max-w-[600px] w-full">
          <div className="flex justify-center mb-6">
            <svg className="w-20 h-20 text-[#2D82FE]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-2">404 - Not Found</h1>
          <p className="text-slate-500 font-medium mb-8">We could not locate the exact ICD-10 billable diagnosis code or URL you requested. Please use the search bar below or return to the directory.</p>
          
          <form action="/" method="GET" className="mb-8 w-full">
            <div className="relative">
              <input type="text" name="q" placeholder="Search codes, categories, or diseases..." className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 outline-none focus:border-[#2D82FE] focus:ring-2 focus:ring-blue-100 transition-all font-medium" />
              <button type="submit" className="absolute right-3 top-3 px-4 py-1.5 bg-[#2D82FE] text-white rounded-lg font-bold hover:bg-blue-700 transition-colors">Search</button>
            </div>
          </form>

          <Link href="/" className="inline-block px-8 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors">Return to Home Directory</Link>
        </div>
      </div>
    </Layout>
  );
}
