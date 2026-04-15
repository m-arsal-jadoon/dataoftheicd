import Link from 'next/link';
import { getAllCodes, getCodesByCategory } from '../../../../../lib/data-engine/db';
import Layout from '../../../../../components/Layout';
import CodeGrid, { type SerializedRecord, type CategoryDetails } from './_components/CodeGrid';

// ─── Constants ────────────────────────────────────────────────────────────────
const THIS_YEAR = '2026';

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();
  
  const allCodes = getAllCodes() || [];
  const categoryRaw = allCodes.find(c => c.code_id.toLowerCase() === decodedSlug);
  
  if (!categoryRaw) {
    return { title: 'Category Not Found' };
  }

  return {
    title: `ICD-10 Category ${categoryRaw.code_id} - ${categoryRaw.title} | DataICD10`,
    description: `Lookup comprehensive details for ICD-10-CM block ${categoryRaw.code_id}. Find billable and non-billable diagnosis codes for ${THIS_YEAR}.`,
  };
}

// ─── Generate Static Params ───────────────────────────────────────────────────
export async function generateStaticParams() {
  const allCodes = getAllCodes() || [];
  // Only explicitly fetch root-level categories (length === 3)
  const categories = allCodes.filter(c => c.code_id.length === 3);
  
  return categories.map((cat) => ({
    slug: cat.code_id.toLowerCase(),
  }));
}

// ─── Component ────────────────────────────────────────────────────────────────
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  const decodedSlug = decodeURIComponent(rawSlug).toLowerCase();

  const allCodes = getAllCodes() || [];
  const categoryRaw = allCodes.find(c => c.code_id.toLowerCase() === decodedSlug && c.code_id.length === 3);

  if (!categoryRaw) {
    return (
      <Layout breadcrumbs={{}}>
         <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: '#07070E' }}>
            <div className="text-center p-10 rounded-2xl shadow-sm border max-w-[500px]" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}>
               <h1 className="text-3xl font-black text-white mb-2">Category Not Found</h1>
               <p className="font-medium mb-8" style={{ color: '#94a3b8' }}>We could not locate the category block for: <strong className="px-2 py-1 rounded ml-1" style={{ background: 'rgba(255,255,255,0.1)', color: '#e2e8f0' }}>{rawSlug}</strong></p>
               <Link href="/icd10cm/2026" className="inline-block px-8 py-3 font-bold rounded-xl transition-all hover:opacity-80 text-white" style={{ background: '#3b82f6' }}>
                  Return to Directory
               </Link>
            </div>
         </div>
      </Layout>
    );
  }

  // Transform into minimal payload
  const sectionId = categoryRaw.chapter_range ? (Array.isArray(categoryRaw.chapter_range) ? categoryRaw.chapter_range[0] : categoryRaw.chapter_range) : '';
  const chapterTitleStr = Array.isArray(categoryRaw.chapter_title) ? categoryRaw.chapter_title.join(': ') : (categoryRaw.chapter_title || '');
  
  const categoryDetails: CategoryDetails = {
    code_id: categoryRaw.code_id,
    title: categoryRaw.title,
    section_id: sectionId,
    chapter_title: chapterTitleStr,
  };

  // Fetch all specific diagnosis codes underneath this 3-character root category
  const rawCodes = getCodesByCategory(decodedSlug);
  const serializableCodes: SerializedRecord[] = rawCodes.map((c: any) => ({
    code_id: c.code_id,
    title: c.title,
    billable: c.billable_flag === "1" || c.billable_flag === true || c.is_billable === true || c.billable === true,
  })).sort((a,b) => a.code_id.localeCompare(b.code_id, undefined, {numeric: true}));

  return (
    <Layout breadcrumbs={{ category: categoryRaw }}>
      <CodeGrid category={categoryDetails} codes={serializableCodes} />
    </Layout>
  );
}
