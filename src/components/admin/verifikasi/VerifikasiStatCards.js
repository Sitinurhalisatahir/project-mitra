import { IconUsers2, IconClock, IconCheckCircle2 } from "@/components/admin/icons";

export default function VerifikasiStatCards({
  totalCount = 0,
  menungguCount = 0,
  verifiedCount = 0,
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {/* Kartu 1: Total Pengajuan */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Pengajuan
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">{totalCount}</h3>
            <span className="text-xs font-semibold text-slate-500">Akun</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Seluruh pengajuan terdaftar</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center shrink-0">
          <IconUsers2 className="w-6 h-6 fill-none stroke-current" strokeWidth={2} />
        </div>
      </div>

      {/* Kartu 2: Menunggu Tindakan */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Menunggu Tindakan
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">{menungguCount}</h3>
            <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60">
              Perlu Respon
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Perlu validasi identitas &amp; NIM</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#B45309] flex items-center justify-center shrink-0">
          <IconClock className="w-6 h-6 fill-none stroke-current" strokeWidth={2} />
        </div>
      </div>

      {/* Kartu 3: Telah Diverifikasi */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Telah Diverifikasi
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-slate-900">{verifiedCount}</h3>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Selesai
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">Akses fitur matchmaking aktif</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center shrink-0">
          <IconCheckCircle2 className="w-6 h-6 fill-none stroke-current" strokeWidth={2} />
        </div>
      </div>
    </div>
  );
}

