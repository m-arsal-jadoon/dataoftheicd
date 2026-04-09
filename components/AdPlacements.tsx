import React from 'react';

export const SidebarAd = ({ mobileMode = false }: { mobileMode?: boolean }) => {
  return (
    <div 
      className={`relative flex flex-col justify-center items-center bg-slate-50 border border-slate-200 shadow-sm rounded-xl overflow-hidden
      ${mobileMode ? 'w-full h-[100px] sm:h-[250px]' : 'w-[300px] h-[600px] mx-auto'}`}
    >
      <div className="absolute top-2 right-3 text-[9px] font-black uppercase text-slate-300 tracking-widest">
        Advertisement
      </div>
      
      <div className="text-center p-6 mt-2">
        <div className="w-12 h-12 mx-auto bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-sm">
           <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </div>
        <h4 className="text-lg font-black text-slate-800 mb-2 leading-tight">
           Master ICD-10 <br/> 2026 Updates
        </h4>
        <p className="text-sm font-medium text-slate-500 line-clamp-3">
           Secure the complete XML dataset and plain-english mapping files.
        </p>
        <button className="mt-5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-6 rounded-full shadow-sm transition-colors">
          Download PDF
        </button>
      </div>
    </div>
  );
};

export const HorizontalAd = () => {
  return (
    <div className="w-full h-[150px] sm:h-[120px] md:h-[90px] bg-slate-50 border border-slate-200 shadow-sm rounded-xl relative flex items-center justify-center overflow-hidden my-10 max-w-[850px] mx-auto group cursor-pointer hover:border-blue-300 transition-colors">
      <div className="absolute top-2 right-3 text-[9px] font-black uppercase text-slate-300 tracking-widest">
        Sponsored
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-6 md:px-10">
         <div className="flex items-center gap-5 text-center md:text-left mb-3 md:mb-0">
            <div className="w-10 h-10 hidden sm:flex bg-emerald-100 text-emerald-600 rounded-full items-center justify-center shadow-sm shrink-0">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
               <h4 className="text-base font-black text-slate-800 tracking-tight">Maximize Clinic Revenue</h4>
               <p className="text-xs font-medium text-slate-500 mt-0.5">Automate your 2026 coding audits to catch under-billing instantly.</p>
            </div>
         </div>
         <button className="bg-slate-900 group-hover:bg-blue-600 text-white text-[11px] font-bold py-2.5 px-6 rounded-full shadow-sm transition-colors uppercase tracking-widest whitespace-nowrap">
            Start Free Trial
         </button>
      </div>
    </div>
  );
};
