export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50">
      <div className="relative flex justify-center items-center">
        <div className="w-16 h-16 border-4 border-[#E2E8F0] border-t-[#2D82FE] rounded-full animate-spin"></div>
      </div>
      <p className="mt-6 text-[#7C8B9F] font-bold text-sm tracking-widest uppercase animate-pulse">Loading DataICD10 Database...</p>
    </div>
  );
}
