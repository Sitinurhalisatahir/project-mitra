import Link from "next/link";

const audiences = [
  {
    icon: "emoji_events",
    title: "Tim Hackathon & Kompetisi",
    desc: "Bangun tim impian berisi Hacker, Hipster, dan Hustler untuk menaklukkan kompetisi teknologi tingkat regional maupun nasional.",
  },
  {
    icon: "school",
    title: "Tugas Besar & Capstone Project",
    desc: "Temukan rekan sekelas atau lintas prodi dengan keahlian komplementer agar tugas akhir selesai dengan nilai maksimal.",
  },
  {
    icon: "lightbulb",
    title: "Riset Akademik & PKM",
    desc: "Kolaborasi penulisan karya tulis ilmiah, riset terapan, dan Program Kreativitas Mahasiswa bersama mahasiswa berprestasi.",
  },
  {
    icon: "rocket_launch",
    title: "Inkubasi Startup & Side Project",
    desc: "Ubah ide kreatif menjadi produk nyata dengan merekrut co-founder atau teknis developer yang memiliki passion serupa.",
  },
];

export default function TentangAudience() {
  return (
    <section className="w-full bg-surface py-20 border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-3">
            <span className="material-symbols-outlined text-sm">hub</span>
            <span>Ekosistem Kampus</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Dirancang Khusus untuk Kebutuhan Mahasiswa
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Apapun target proyek yang sedang kamu persiapkan, SkillMatch menyediakan ruang untuk menemukan mitra yang tepat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {audiences.map((a) => (
            <div
              key={a.title}
              className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/20 shadow-sm flex items-start gap-5 hover:border-primary-container/30 transition-colors"
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary-fixed text-on-secondary-fixed-variant flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-2">{a.title}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 text-center bg-gradient-to-r from-primary-container to-indigo-800 text-white rounded-3xl p-10 shadow-xl flex flex-col items-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold mb-3">
            Mari Bersama Ciptakan Karya Terbaik
          </h3>
          <p className="text-white/80 text-base max-w-xl mb-6">
            Jangan biarkan ide hebatmu terhambat karena kekurangan anggota tim. Mulai langkah pertamamu bersama SkillMatch.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-base shadow-lg hover:scale-105 transition-transform"
          >
            <span>Bergabung Sekarang</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

