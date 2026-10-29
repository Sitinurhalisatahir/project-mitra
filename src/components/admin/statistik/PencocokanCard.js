import CardFooterNote from "./CardFooterNote";

export default function PencocokanCard({
  tingkatKeberhasilan = null,
  lamaranPerStatus = {},
  loading = false,
}) {
  if (loading) {
    return (
      <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm animate-pulse">
        <div>
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-slate-200" />
            <div className="w-24 h-6 rounded-full bg-slate-200" />
          </div>
          <div className="space-y-2 mb-6">
            <div className="h-4 w-48 bg-slate-200 rounded" />
            <div className="h-12 w-20 bg-slate-200 rounded" />
          </div>
          <div className="space-y-4 pt-4">
            <div className="h-12 rounded-2xl bg-slate-100" />
            <div className="h-8 rounded-full bg-slate-100" />
            <div className="h-8 rounded-full bg-slate-100" />
          </div>
        </div>
        <div className="mt-8 pt-4 h-10 w-full bg-slate-100 rounded-full" />
      </div>
    );
  }

  // Hitung tingkat keberhasilan pencocokan dari lamaran (diterima / total) bila field eksplisit tidak ada
  let rate = null;
  if (typeof tingkatKeberhasilan === "number") {
    rate = tingkatKeberhasilan;
  } else {
    const diterima = lamaranPerStatus?.diterima || 0;
    const ditolak = lamaranPerStatus?.ditolak || 0;
    const pending = lamaranPerStatus?.pending || 0;
    const totalLamaran = diterima + ditolak + pending;
    if (totalLamaran > 0) {
      rate = Math.round((diterima / totalLamaran) * 100);
    }
  }

  const isOptimal = rate !== null && rate >= 80;
  const badgeText = isOptimal ? "Optimal" : "Perlu Ditingkatkan";
  const displayRate = rate !== null ? `${rate}%` : "-";

  return (
    <div className="flex flex-col justify-between p-8 rounded-[2rem] bg-surface-container-lowest shadow-sm hover:shadow-md transition-all duration-300">
      <div>
        {/* Card Header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
            <span className="material-symbols-outlined text-[26px]">task_alt</span>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-fixed text-primary text-label-md font-bold">
            <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
            {badgeText}
          </span>
        </div>

        {/* Label & Big Number */}
        <div className="space-y-1 mb-6">
          <h2 className="text-title-lg text-on-surface-variant font-semibold tracking-normal">
            Tingkat Keberhasilan Pencocokan
          </h2>
          <div className="text-display-lg text-primary font-extrabold tracking-tight">
            {displayRate}
          </div>
        </div>

        {/* Micro-stats / Breakdown Section */}
        <div className="space-y-4 pt-4">
          {/* Kepuasan Rating Pill (Data tidak tersedia -> Bintang tanpa isi dan nilai "- / 5.0") */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-container-low">
            <div className="flex items-center gap-2">
              <div className="flex text-slate-300">
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  star
                </span>
                <span
                  className="material-symbols-outlined text-[18px]"
                  style={{ fontVariationSettings: "'FILL' 0" }}
                >
                  star
                </span>
              </div>
              <span className="text-label-md text-on-surface font-bold">
                Kepuasan Tim
              </span>
            </div>
            <span className="text-title-lg text-on-surface font-extrabold">
              -{" "}
              <span className="text-label-md text-on-surface-variant font-medium">
                / 5.0
              </span>
            </span>
          </div>

          {/* Match Speed (Data tidak tersedia -> "-") */}
          <div className="flex items-center justify-between py-1.5 px-3 rounded-full bg-surface-container-low text-on-surface-variant text-label-md">
            <span className="font-medium">Kecepatan Pencocokan</span>
            <span className="font-bold text-on-surface">-</span>
          </div>

          {/* Algorithm status tag (Teks statis) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface-variant text-label-md">
            <span className="material-symbols-outlined text-[16px] text-tertiary">
              check_circle
            </span>
            <span className="truncate">
              Taksonomi skill & preferensi minat saling selaras
            </span>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <CardFooterNote
        icon="psychology"
        iconColor="text-primary"
        text="Didukung model kolaboratif berbasis afinitas peran"
      />
    </div>
  );
}

