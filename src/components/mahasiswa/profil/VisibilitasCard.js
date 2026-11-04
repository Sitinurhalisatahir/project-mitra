export default function VisibilitasCard({
  checked,
  onChange,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-body-lg text-on-surface font-semibold">
          Tampilkan profil ke pengguna lain
        </span>
        <span className="text-body-md text-on-surface-variant font-normal">
          Profil kamu dapat ditemukan oleh mahasiswa lain yang mencari rekan proyek.
        </span>
      </div>
      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
        <input
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
          id="toggle-visibilitas"
          type="checkbox"
        />
        <div className="w-14 h-8 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-surface-container-lowest after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-surface-container-lowest after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-primary-container shadow-inner" />
      </label>
    </div>
  );
}

