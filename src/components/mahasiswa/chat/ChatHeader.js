export default function ChatHeader({ activeCount = 0 }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-xs">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-label-md text-primary font-bold uppercase tracking-wider">
            SkillMatch Hub
          </span>
          <span className="text-outline-variant text-label-md">/</span>
          <span className="text-label-md text-on-surface-variant">
            Komunikasi Proyek
          </span>
        </div>
        <h1 className="text-headline-md text-on-surface font-extrabold tracking-tight mt-0.5">
          Chat &amp; Diskusi
        </h1>
        <p className="text-body-md text-on-surface-variant">
          Kolaborasi langsung dengan rekan satu tim dan koordinator proyek kampus.
        </p>
      </div>

      {/* Quick Status Pill & Badge */}
      <div className="flex items-center gap-space-sm self-start sm:self-auto">
        <div className="flex items-center gap-2 px-space-md py-1.5 rounded-full bg-surface-container-low shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse"></span>
          <span className="text-label-md font-semibold text-on-surface">
            {activeCount} Percakapan Aktif
          </span>
        </div>
      </div>
    </div>
  );
}

