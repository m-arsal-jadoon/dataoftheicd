"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function GlobalBreadcrumb({ breadcrumbs }: { breadcrumbs?: any }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const [navQuery, setNavQuery] = useState("");
  const [ghostPath, setGhostPath] = useState<{label: string, url: string} | null>(null);

  // Navigation Memory Logic
  useEffect(() => {
     let memory: any = {};
     try {
         const memStr = sessionStorage.getItem('navigationMemory');
         if (memStr) memory = JSON.parse(memStr);
     } catch {}

     if (breadcrumbs?.code) {
         memory.code = { label: breadcrumbs.code.code_id, url: pathname, parentId: breadcrumbs.code.code_id.substring(0, 3) };
         sessionStorage.setItem('navigationMemory', JSON.stringify(memory));
         setGhostPath(null);
     } else if (breadcrumbs?.category) {
         const cid = breadcrumbs.category.code_id;
         memory.category = { label: `Category ${cid}`, url: pathname, parentId: breadcrumbs.category.chapter_range };
         sessionStorage.setItem('navigationMemory', JSON.stringify(memory));

         if (memory.code && memory.code.parentId === cid) {
             setGhostPath(memory.code);
         } else {
             setGhostPath(null);
         }
     } else if (pathname.includes('/section/')) {
         const sectionSlug = pathname.split('/').pop()?.toUpperCase() || "";
         memory.section = { label: `Section ${sectionSlug}`, url: pathname };
         sessionStorage.setItem('navigationMemory', JSON.stringify(memory));

         if (memory.category && memory.category.parentId === sectionSlug) {
             setGhostPath(memory.category);
         } else {
             setGhostPath(null);
         }
     } else {
         setGhostPath(null);
     }
  }, [breadcrumbs, pathname]);

  // Smart Path Auto-Builder
  let sequence: { label: string; url?: string; isCurrent?: boolean; isGhost?: boolean }[] = [];
  
  if (breadcrumbs?.code || breadcrumbs?.category || breadcrumbs?.chapter || breadcrumbs?.section) {
      sequence.push({ label: 'Home', url: '/' });
      sequence.push({ label: '2026 Codes', url: '/icd10cm/2026' });
      
      if (breadcrumbs?.code) {
        const code = breadcrumbs.code;
        const cTitle = Array.isArray(code.chapter_title) ? code.chapter_title.join(': ') : code.chapter_title;
        const match = cTitle?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)/);
        const cId = match ? match[1] : cTitle;
    
        if (cId) sequence.push({ label: `Chapter ${cId}`, url: `/icd10cm/2026/chapter/${cId}` });
        if (code.chapter_range) sequence.push({ label: `Section ${code.chapter_range}`, url: `/icd10cm/2026/section/${code.chapter_range}` });
        const cat = code.category_code || code.code_id.substring(0, 3);
        if (cat) sequence.push({ label: `Category ${cat}`, url: `/icd10cm/2026/category/${cat}` });
        sequence.push({ label: code.code_id, isCurrent: true, url: `/icd10cm/2026/code/${code.code_id}` });
    
      } else if (breadcrumbs?.category) {
        const category = breadcrumbs.category;
        const cTitle = Array.isArray(category.chapter_title) ? category.chapter_title.join(': ') : category.chapter_title;
        const match = cTitle?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)/);
        const cId = match ? match[1] : cTitle;
    
        if (cId) sequence.push({ label: `Chapter ${cId}`, url: `/icd10cm/2026/chapter/${cId}` });
        if (category.chapter_range) sequence.push({ label: `Section ${category.chapter_range}`, url: `/icd10cm/2026/section/${category.chapter_range}` });
        sequence.push({ label: `Category ${category.code_id}`, isCurrent: true, url: `/icd10cm/2026/category/${category.code_id}` });
        
      } else if (breadcrumbs?.chapter) {
        sequence.push({ label: `Chapter ${breadcrumbs.chapter.id}`, isCurrent: true, url: `/icd10cm/2026/chapter/${breadcrumbs.chapter.id}` });
      } else if (breadcrumbs?.section) {
        const section = breadcrumbs.section;
        const cTitle = Array.isArray(section.chapter_title) ? section.chapter_title.join(': ') : section.chapter_title;
        const match = cTitle?.match(/\(([A-Z][0-9]{2}-[A-Z][0-9]{2})\)/);
        const cId = match ? match[1] : cTitle;
    
        if (cId) sequence.push({ label: `Chapter ${cId}`, url: `/icd10cm/2026/chapter/${cId}` });
        sequence.push({ label: `Section ${section.id}`, isCurrent: true, url: `/icd10cm/2026/section/${section.id}` });
      }
      
      if (ghostPath && sequence.length > 0) {
         sequence.push({ label: ghostPath.label, url: ghostPath.url, isGhost: true });
      }
  } else {
      const segments = pathname.split('/').filter(Boolean);
      sequence.push({ label: 'Home', url: '/' });
      
      let currentUrl = '';
      for (let i = 0; i < segments.length; i++) {
         const seg = segments[i];
         currentUrl += `/${seg}`;
         const isLast = i === segments.length - 1;
         
         if (seg === 'icd10cm') continue; 
         
         if (seg === '2026') {
             sequence.push({ label: '2026 Codes', url: '/icd10cm/2026', isCurrent: isLast });
         } else if (seg === 'section' || seg === 'category' || seg === 'chapter') {
             continue; // Skip the raw folder words
         } else if (i > 0 && segments[i-1] === 'section') {
             sequence.push({ label: `Section ${seg.toUpperCase()}`, url: currentUrl, isCurrent: isLast });
         } else if (i > 0 && segments[i-1] === 'chapter') {
             sequence.push({ label: `Chapter ${seg.toUpperCase()}`, url: currentUrl, isCurrent: isLast });
         } else {
             sequence.push({ label: seg.charAt(0).toUpperCase() + seg.slice(1), url: currentUrl, isCurrent: isLast });
         }
      }
      
      if (segments.length === 0) {
         sequence = [{ label: 'Home', isCurrent: true }];
      }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (navQuery.trim()) router.push(`/?q=${encodeURIComponent(navQuery)}`);
  };

  return (
    <div className="bg-slate-50/80 backdrop-blur-md border-b border-slate-200 w-full flex items-center shadow-sm">
       <div className="w-full mx-auto flex flex-col md:flex-row md:items-center justify-between min-h-[48px] px-4 lg:px-8">
          
          <div className="flex-1 min-w-0 flex items-center text-[12.5px] font-medium text-[#7C8B9F] gap-0.5 py-3 md:py-0 w-full overflow-x-auto no-scrollbar whitespace-nowrap">
             {sequence.map((item, idx) => (
                <React.Fragment key={idx}>
                   {item.isGhost ? (
                       <Link href={item.url!} className="text-slate-400 opacity-50 font-medium tracking-tight px-1 italic hover:text-blue-500 hover:opacity-100 transition-all duration-300" title="Last visited page">
                          {item.label}
                       </Link>
                   ) : item.isCurrent && !ghostPath ? (
                       <span className="text-slate-900 font-bold tracking-tight px-1">{item.label}</span>
                   ) : item.isCurrent && ghostPath ? (
                       <Link href={item.url!} className="hover:text-blue-600 transition px-1 font-bold text-slate-800">{item.label}</Link>
                   ) : (
                       <Link href={item.url!} className="hover:text-blue-600 transition px-1">{item.label}</Link>
                   )}
                   {idx < sequence.length - 1 && (
                       <span className={`text-slate-300 mx-0.5 mt-0.5 ${sequence[idx+1]?.isGhost ? 'opacity-50' : ''}`}>
                          <svg className="w-3 h-3 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                       </span>
                   )}
                </React.Fragment>
             ))}
          </div>

          <div className="w-full md:w-[320px] h-[40px] md:h-8 flex bg-white md:bg-white/80 md:border border-slate-200 rounded-md shrink-0 mb-3 md:mb-0 shadow-sm ml-0 md:ml-4">
             <form onSubmit={handleSearch} className="flex items-center justify-between w-full h-full px-3">
                <input 
                  type="text" 
                  value={navQuery}
                  onChange={(e) => setNavQuery(e.target.value)}
                  placeholder="Search Dataicd10..." 
                  autoComplete="off" 
                  className="flex-1 text-[13px] bg-transparent outline-none placeholder-[#7C8B9F] font-medium text-slate-700 h-full py-2 md:py-0 w-full" 
                />
                <button type="submit" className="text-slate-500 transition flex items-center h-full hover:text-blue-600">
                   <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </button>
             </form>
          </div>

       </div>
    </div>
  );
}
