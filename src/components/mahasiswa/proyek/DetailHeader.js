import Link from "next/link";
import { formatProjectCategory } from "@/lib/frontend/utils/format";

export default function DetailHeader({ proyek }) {
  const kategoriLabel = formatProjectCategory(proyek?.kategori);

  return (
    <div className="flex flex-col gap-6">
      {/* Breadcrumb / Back Link Navigation */}
      <div className="flex items-center">
        <Link
          href="/proyek"
          className="inline-flex items-center gap-2 text-body-md font-semibold text-primary hover:text-primary-container transition-colors group"
        >
          <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
            arrow_back
          </span>
          <span>Kembali ke Pencarian</span>
        </Link>
      </div>

      {/* Title & Category Badge */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-pill-tag bg-surface-container text-primary px-3.5 py-1 rounded-full font-semibold">
            <span className="material-symbols-outlined text-[14px]">emoji_events</span>
            {kategoriLabel}
          </span>
        </div>
        <h1 className="text-headline-xl text-on-surface font-bold tracking-tight">
          {proyek?.judul}
        </h1>
      </div>
    </div>
  );
}

