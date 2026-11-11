"use client";

export default function ProyekTergabungHeader({
  totalTergabung = 0,
  totalAktif = 0,
  totalPending = 0,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-space-xs">
          <div className="w-10 h-10 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center shadow-sm">
            <span className="material-symbols-outlined text-[22px]">groups</span>
          </div>
          <div>
            <h1 className="text-headline-md font-bold text-on-surface tracking-tight">
              Proyek Tergabung
            </h1>
            <p className="text-body-md text-on-surface-variant">
              Daftar proyek kolaborasi di mana Anda telah bergabung sebagai anggota tim
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-space-sm flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary"></span>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface-variant font-medium">Tergabung</span>
            <span className="text-title-lg text-on-surface font-bold leading-tight">
              {totalTergabung} Proyek
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="w-2.5 h-2.5 rounded-full bg-primary"></span>
          <div className="flex flex-col">
            <span className="text-label-md text-on-surface-variant font-medium">Masih Aktif</span>
            <span className="text-title-lg text-on-surface font-bold leading-tight">
              {totalAktif} Proyek
            </span>
          </div>
        </div>

        {totalPending > 0 && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
            <div className="flex flex-col">
              <span className="text-label-md text-on-surface-variant font-medium">Menunggu</span>
              <span className="text-title-lg text-on-surface font-bold leading-tight">
                {totalPending} Lamaran
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

