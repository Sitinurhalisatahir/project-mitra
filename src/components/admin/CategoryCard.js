import Link from "next/link";
import { IconLayers } from "./icons";
import TagPill from "./TagPill";

export default function CategoryCard({
  tags = [],
  totalCount = 0,
  loading = false,
}) {
  const countLabel = totalCount > 0 ? totalCount : tags.length;

  return (
    <div
      className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col justify-between"
      data-purpose="taxonomy-overview"
    >
      <div>
        {/* Header with Title & Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-50">
          <div className="flex items-center space-x-2">
            <IconLayers className="w-4 h-4 text-brand-600" />
            <h2 className="text-sm font-bold text-slate-900">Kategori Skill/Minat Terbaru</h2>
          </div>
          <span className="px-2.5 py-0.5 text-[11px] font-semibold text-brand-600 bg-indigo-50 rounded-full border border-indigo-100">
            {countLabel} Kategori
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-500 mt-4 leading-relaxed font-normal">
          Daftar taksonomi keahlian dan minat yang baru ditambahkan ke algoritma pencocokan:
        </p>

        {/* Tags Grid List */}
        <div className="mt-5 flex flex-wrap gap-2.5" data-purpose="pill-tags-list">
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-7 w-24 bg-slate-100 rounded-full animate-pulse"
              />
            ))
          ) : tags.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 font-medium w-full">
              Belum ada kategori skill atau minat
            </div>
          ) : (
            tags.map((tag) => <TagPill key={tag.tag_id} tag={tag} />)
          )}
        </div>
      </div>

      {/* Right Card Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">
          Sinkronisasi otomatis dengan katalog minat
        </span>
        <Link
          href="/admin/kategori"
          className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center space-x-1 group"
        >
          <span>Kelola Kategori</span>
          <span className="group-hover:translate-x-0.5 transition-transform">→</span>
        </Link>
      </div>
    </div>
  );
}

