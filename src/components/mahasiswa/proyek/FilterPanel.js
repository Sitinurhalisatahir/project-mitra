"use client";

export default function FilterPanel({
  filter,
  onChange,
  onReset,
  onSubmit,
}) {
  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm flex flex-col gap-space-lg sticky top-24">
        {/* Header Filter */}
        <div className="flex items-center justify-between pb-space-sm">
          <div className="flex items-center gap-space-sm">
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
            <span className="text-title-lg text-on-surface font-semibold">Filter</span>
          </div>
          <button
            onClick={onReset}
            className="text-label-md text-primary hover:underline cursor-pointer font-semibold"
            type="button"
          >
            Reset
          </button>
        </div>

        {/* Kategori Proyek */}
        <div className="flex flex-col gap-space-sm">
          <label className="text-label-md text-on-surface uppercase tracking-wider font-semibold">
            Kategori Proyek
          </label>
          <div className="flex flex-col gap-space-xs">
            <label className="flex items-center gap-space-sm p-space-sm rounded-2xl hover:bg-surface-container-low cursor-pointer transition-colors group">
              <input
                checked={filter.kategori === "tugas_kuliah"}
                onChange={() => onChange("kategori", "tugas_kuliah")}
                className="w-4 h-4 text-primary accent-primary focus:ring-primary"
                name="kategori"
                type="radio"
                value="tugas_kuliah"
              />
              <span className={`text-body-md transition-colors font-medium ${
                filter.kategori === "tugas_kuliah"
                  ? "text-on-surface group-hover:text-primary"
                  : "text-on-surface-variant group-hover:text-on-surface"
              }`}>
                Tugas Kuliah
              </span>
            </label>
            <label className="flex items-center gap-space-sm p-space-sm rounded-2xl hover:bg-surface-container-low cursor-pointer transition-colors group">
              <input
                checked={filter.kategori === "lomba"}
                onChange={() => onChange("kategori", "lomba")}
                className="w-4 h-4 text-primary accent-primary focus:ring-primary"
                name="kategori"
                type="radio"
                value="lomba"
              />
              <span className={`text-body-md transition-colors font-medium ${
                filter.kategori === "lomba"
                  ? "text-on-surface group-hover:text-primary"
                  : "text-on-surface-variant group-hover:text-on-surface"
              }`}>
                Lomba
              </span>
            </label>
            <label className="flex items-center gap-space-sm p-space-sm rounded-2xl hover:bg-surface-container-low cursor-pointer transition-colors group">
              <input
                checked={filter.kategori === "personal"}
                onChange={() => onChange("kategori", "personal")}
                className="w-4 h-4 text-primary accent-primary focus:ring-primary"
                name="kategori"
                type="radio"
                value="personal"
              />
              <span className={`text-body-md transition-colors font-medium ${
                filter.kategori === "personal"
                  ? "text-on-surface group-hover:text-primary"
                  : "text-on-surface-variant group-hover:text-on-surface"
              }`}>
                Personal
              </span>
            </label>
          </div>
        </div>

        {/* Skill Dibutuhkan */}
        <div className="flex flex-col gap-space-sm">
          <label
            className="text-label-md text-on-surface uppercase tracking-wider font-semibold"
            htmlFor="filter-skill"
          >
            Skill Dibutuhkan
          </label>
          <div className="relative flex items-center">
            <input
              className="w-full bg-surface-container-low text-on-surface placeholder:text-on-surface-variant/60 text-body-md rounded-2xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all"
              id="filter-skill"
              placeholder="Contoh: React, UI/UX, Python..."
              type="text"
              value={filter.skill}
              onChange={(e) => onChange("skill", e.target.value)}
            />
          </div>
        </div>

        {/* Deadline Proyek */}
        <div className="flex flex-col gap-space-sm">
          <label
            className="text-label-md text-on-surface uppercase tracking-wider font-semibold"
            htmlFor="filter-deadline"
          >
            Deadline Proyek
          </label>
          <div className="relative flex items-center">
            <input
              className="w-full bg-surface-container-low text-on-surface text-body-md rounded-2xl px-space-md py-3 focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
              id="filter-deadline"
              type="date"
              value={filter.deadline}
              onChange={(e) => onChange("deadline", e.target.value)}
            />
          </div>
        </div>

        {/* Button Terapkan Filter */}
        <button
          onClick={onSubmit}
          className="mt-space-xs w-full py-3 px-space-md rounded-full bg-primary hover:bg-primary-container text-on-primary text-body-lg font-semibold text-center transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-space-xs cursor-pointer"
          type="button"
        >
          <span>Terapkan Filter</span>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>
      </div>
    </aside>
  );
}

