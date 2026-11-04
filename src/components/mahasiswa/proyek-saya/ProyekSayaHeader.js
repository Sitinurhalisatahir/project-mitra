export default function ProyekSayaHeader() {
  return (
    <section className="flex flex-col gap-space-xs mb-space-sm">
      <div className="inline-flex items-center gap-space-xs self-start">
        <span className="bg-surface-container-high text-primary px-space-sm py-0.5 rounded-full text-label-md font-semibold tracking-wider uppercase">
          PROYEK MAHASISWA • Manajemen Tim &amp; Kolaborasi
        </span>
      </div>
      <h1 className="text-headline-xl text-on-surface font-extrabold tracking-tight">
        Kelola Proyek Saya
      </h1>
      <p className="text-body-lg text-on-surface-variant max-w-3xl">
        Kelola rekrutmen tim proyek Anda, tinjau pelamar mahasiswa, dan temukan
        rekomendasi calon mitra yang sesuai kriteria.
      </p>
    </section>
  );
}

