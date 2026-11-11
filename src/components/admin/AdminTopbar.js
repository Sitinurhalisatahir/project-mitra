"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearSession } from "@/lib/frontend/session";
import { getAdminMe } from "@/lib/frontend/api/admin";
import { IconUser, IconLogout } from "./icons";
import AdminProfileModal from "./AdminProfileModal";

export default function AdminTopbar() {
  const router = useRouter();
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  // Tutup dropdown jika klik di luar
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  function handleLogout() {
    clearSession();
    router.replace("/login");
  }

  return (
    <>
      <header className="px-8 py-5 flex items-center justify-between relative z-30" data-purpose="topbar-header">
        {/* Breadcrumb indicator */}
        <div>
          <span className="text-sm font-semibold text-slate-600">Panel Kelola Kampus</span>
        </div>

        {/* Right controls: Admin Profile */}
        <div className="flex items-center space-x-5">
          {/* Profile Dropdown Container */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center space-x-3 p-1.5 -mr-1.5 rounded-2xl hover:bg-slate-100/80 transition cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
              data-purpose="user-profile-header"
            >
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
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                      <span>{admin?.nama || "Administrator"}</span>
                      <span className="material-symbols-outlined text-[16px] text-slate-400">
                        {dropdownOpen ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-medium">{admin?.email || "admin@campus.ac.id"}</div>
                  </>
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                role="menu"
              >
                {/* Header User Info */}
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold text-indigo-700 bg-indigo-50 rounded-full border border-indigo-100">
                      ADMINISTRATOR
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-900 truncate">{admin?.nama || "Administrator"}</p>
                  <p className="text-[11px] text-slate-500 truncate">{admin?.email || "admin@campus.ac.id"}</p>
                </div>

                {/* Menu Items */}
                <div className="p-1 space-y-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setDropdownOpen(false);
                      setModalOpen(true);
                    }}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/60 rounded-xl transition cursor-pointer"
                    role="menuitem"
                  >
                    <span className="material-symbols-outlined text-[18px] text-slate-400">manage_accounts</span>
                    <span>Pengaturan Profil & Password</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                    role="menuitem"
                  >
                    <IconLogout className="w-4 h-4 text-rose-500" />
                    <span>Keluar (Logout)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Edit Profil & Password Admin */}
      <AdminProfileModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        admin={admin}
        onAdminUpdated={(newAdmin) => setAdmin(newAdmin)}
      />
    </>
  );
}
