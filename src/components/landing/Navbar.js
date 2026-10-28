"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import BrandLogo from "./BrandLogo";

const links = [
  { href: "/", label: "Beranda" },
  { href: "/fitur", label: "Fitur" },
  { href: "/tentang", label: "Tentang" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      <div className="h-20 max-w-[1440px] mx-auto px-gutter flex items-center justify-between">
        <BrandLogo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-space-xs p-1.5 rounded-full bg-surface-container-low">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={
                  active
                    ? "px-space-md py-space-xs rounded-full transition-colors bg-primary-container text-on-primary text-pill-tag shadow-[0_4px_14px_rgba(79,70,229,0.35)]"
                    : "px-space-md py-space-xs rounded-full text-pill-tag text-on-surface-variant hover:text-on-surface transition-colors"
                }
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-space-sm">
          <Link
            href="/login"
            className="hidden sm:inline-flex px-space-md py-space-xs rounded-full text-pill-tag text-on-surface bg-surface-container-lowest shadow-[0_1px_4px_rgba(0,0,0,0.06)] hover:bg-surface-container-low transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-space-md py-space-xs rounded-full text-pill-tag bg-secondary-container text-on-secondary-fixed font-bold shadow-[0_4px_12px_rgba(254,166,25,0.3)] hover:opacity-95 transition-opacity"
          >
            Daftar
          </Link>
          <Link
            href="/login"
            aria-label="Masuk ke akun"
            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-space-xs"
          >
            <span className="material-symbols-outlined text-on-primary text-[18px]">
              person
            </span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu navigasi"
            className="md:hidden w-9 h-9 rounded-full bg-surface-container flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors ml-1"
          >
            <span className="material-symbols-outlined text-[22px]">
              {mobileMenuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-surface-container-lowest border-b border-outline-variant/30 px-gutter py-4 flex flex-col gap-2 shadow-lg animate-fadeIn">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-2.5 rounded-xl font-medium text-sm transition-colors ${
                  active
                    ? "bg-primary-container text-on-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-4 py-2 text-center rounded-xl font-medium text-sm text-on-surface bg-surface-container-low hover:bg-surface-container transition-colors"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
