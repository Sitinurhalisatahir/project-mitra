export default function DataDasarCard({
  formData,
  errors,
  onChange,
  onPhotoError,
}) {
  return (
    <div className="bg-surface-container-lowest rounded-[2rem] shadow-sm p-6 flex flex-col gap-space-md">
      {/* Header Card */}
      <div className="flex items-start gap-space-md pb-space-xs border-b border-surface-container-low">
        <div className="w-11 h-11 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0 text-primary">
          <span className="material-symbols-outlined text-[24px]">school</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-title-lg text-on-surface font-semibold">Data Dasar</h2>
          <p className="text-body-md text-on-surface-variant font-normal">
            Informasi identitas akademik dan alokasi waktu kamu.
          </p>
        </div>
      </div>

      {/* Foto Profil */}
      <div className="flex flex-col sm:flex-row items-center gap-space-md p-4 rounded-2xl bg-surface-container-low/60">
        <div className="relative flex-shrink-0">
          <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center text-primary shadow-inner border-2 border-surface-container-lowest overflow-hidden">
            {formData.foto ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={formData.foto}
                alt="Foto Profil"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="material-symbols-outlined text-[40px]">account_circle</span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1.5 text-center sm:text-left flex-1">
          <span className="text-body-lg text-on-surface font-semibold">Foto Profil</span>
          <p className="text-label-md text-on-surface-variant">Format JPG, PNG atau WebP (Maks. 2MB)</p>
          <div className="flex items-center gap-2 mt-1 justify-center sm:justify-start">
            <label
              htmlFor="input-foto-profil"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-container text-on-primary text-pill-tag cursor-pointer transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">photo_camera</span>
              {formData.foto ? "Ganti Foto" : "Unggah Foto"}
              <input
                type="file"
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                id="input-foto-profil"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    if (onPhotoError) onPhotoError("Ukuran foto maksimal 2MB");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    onChange("foto", event.target.result);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {formData.foto && (
              <button
                type="button"
                onClick={() => onChange("foto", "")}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-outline-variant/60 text-pill-tag text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">delete</span>
                Hapus
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields: Nama & NIM */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface font-semibold" htmlFor="input-nama-lengkap">
            Nama Lengkap
          </label>
          <input
            className={`w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md rounded-2xl px-4 py-2.5 outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all ${
              errors?.nama ? "border border-red-500" : ""
            }`}
            id="input-nama-lengkap"
            placeholder="Contoh: Ahmad Fauzi"
            type="text"
            value={formData.nama || ""}
            onChange={(e) => onChange("nama", e.target.value)}
          />
          {errors?.nama && (
            <span className="text-xs text-red-600">{errors.nama}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface font-semibold" htmlFor="input-nim">
            NIM
          </label>
          <input
            readOnly
            title="NIM tidak dapat diubah"
            className="w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md rounded-2xl px-4 py-2.5 outline-none cursor-not-allowed opacity-80 transition-all"
            id="input-nim"
            placeholder="Contoh: 22010182"
            type="text"
            value={formData.nim || ""}
          />
          {errors?.nim && (
            <span className="text-xs text-red-600">{errors.nim}</span>
          )}
        </div>
      </div>

      {/* Form Fields: Jurusan & Angkatan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface font-semibold" htmlFor="input-jurusan">
            Jurusan
          </label>
          <input
            className={`w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md rounded-2xl px-4 py-2.5 outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all ${
              errors?.jurusan ? "border border-red-500" : ""
            }`}
            id="input-jurusan"
            placeholder="Contoh: Teknik Informatika"
            type="text"
            value={formData.jurusan || ""}
            onChange={(e) => onChange("jurusan", e.target.value)}
          />
          {errors?.jurusan && (
            <span className="text-xs text-red-600">{errors.jurusan}</span>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-label-md text-on-surface font-semibold" htmlFor="input-angkatan">
            Angkatan
          </label>
          <input
            className={`w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md rounded-2xl px-4 py-2.5 outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all ${
              errors?.angkatan ? "border border-red-500" : ""
            }`}
            id="input-angkatan"
            placeholder="Contoh: 2022, 2023"
            type="number"
            value={formData.angkatan ?? ""}
            onChange={(e) => onChange("angkatan", e.target.value ? parseInt(e.target.value) : null)}
          />
          {errors?.angkatan && (
            <span className="text-xs text-red-600">{errors.angkatan}</span>
          )}
        </div>
      </div>

      {/* Form Field: Ketersediaan Waktu */}
      <div className="flex flex-col gap-1.5">
        <label className="text-label-md text-on-surface font-semibold" htmlFor="input-ketersediaan">
          Ketersediaan Waktu
        </label>
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-[20px]">
            schedule
          </span>
          <input
            className={`w-full bg-surface-container-low text-on-surface placeholder:text-outline text-body-md rounded-2xl pl-10 pr-4 py-2.5 outline-none focus:bg-surface-container-lowest focus:shadow-[0_0_0_2px_#4f46e5] transition-all ${
              errors?.ketersediaan_waktu ? "border border-red-500" : ""
            }`}
            id="input-ketersediaan"
            placeholder="10 - 15 jam/minggu, Fleksibel di akhir pekan"
            type="text"
            value={formData.ketersediaan_waktu || ""}
            onChange={(e) => onChange("ketersediaan_waktu", e.target.value)}
          />
        </div>
        {errors?.ketersediaan_waktu && (
          <span className="text-xs text-red-600">{errors.ketersediaan_waktu}</span>
        )}
      </div>
    </div>
  );
}
