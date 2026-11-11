"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getNotifikasi } from "@/lib/frontend/api/mahasiswa";
import { useMahasiswa } from "@/components/mahasiswa/MahasiswaGuard";
import { getInitials } from "@/lib/frontend/utils/format";

export default function MahasiswaTopbar() {
  const router = useRouter();
  const { user } = useMahasiswa() || {};
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Pencarian global: membawa kata kunci ke halaman Cari Proyek
  function handleSearchSubmit(e) {
    e.preventDefault();
    const q = searchText.trim();
    router.push(q ? `/proyek?q=${encodeURIComponent(q)}` : "/proyek");
  }

  useEffect(() => {
    let isMounted = true;

    function checkUnread() {
      getNotifikasi(true)
        .then((res) => {
          if (!isMounted) return;
          const count =
            res?.meta?.unread_count ?? (Array.isArray(res) ? res.length : 0);
          setHasUnreadNotif(count > 0);
        })
        .catch(() => {
          // Abaikan error pada topbar
        });
    }

    checkUnread();

    function handleNotifChanged() {
      checkUnread();
    }

    window.addEventListener("notifikasi:berubah", handleNotifChanged);
    return () => {
      isMounted = false;
      window.removeEventListener("notifikasi:berubah", handleNotifChanged);
    };
  }, []);

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface/80 backdrop-blur-xl z-40 flex items-center justify-between px-space-xl">
      <div className="flex items-center gap-space-sm">
        <span className="text-label-md uppercase tracking-wider text-on-surface-variant font-semibold">
          Universitas Hasanuddin
        </span>
      </div>
      <div className="flex items-center gap-space-md">
        <form
          role="search"
          onSubmit={handleSearchSubmit}
          className="relative flex items-center"
        >
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px] pointer-events-none">
            search
          </span>
          <input
            className="pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary w-64"
            placeholder="Cari proyek atau skill..."
            aria-label="Cari proyek"
            type="search"
            name="q"
            autoComplete="off"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
        <Link
          href="/notifikasi"
          className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface relative shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">
            notifications
          </span>
          {hasUnreadNotif && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container" />
          )}
        </Link>
        <Link
          href="/profil"
          aria-label="Profil saya"
          title={user?.nama || "Profil saya"}
          className="w-8 h-8 rounded-full bg-primary-container text-on-primary flex items-center justify-center text-label-md font-bold shadow-sm hover:opacity-90 transition-opacity"
        >
          {getInitials(user?.nama)}
        </Link>
      </div>
    </header>
  );
}
