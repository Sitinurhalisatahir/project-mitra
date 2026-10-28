import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="w-full bg-surface py-20">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-container via-primary to-indigo-900 text-on-primary p-10 sm:p-16 lg:p-20 shadow-2xl">
          {/* Decorative Background Elements */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary-container/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md text-white text-pill-tag mb-6 border border-white/20">
              <span className="material-symbols-outlined text-sm">rocket_launch</span>
              <span>Mulai Langkah Kolaborasimu Hari Ini</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-6">
              Siap Menemukan Rekan Tim &amp; Proyek Impianmu?
            </h2>

            <p className="text-white/85 text-base sm:text-lg leading-relaxed max-w-2xl mb-10">
              Daftar akun gratis dalam 1 menit, buat portofolio skill-mu, dan terhubung langsung dengan mahasiswa berbakat di sekitarmu.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-secondary-container text-on-secondary-fixed font-bold text-sm sm:text-base shadow-[0_6px_20px_rgba(254,166,25,0.4)] hover:opacity-95 transition-all hover:scale-105"
              >
                <span>Daftar Sekarang — Gratis</span>
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center px-8 py-4 rounded-full bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-colors"
              >
                Masuk ke Akun
              </Link>
            </div>

            <div className="flex items-center gap-6 mt-10 text-xs text-white/70">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-300">check_circle</span>
                100% Gratis untuk Mahasiswa
              </span>
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-emerald-300">check_circle</span>
                Tanpa Biaya Tersembunyi
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

