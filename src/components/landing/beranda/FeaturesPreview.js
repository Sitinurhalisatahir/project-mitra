import Link from "next/link";

const steps = [
  {
    icon: "badge",
    iconBox: "bg-primary-fixed text-primary-container",
    labelColor: "text-primary-container",
    step: "LANGKAH 01",
    title: "Profil Skill & Minat",
    desc: "Bangun portofolio dan profil keahlian spesifikmu agar mudah ditemukan rekan proyek potensial.",
    cta: "Lengkapi Profil",
  },
  {
    icon: "auto_awesome",
    iconBox: "bg-secondary-fixed text-on-secondary-fixed-variant",
    labelColor: "text-secondary",
    step: "LANGKAH 02",
    title: "Pencarian & Rekomendasi Mitra",
    desc: "Temukan rekan tim ideal secara instan berdasarkan algoritma kecocokan keahlian dan minat riset.",
    cta: "Cari Rekan Sekarang",
  },
  {
    icon: "chat",
    iconBox: "bg-tertiary-fixed text-tertiary",
    labelColor: "text-tertiary-container",
    step: "LANGKAH 03",
    title: "Chat/Diskusi",
    desc: "Ruang obrolan langsung untuk menyelaraskan visi, ekspektasi, dan pembagian tugas sebelum tim resmi dibentuk.",
    cta: "Mulai Diskusi",
  },
];

export default function FeaturesPreview() {
  return (
    <section className="w-full bg-surface-container-low/70 py-24 border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-4">
            <span className="material-symbols-outlined text-sm">star</span>
            <span>Fitur Utama</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-4">
            Tiga Langkah Mudah Membangun Tim Impian
          </h2>
          <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Eksplorasi kemudahan menemukan rekan kolaborasi terbaik untuk menuntaskan
            proyek akademik, lomba riset, hingga kompetisi teknologi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-surface-container-lowest rounded-3xl p-8 shadow-[0_10px_30px_-6px_rgba(79,70,229,0.06),0_2px_8px_-2px_rgba(11,28,48,0.04)] hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.12)] transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${s.iconBox}`}>
                  <span className="material-symbols-outlined text-[26px]">{s.icon}</span>
                </div>
                <span className={`text-xs font-bold uppercase tracking-wider block mb-2 ${s.labelColor}`}>
                  {s.step}
                </span>
                <h3 className="text-xl font-bold text-on-surface mb-3">{s.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">{s.desc}</p>
              </div>
              <Link
                href="/register"
                className="group inline-flex items-center text-sm font-semibold text-primary-container hover:text-primary transition-colors"
              >
                {s.cta}
                <span className="ml-1.5 transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}