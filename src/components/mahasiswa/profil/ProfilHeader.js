export default function ProfilHeader() {
  return (
    <section className="flex flex-col gap-space-xs">
      <div className="flex items-center gap-space-xs">
        <span className="text-label-md text-primary bg-primary-fixed px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
          Akun Mahasiswa
        </span>
        <span className="text-outline-variant text-label-md">•</span>
        <span className="text-label-md text-on-surface-variant font-medium">
          Preferensi Kolaborasi
        </span>
      </div>
      <h1 className="text-headline-xl text-on-surface font-extrabold tracking-tight">
        Profil Saya
      </h1>
      <p className="text-body-md text-on-surface-variant max-w-2xl font-normal">
        Kelola data akademik, keahlian, dan portofolio untuk meningkatkan kecocokan kolaborasi proyek kampus.
      </p>
    </section>
  );
}

