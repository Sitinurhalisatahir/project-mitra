import { IconShieldAlert, IconCheck } from "@/components/admin/icons";

export default function ValidationNotice() {
  return (
    <div className="mt-6 p-5 rounded-2xl bg-indigo-50/60 border border-indigo-100/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Left notice info */}
      <div className="flex items-start gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-white border border-indigo-100 text-[#4F46E5] flex items-center justify-center shrink-0 shadow-sm">
          <IconShieldAlert className="w-5 h-5 fill-none stroke-current" strokeWidth={2} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 tracking-tight">
            Ketentuan Validasi Akun Mahasiswa
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Pastikan setiap pengajuan memenuhi standar administrasi kampus sebelum menyetujui verifikasi
          </p>
        </div>
      </div>

      {/* Right notice rules */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full md:w-auto text-xs text-slate-600">
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-100/60 shadow-sm">
          <IconCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
          <span className="leading-tight text-[11px] font-medium">
            Kesesuaian NIM &amp; Jurusan resmi
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-100/60 shadow-sm">
          <IconCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
          <span className="leading-tight text-[11px] font-medium">
            Domain email @kampus.ac.id
          </span>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-indigo-100/60 shadow-sm">
          <IconCheck className="w-4 h-4 text-emerald-600 shrink-0" strokeWidth={2} />
          <span className="leading-tight text-[11px] font-medium">
            Aktivasi instan matchmaking
          </span>
        </div>
      </div>
    </div>
  );
}

