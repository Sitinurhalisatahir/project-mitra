"use client";

import { getInitials } from "@/lib/frontend/utils/format";

export default function ChatRoomHeader({ recipient }) {
  if (!recipient) return null;

  const initials = getInitials(recipient.nama);

  // Subtitle: "{jurusan} • Angkatan {angkatan}" (bagian null dibuang; bila keduanya null "Mahasiswa SkillMatch")
  const parts = [];
  if (recipient.jurusan) parts.push(recipient.jurusan);
  if (recipient.angkatan) parts.push(`Angkatan ${recipient.angkatan}`);
  const subtitle = parts.length > 0 ? parts.join(" • ") : "Mahasiswa SkillMatch";

  const matchPercent =
    recipient.match_score != null ? Math.round(recipient.match_score) : null;

  return (
    <div className="h-20 px-space-lg flex items-center justify-between bg-surface-container-lowest shadow-sm z-10 shrink-0 border-b border-outline-variant/20">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="w-11 h-11 rounded-full bg-primary-container text-on-primary text-title-lg font-bold flex items-center justify-center shadow-md">
            {initials}
          </div>
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-title-lg font-bold text-on-surface truncate">
              {recipient.nama}
            </h2>
            {matchPercent != null && (
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-semibold">
                {matchPercent}% Match
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant text-label-md">
            <span className="truncate">{subtitle}</span>
          </div>
        </div>
      </div>

      {/* Action Icons on Header */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          disabled
          title="Belum tersedia"
          aria-label="Detail Proyek"
          className="p-2.5 rounded-full text-on-surface-variant opacity-50 cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">info</span>
        </button>
        <button
          type="button"
          disabled
          title="Belum tersedia"
          aria-label="Buka Lampiran"
          className="p-2.5 rounded-full text-on-surface-variant opacity-50 cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            folder_open
          </span>
        </button>
        <button
          type="button"
          disabled
          title="Belum tersedia"
          aria-label="Opsi Percakapan"
          className="p-2.5 rounded-full text-on-surface-variant opacity-50 cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[20px]">
            more_vert
          </span>
        </button>
      </div>
    </div>
  );
}

