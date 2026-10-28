import Link from "next/link";

export default function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-space-sm">
      <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary shadow-[0_4px_14px_rgba(79,70,229,0.35)]">
        <span className="material-symbols-outlined text-[22px]">hub</span>
      </div>
      <span className="text-headline-md tracking-tight text-on-surface font-extrabold">
        Skill<span className="text-primary-container">Match</span>
      </span>
    </Link>
  );
}