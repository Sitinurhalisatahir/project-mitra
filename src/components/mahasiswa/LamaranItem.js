"use client";

import { useSyncExternalStore } from "react";
import { formatRelativeTime, formatProjectCategory } from "@/lib/frontend/utils/format";

// Hook untuk mendapatkan waktu relatif hanya di client guna menghindari hydration mismatch
function useRelativeTime(date) {
  return useSyncExternalStore(
    () => () => {},
    () => formatRelativeTime(date),
    () => ""
  );
}

export default function LamaranItem({ item }) {
  const relativeTime = useRelativeTime(item.applied_at);
  const kategoriLabel = formatProjectCategory(item.kategori);

  let badgeClass = "bg-secondary-fixed text-on-secondary-fixed-variant";
  let statusText = "Pending";

  if (item.status === "diterima") {
    badgeClass = "bg-tertiary-fixed text-tertiary";
    statusText = "Diterima";
  } else if (item.status === "ditolak") {
    badgeClass = "bg-error-container text-on-error-container";
    statusText = "Ditolak";
  }

  return (
    <div className="rounded-2xl p-space-md bg-surface-container-low/60 hover:bg-surface-container-low transition-all duration-200 flex items-center justify-between">
      <div className="flex flex-col min-w-0 pr-space-sm">
        <span className="text-body-md font-semibold text-on-surface truncate">
          {item.judul || "Proyek"}
        </span>
        <span className="text-label-md text-on-surface-variant mt-0.5">
          Kategori: {kategoriLabel} • Diajukan {relativeTime || "..."}
        </span>
      </div>
      <span
        className={`shrink-0 text-pill-tag ${badgeClass} px-3 py-1 rounded-full font-semibold`}
      >
        {statusText}
      </span>
    </div>
  );
}
