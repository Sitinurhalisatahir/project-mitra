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

  const diterima = Number(lamaranPerStatus?.diterima || 0);
  const ditolak = Number(lamaranPerStatus?.ditolak || 0);
  const pending = Number(lamaranPerStatus?.pending || 0);
  const totalLamaran = diterima + ditolak + pending;

  // Hitung tingkat keberhasilan pencocokan dari lamaran (diterima / total) bila field eksplisit tidak ada
  let rate = null;
  if (typeof tingkatKeberhasilan === "number") {
    rate = tingkatKeberhasilan;
  } else if (totalLamaran > 0) {
    rate = Math.round((diterima / totalLamaran) * 100);
  }

  const isOptimal = rate !== null && rate >= 60;
  const badgeText = rate !== null ? (isOptimal ? "Optimal" : "Perlu Ditingkatkan") : "Belum Ada Data";
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
          {/* Total Lamaran Masuk */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-surface-container-low">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px] text-primary">
                send
              </span>
              <span className="text-label-md text-on-surface font-bold">
                Total Lamaran Tim
              </span>
            </div>
            <span className="text-title-lg text-on-surface font-extrabold">
              {totalLamaran.toLocaleString("id-ID")}
            </span>
          </div>

          {/* Breakdown Pills: Diterima vs Menunggu */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {diterima.toLocaleString("id-ID")} Diterima
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {pending.toLocaleString("id-ID")} Pending
            </div>
            {ditolak > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                {ditolak.toLocaleString("id-ID")} Ditolak
              </div>
            )}
          </div>

          {/* Algorithm status tag */}
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
