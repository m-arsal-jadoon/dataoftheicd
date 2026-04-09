import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  url?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center space-x-2 text-[10px] md:text-xs text-slate-500 font-medium tracking-wide bg-slate-100 overflow-x-auto whitespace-nowrap px-4 py-2.5 rounded-lg border border-slate-200 w-full shadow-sm mb-6">
      {items.map((item, index) => (
        <span key={index} className="flex items-center shrink-0">
          {index > 0 && (
            <svg className="w-3 h-3 mx-1.5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
          {item.url ? (
            <Link href={item.url} className="hover:text-blue-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-slate-800 font-bold">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
