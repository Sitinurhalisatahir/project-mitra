"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import ProyekTergabungHeader from "@/components/mahasiswa/proyek-tergabung/ProyekTergabungHeader";
import ProyekTergabungCard from "@/components/mahasiswa/proyek-tergabung/ProyekTergabungCard";
import LamaranPendingCard from "@/components/mahasiswa/proyek-tergabung/LamaranItemCard";
import {
  getAplikasiSaya,
  getProyekSaya,
  getDetailProyek,
} from "@/lib/frontend/api/mahasiswa";

export default function ProyekTergabungPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [aplikasiList, setAplikasiList] = useState([]);
  const [proyekTergabungList, setProyekTergabungList] = useState([]);

  // Filter state
  const [activeTab, setActiveTab] = useState("tergabung"); // 'tergabung' | 'aktif' | 'selesai' | 'lamaran'
  const [searchKeyword, setSearchKeyword] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [appsRes, myProjectsRes] = await Promise.all([
        getAplikasiSaya(),
        getProyekSaya(),
      ]);

      const safeApps = Array.isArray(appsRes) ? appsRes : [];
      const safeMyProjects = Array.isArray(myProjectsRes)
        ? myProjectsRes
        : Array.isArray(myProjectsRes?.data)
        ? myProjectsRes.data
        : [];

      setAplikasiList(safeApps);

      const acceptedApps = safeApps.filter((a) => a.status === "diterima");
      const acceptedAppsMap = new Map();
      acceptedApps.forEach((a) => acceptedAppsMap.set(a.proyek_id, a));

      // Kumpulkan semua proyek_id unik (proyek buatan sendiri + proyek di mana lamaran diterima)
      const allIds = new Set();
      safeMyProjects.forEach((p) => allIds.add(p.proyek_id));
      acceptedApps.forEach((a) => allIds.add(a.proyek_id));

      const detailPromises = Array.from(allIds).map(async (id) => {
        const isOwned = safeMyProjects.some((mp) => mp.proyek_id === id);
        const ownedFallback = safeMyProjects.find((mp) => mp.proyek_id === id);
        const appFallback = acceptedAppsMap.get(id);

        try {
          const detail = await getDetailProyek(id);
          return {
            ...detail,
            is_pemilik: isOwned || Boolean(detail?.is_pemilik),
            aplikasi: appFallback || null,
          };
        } catch {
          return {
            proyek_id: id,
            judul: ownedFallback?.judul || appFallback?.judul || "Proyek",
            kategori: ownedFallback?.kategori || appFallback?.kategori || "tugas",
            status: ownedFallback?.status || appFallback?.status_proyek || "buka",
            slot_dibutuhkan: ownedFallback?.slot_dibutuhkan || 1,
            slot_terisi: ownedFallback?.slot_terisi || 1,
            is_pemilik: isOwned,
            aplikasi: appFallback || null,
          };
        }
      });

      const details = await Promise.all(detailPromises);
      setProyekTergabungList(details);
    } catch (err) {
      setError(err.message || "Gagal memuat data proyek");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    async function initialFetch() {
      try {
        const [appsRes, myProjectsRes] = await Promise.all([
          getAplikasiSaya(),
          getProyekSaya(),
        ]);

        if (ignore) return;

        const safeApps = Array.isArray(appsRes) ? appsRes : [];
        const safeMyProjects = Array.isArray(myProjectsRes)
          ? myProjectsRes
          : Array.isArray(myProjectsRes?.data)
          ? myProjectsRes.data
          : [];

        setAplikasiList(safeApps);

        const acceptedApps = safeApps.filter((a) => a.status === "diterima");
        const acceptedAppsMap = new Map();
        acceptedApps.forEach((a) => acceptedAppsMap.set(a.proyek_id, a));

        // Kumpulkan semua proyek_id unik (proyek buatan sendiri + proyek di mana lamaran diterima)
        const allIds = new Set();
        safeMyProjects.forEach((p) => allIds.add(p.proyek_id));
        acceptedApps.forEach((a) => allIds.add(a.proyek_id));

        const detailPromises = Array.from(allIds).map(async (id) => {
          const isOwned = safeMyProjects.some((mp) => mp.proyek_id === id);
          const ownedFallback = safeMyProjects.find((mp) => mp.proyek_id === id);
          const appFallback = acceptedAppsMap.get(id);

          try {
            const detail = await getDetailProyek(id);
            return {
              ...detail,
              is_pemilik: isOwned || Boolean(detail?.is_pemilik),
              aplikasi: appFallback || null,
            };
          } catch {
            return {
              proyek_id: id,
              judul: ownedFallback?.judul || appFallback?.judul || "Proyek",
              kategori: ownedFallback?.kategori || appFallback?.kategori || "tugas",
              status: ownedFallback?.status || appFallback?.status_proyek || "buka",
              slot_dibutuhkan: ownedFallback?.slot_dibutuhkan || 1,
              slot_terisi: ownedFallback?.slot_terisi || 1,
              is_pemilik: isOwned,
              aplikasi: appFallback || null,
            };
          }
        });

        const details = await Promise.all(detailPromises);
        if (!ignore) {
          setProyekTergabungList(details);
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message || "Gagal memuat data proyek");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    initialFetch();

    return () => {
      ignore = true;
    };
  }, []);

  // Statistik
  const totalTergabung = proyekTergabungList.length;
  const totalAktif = proyekTergabungList.filter((p) => p.status === "buka").length;
  const pendingApps = useMemo(
    () => aplikasiList.filter((a) => a.status === "pending"),
    [aplikasiList]
  );
  const totalPending = pendingApps.length;

  // Filter list sesuai tab dan kata kunci
  const filteredTergabung = useMemo(() => {
    let list = proyekTergabungList;
    if (activeTab === "aktif") {
      list = list.filter((p) => p.status === "buka");
    } else if (activeTab === "selesai") {
      list = list.filter((p) => p.status !== "buka");
    }

    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter(
        (p) =>
          p.judul?.toLowerCase().includes(q) ||
          p.pemilik_nama?.toLowerCase().includes(q) ||
          p.kategori?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [proyekTergabungList, activeTab, searchKeyword]);

  const filteredLamaran = useMemo(() => {
    let list = aplikasiList;
    if (searchKeyword.trim()) {
      const q = searchKeyword.toLowerCase();
      list = list.filter(
        (a) =>
          a.judul?.toLowerCase().includes(q) ||
          a.kategori?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [aplikasiList, searchKeyword]);

  return (
    <div className="flex flex-col gap-space-lg w-full max-w-[1360px] mx-auto">
      {/* Header Halaman */}
      <ProyekTergabungHeader
        totalTergabung={totalTergabung}
        totalAktif={totalAktif}
        totalPending={totalPending}
      />

      {/* Kontrol Navigasi Tab & Kolom Pencarian */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/30 pb-space-sm">
        {/* Tab Buttons */}
        <div className="flex items-center gap-space-xs overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("tergabung")}
            className={`px-4 py-2 rounded-2xl text-label-md font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "tergabung"
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Semua Tergabung ({totalTergabung})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("aktif")}
            className={`px-4 py-2 rounded-2xl text-label-md font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "aktif"
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Proyek Aktif ({totalAktif})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("selesai")}
            className={`px-4 py-2 rounded-2xl text-label-md font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "selesai"
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Proyek Selesai ({totalTergabung - totalAktif})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("lamaran")}
            className={`px-4 py-2 rounded-2xl text-label-md font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "lamaran"
                ? "bg-primary text-on-primary shadow-xs"
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            }`}
          >
            Semua Lamaran ({aplikasiList.length})
          </button>
        </div>

        {/* Input Pencarian Lokal */}
        <div className="relative min-w-[240px]">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Cari dalam daftar..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-surface-container-lowest border border-outline-variant/40 rounded-full text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
          <div className="h-64 rounded-[2rem] bg-surface-container-low animate-pulse" />
          <div className="h-64 rounded-[2rem] bg-surface-container-low animate-pulse" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center p-space-xl bg-surface-container-lowest rounded-[2rem] border border-red-200 gap-space-sm text-center">
          <span className="material-symbols-outlined text-[36px] text-red-500">
            error
          </span>
          <p className="text-body-md text-red-600 font-semibold">{error}</p>
          <button
            type="button"
            onClick={loadData}
            className="px-4 py-2 bg-primary text-on-primary rounded-full text-label-md font-semibold hover:bg-primary-container transition-all"
          >
            Coba Lagi
          </button>
        </div>
      ) : activeTab === "lamaran" ? (
        /* Tab Tampilan Semua Lamaran (Pending, Ditolak, Diterima) */
        filteredLamaran.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-space-md text-center bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 gap-space-sm">
            <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[28px]">send</span>
            </div>
            <h3 className="text-title-lg font-bold text-on-surface">
              Belum Ada Lamaran Terkirim
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-md">
              Anda belum mengirimkan lamaran ke proyek mana pun. Buka halaman Cari Proyek untuk mulai berkolaborasi!
            </p>
            <Link
              href="/proyek"
              className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-label-md font-bold hover:bg-primary-container transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              Cari Proyek
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {filteredLamaran.map((app) => (
              <LamaranPendingCard
                key={app.aplikasi_id}
                aplikasi={app}
              />
            ))}
          </div>
        )
      ) : (
        /* Tab Tampilan Proyek Tergabung */
        filteredTergabung.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-space-md text-center bg-surface-container-lowest rounded-[2rem] border border-outline-variant/30 gap-space-sm">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[32px]">groups</span>
            </div>
            <h3 className="text-title-lg font-bold text-on-surface">
              {searchKeyword
                ? `Tidak ada proyek yang sesuai dengan "${searchKeyword}"`
                : activeTab === "aktif"
                ? "Tidak Ada Proyek Aktif yang Sedang Diikuti"
                : activeTab === "selesai"
                ? "Belum Ada Proyek yang Telah Selesai"
                : "Belum Bergabung di Proyek Mana Pun"}
            </h3>
            <p className="text-body-md text-on-surface-variant max-w-md">
              {searchKeyword
                ? "Coba gunakan kata kunci lain untuk menemukan proyek Anda."
                : "Saat Anda melamar ke proyek lain dan ketua tim menerima lamaran Anda, proyek tersebut akan otomatis tersimpan dan muncul di halaman ini."}
            </p>
            {!searchKeyword && (
              <Link
                href="/proyek"
                className="mt-2 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-on-primary text-label-md font-bold hover:bg-primary-container transition-all shadow-sm"
              >
                <span className="material-symbols-outlined text-[20px]">explore</span>
                Eksplorasi Proyek Kampus
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-lg">
            {filteredTergabung.map((proyek) => (
              <ProyekTergabungCard
                key={proyek.proyek_id}
                proyek={proyek}
                aplikasi={proyek.aplikasi}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
}

