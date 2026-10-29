"use client";

import KategoriItem from "./KategoriItem";

export default function KategoriPanel({
  variant = "skill",
  items = [],
  loading = false,
  onAdd,
  onEdit,
  onDelete,
}) {
  const isSkill = variant === "skill";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between min-h-[580px]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isSkill
                  ? "bg-indigo-50 border border-indigo-100/60 text-indigo-600"
                  : "bg-amber-50 border border-amber-300 text-amber-500"
              }`}
            >
              <span className="material-symbols-outlined text-xl">explore</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  {isSkill ? "Kategori Skill" : "Kategori Minat"}
                </h2>
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isSkill
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100/60"
                      : "bg-amber-50 text-amber-600 border border-amber-300"
                  }`}
                >
                  {loading ? "..." : items.length}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSkill
                  ? "Daftar skill yang diverifikasi & dipetakan pada profil peserta."
                  : "Aspirasi topik proyek, industri, dan minat eksplorasi mahasiswa."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className={`px-3.5 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0 cursor-pointer ${
              isSkill
                ? "border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                : "border-amber-300 text-amber-600 hover:bg-amber-50"
            }`}
          >
            <span className="material-symbols-outlined text-base">add</span>
            <span>{isSkill ? "Tambah Skill" : "Tambah Minat"}</span>
          </button>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-2.5">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl bg-slate-100 animate-pulse"
              />
            ))
          ) : items.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Belum ada kategori
            </div>
          ) : (
            items.map((item) => (
              <KategoriItem
                key={item.tag_id}
                item={item}
                variant={variant}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400 text-xs">
          {isSkill ? "Status: Siap dipetakan" : "Status: Digunakan di kuesioner"}
        </span>
        <a
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`font-semibold text-xs flex items-center gap-1 ${
            isSkill
              ? "text-indigo-600 hover:text-indigo-700"
              : "text-amber-600 hover:text-amber-700"
          }`}
        >
          {isSkill ? "Kelola Alias Skill →" : "Atur Pembobotan →"}
        </a>
      </div>
    </div>
  );
}

