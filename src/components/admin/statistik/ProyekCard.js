import CardFooterNote from "./CardFooterNote";

const KATEGORI_LABELS = {
  tugas_kuliah: "Tugas Kuliah",
  lomba: "Lomba",
  personal: "Personal",
};

export default function ProyekCard({
  proyekPerStatus = {},
  proyekPerKategori = {},
  lamaranPerStatus = {},
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm animate-pulse">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="w-28 h-6 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 w-32 bg-slate-200 rounded" />
            <div className="h-12 w-24 bg-slate-200 rounded" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <div className="h-7 w-32 rounded-full bg-slate-200" />
              <div className="h-7 w-24 rounded-full bg-slate-200" />
            </div>
            <div className="space-y-2 pt-1">
              <div className="h-8 rounded-full bg-slate-100" />
              <div className="h-8 rounded-full bg-slate-100" />
            </div>
          </div>
        </div>
        <div className="mt-8 pt-4 h-10 w-full bg-slate-100 rounded-full" />
      </div>
    );
  }

  const bukaCount = proyekPerStatus?.buka || 0;
  const selesaiCount = proyekPerStatus?.selesai || 0;
  const ditutupCount = proyekPerStatus?.ditutup || 0;
  const totalProyek = bukaCount + selesaiCount + ditutupCount;

  // Kategori terbanyak
  let maxCat = null;
  let maxVal = 0;
  if (proyekPerKategori && typeof proyekPerKategori === "object") {
    for (const [cat, count] of Object.entries(proyekPerKategori)) {
      const num = Number(count) || 0;
      if (num > maxVal) {
        maxVal = num;
        maxCat = cat;
      }
    }
  }

  const persenCat = totalProyek > 0 && maxVal > 0 ? Math.round((maxVal / totalProyek) * 100) : 0;
  const kategoriTerbanyakStr =
    maxCat && totalProyek > 0
      ? `${KATEGORI_LABELS[maxCat] || maxCat} (${persenCat}%)`
      : "-";

  // Ukuran tim rata-rata (pelamar diterima per proyek)
  const pelamarDiterima = lamaranPerStatus?.diterima || 0;
  const ukuranTimRataRataStr =
    totalProyek > 0 && pelamarDiterima > 0
      ? `${(pelamarDiterima / totalProyek).toFixed(1)} Mahasiswa / Tim`
      : "-";

  const persenSelesai =
    totalProyek > 0 ? Math.round((selesaiCount / totalProyek) * 100) : 0;

  return (
    <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">folder_copy</span>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-fixed/50 text-secondary text-label-md font-bold">
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            {bukaCount.toLocaleString("id-ID")} proyek dibuka
          </span>
        </div>

        {/* Label & Big Number */}
        <div className="space-y-1 mb-6">
          <h2 className="text-title-lg text-on-surface-variant font-semibold tracking-normal">
            Jumlah Proyek
          </h2>
          <div className="text-display-lg text-on-surface font-extrabold tracking-tight">
            {totalProyek.toLocaleString("id-ID")}
          </div>
        </div>

        {/* Micro-stats / Breakdown Section */}
        <div className="space-y-4 pt-4">
          {/* Badges breakdown */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-secondary-container" />
              {bukaCount.toLocaleString("id-ID")} Proyek Dibuka
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-tertiary" />
              {selesaiCount.toLocaleString("id-ID")} Selesai
            </div>
          </div>

          {/* Proyek Meta List */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between py-1.5 px-3 rounded-full bg-surface-container-low text-on-surface-variant text-label-md">
              <span className="font-medium">Kategori Terbanyak</span>
              <span className="font-bold text-on-surface">
                {kategoriTerbanyakStr}
              </span>
            </div>
            <div className="flex items-center justify-between py-1.5 px-3 rounded-full bg-surface-container-low text-on-surface-variant text-label-md">
              <span className="font-medium">Ukuran Tim Rata-rata</span>
              <span className="font-bold text-on-surface">
                {ukuranTimRataRataStr}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <CardFooterNote
        icon="rocket_launch"
        iconColor="text-secondary"
        text={`${persenSelesai}% proyek sudah selesai`}
      />
    </div>
  );
}

