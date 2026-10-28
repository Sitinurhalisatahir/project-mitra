import Image from "next/image";

export default function ProfilPreview() {
  const skills = ["UI/UX Design", "Frontend", "React.js"];

  return (
    <div className="p-space-md rounded-[2rem] bg-surface-container-low/70 flex flex-col gap-space-sm mt-space-sm">
      <div className="flex items-center gap-space-sm">
        <div className="relative">
          <Image
            className="w-11 h-11 rounded-full object-cover shadow-sm"
            alt="Foto Ahmad Rizky"
            src="/images/avatar-1.svg"
            width={44}
            height={44}
          />
          <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-tertiary-container shadow-[0_0_0_2px_#ffffff]"></div>
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-body-md text-on-surface font-bold truncate">Ahmad Rizky</span>
          <span className="text-label-md text-on-surface-variant">Teknik Informatika • Sem 5</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 pt-space-xs">
        {skills.map((s) => (
          <span key={s} className="px-2.5 py-1 rounded-full bg-primary-fixed text-primary text-label-md font-medium">
            {s}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-space-xs">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed-variant text-label-md font-semibold">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          Tersedia 10 jam/minggu
        </span>
        <span className="text-label-md text-tertiary-container font-semibold flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[14px]">verified</span>
          Aktif
        </span>
      </div>
    </div>
  );
}
