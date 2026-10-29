"use client";

import { useEffect, useState, useCallback } from "react";
import StatistikHeader from "@/components/admin/statistik/StatistikHeader";
import PenggunaCard from "@/components/admin/statistik/PenggunaCard";
import ProyekCard from "@/components/admin/statistik/ProyekCard";
import PencocokanCard from "@/components/admin/statistik/PencocokanCard";
import { getStatistik, getSemuaPengguna } from "@/lib/frontend/api/admin";

export default function AdminStatistikPage() {
  const [stats, setStats] = useState(null);
  const [adminCount, setAdminCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastFetched, setLastFetched] = useState(null);
  const [relativeTime, setRelativeTime] = useState("baru saja");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setErrorMsg("");
    try {
      const [statsData, usersRes] = await Promise.all([
        getStatistik(),
        getSemuaPengguna({ limit: 100 }).catch(() => null),
      ]);
      setStats(statsData);
      if (usersRes) {
        const items = Array.isArray(usersRes) ? usersRes : usersRes?.items || [];
        const admins = items.filter((u) => u.role === "admin");
        setAdminCount(admins.length);
      }
      setLastFetched(new Date());
    } catch (err) {
      setErrorMsg(err.message || "Gagal memuat statistik penggunaan");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function init() {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const [statsData, usersRes] = await Promise.all([
          getStatistik(),
          getSemuaPengguna({ limit: 100 }).catch(() => null),
        ]);
        if (!isMounted) return;
        setStats(statsData);
        if (usersRes) {
          const items = Array.isArray(usersRes) ? usersRes : usersRes?.items || [];
          const admins = items.filter((u) => u.role === "admin");
          setAdminCount(admins.length);
        }
        setLastFetched(new Date());
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg(err.message || "Gagal memuat statistik penggunaan");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update waktu relatif setelah mount
  useEffect(() => {
    if (!lastFetched) return;
    const updateRelative = () => {
      const diffSec = Math.floor((Date.now() - lastFetched.getTime()) / 1000);
      if (diffSec < 60) {
        setRelativeTime("baru saja");
      } else {
        const diffMin = Math.floor(diffSec / 60);
        setRelativeTime(`${diffMin} menit lalu`);
      }
    };
    updateRelative();
    const timer = setInterval(updateRelative, 30000);
    return () => clearInterval(timer);
  }, [lastFetched]);

  return (
    <div className="max-w-[1440px] mx-auto p-8 lg:p-10">
      <div className="flex flex-col gap-8 pb-12">
        {/* Header Halaman */}
        <StatistikHeader
          relativeTime={relativeTime}
          isSuccess={!errorMsg}
        />

        {/* State Error Singkat */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{errorMsg}</span>
            </div>
            <button
              type="button"
              onClick={fetchData}
              className="font-bold underline hover:no-underline cursor-pointer"
            >
              Coba lagi
            </button>
          </div>
        )}

        {/* 3 Stat Cards in a balanced, spacious, premium grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PenggunaCard
            totalMahasiswa={stats?.total_mahasiswa || 0}
            terverifikasi={stats?.terverifikasi || 0}
            menungguVerifikasi={stats?.menunggu_verifikasi || 0}
            adminCount={adminCount}
            loading={loading}
          />
          <ProyekCard
            proyekPerStatus={stats?.proyek_per_status || {}}
            proyekPerKategori={stats?.proyek_per_kategori || {}}
            lamaranPerStatus={stats?.lamaran_per_status || {}}
            loading={loading}
          />
          <PencocokanCard
            tingkatKeberhasilan={stats?.tingkat_keberhasilan}
            lamaranPerStatus={stats?.lamaran_per_status || {}}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

