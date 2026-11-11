"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import {
  formatProjectCategory,
  formatShortDateIndonesian,
  formatDaysRemaining,
} from "@/lib/frontend/utils/format";

function useDaysRemaining(deadline) {
  return useSyncExternalStore(
    () => () => {},
    () => formatDaysRemaining(deadline),
    () => "Menghitung..."
  );
}

export default function DetailInfoGrid({ proyek }) {
  const daysRemainingText = useDaysRemaining(proyek?.deadline);

  const kategoriLabel = formatProjectCategory(proyek?.kategori);
  const slotTerisi = proyek?.slot_terisi !== undefined ? proyek.slot_terisi : 0;
  const slotDibutuhkan = proyek?.slot_dibutuhkan || 1;
  const sisaSlot = Math.max(0, slotDibutuhkan - slotTerisi);

  const deadlineFormatted = proyek?.deadline
    ? formatShortDateIndonesian(proyek.deadline)
    : "Tanpa deadline";

  // Format info pemilik: {jurusan} '{angkatan2digit}
  let pemilikSub = "-";
  if (proyek?.pemilik_jurusan || proyek?.pemilik_angkatan) {
    const angkatanStr = proyek.pemilik_angkatan
      ? `'${String(proyek.pemilik_angkatan).slice(-2)}`
      : "";
    pemilikSub = `${proyek.pemilik_jurusan || ""} ${angkatanStr}`.trim() || "-";
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 p-6 rounded-2xl bg-surface-container-low">
      {/* 1. Kategori */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">category</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-label-md text-outline uppercase tracking-wider font-semibold">
            Kategori
          </span>
          <span className="text-title-lg text-on-surface font-semibold leading-snug">
            {kategoriLabel}
          </span>
        </div>
      </div>

      {/* 2. Slot Tim */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">group</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-label-md text-outline uppercase tracking-wider font-semibold">
            Slot Tim
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-title-lg text-on-surface font-semibold leading-snug">
              {slotTerisi}/{slotDibutuhkan}
            </span>
            <span className="text-label-md bg-secondary-fixed text-on-secondary-fixed px-2 py-0.5 rounded-full font-bold">
              {sisaSlot} tersisa
            </span>
          </div>
        </div>
      </div>

      {/* 3. Deadline */}
      <div className="flex items-start gap-3 min-w-0">
        <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
          <span className="material-symbols-outlined text-[20px]">schedule</span>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-label-md text-outline uppercase tracking-wider font-semibold">
            Deadline
          </span>
          <span className="text-title-lg text-on-surface font-semibold leading-snug">
            {deadlineFormatted}
          </span>
          <span className="text-label-md text-secondary font-medium leading-snug">
            {daysRemainingText}
          </span>
        </div>
      </div>

      {/* 4. Pemilik Proyek */}
      <div className="flex items-start justify-between gap-3 min-w-0">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
            <span className="material-symbols-outlined text-[20px]">person_pin</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-label-md text-outline uppercase tracking-wider font-semibold">
              Pemilik Proyek
            </span>
            <span className="text-title-lg text-on-surface font-semibold leading-snug truncate">
              {proyek?.pemilik_nama || "-"}
            </span>
            <span className="text-label-md text-on-surface-variant leading-snug truncate">
              {pemilikSub}
            </span>
          </div>
        </div>

        {/* Tombol chat dengan pemilik proyek (jika bukan proyek milik sendiri) */}
        {!proyek?.is_pemilik && proyek?.pemilik_id && (
          <Link
            href={`/chat?user=${proyek.pemilik_id}`}
            className="w-9 h-9 rounded-full bg-primary-container hover:bg-primary text-on-primary flex items-center justify-center shrink-0 shadow-sm transition-all"
            title={`Chat dengan ${proyek.pemilik_nama}`}
            aria-label={`Chat dengan ${proyek.pemilik_nama}`}
          >
            <span className="material-symbols-outlined text-[18px]">chat</span>
          </Link>
        )}
      </div>
    </div>
  );
}

