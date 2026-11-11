"use client";

import Link from "next/link";
import {
  formatProjectCategory,
  formatShortDateIndonesian,
  formatRelativeTime,
} from "@/lib/frontend/utils/format";

export default function LamaranPendingCard({ aplikasi, onBatal }) {
  const isPending = aplikasi.status === "pending";
  const isDitolak = aplikasi.status === "ditolak";

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm border border-outline-variant/30 flex flex-col justify-between gap-space-md hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-space-sm">
        {/* Top badges */}
        <div className="flex items-center justify-between gap-space-xs flex-wrap">
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant text-label-md font-semibold">
            {formatProjectCategory(aplikasi.kategori)}
          </span>

          {isPending ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed text-label-md font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary-container"></span>
              Menunggu Respon
            </span>
          ) : isDitolak ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-error-container text-error text-label-md font-semibold">
              Tidak Diterima
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-primary text-label-md font-bold">
              Diterima
            </span>
          )}
        </div>

        {/* Project Title */}
        <Link
          href={`/proyek/${aplikasi.proyek_id}`}
          className="text-title-lg font-bold text-on-surface hover:text-primary transition-colors leading-snug line-clamp-2"
        >
          {aplikasi.judul}
        </Link>

        {/* Motivation note sent by user */}
        {aplikasi.pesan && (
          <div className="p-space-sm rounded-2xl bg-surface-container-low flex flex-col gap-1">
            <span className="text-xs font-semibold text-on-surface-variant">Pesan Lamaran Anda:</span>
            <p className="text-body-md text-on-surface italic line-clamp-2">
              &quot;{aplikasi.pesan}&quot;
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-space-xs pt-space-xs border-t border-outline-variant/20 flex-wrap">
        <span className="text-xs text-on-surface-variant">
          Diajukan: {formatShortDateIndonesian(aplikasi.applied_at)} ({formatRelativeTime(aplikasi.applied_at)})
        </span>

        <div className="flex items-center gap-space-xs">
          {isPending && onBatal && (
            <button
              type="button"
              onClick={() => onBatal(aplikasi.aplikasi_id)}
              className="px-3 py-1.5 rounded-full text-error hover:bg-error-container text-label-md font-semibold transition-colors cursor-pointer"
            >
              Batalkan
            </button>
          )}

          <Link
            href={`/proyek/${aplikasi.proyek_id}`}
            className="px-3.5 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface text-label-md font-semibold transition-colors"
          >
            Lihat Proyek
          </Link>
        </div>
      </div>
    </div>
  );
}

