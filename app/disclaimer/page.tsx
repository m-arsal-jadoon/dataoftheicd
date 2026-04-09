import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Medical Disclaimer | Dataicd10',
  description: 'Read the official Dataicd10 medical, legal, and operational disclaimer regarding ICD-10 diagnostics.',
}

export default function DisclaimerPage() {
  return (
    <Layout>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Disclaimer for DataICD10</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed text-[15px]">
            <p><strong>Last Updated: April 02, 2026</strong></p>
            <p>If you require any more information or have any questions about our site's disclaimer, please feel free to contact us by email at support@dataicd10.com.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">1. General Information Only</h2>
            <p className="bg-amber-50 text-amber-900 border border-amber-200 p-5 rounded-xl font-medium">All the information on this website – <a href="https://www.dataicd10.com" className="text-blue-600 hover:underline hover:font-bold">https://www.dataicd10.com</a> – is published in good faith and for general information and educational purposes only. DataICD10 does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website (DataICD10), is strictly at your own risk.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">2. Not a Medical or Professional Advice</h2>
            <p>The content on DataICD10.com, including ICD-10-CM codes, descriptions, and conversion tools, is provided as a reference for medical coders and billers. It does NOT constitute medical advice, diagnosis, or treatment. Clinical decisions should always be made by qualified healthcare professionals.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">3. Accuracy & Official Sources</h2>
            <p>While we strive to provide the most updated 2026 ICD-10-CM data, medical coding rules change frequently.</p>
            <p><strong>Users are strictly advised to consult the official CMS (Centers for Medicare & Medicaid Services) and CDC (Centers for Disease Control and Prevention) manuals before submitting any official insurance claims or clinical documentation.</strong></p>
            <p>DataICD10 will not be liable for any losses and/or damages (including financial loss or claim denials) in connection with the use of our website.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">4. External Links Disclaimer</h2>
            <p>From our website, you can visit other websites by following hyperlinks to such outer sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">5. Consent</h2>
            <p>By using our website, you hereby consent to our disclaimer and agree to its terms.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-10 mb-4">6. Update</h2>
            <p>Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
