import Image from "next/image";

const testimonials = [
  {
    name: "Rizky Pratama",
    major: "Teknik Informatika • Semester 6",
    avatar: "/images/avatar-1.svg",
    badge: "Juara 2 Hackathon Nasional",
    quote:
      "Dulu susah banget cari partner UI/UX yang komit. Lewat SkillMatch, kami ketemu designer dari jurusan DKV yang sevisi. Hasilnya kami tembus juara 2 di Hackathon!",
    rating: 5,
  },
  {
    name: "Siti Anisa Rahma",
    major: "Sistem Informasi • Semester 4",
    avatar: "/images/avatar-2.svg",
    badge: "Tim Tugas Besar Capstone",
    quote:
      "Nggak perlu lagi sebar broadcast panjang di grup WhatsApp kelas yang cepat tenggelam. Dalam 2 hari, tim tugas besar 4 orang langsung terbentuk lengkap dengan pembagian role jelas.",
    rating: 5,
  },
  {
    name: "Dimas Firmansyah",
    major: "Teknik Elektro • Semester 7",
    avatar: "/images/avatar-3.svg",
    badge: "Lolos Pendanaan PKM Riset",
    quote:
      "Fitur ketersediaan jam per minggu sangat ngebantu. Anggota tim kami ritme kerjanya sama-sama sinkron 10-15 jam/minggu, jadi progres riset selesai tepat waktu.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section className="w-full bg-surface-container-low/50 py-24 border-t border-outline-variant/30">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-primary-fixed text-primary text-pill-tag mb-3">
            <span className="material-symbols-outlined text-sm">sentiment_satisfied</span>
            <span>Kisah Mahasiswa</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-on-surface tracking-tight mb-3">
            Terbukti Membantu Ratusan Tim Kampus
          </h2>
          <p className="text-on-surface-variant text-base leading-relaxed">
            Dengarkan langsung pengalaman mahasiswa yang telah menemukan rekan proyek ideal melalui SkillMatch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-surface-container-lowest rounded-3xl p-8 border border-outline-variant/30 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  ))}
                </div>
                <p className="text-on-surface text-sm sm:text-base leading-relaxed italic mb-6">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-outline-variant/20 flex items-center gap-3">
                <Image
                  src={t.avatar}
                  alt={t.name}
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-primary-fixed"
                />
                <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold text-on-surface truncate">{t.name}</span>
                  <span className="text-xs text-on-surface-variant truncate">{t.major}</span>
                  <span className="text-[11px] font-semibold text-primary-container mt-0.5">{t.badge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

