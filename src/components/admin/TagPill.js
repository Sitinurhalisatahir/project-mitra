export default function TagPill({ tag }) {
  const isMinat = tag?.jenis === "minat";

  if (isMinat) {
    return (
      <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-amber-800 text-xs font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
        <span>{tag?.nama_tag}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-100/70 border border-slate-200/50 text-slate-700 text-xs font-medium">
      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
      <span>{tag?.nama_tag}</span>
    </div>
  );
}

