import { fetchCodeBySlug, getSiblings, getChildren, getRelatedCodes } from '../../../../../lib/data-engine/db';
import { redirect } from 'next/navigation';
import Layout from '../../../../../components/Layout';
import ClientDashboard from './ClientDashboard';
import Link from 'next/link';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();
  const codeData = fetchCodeBySlug(decodedSlug);

  if (!codeData) {
    return { title: 'Code Not Found | DataICD10' };
  }

  return {
    title: `${codeData.code_id} - ${codeData.title} | DataICD10`,
    description: `Find 2026 ICD-10-CM details for ${codeData.title}. See billable status, hierarchy, and clinical coding notes at DataICD10.`,
    alternates: {
      canonical: `https://www.dataicd10.com/icd10cm/2026/code/${decodedSlug}`
    }
  };
}

const synonymMap: Record<string, string[]> = {
  'sugar': ['diabetes type 2', 'glucose dependency', 'insulin resistance'],
  'heart': ['cardiac muscle pathway', 'myocardial infarction index', 'cardiopulmonary'],
  'chest': ['thoracic cavity mapping', 'sternum connection'],
  'lung': ['pulmonary embolism pathway', 'bronchial infection'],
  'brain': ['cerebral hemorrhage', 'neurological deficit'],
  'blood': ['hematologic screening', 'vascular system']
};

export default async function CodePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();
  
  // If a user types M54 or m54 (3 characters), and it has no dot, it's highly likely a root block category
  // Let's check the DB first
  const codeData = fetchCodeBySlug(decodedSlug);

  // If the target is exactly 3 chars long, and it's missing or exists as a 3-char block, redirect to Category.
  if (decodedSlug.length === 3) {
      redirect(`/icd10cm/2026/category/${decodedSlug.toUpperCase()}`);
  }

  // Not found state inside Layout wrapper
  if (!codeData) {
      return (
         <Layout breadcrumbs={{}}>
            <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#07070E' }}>
               <div className="text-center p-10 rounded-2xl shadow-sm border max-w-[500px]" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
                  <h1 className="text-3xl font-black text-white mb-2">Code Not Found</h1>
                  <p className="font-medium mb-8" style={{ color: '#94a3b8' }}>We could not locate the exact ICD-10 billable diagnosis code or structural component for: <strong className="px-2 py-1 rounded ml-1" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>{rawSlug}</strong></p>
                  <Link href="/icd10cm/2026" className="inline-block px-8 py-3 font-bold rounded-xl transition-all hover:opacity-80 text-white" style={{ background: '#3b82f6' }}>
                     Return to Directory
                  </Link>
               </div>
            </div>
         </Layout>
      );
  }

  const relations = {
      siblings: getSiblings(codeData),
      children: getChildren(codeData),
      fallbackRelated: getRelatedCodes(decodedSlug, 30)
  };

  const rawTitle = codeData.title || "";
  const isBillable = codeData.is_billable; 
  
  const words = rawTitle.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(' ');
  let clinicalPathways = new Set<string>();
  words.forEach((w: string) => {
      if (synonymMap[w]) synonymMap[w].forEach(s => clinicalPathways.add(s));
  });
  if (clinicalPathways.size === 0) {
      clinicalPathways.add(`Clinical evaluation of ${rawTitle.substring(0, 15)}...`);
      clinicalPathways.add('General screening protocol');
  }

  const specificBillableChildren = (!isBillable && relations.children.length > 0)
      ? relations.children.filter((c: any) => c.is_billable)
      : [];

  const alternatives = specificBillableChildren.length > 0 ? specificBillableChildren : (relations.siblings.length > 0 ? relations.siblings : relations.fallbackRelated);

  const chapterStr = Array.isArray(codeData.chapter_title) ? codeData.chapter_title.join(': ') : (codeData.chapter_title || "Unspecified Chapter");
  const sectionStr = Array.isArray(codeData.section_title) ? codeData.section_title.join(': ') : (codeData.section_title || "Unspecified Section");
  const parentId = codeData.parent_id || codeData.code_id.substring(0, 3);

  return (
      <Layout breadcrumbs={{ code: codeData }}>
         <ClientDashboard 
            codeData={codeData} 
            relations={relations}
            rawTitle={rawTitle}
            clinicalPathways={Array.from(clinicalPathways)}
            alternatives={alternatives}
            chapterStr={chapterStr}
            sectionStr={sectionStr}
            parentId={parentId}
         />
      </Layout>
  );
}
