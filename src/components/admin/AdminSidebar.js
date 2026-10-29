"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearSession } from "@/lib/frontend/session";
import {
  IconNetwork,
  IconDashboard,
  IconShield,
  IconLayers,
  IconTrend,
  IconLogout,
} from "./icons";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  const navItems = [
    {
      name: "Dashboard Admin",
      href: "/admin",
      icon: IconDashboard,
      isActive: pathname === "/admin",
    },
    {
      name: "Verifikasi Akun",
      href: "/admin/verifikasi",
      icon: IconShield,
      isActive: pathname.startsWith("/admin/verifikasi"),
    },
    {
      name: "Kelola Kategori Skill/Minat",
      href: "/admin/kategori",
      icon: IconLayers,
      isActive: pathname.startsWith("/admin/kategori"),
    },
    {
      name: "Pantau Statistik Penggunaan",
      href: "/admin/statistik",
      icon: IconTrend,
      isActive: pathname.startsWith("/admin/statistik"),
    },
  ];

  return (
    <aside
      className="w-[280px] bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 min-h-screen z-20"
      data-purpose="admin-sidebar"
    >
      {/* Sidebar Top Area */}
      <div className="p-6">
        {/* Platform Logo & Title */}
        <div className="flex items-center space-x-3 mb-8" data-purpose="brand-header">
          <div className="w-10 h-10 rounded-full bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20">
            <IconNetwork className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base font-bold text-slate-900 tracking-tight">SkillMatch</span>
              <span className="px-2 py-0.5 text-[10px] font-bold text-brand-600 bg-indigo-50 rounded-full border border-indigo-100">
                Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium leading-none mt-1">Campus Platform</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5" data-purpose="sidebar-navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            if (item.isActive) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3.5 px-4 py-3 rounded-full bg-brand-600 text-white font-medium text-sm shadow-sm transition-all duration-150"
                >
                  <Icon className="w-4 h-4 text-white shrink-0" />
                  <span className="tracking-tight">{item.name}</span>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-3.5 px-4 py-3 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium text-sm transition-colors duration-150"
              >
                <Icon className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="tracking-tight">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom: Logout */}
      <div className="p-6 border-t border-slate-100" data-purpose="sidebar-footer">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center space-x-2 text-rose-500 hover:text-rose-600 font-semibold text-sm transition-colors group cursor-pointer"
        >
          <IconLogout className="w-4 h-4 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}

