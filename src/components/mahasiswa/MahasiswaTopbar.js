"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNotifikasi } from "@/lib/frontend/api/mahasiswa";

export default function MahasiswaTopbar() {
  const [hasUnreadNotif, setHasUnreadNotif] = useState(false);

  useEffect(() => {
    let isMounted = true;
    getNotifikasi(true)
      .then((res) => {
        if (!isMounted) return;
        const count = res?.meta?.unread_count ?? (Array.isArray(res) ? res.length : 0);
        setHasUnreadNotif(count > 0);
      })
      .catch(() => {
        // Abaikan error pada topbar
      });

    return () => {
      isMounted = false;
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
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            className="pl-9 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary w-64"
            placeholder="Cari skill, rekan, proyek..."
            type="text"
            readOnly
          />
        </div>
        <Link
          href="/notifikasi"
          className="w-9 h-9 rounded-full bg-surface-container-lowest border border-outline-variant/30 flex items-center justify-center text-on-surface-variant hover:text-on-surface relative shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {hasUnreadNotif && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-secondary-container" />
          )}
        </Link>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover"
          src="/images/profile-default.jpg"
        />
      </div>
    </header>
  );
}

