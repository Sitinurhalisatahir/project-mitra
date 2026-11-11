"use client";

import Link from "next/link";
import {
  formatProjectCategory,
  formatShortDateIndonesian,
  formatDaysRemaining,
  getInitials,
} from "@/lib/frontend/utils/format";

const AVATAR_PALETTES = [
  { bg: "bg-primary-container", text: "text-on-primary" },
  { bg: "bg-secondary-container", text: "text-on-secondary-container" },
  { bg: "bg-tertiary-container", text: "text-on-tertiary" },
  { bg: "bg-surface-tint", text: "text-white" },
];

function getAvatarPalette(id) {
  const num = Number(id) || 0;
  return AVATAR_PALETTES[Math.abs(num) % AVATAR_PALETTES.length];
}

export default function ProyekTergabungCard({ proyek, aplikasi }) {
  const ownerPalette = getAvatarPalette(proyek.pemilik_id);
  const ownerInitials = getInitials(proyek.pemilik_nama || "Ketua Proyek");

  const anggotaList = Array.isArray(proyek.anggota) ? proyek.anggota : [];
  const tagsList = Array.isArray(proyek.tags) ? proyek.tags : [];
  const terisi = proyek.slot_terisi || anggotaList.length || 1;
  const slotDibutuhkan = proyek.slot_dibutuhkan || 1;
  const percent = Math.min(100, Math.round((terisi / slotDibutuhkan) * 100));

  const isBuka = proyek.status === "buka";

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-lg hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-space-md">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-space-sm flex-wrap">
          <div className="flex items-center gap-space-xs flex-wrap">
            {/* Category */}
            <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-md font-semibold">
              {formatProjectCategory(proyek.kategori)}
            </span>

            {/* Status Proyek */}
            {isBuka ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tertiary-fixed text-tertiary text-label-md font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                Proyek Berjalan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant text-label-md font-semibold">
                {proyek.status === "ditutup" ? "Ditutup" : "Selesai"}
              </span>
            )}
          </div>

          {/* Keanggotaan Badge */}
          {proyek.is_pemilik ? (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-bold shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">stars</span>
              Ketua Tim (Pemilik)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-primary text-label-md font-bold shadow-2xs">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Anggota Tim
            </span>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-1">
          <Link
            href={`/proyek/${proyek.proyek_id}`}
            className="text-title-lg font-bold text-on-surface hover:text-primary transition-colors leading-snug line-clamp-2"
          >
            {proyek.judul}
          </Link>
          {proyek.deskripsi && (
            <p className="text-body-md text-on-surface-variant line-clamp-2 mt-0.5">
              {proyek.deskripsi}
            </p>
          )}
        </div>

        {/* Ketua Proyek Info */}
        <div className="flex items-center justify-between gap-space-sm p-space-sm rounded-2xl bg-surface-container-low">
          <div className="flex items-center gap-space-sm min-w-0">
            <div
              className={`w-9 h-9 rounded-full ${ownerPalette.bg} ${ownerPalette.text} flex items-center justify-center text-pill-tag font-bold shrink-0 shadow-xs`}
            >
              {ownerInitials}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-pill-tag font-bold text-on-surface truncate">
                {proyek.is_pemilik ? `${proyek.pemilik_nama || "Anda"} (Anda)` : (proyek.pemilik_nama || "Ketua Tim")}
              </span>
              <span className="text-xs text-on-surface-variant truncate">
                {proyek.is_pemilik
                  ? "Anda adalah Ketua Proyek ini"
                  : `Ketua Proyek ${proyek.pemilik_jurusan ? `• ${proyek.pemilik_jurusan}` : ""}`}
              </span>
            </div>
          </div>

          {proyek.is_pemilik ? (
            <Link
              href="/proyek-saya"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-secondary text-label-md font-semibold border border-outline-variant/30 transition-colors shrink-0"
              title="Kelola pelamar di Proyek Saya"
            >
              <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
              <span>Kelola</span>
            </Link>
          ) : (
            proyek.pemilik_id && (
              <Link
                href={`/chat?user=${proyek.pemilik_id}`}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container-lowest hover:bg-surface-container text-primary text-label-md font-semibold border border-outline-variant/30 transition-colors shrink-0"
                title="Kirim pesan langsung ke ketua proyek"
              >
                <span className="material-symbols-outlined text-[16px]">chat</span>
                <span>Chat Ketua</span>
              </Link>
            )
          )}
        </div>

        {/* Anggota Tim Yang Tergabung */}
        {anggotaList.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-label-md font-semibold text-on-surface-variant">
              Rekan Tim Tergabung:
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {anggotaList.map((member) => {
                const memPalette = getAvatarPalette(member.pengguna_id);
                const memInitials = getInitials(member.nama);
                return (
                  <div
                    key={member.pengguna_id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container-low border border-outline-variant/20 text-xs font-medium text-on-surface"
                    title={`${member.nama} (${member.jurusan || "Mahasiswa"})`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full ${memPalette.bg} ${memPalette.text} flex items-center justify-center text-[10px] font-bold`}
                    >
                      {memInitials}
                    </div>
                    <span className="truncate max-w-[120px]">{member.nama}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tags Skill / Minat */}
        {tagsList.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {tagsList.slice(0, 5).map((tag, idx) => {
              const isMinat = (tag.jenis || "").toLowerCase() === "minat";
              return (
                <span
                  key={tag.tag_id || idx}
                  className={`px-2.5 py-0.5 rounded-full text-pill-tag font-semibold ${
                    isMinat
                      ? "bg-secondary-fixed text-on-secondary-fixed-variant"
                      : "bg-surface-container text-primary"
                  }`}
                >
                  {tag.nama_tag || tag.nama}
                </span>
              );
            })}
            {tagsList.length > 5 && (
              <span className="text-xs text-on-surface-variant font-medium">
                +{tagsList.length - 5} lainnya
              </span>
            )}
          </div>
        )}

        {/* Progress Slot & Deadline */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/20">
          <div className="flex items-center justify-between text-label-md text-on-surface-variant">
            <span>
              Slot Anggota: <strong className="text-on-surface">{terisi}/{slotDibutuhkan}</strong>
            </span>
            <span>
              Deadline: <strong className="text-on-surface">{proyek.deadline ? formatShortDateIndonesian(proyek.deadline) : "Tanpa batas"}</strong>
              {proyek.deadline && (
                <span className="ml-1 text-xs text-primary font-semibold">
                  ({formatDaysRemaining(proyek.deadline)})
                </span>
              )}
            </span>
          </div>
          <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
            <div
              className="bg-primary-container h-full rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="flex items-center justify-between gap-space-sm pt-space-xs border-t border-outline-variant/20 flex-wrap">
        <span className="text-xs text-on-surface-variant">
          {proyek.is_pemilik
            ? (proyek.created_at ? `Dibuat: ${formatShortDateIndonesian(proyek.created_at)}` : "Dibuat oleh Anda")
            : (aplikasi?.applied_at ? `Bergabung: ${formatShortDateIndonesian(aplikasi.applied_at)}` : "Tergabung dalam tim")}
        </span>

        <div className="flex items-center gap-space-xs">
          {proyek.is_pemilik && (
            <Link
              href="/proyek-saya"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-semibold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">folder</span>
              <span>Proyek Saya</span>
            </Link>
          )}
          <Link
            href={`/proyek/${proyek.proyek_id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-label-md font-semibold hover:bg-primary-container transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
            <span>Buka Proyek</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

