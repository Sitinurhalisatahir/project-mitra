export default function TipsBanner() {
  return (
    <div className="bg-indigo-50/60 border border-indigo-100/70 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm">
          <span className="material-symbols-outlined text-xl">lightbulb</span>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900">
            Tips Pengelolaan Taksonomi SkillMatch
          </h4>
          <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5 max-w-3xl">
            Kategori yang aktif langsung disinkronkan ke mesin rekomendasi tim. Perubahan nama atau penghapusan kategori akan tetap mempertahankan riwayat kecocokan proyek sebelumnya tanpa memutus koneksi profil mahasiswa.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-emerald-700 border border-emerald-200 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Sinkronisasi Aktif
        </span>
      </div>
    </div>
  );
}
