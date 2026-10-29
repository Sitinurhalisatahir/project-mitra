export default function KategoriHeader({ total = 0, loading = false }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Kelola Kategori Skill/Minat
        </h1>
        <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100/60">
          Total {loading ? "..." : total} Kategori Terdaftar
        </span>
      </div>
      <p className="text-xs text-slate-500 mt-1 max-w-2xl font-normal">
        Atur taksonomi keahlian dan minat mahasiswa untuk mendukung akurasi algoritma pencocokan SkillMatch.
      </p>
    </div>
  );
}

