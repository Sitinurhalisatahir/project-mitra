export default function MatchPreview() {
  return (
    <div className="p-space-md rounded-[2rem] bg-surface-container-low/70 flex flex-col gap-space-sm mt-space-sm">
      <div className="flex items-center justify-between gap-space-xs">
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest shadow-sm">
          <span className="material-symbols-outlined text-primary-container text-[16px]">tune</span>
          <span className="text-label-md text-on-surface font-medium">Filter Cerdas</span>
        </div>
        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary-container text-on-secondary-fixed text-pill-tag font-bold shadow-[0_2px_8px_rgba(254,166,25,0.3)]">
          <span className="material-symbols-outlined text-[16px]">bolt</span>
          96% Match
        </div>
      </div>

      <div className="flex items-center justify-between p-2.5 rounded-[1rem] bg-surface-container-lowest">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-title-lg font-bold shadow-sm">
            AI
          </div>
          <div className="flex flex-col">
            <span className="text-body-md text-on-surface font-bold">Smart Match Engine</span>
            <span className="text-label-md text-on-surface-variant">3 Parameter Sangat Cocok</span>
          </div>
        </div>
        <span className="material-symbols-outlined text-tertiary-container text-[20px]">check_circle</span>
      </div>

      <div className="flex items-center gap-2 pt-space-xs">
        <div className="flex -space-x-2 overflow-hidden">
          <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" alt="Mitra 1" src="/images/avatar-2.jpg" />
          <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" alt="Mitra 2" src="/images/avatar-3.jpg" />
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary-fixed text-on-primary-fixed text-label-md font-bold ring-2 ring-white">
            +8
          </div>
        </div>
        <span className="text-label-md text-on-surface-variant font-medium">
          Mitra direkomendasikan hari ini
        </span>
      </div>
    </div>
  );
}