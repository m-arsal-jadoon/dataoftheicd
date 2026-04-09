import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Privacy Policy | Dataicd10',
  description: 'Read the official Dataicd10 Privacy Policy, including our Google AdSense compliance and data collection practices.',
}

export default function PrivacyPage() {
  return (
    <Layout>
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Privacy Policy for DataICD10</h1>
          <div className="space-y-6 text-slate-700 leading-relaxed text-[15px]">
            <p><strong>Last Updated: April 02, 2026</strong></p>
            <p>At DataICD10.com, accessible from https://www.dataicd10.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by DataICD10 and how we use it.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">1. Log Files</h2>
            <p>DataICD10 follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks. These are not linked to any information that is personally identifiable.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">2. Cookies and Web Beacons</h2>
            <p>Like any other website, DataICD10 uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited. The information is used to optimize the users' experience by customizing our web page content based on visitors' browser type and/or other information.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">3. Google DoubleClick DART Cookie</h2>
            <p>Google is one of the third-party vendors on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to www.website.com and other sites on the internet. However, visitors may choose to decline the use of DART cookies by visiting the Google ad and content network Privacy Policy at the following URL – <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-bold">https://policies.google.com/technologies/ads</a></p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">4. Google AdSense (Third-party Advertisers)</h2>
            <p className="bg-slate-50 p-4 rounded-lg border border-slate-200"><strong>Important for Users:</strong> We use Google AdSense to serve advertisements. Third-party ad servers or ad networks use technologies like cookies, JavaScript, or Web Beacons that are used in their respective advertisements and links that appear on DataICD10, which are sent directly to users' browsers. They automatically receive your IP address when this occurs. These technologies are used to measure the effectiveness of their advertising campaigns and/or to personalize the advertising content that you see on websites that you visit.</p>
            <p className="italic">Note: DataICD10 has no access to or control over these cookies that are used by third-party advertisers.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">5. Medical Information Disclaimer</h2>
            <p>DataICD10 provides ICD-10-CM coding data for informational purposes only. We do not collect or store any Personal Health Information (PHI) or patient records. Users are advised to use this data as a reference tool and consult official CMS/CDC guidelines for clinical billing.</p>

            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">6. Children's Information</h2>
            <p>Another part of our priority is adding protection for children while using the internet. We encourage parents and guardians to observe, participate in, and/or monitor and guide their online activity. DataICD10 does not knowingly collect any Personal Identifiable Information from children under the age of 13.</p>
            
            <h2 className="text-xl font-bold text-slate-900 mt-8 mb-3">7. Consent</h2>
            <p>By using our website, you hereby consent to our Privacy Policy and agree to its Terms and Conditions.</p>
          </div>
        </div>
      </main>
    </Layout>
  )
}
