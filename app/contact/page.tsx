"use client";

import Layout from '../../components/Layout';
import { Inter } from 'next/font/google';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'success'>('idle');

  return (
    <Layout>
      <title>Contact Us | Dataicd10 Support</title>
      <meta name="description" content="Get in touch with the team at Dataicd10. We're here to help optimize your coding pipelines." />
      <main className={`max-w-[1000px] mx-auto px-4 lg:px-6 py-16 ${inter.className}`}>
        <div className="bg-white rounded-2xl p-8 sm:p-12 border border-[#E2E8F0] shadow-sm grid md:grid-cols-2 gap-12">
          
          <div className="flex flex-col">
             <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Contact Us</h1>
             <p className="text-slate-600 mb-8 text-lg">Have a question about our data mappings, need technical support, or interested in bulk API access? Reach out to our dedicated team.</p>
             
             <div className="flex items-center gap-4 mb-4">
               <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
               </div>
               <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email Us Directly</p>
                  <a href="mailto:support@dataicd10.com" className="text-xl font-bold text-blue-600 hover:text-blue-800 transition">support@dataicd10.com</a>
               </div>
             </div>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); setStatus('success'); }} 
            className="flex flex-col gap-5 bg-slate-50/50 p-6 rounded-xl border border-slate-100"
          >
             {status === 'success' ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                   <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                   </div>
                   <h3 className="text-2xl font-extrabold text-slate-800">Message Sent!</h3>
                   <p className="text-slate-600">We will respond to your inquiry via email shortly.</p>
                   <button onClick={() => setStatus('idle')} className="mt-4 text-blue-600 font-bold hover:underline">Send another message</button>
                </div>
             ) : (
                <>
                   <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-slate-700">Full Name</label>
                     <input type="text" required className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" placeholder="Jane Doe" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-slate-700">Email Address</label>
                     <input type="email" required className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition" placeholder="coder@hospital.org" />
                   </div>
                   <div className="flex flex-col gap-2">
                     <label className="text-sm font-bold text-slate-700">Message</label>
                     <textarea required rows={4} className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none" placeholder="How can we help?" />
                   </div>
                   <button type="submit" className="mt-2 w-full py-3.5 bg-[#2D82FE] hover:bg-blue-700 text-white font-extrabold rounded-lg shadow-sm transition-colors text-lg">Send Message</button>
                </>
             )}
          </form>

        </div>
      </main>
    </Layout>
  )
}
