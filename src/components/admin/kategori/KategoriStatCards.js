export default function KategoriStatCards({
  total = 0,
  skillCount = 0,
  minatCount = 0,
  loading = false,
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between animate-pulse"
          >
            <div className="space-y-2">
              <div className="h-3 w-24 bg-slate-200 rounded" />
              <div className="h-8 w-16 bg-slate-200 rounded" />
              <div className="h-3 w-32 bg-slate-100 rounded" />
            </div>
            <div className="w-11 h-11 rounded-xl bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Kartu 1: Total Kategori */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Total Kategori
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {total}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              Kategori
            </span>
          </div>
          <p className="text-xs text-slate-400">Aktif di mesin pencocokan</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
          <span className="material-symbols-outlined text-2xl">category</span>
        </div>
      </div>

      {/* Kartu 2: Kategori Skill */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
            Kategori Skill
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {skillCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Skill</span>
          </div>
          <p className="text-xs text-indigo-500">Basis hard skills tim</p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100/60 flex items-center justify-center text-indigo-600 shadow-sm shrink-0">
          <span className="material-symbols-outlined text-2xl">code</span>
        </div>
      </div>

      {/* Kartu 3: Kategori Minat */}
      <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between hover:shadow-md transition-all">
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
            Kategori Minat
          </p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {minatCount}
            </span>
            <span className="text-xs font-semibold text-slate-500">Minat</span>
          </div>
          <p className="text-xs text-amber-600/80">
            Preferensi aspirasi mahasiswa
          </p>
        </div>
        <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-500 shadow-sm shrink-0">
          <span className="material-symbols-outlined text-2xl">interests</span>
        </div>
      </div>
    </div>
  );
}

