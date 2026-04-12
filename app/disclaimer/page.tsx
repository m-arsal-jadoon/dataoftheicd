import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { Info, Stethoscope, Landmark, ExternalLink } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Medical Disclaimer | Dataicd10',
  description: 'Read the official Dataicd10 medical, legal, and operational disclaimer regarding ICD-10 diagnostics.',
}

export default function DisclaimerPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900/40 dark:to-transparent pointer-events-none" />
        
        <main className={`relative z-10 max-w-6xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">Medical Disclaimer</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 Last Updated: April 02, 2026. <br className="hidden sm:block" />Operational and clinical disclaimer regarding the use of DataICD10.com.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            
            {/* 1. General Information */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 group-hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                       <Info className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1. General Information Only</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium space-y-4">
                   <p className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 border border-amber-200 dark:border-amber-900/50 p-5 rounded-xl">
                      All the information on this website is published in good faith and for general information and educational purposes only.
                   </p>
                   <p>DataICD10 does not make any warranties about the completeness, reliability, and accuracy of this information. Any action you take upon the information you find on this website is strictly at your own risk.</p>
               </div>
            </div>

            {/* 2. Not Medical Advice */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-rose-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500/80 group-hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                       <Stethoscope className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">2. Not Medical Advice</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>The content on DataICD10.com, including ICD-10-CM codes, descriptions, and conversion tools, is provided as a reference for medical coders and billers. It does NOT constitute medical advice, diagnosis, or treatment. Clinical decisions should always be made by qualified healthcare professionals.</p>
               </div>
            </div>

            {/* 3. Accuracy & Official Sources */}
            <div className="md:col-span-2 group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-emerald-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                       <Landmark className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">3. Accuracy & Official Sources</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium space-y-4">
                   <p>While we strive to provide the most updated 2026 ICD-10-CM data, medical coding rules change frequently.</p>
                   <p className="font-bold text-slate-900 dark:text-white">
                      Users are strictly advised to consult the official CMS (Centers for Medicare & Medicaid Services) and CDC (Centers for Disease Control and Prevention) manuals before submitting any official insurance claims or clinical documentation.
                   </p>
                   <p>DataICD10 will not be liable for any losses and/or damages (including financial loss or claim denials) in connection with the use of our website.</p>
               </div>
            </div>

            {/* 4. External Links */}
            <div className="md:col-span-2 group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-slate-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-500/80 group-hover:bg-slate-400 transition-colors"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                       <ExternalLink className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">4. External Links Disclaimer</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>From our website, you can visit other websites by following hyperlinks to such outer sites. While we strive to provide only quality links to useful and ethical websites, we have no control over the content and nature of these sites. These links to other websites do not imply a recommendation for all the content found on these sites.</p>
                   <p className="mt-4">By using our website, you hereby consent to our disclaimer and agree to its terms. Should we update, amend or make any changes to this document, those changes will be prominently posted here.</p>
               </div>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  )
}
