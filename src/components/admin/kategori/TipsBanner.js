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
      <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
        <button
          type="button"
          disabled
          title="Belum tersedia"
          className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-sm opacity-50 cursor-not-allowed"
        >
          Unduh Log
        </button>
        <button
          type="button"
          disabled
          title="Belum tersedia"
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-200 transition-colors opacity-50 cursor-not-allowed"
        >
          Sinkronkan Mesin
        </button>
      </div>
    </div>
  );
}

