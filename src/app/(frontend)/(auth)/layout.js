import Link from "next/link";
import BrandLogo from "@/components/auth/BrandLogo";

export default function AuthLayout({ children }) {
  return (
    <main className="w-full min-h-screen flex flex-col items-center justify-center p-6 sm:p-8 bg-gradient-to-br from-indigo-50/70 via-slate-50 to-amber-50/40 relative overflow-hidden">
      <div className="flex flex-col w-full items-center justify-center relative">
        {/* Ambient Decorative Light Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-fixed-dim/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-36 -right-36 w-96 h-96 bg-secondary-fixed/40 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Navigation / Brand Anchor */}
        <div className="w-full max-w-5xl flex items-center justify-between mb-8 sm:mb-10 px-2 sm:px-4">
          <BrandLogo />
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 hover:bg-white text-slate-700 hover:text-indigo-600 text-sm font-semibold shadow-xs hover:shadow-md transition-all duration-200 border border-slate-200/60"
          >
            <i className="fa-solid fa-arrow-left text-xs"></i>
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>

      {children}

      {/* Bottom Brand Footer */}
      <div className="mt-8 text-center text-slate-500 text-sm flex items-center justify-center gap-1.5 px-4">
        <span>© 2025 SkillMatch Indonesia</span>
        <span className="text-slate-400">•</span>
        <span>🎓 Ekosistem Kolaborasi Mahasiswa</span>
      </div>
    </main>
  );
}