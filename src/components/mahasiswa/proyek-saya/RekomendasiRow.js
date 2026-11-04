"use client";

import { useState } from "react";
import { getInitials } from "@/lib/frontend/utils/format";

const REKOMENDASI_PALETTES = [
  { bg: "bg-primary-fixed-dim", text: "text-primary" },
  { bg: "bg-secondary-fixed", text: "text-secondary" },
  { bg: "bg-tertiary-fixed", text: "text-tertiary" },
];

function getAvatarPalette(id) {
  const num = Number(id) || 0;
  return REKOMENDASI_PALETTES[Math.abs(num) % REKOMENDASI_PALETTES.length];
}

export default function RekomendasiRow({ mitra, proyekJudul, onInvite }) {
  const [isSending, setIsSending] = useState(false);
  const [isInvited, setIsInvited] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const initials = getInitials(mitra.nama);
  const palette = getAvatarPalette(mitra.pengguna_id);

  async function handleInvite() {
    if (isInvited || isSending) return;
    setIsSending(true);
    setErrorMsg(null);
    try {
      const pesan = `Halo ${mitra.nama}, saya mengajak kamu bergabung di proyek "${proyekJudul}".`;
      await onInvite(mitra.pengguna_id, pesan);
      setIsInvited(true);
    } catch (err) {
      setErrorMsg(err.message || "Gagal mengirim undangan");
    } finally {
      setIsSending(false);
    }
  }

  // Build academic info string (e.g., "• Teknik Informatika (Angk. 2022)")
  const academicParts = [];
  if (mitra.jurusan) academicParts.push(mitra.jurusan);
  if (mitra.angkatan) academicParts.push(`(Angk. ${mitra.angkatan})`);
  const academicText =
    academicParts.length > 0 ? `• ${academicParts.join(" ")}` : "";

  // Skill tags (max 3)
  const tags = Array.isArray(mitra.tags) ? mitra.tags.slice(0, 3) : [];

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between p-space-md rounded-2xl bg-surface-container-low hover:bg-surface-container transition-colors gap-space-sm">
        <div className="flex items-start gap-space-md min-w-0">
          <div
            className={`w-10 h-10 rounded-full ${palette.bg} ${palette.text} flex items-center justify-center text-pill-tag font-bold shrink-0 mt-0.5 shadow-sm`}
          >
            {initials}
          </div>
          <div className="flex flex-col min-w-0 gap-1.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-pill-tag text-on-surface font-bold">
                {mitra.nama}
              </span>
              {academicText && (
                <span className="text-label-md text-on-surface-variant">
                  {academicText}
                </span>
              )}
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag, idx) => (
                  <span
                    key={tag.tag_id || idx}
                    className="px-2.5 py-0.5 rounded-full bg-surface-container-high text-primary text-label-md font-semibold"
                  >
                    {tag.nama_tag || tag.nama}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          type="button"
          disabled={isInvited || isSending}
          onClick={handleInvite}
          className={`ml-space-xs shrink-0 px-space-md py-2 rounded-2xl font-semibold text-label-md transition-all shadow-sm flex items-center gap-1 cursor-pointer ${
            isInvited
              ? "bg-surface-container-high text-on-surface-variant cursor-not-allowed opacity-80"
              : "bg-primary-container text-on-primary hover:bg-primary"
          }`}
        >
          {isSending ? (
            <span>Mengirim...</span>
          ) : isInvited ? (
            <>
              <span className="material-symbols-outlined text-[16px]">
                check
              </span>
              <span>Undangan Terkirim</span>
            </>
          ) : (
            <>
              <span>Ajak Kolaborasi</span>
              <span className="material-symbols-outlined text-[16px]">
                arrow_forward
              </span>
            </>
          )}
        </button>
      </div>

      {errorMsg && (
        <p className="text-xs text-red-600 px-space-md mt-1">{errorMsg}</p>
      )}
    </div>
  );
}

