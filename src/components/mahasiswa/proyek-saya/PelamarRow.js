"use client";

import Link from "next/link";
import { getInitials } from "@/lib/frontend/utils/format";

const AVATAR_PALETTES = [
  { bg: "bg-primary-container", text: "text-on-primary" },
  { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  { bg: "bg-tertiary-container", text: "text-on-tertiary" },
];

function getAvatarPalette(id) {
  const num = Number(id) || 0;
  return AVATAR_PALETTES[Math.abs(num) % AVATAR_PALETTES.length];
}

export default function PelamarRow({
  applicant,
  onUpdateStatus,
  isProcessing = false,
}) {
  const initials = getInitials(applicant.nama);
  const palette = getAvatarPalette(applicant.pengguna_id);

  function handleAccept() {
    onUpdateStatus(applicant.aplikasi_id, "diterima");
  }

  function handleReject() {
    if (window.confirm(`Tolak lamaran ${applicant.nama}?`)) {
      onUpdateStatus(applicant.aplikasi_id, "ditolak");
    }
  }

  return (
    <div className="flex items-center justify-between p-space-md rounded-2xl bg-surface-container-lowest hover:bg-surface-container-low transition-colors shadow-sm gap-space-md">
      <div className="flex items-center gap-space-md min-w-0">
        <div
          className={`w-10 h-10 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-pill-tag font-bold shrink-0 shadow-sm`}
        >
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-pill-tag text-on-surface font-bold truncate">
            {applicant.nama}
          </span>
          <span className="text-label-md text-on-surface-variant truncate">
            {applicant.jurusan || "-"} • {applicant.pesan || "Tanpa pesan"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-space-xs shrink-0">
        <Link
          href={`/chat?user=${applicant.pengguna_id}`}
          className="w-8 h-8 rounded-full bg-surface-container hover:bg-primary-container text-on-surface-variant hover:text-on-primary flex items-center justify-center transition-all duration-200 mr-1"
          title={`Chat dengan ${applicant.nama}`}
          aria-label={`Chat dengan ${applicant.nama}`}
        >
          <span className="material-symbols-outlined text-[18px]">chat</span>
        </Link>
        {applicant.status === "pending" && (
          <>
            <span className="px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-semibold mr-1">
              Pending
            </span>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleAccept}
              className="px-space-md py-1.5 bg-primary-container hover:bg-primary text-on-primary rounded-2xl text-label-md transition-all shadow-sm font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Memproses..." : "Terima"}
            </button>
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleReject}
              className="px-space-md py-1.5 bg-surface-container hover:bg-error-container hover:text-on-error-container text-on-surface-variant rounded-2xl text-label-md transition-all font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? "Memproses..." : "Tolak"}
            </button>
          </>
        )}

        {applicant.status === "diterima" && (
          <span className="px-2.5 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-md font-semibold">
            Diterima
          </span>
        )}

        {applicant.status === "ditolak" && (
          <span className="px-2.5 py-1 rounded-full bg-error-container text-on-error-container text-label-md font-semibold">
            Ditolak
          </span>
        )}
      </div>
    </div>
  );
}

