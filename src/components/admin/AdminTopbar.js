"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/lib/frontend/session";
import { getAdminMe } from "@/lib/frontend/api/admin";
import { IconBell, IconUser } from "./icons";

export default function AdminTopbar() {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadAdmin() {
      try {
        const data = await getAdminMe();
        if (isMounted && data) {
          setAdmin(data);
        }
      } catch {
        // Abaikan error fetch background
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadAdmin();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <header className="px-8 py-5 flex items-center justify-between" data-purpose="topbar-header">
      {/* Breadcrumb indicator */}
      <div>
        <span className="text-sm font-semibold text-slate-600">Panel Kelola Kampus</span>
      </div>

      {/* Right controls: Bell & Admin Profile */}
      <div className="flex items-center space-x-5">
        {/* Notification icon */}
        <button
          type="button"
          aria-label="Notifikasi"
          className="relative p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
        >
          <IconBell className="w-5 h-5" />
        </button>

        {/* Profile Card */}
        <div className="flex items-center space-x-3" data-purpose="user-profile-header">
          <div className="w-9 h-9 rounded-full bg-brand-600 flex items-center justify-center text-white text-sm font-semibold shadow-sm">
            <IconUser className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            {loading && !admin ? (
              <>
                <div className="h-3.5 w-24 bg-slate-200 rounded animate-pulse" />
                <div className="h-2.5 w-32 bg-slate-100 rounded animate-pulse mt-1" />
              </>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-900">{admin?.nama || "Administrator"}</div>
                <div className="text-[11px] text-slate-400 font-medium">{admin?.email || "admin@campus.ac.id"}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

