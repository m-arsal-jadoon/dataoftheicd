import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { FileText, Cookie, MonitorPlay, ShieldCheck, Database, Users } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Privacy Policy | Dataicd10',
  description: 'Read the official Dataicd10 Privacy Policy, including our Google AdSense compliance and data collection practices.',
}

export default function PrivacyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 dark:bg-[#07070E] transition-colors py-16 md:py-24 relative overflow-hidden">
        {/* Subtle Background Glows */}
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-50/50 to-transparent dark:from-slate-900/40 dark:to-transparent pointer-events-none" />
        
        <main className={`relative z-10 max-w-6xl mx-auto px-4 lg:px-6 ${inter.className}`}>
          
          <div className="mb-14 text-center">
             <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight drop-shadow-sm">Privacy Policy for DataICD10</h1>
             <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
                 Last Updated: April 02, 2026. <br className="hidden sm:block" />At DataICD10.com, accessible from https://www.dataicd10.com, one of our main priorities is the privacy of our visitors.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 lg:gap-8">
            
            {/* 1. Log Files */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-slate-400/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-400/80 group-hover:bg-slate-500 transition-colors"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                       <FileText className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">1. Log Files</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>DataICD10 follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>
               </div>
            </div>

            {/* 2. Cookies and Web Beacons */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-amber-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-500/80 group-hover:bg-amber-400 transition-colors shadow-[0_0_15px_rgba(245,158,11,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20">
                       <Cookie className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">2. Cookies</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium space-y-4">
                   <p>Like any other website, DataICD10 uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>
                   <p>The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>
               </div>
            </div>

            {/* 3 & 4. Google AdSense (Full Width) */}
            <div className="md:col-span-2 group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 lg:p-10 hover:border-rose-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500/80 group-hover:bg-rose-400 transition-colors shadow-[0_0_15px_rgba(244,63,94,0.5)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20">
                       <MonitorPlay className="w-8 h-8" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">3. Google AdSense & DART</h2>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <div>
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">DoubleClick DART Cookie</h4>
                      <p>Google is one of the third-party vendors on our site. It uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. Visitors may choose to decline the use of DART cookies by visiting the Google ad network Privacy Policy at <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">policies.google.com/technologies/ads</a>.</p>
                   </div>
                   <div className="bg-slate-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-slate-100 dark:border-gray-700">
                      <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-3">Third-party Advertisers</h4>
                      <p>Third-party ad servers use technologies like cookies, JavaScript, or Web Beacons in their respective advertisements. They automatically receive your IP address when this occurs to measure the effectiveness of their advertising campaigns.</p>
                      <p className="mt-3 text-sm italic text-slate-500 dark:text-slate-400">Note: DataICD10 has no access to or control over these cookies used by third-party advertisers.</p>
                   </div>
               </div>
            </div>

            {/* 5. Medical Disclaimer */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-blue-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-500/80 group-hover:bg-blue-400 transition-colors shadow-[0_0_15px_rgba(59,130,246,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20">
                       <Database className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">5. Medical Information</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium">
                   <p>DataICD10 provides ICD-10-CM coding data for informational purposes only. We do not collect or store any Personal Health Information (PHI) or patient records. Users are advised to use this data as a reference tool and consult official CMS/CDC guidelines for clinical billing.</p>
               </div>
            </div>

            {/* 6. Children's Info & Consent */}
            <div className="group relative bg-white dark:bg-gray-900/40 backdrop-blur-sm border border-slate-200 dark:border-gray-800 rounded-3xl p-8 hover:border-emerald-500/50 transition-colors overflow-hidden shadow-sm hover:shadow-xl">
               <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"></div>
               
               <div className="flex items-center gap-4 mb-6">
                   <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20">
                       <ShieldCheck className="w-7 h-7" />
                   </div>
                   <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">6. Compliance & Consent</h2>
               </div>
               
               <div className="text-slate-700 dark:text-slate-300 leading-relaxed text-[16px] font-medium space-y-4">
                   <p>Another part of our priority is adding protection for children. DataICD10 does not knowingly collect any Personal Identifiable Information from children under the age of 13. We encourage parents to monitor online activity.</p>
                   <p className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300">
                      By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.
                   </p>
               </div>
            </div>

          </div>
        </main>
      </div>
    </Layout>
  )
}
