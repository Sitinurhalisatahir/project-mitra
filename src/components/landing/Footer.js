import Link from "next/link";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/fitur", label: "Fitur" },
  { href: "/tentang", label: "Tentang" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Daftar" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-black text-white pt-space-xl pb-space-lg">
      <div className="max-w-[1440px] mx-auto px-gutter py-space-xl flex flex-col items-start text-left">
        <div className="text-headline-md font-extrabold tracking-tight text-white mb-space-md">
          SkillMatch
        </div>
        <div className="w-full h-[1px] bg-white/10 mb-space-md"></div>
        <nav className="flex flex-wrap items-center gap-space-xs text-body-md text-white/70 mb-space-sm">
          {links.map((l, i) => (
            <span key={l.href} className="flex items-center gap-space-xs">
              {i > 0 && <span className="text-white/30 px-1">|</span>}
              <Link href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            </span>
          ))}
        </nav>
        <div className="text-label-md text-white/40">© 2026 SkillMatch</div>
      </div>
    </footer>
  );
}