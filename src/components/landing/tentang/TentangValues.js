const values = [
  {
    icon: "target",
    title: "Presisi & Relevansi",
    desc: "Pencocokan didasarkan pada portofolio dan keahlian riil, bukan sekadar algoritma acak.",
    badge: "Akurasi Tinggi",
  },
  {
    icon: "groups_3",
    title: "Inklusif & Terbuka",
    desc: "Menghubungkan mahasiswa lintas kampus, fakultas, dan jurusan tanpa batasan birokrasi.",
    badge: "Lintas Disiplin",
  },
  {
    icon: "bolt",
    title: "Efisien & Cepat",
    desc: "Menghemat waktu pencarian anggota tim dari berminggu-minggu menjadi hitungan hari.",
    badge: "Hemat Waktu",
  },
  {
    icon: "verified_user",
    title: "Transparan & Aman",
    desc: "Profil terverifikasi dengan informasi ketersediaan waktu dan minat proyek yang jelas.",
    badge: "Terpercaya",
  },
];

export default function TentangValues() {
  return (
    <section className="w-full bg-surface-container-low/60 py-20 border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-3">
            <span className="material-symbols-outlined text-sm">stars</span>
            <span>Prinsip &amp; Komitmen</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Nilai-Nilai Utama SkillMatch
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Fondasi yang kami bangun untuk memastikan setiap mahasiswa mendapatkan pengalaman kolaborasi yang produktif dan menyenangkan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((v) => (
            <div
              key={v.title}
              className="bg-surface-container-lowest rounded-3xl p-6 border border-outline-variant/20 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-primary-fixed text-primary-container flex items-center justify-center mb-5">
                  <span className="material-symbols-outlined text-2xl">{v.icon}</span>
                </div>
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-primary-container mb-1">
                  {v.badge}
                </span>
                <h3 className="text-lg font-bold text-on-surface mb-2">{v.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

