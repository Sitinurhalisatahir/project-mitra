import { IconShieldCheck } from "@/components/admin/icons";
import StatusBadge from "./StatusBadge";
import { getInitials } from "@/lib/frontend/utils/format";

const AVATAR_PALETTES = [
  { bg: "bg-indigo-50", text: "text-[#4F46E5]" },
  { bg: "bg-orange-100", text: "text-orange-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-indigo-100", text: "text-[#4F46E5]" },
  { bg: "bg-violet-100", text: "text-violet-600" },
];

export default function VerifikasiRow({
  user,
  isProcessing = false,
  onVerify,
  onRevoke,
  onReject,
}) {
  const initials = getInitials(user?.nama);
  const palette = AVATAR_PALETTES[(user?.pengguna_id || 0) % AVATAR_PALETTES.length];

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* NIM */}
      <td className="py-4 px-8 font-semibold text-slate-900 text-xs">
        {user?.nim}
      </td>

      {/* Mahasiswa */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-9 h-9 rounded-full ${palette.bg} ${palette.text} font-bold text-xs flex items-center justify-center shrink-0`}
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0 leading-tight">
            <span className="font-bold text-slate-900 text-xs truncate">
              {user?.nama}
            </span>
            <span className="text-[11px] text-slate-400 font-medium mt-0.5">
              {user?.jurusan || "-"}
            </span>
          </div>
        </div>
      </td>

      {/* Email */}
      <td className="py-4 px-6 text-slate-500 text-xs">
        {user?.email}
      </td>

      {/* Status */}
      <td className="py-4 px-6">
        <StatusBadge isVerified={user?.is_verified} />
      </td>

      {/* Aksi */}
      <td className="py-4 px-8 text-right whitespace-nowrap">
        {user?.is_verified ? (
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center text-emerald-600 font-semibold text-xs space-x-1">
              <IconShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Selesai</span>
            </div>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onRevoke && onRevoke(user?.pengguna_id)}
              className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border border-slate-200 rounded-full transition-colors cursor-pointer disabled:opacity-50"
              title="Batalkan verifikasi akun ini (kembalikan ke status menunggu)"
            >
              Cabut
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onVerify(user?.pengguna_id)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-amber-400 hover:bg-amber-500 rounded-full shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Memproses..." : "Verifikasi"}
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={() => onReject && onReject(user)}
              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-white hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              title="Tolak dan hapus pengajuan akun mahasiswa ini"
            >
              Tolak
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}
