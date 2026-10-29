export default function StatistikHeader({
  relativeTime = "baru saja",
  isSuccess = true,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
      <div className="flex flex-col gap-2 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low w-fit">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span className="text-label-md text-on-surface-variant font-semibold">
            Terakhir diperbarui: {relativeTime}
          </span>
        </div>
        <h1 className="text-headline-xl text-on-surface font-extrabold tracking-tight">
          Statistik Penggunaan Platform
        </h1>
        <p className="text-body-lg text-on-surface-variant">
          Pemantauan komprehensif metrik keterlibatan mahasiswa, proyek kolaborasi, dan efektivitas algoritma pencocokan SkillMatch.
        </p>
      </div>
      {/* Quick Action / Status Highlight Pill */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 bg-surface-container-lowest px-4 py-2.5 rounded-full shadow-sm">
          <span
            className={`material-symbols-outlined text-[20px] ${
              isSuccess ? "text-primary" : "text-red-600"
            }`}
          >
            verified
          </span>
          <span
            className={`text-label-md font-semibold ${
              isSuccess ? "text-on-surface" : "text-red-600"
            }`}
          >
            {isSuccess ? "Sistem Normal" : "Terjadi gangguan"}
          </span>
          {isSuccess && (
            <span className="text-label-md text-on-surface-variant">
              • Terhubung
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

