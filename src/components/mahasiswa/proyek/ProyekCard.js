import Link from "next/link";
import { formatShortDateIndonesian, formatProjectCategory } from "@/lib/frontend/utils/format";

export default function ProyekCard({ proyek }) {
  const kategori = proyek.kategori || "personal";
  const kategoriLabel = formatProjectCategory(kategori);

  let badgeColor = "bg-surface-container-high text-primary";
  let groupIconColor = "text-primary";

  if (kategori === "tugas_kuliah" || kategori === "tugas") {
    badgeColor = "bg-primary-fixed text-primary";
    groupIconColor = "text-primary";
  } else if (kategori === "lomba") {
    badgeColor = "bg-secondary-fixed text-secondary";
    groupIconColor = "text-secondary";
  }

  const slotTerisi = proyek.slot_terisi !== undefined ? proyek.slot_terisi : 0;
  const slotDibutuhkan = proyek.slot_dibutuhkan || 1;
  const deadlineText = proyek.deadline
    ? formatShortDateIndonesian(proyek.deadline)
    : "Tanpa deadline";

  const tags = Array.isArray(proyek.tags) ? proyek.tags : [];

  return (
    <article className="bg-surface-container-lowest rounded-[2rem] p-space-lg shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
      <div className="flex flex-col">
        {/* Card Header: Kategori, Slot, Deadline */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-sm">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-pill-tag font-semibold ${badgeColor}`}
          >
            {kategoriLabel}
          </span>
          <div className="flex items-center gap-space-sm">
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface text-label-md font-semibold">
              <span className={`material-symbols-outlined ${groupIconColor} text-[16px]`}>
                group
              </span>
              <span>
                Slot: {slotTerisi}/{slotDibutuhkan}
              </span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-space-sm py-1 rounded-full bg-surface-container-low text-on-surface-variant text-label-md font-medium">
              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                calendar_today
              </span>
              <span>{deadlineText}</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-title-lg md:text-headline-md text-on-surface font-bold group-hover:text-primary transition-colors mb-space-xs leading-snug">
          {proyek.judul}
        </h3>

        {/* Description */}
        <p className="text-body-md text-on-surface-variant line-clamp-2 mb-space-lg leading-relaxed">
          {proyek.deskripsi || "Belum ada deskripsi."}
        </p>
      </div>

      {/* Card Footer: Tags & Action */}
      <div className="flex flex-wrap items-center justify-between gap-space-md pt-space-sm">
        <div className="flex flex-wrap items-center gap-space-xs">
          {tags.map((t) => (
            <span
              key={t.tag_id || t.nama_tag}
              className="px-3 py-1 rounded-full bg-surface-container text-primary text-label-md font-semibold"
            >
              {t.nama_tag}
            </span>
          ))}
        </div>
        <Link
          href={`/proyek/${proyek.proyek_id}`}
          className="inline-flex items-center justify-center px-space-lg py-2.5 rounded-full bg-primary-fixed text-primary hover:bg-primary hover:text-on-primary text-body-md font-semibold transition-all"
        >
          Lihat Detail
        </Link>
      </div>
    </article>
  );
}

