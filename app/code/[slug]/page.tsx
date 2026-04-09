import { redirect } from 'next/navigation';

export default async function RedirectCodePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const rawSlug = resolvedParams.slug || "";
  
  if (rawSlug) {
    redirect(`/icd10cm/2026/code/${rawSlug}`);
  } else {
    redirect(`/icd10cm/2026`);
  }
}
