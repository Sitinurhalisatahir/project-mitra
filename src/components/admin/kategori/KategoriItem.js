"use client";

export default function KategoriItem({ item, variant = "skill", onEdit, onDelete }) {
  const isSkill = variant === "skill";

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-slate-50/80 border border-slate-100 transition-colors ${
        isSkill ? "hover:bg-indigo-50/40" : "hover:bg-amber-50/40"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span
          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
            isSkill ? "bg-indigo-600" : "bg-amber-500"
          }`}
        />
        <span
          className={`text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 ${
            isSkill
              ? "text-indigo-600 bg-indigo-100/70"
              : "text-amber-600 bg-amber-50"
          }`}
        >
          {isSkill ? "SKILL" : "MINAT"}
        </span>
        <span className="text-xs font-semibold text-slate-700 ml-1 truncate" title={item.nama_tag}>
          {item.nama_tag}
        </span>
      </div>
      <div className="flex items-center gap-1.5 shrink-0 ml-2">
        <button
          type="button"
          onClick={() => onEdit(item)}
          className={`px-2.5 py-1 text-xs font-semibold hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors flex items-center gap-1 cursor-pointer ${
            isSkill
              ? "text-indigo-600 hover:text-indigo-700"
              : "text-amber-600 hover:text-amber-700"
          }`}
        >
          <span className="material-symbols-outlined text-sm">edit</span>
          <span>Ubah</span>
        </button>
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-white rounded border border-transparent hover:border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">delete</span>
          <span>Hapus</span>
        </button>
      </div>
    </div>
  );
}

