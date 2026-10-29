import { IconClock, IconCheckCircle2 } from "@/components/admin/icons";

export default function StatusBadge({ isVerified }) {
  if (isVerified) {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-700 text-xs font-semibold">
        <IconCheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        Terverifikasi
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FEF3C7] text-[#B45309] text-xs font-semibold">
      <IconClock className="w-3.5 h-3.5 text-[#B45309]" />
      Belum Terverifikasi
    </span>
  );
}

