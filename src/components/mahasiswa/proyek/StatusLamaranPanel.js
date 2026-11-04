"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { formatRelativeTime, formatProjectCategory } from "@/lib/frontend/utils/format";

function useRelativeTime(date) {
  return useSyncExternalStore(
    () => () => {},
    () => formatRelativeTime(date),
    () => "..."
  );
}

function StatusLamaranItem({ item }) {
  const relativeTime = useRelativeTime(item.applied_at);
  const kategoriLabel = formatProjectCategory(item.kategori);

  let badgeColor = "bg-secondary-fixed text-on-secondary-fixed-variant";
  let badgeIcon = "hourglass_top";
  let statusText = "Menunggu Keputusan Pemilik Proyek";

  if (item.status === "diterima") {
    badgeColor = "bg-tertiary-fixed text-on-tertiary-fixed-variant";
    badgeIcon = "check_circle";
    statusText = "Diterima";
  } else if (item.status === "ditolak") {
    badgeColor = "bg-error-container text-on-error-container";
    badgeIcon = "cancel";
    statusText = "Ditolak";
  }

  return (
    <div className="p-4 rounded-2xl bg-surface-container-low flex flex-col gap-3 hover:bg-surface-container transition-colors">
      <div className="flex flex-col gap-1">
        <Link
          href={`/proyek/${item.proyek_id}`}
          className="text-title-lg font-bold text-on-surface leading-snug hover:text-primary transition-colors"
        >
          {item.judul || "Proyek"}
        </Link>
        <div className="flex items-center gap-1.5 text-label-md text-on-surface-variant flex-wrap font-normal">
          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
          <span>Diajukan {relativeTime}</span>
          <span>•</span>
          <span className="font-semibold text-primary">
            Kategori: {kategoriLabel}
          </span>
        </div>
      </div>
      <div className="flex items-center">
        <span
          className={`inline-flex items-center gap-1.5 text-pill-tag ${badgeColor} px-3 py-1 rounded-full font-semibold`}
        >
          <span className="material-symbols-outlined text-[15px]">{badgeIcon}</span>
          {statusText}
        </span>
      </div>
    </div>
  );
}

export default function StatusLamaranPanel({
  items = [],
  loading = false,
}) {
  const displayItems = items.slice(0, 3);

  return (
    <aside className="lg:col-span-4 w-full bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-title-lg font-bold text-on-surface">
          Status Lamaran Saya
        </h2>
        <p className="text-body-md text-outline font-normal">
          Pantau respon pengajuan kolaborasimu
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-28 rounded-2xl bg-surface-container-low animate-pulse"
            />
          ))
        ) : displayItems.length === 0 ? (
          <div className="p-8 text-center bg-surface-container-low/40 rounded-2xl">
            <p className="text-body-md text-outline font-normal">
              Belum ada lamaran
            </p>
          </div>
        ) : (
          displayItems.map((item) => (
            <StatusLamaranItem key={item.aplikasi_id} item={item} />
          ))
        )}
      </div>
    </aside>
  );
}

