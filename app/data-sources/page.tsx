import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'CDC & CMS Data Sources | Dataicd10',
  description: 'Explore the root clinical data engines powering the Dataicd10 indexing framework.',
}

export default function DataSourcesPage() {
  return (
    <Layout>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Data Sources & Integrity</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed text-[15px]">
            <p><strong>Last Updated: April 02, 2026</strong></p>
            <p>At DataICD10, we prioritize the accuracy and reliability of medical coding data. Our mission is to provide healthcare professionals, medical billers, and coders with high-performance access to the most current ICD-10-CM datasets.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. Official Data Sources</h2>
            <p>The 2026 ICD-10-CM (International Classification of Diseases, 10th Revision, Clinical Modification) data provided on this website is sourced directly from the official United States Government agencies:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
               <li><strong>CMS (Centers for Medicare & Medicaid Services):</strong> The primary source for clinical coding guidelines, payment policy, and annual code updates.</li>
               <li><strong>CDC (Centers for Disease Control and Prevention):</strong> Specifically the National Center for Health Statistics (NCHS), which is responsible for the maintenance and update of the ICD-10-CM classification system.</li>
               <li><strong>AHA (American Hospital Association):</strong> For additional references regarding official coding clinics and advice.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Data Version & Updates</h2>
            <ul className="list-disc pl-6 space-y-2 mt-3">
               <li><strong>Current Version:</strong> 2026 Fiscal Year (FY 2026) Dataset.</li>
               <li><strong>Update Cycle:</strong> DataICD10 synchronizes its database annually following the official release of the new fiscal year's codes (usually effective October 1st of each year).</li>
               <li><strong>Historical Archive:</strong> While we focus on the most current codes, our database includes legacy mappings for historical billing audits.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Data Processing & Integrity (The DataICD10 Engine)</h2>
            <p>We don't just host raw files; we transform them into a searchable intelligence platform:</p>
            <ul className="list-disc pl-6 space-y-2 mt-3">
               <li><strong>Validation:</strong> Every code undergoes a rigorous validation process to ensure the correct hierarchy (Chapter &gt; Section &gt; Category &gt; Sub-category).</li>
               <li><strong>Billable Status Accuracy:</strong> Our system uses official CMS flags to differentiate between 'Header' codes (Non-Billable) and specific codes (Billable) to prevent claim denials.</li>
               <li><strong>Mapping Accuracy:</strong> Our ICD-9 to ICD-10 conversion tools utilize the General Equivalence Mappings (GEMs) logic to provide the most accurate crosswalks possible.</li>
            </ul>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. Quality Control</h2>
            <p>While we utilize advanced automated algorithms to index our 98,000+ pages, we conduct regular manual audits of the data to ensure descriptions and billable statuses remain 100% compliant with the latest official guidelines.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Verification Notice</h2>
            <p className="bg-amber-50 text-amber-900 border border-amber-200 p-5 rounded-xl font-bold">Important: Despite our best efforts to maintain data integrity, users are always encouraged to verify their final code selections with the latest official coding manuals provided by CMS.gov and CDC.gov.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
