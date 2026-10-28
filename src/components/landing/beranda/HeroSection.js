import Link from "next/link";
import Image from "next/image";

const stats = [
  { value: "500+", label: ["TIM", "TERBENTUK"], accent: false },
  { value: "98%", label: ["AKURASI", "KECOCOKAN"], accent: true },
  { value: "4.9/5", label: ["KEPUASAN", "KOLABORATOR"], accent: false },
];

export default function HeroSection() {
  return (
    <section className="w-full bg-surface pt-10 pb-20 lg:pt-14 lg:pb-28 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Kolom kiri */}
        <div className="lg:col-span-6 flex flex-col items-start pr-0 lg:pr-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-fixed text-primary text-pill-tag mb-6">
            <span className="material-symbols-outlined text-base">diversity_3</span>
            <span>Platform Kolaborasi Mahasiswa</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-on-surface leading-[1.18] tracking-tight mb-5">
            Temukan Mitra Proyek <br className="hidden sm:inline" />
            Sesuai <span className="text-primary-container">Skill</span> dan{" "}
            <span className="text-[#6366F1]">Minatmu</span>
          </h1>

          <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-xl mb-9">
            Platform bagi mahasiswa untuk membangun profil keahlian dan menemukan
            rekan tim yang tepat
          </p>

          <div className="flex flex-wrap items-center gap-5 sm:gap-6 mb-14">
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-sm sm:text-base shadow-[0_4px_12px_rgba(254,166,25,0.3)] hover:opacity-95 transition-all"
            >
              <span>Mulai Sekarang</span>
              <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">
                arrow_forward
              </span>
            </Link>
            <Link
              href="/fitur"
              className="inline-flex items-center px-7 py-3.5 rounded-full text-primary-container bg-primary-fixed/60 hover:bg-primary-fixed font-semibold text-sm sm:text-base transition-colors"
            >
              Pelajari Fitur
            </Link>
          </div>

          <div className="flex items-center gap-6 sm:gap-9 pt-4 border-t border-outline-variant/40 w-full sm:w-auto">
            {stats.map((s, i) => (
              <div key={s.value} className="flex items-center gap-6 sm:gap-9">
                {i > 0 && <div className="h-10 w-[1px] bg-outline-variant/60 -ml-6 sm:-ml-9 mr-0"></div>}
                <div>
                  <div
                    className={`text-2xl sm:text-3xl font-extrabold ${
                      s.accent ? "text-primary-container" : "text-on-surface"
                    }`}
                  >
                    {s.value}
                  </div>
                  <div className="text-[11px] font-bold text-on-surface-variant tracking-wider uppercase mt-1 leading-snug">
                    {s.label[0]}
                    <br />
                    {s.label[1]}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom kanan */}
        <div className="lg:col-span-6 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[560px] rounded-[2rem] overflow-hidden shadow-2xl bg-surface-container-low aspect-[4/3] sm:aspect-[1.12/1]">
            <Image
              alt="Mahasiswa berdiskusi dan berkolaborasi dengan laptop di perpustakaan"
              className="w-full h-full object-cover object-center"
              src="/images/hero.svg"
              width={800}
              height={600}
              priority
            />

            <div className="absolute top-5 left-5 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary shrink-0">
                <span className="material-symbols-outlined text-base">verified_user</span>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface leading-tight">98% Match Rate</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Berdasarkan Keahlian</div>
              </div>
            </div>

            <div className="absolute bottom-5 right-5 bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant shrink-0">
                <span className="material-symbols-outlined text-base">emoji_events</span>
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface leading-tight">500+ Tim Berhasil</div>
                <div className="text-[10px] text-on-surface-variant font-medium">Proyek &amp; Hackathon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}