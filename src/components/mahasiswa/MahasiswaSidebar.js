"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/frontend/session";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { href: "/profil", label: "Profil Saya", icon: "person" },
  { href: "/proyek", label: "Cari Proyek", icon: "explore" },
  { href: "/proyek-saya", label: "Proyek Saya", icon: "folder" },
  { href: "/chat", label: "Chat", icon: "chat_bubble" },
  { href: "/notifikasi", label: "Notifikasi", icon: "notifications" },
];

export default function MahasiswaSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-72 bg-surface-container-lowest border-r border-outline-variant/30 z-50 flex flex-col justify-between p-space-lg shadow-[0_1px_8px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col gap-space-xl">
        {/* Brand */}
        <div className="flex items-center gap-space-sm px-space-xs">
          <div className="w-10 h-10 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary shadow-sm">
            <span className="material-symbols-outlined text-[22px]">hub</span>
          </div>
          <div className="flex flex-col">
            <span className="text-title-lg text-on-surface font-bold leading-tight">
              SkillMatch
            </span>
            <span className="text-label-md text-on-surface-variant font-medium">
              Campus Hub
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-space-xs">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-2xl transition-all ${
                  isActive
                    ? "bg-primary-fixed text-primary font-bold shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-body-md">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Logout button (Diberi padding bawah agar tidak tertutup popup/overlay Next.js) */}
      <div className="pt-space-md pb-24 border-t border-outline-variant/30">
        <button
          onClick={handleLogout}
          type="button"
          className="mt-space-sm w-full flex items-center gap-space-sm px-space-md py-space-sm rounded-2xl text-error bg-transparent hover:bg-error-container hover:text-on-error-container transition-all duration-200"
        >
          <span className="material-symbols-outlined text-[20px] text-error">
            logout
          </span>
          <span className="text-body-md font-medium text-error">Keluar</span>
        </button>
      </div>
    </aside>
  );
}

