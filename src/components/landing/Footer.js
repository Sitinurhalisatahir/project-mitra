import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0B132B] text-slate-300 pt-16 pb-10 border-t border-slate-800">
      <div className="max-w-[1440px] mx-auto px-gutter lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col items-start pr-0 lg:pr-8">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white shadow-[0_4px_14px_rgba(79,70,229,0.4)]">
                <span className="material-symbols-outlined text-[22px]">hub</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                Skill<span className="text-indigo-400">Match</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mb-6">
              Platform kolaborasi dan pencarian mitra proyek mahasiswa berbasis keselarasan skill, minat riset, dan ketersediaan waktu.
            </p>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 text-emerald-400 text-xs font-semibold border border-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Sistem Aktif • Kampus Hub
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Navigasi
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-white transition-colors">
                  Fitur Unggulan
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Fitur Utama
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-slate-400">
              <li>
                <Link href="/fitur" className="hover:text-white transition-colors">
                  Profil Skill &amp; Portofolio
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-white transition-colors">
                  Smart Match Engine
                </Link>
              </li>
              <li>
                <Link href="/fitur" className="hover:text-white transition-colors">
                  Chat &amp; Diskusi Tim
                </Link>
              </li>
            </ul>
          </div>

          {/* Akses & Developer */}
          <div>
            <h4 className="text-white text-sm font-bold uppercase tracking-wider mb-4">
              Akses Mahasiswa
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Masuk Akun
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
                  Daftar Sekarang
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>API Docs</span>
                  <span className="material-symbols-outlined text-xs">open_in_new</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 SkillMatch Indonesia. Hak Cipta Dilindungi.
          </div>
          <div className="flex items-center gap-6">
            <span>Dibuat untuk mahasiswa dan inovator kampus</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
