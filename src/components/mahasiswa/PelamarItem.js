import { getInitials } from "@/lib/frontend/utils/format";

const AVATAR_PALETTES = [
  { bg: "bg-primary-fixed", text: "text-primary" },
  { bg: "bg-secondary-fixed", text: "text-secondary" },
  { bg: "bg-tertiary-fixed", text: "text-tertiary" },
  { bg: "bg-inverse-primary", text: "text-primary" },
];

function getAvatarPalette(id) {
  const num = Number(id) || 0;
  return AVATAR_PALETTES[Math.abs(num) % AVATAR_PALETTES.length];
}

export default function PelamarItem({ item }) {
  const initials = getInitials(item.nama);
  const palette = getAvatarPalette(item.pengguna_id);

  return (
    <div className="rounded-2xl p-space-md bg-surface-container-low/60 hover:bg-surface-container-low transition-all duration-200 flex items-center justify-between">
      <div className="flex items-center gap-space-sm min-w-0 pr-space-sm">
        <div
          className={`w-9 h-9 rounded-full ${palette.bg} ${palette.text} font-bold text-xs flex items-center justify-center shrink-0`}
        >
          {initials}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-body-md font-bold text-on-surface truncate leading-tight">
            {item.nama}
          </span>
          <span className="text-label-md text-on-surface-variant mt-0.5 truncate">
            {item.jurusan || "-"} •{" "}
            <span className="text-primary-container font-semibold">
              Proyek: {item.judul_proyek || "-"}
            </span>
          </span>
        </div>
      </div>
      <button
        type="button"
        title="Segera tersedia"
        className="shrink-0 bg-secondary-container hover:bg-secondary text-on-primary font-semibold px-4 py-1.5 rounded-2xl text-xs shadow-sm transition-all duration-200 cursor-default"
      >
        Tinjau
      </button>
    </div>
  );
}

