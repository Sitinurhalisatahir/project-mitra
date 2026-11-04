"use client";

import RekomendasiRow from "./RekomendasiRow";

export default function RekomendasiPanel({
  rekomendasi = [],
  loading = false,
  error = null,
  proyekJudul = "",
  onInvite,
}) {
  const displayItems = rekomendasi.slice(0, 3);

  return (
    <div className="bg-surface-container-lowest rounded-[2rem] p-space-xl shadow-sm flex flex-col gap-space-md">
      <div className="flex flex-col gap-0.5">
        <h3 className="text-title-lg font-bold text-on-surface">
          Rekomendasi Calon Mitra untuk Proyek Ini
        </h3>
        <p className="text-body-md text-on-surface-variant">
          Mahasiswa dengan skill yang cocok dengan kriteria proyek Anda
        </p>
      </div>

      <div className="flex flex-col gap-space-sm">
        {loading ? (
          <div className="flex flex-col gap-2 py-2">
            <div className="h-16 rounded-2xl bg-surface-container-low animate-pulse" />
            <div className="h-16 rounded-2xl bg-surface-container-low animate-pulse" />
            <div className="h-16 rounded-2xl bg-surface-container-low animate-pulse" />
          </div>
        ) : error ? (
          <p className="text-body-md text-error text-center py-4">{error}</p>
        ) : displayItems.length === 0 ? (
          <p className="text-body-md text-on-surface-variant text-center py-6">
            Belum ada rekomendasi untuk proyek ini
          </p>
        ) : (
          displayItems.map((mitra) => (
            <RekomendasiRow
              key={mitra.pengguna_id}
              mitra={mitra}
              proyekJudul={proyekJudul}
              onInvite={onInvite}
            />
          ))
        )}
      </div>
    </div>
  );
}

