export default function VerifikasiHeader({ menungguCount = 0 }) {
  return (
    <header className="flex flex-col gap-1 mb-8 pt-2">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verifikasi Akun Mahasiswa
        </h1>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffddb8]/80 text-[#653e00] font-semibold text-xs shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#fea619]" />
          {menungguCount} Menunggu Tindakan
        </span>
      </div>
      <p className="text-sm text-slate-500 font-normal">
        Kelola permohonan verifikasi identitas dan status akun mahasiswa SkillMatch
      </p>
    </header>
  );
}

