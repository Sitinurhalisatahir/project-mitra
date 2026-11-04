"use client";

import { useEffect, useState, useCallback } from "react";
import SummaryCard from "@/components/mahasiswa/SummaryCard";
import LamaranPanel from "@/components/mahasiswa/LamaranPanel";
import PelamarPanel from "@/components/mahasiswa/PelamarPanel";
import {
  getProyekSaya,
  getAplikasiSaya,
  getMahasiswaProfil,
  getPercakapan,
  getNotifikasi,
  getPelamarProyek,
} from "@/lib/frontend/api/mahasiswa";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    proyekCount: "-",
    proyekDesc: "- proyek tim aktif diikuti",
    skillCount: "-",
    skillDesc: "- skill teknis & - minat proyek",
    lamaranCount: "-",
    lamaranDesc: "Menunggu peninjauan ketua proyek",
    pesanCount: "-",
    pesanDesc: "Dari obrolan tim & notifikasi sistem",
  });

  const [lamaranList, setLamaranList] = useState([]);
  const [pelamarList, setPelamarList] = useState([]);
  const [pelamarCount, setPelamarCount] = useState(0);

  const [loadingCards, setLoadingCards] = useState(true);
  const [loadingLamaran, setLoadingLamaran] = useState(true);
  const [loadingPelamar, setLoadingPelamar] = useState(true);

  const [errorLamaran, setErrorLamaran] = useState(null);
  const [errorPelamar, setErrorPelamar] = useState(null);

  const fetchDashboardData = useCallback(async () => {
    // Ambil data secara paralel
    const [
      proyekRes,
      aplikasiRes,
      profilRes,
      pesanRes,
      notifRes,
    ] = await Promise.allSettled([
      getProyekSaya(),
      getAplikasiSaya(),
      getMahasiswaProfil(),
      getPercakapan(),
      getNotifikasi(true),
    ]);

    // 1. Proyek Saya & Lamaran
    let myProjects = [];
    if (proyekRes.status === "fulfilled" && Array.isArray(proyekRes.value)) {
      myProjects = proyekRes.value;
    }

    let myApps = [];
    if (aplikasiRes.status === "fulfilled" && Array.isArray(aplikasiRes.value)) {
      myApps = aplikasiRes.value;
    }

    // Hitung Proyek Saya: proyek milik user + proyek di mana lamaran berstatus diterima (tanpa duplikat)
    const projectIds = new Set();
    myProjects.forEach((p) => projectIds.add(p.proyek_id));
    myApps.forEach((a) => {
      if (a.status === "diterima" && a.proyek_id) {
        projectIds.add(a.proyek_id);
      }
    });

    const totalProjects =
      proyekRes.status === "fulfilled" || aplikasiRes.status === "fulfilled"
        ? projectIds.size
        : "-";

    // 2. Skill & Minat Terisi
    let totalTags = "-";
    let descTags = "- skill teknis & - minat proyek";
    if (profilRes.status === "fulfilled" && profilRes.value?.tags) {
      const tags = profilRes.value.tags;
      totalTags = tags.length;
      const skillCount = tags.filter((t) => t.jenis === "skill").length;
      const minatCount = tags.filter((t) => t.jenis === "minat").length;
      descTags = `${skillCount} skill teknis & ${minatCount} minat proyek`;
    }

    // 3. Lamaran Pending
    let pendingAppsCount = "-";
    if (aplikasiRes.status === "fulfilled") {
      pendingAppsCount = myApps.filter((a) => a.status === "pending").length;
    }

    // 4. Pesan Belum Dibaca
    let totalUnread = "-";
    if (pesanRes.status === "fulfilled" || notifRes.status === "fulfilled") {
      let unreadMessages = 0;
      if (pesanRes.status === "fulfilled" && Array.isArray(pesanRes.value)) {
        unreadMessages = pesanRes.value.reduce(
          (sum, c) => sum + (Number(c.belum_dibaca) || 0),
          0
        );
      }

      let unreadNotifs = 0;
      if (notifRes.status === "fulfilled") {
        unreadNotifs =
          notifRes.value?.meta?.unread_count ??
          (Array.isArray(notifRes.value) ? notifRes.value.length : 0);
      }

      totalUnread = unreadMessages + unreadNotifs;
    }

    setStats({
      proyekCount: totalProjects,
      proyekDesc: `${totalProjects} proyek tim aktif diikuti`,
      skillCount: totalTags,
      skillDesc: descTags,
      lamaranCount: pendingAppsCount,
      lamaranDesc: "Menunggu peninjauan ketua proyek",
      pesanCount: totalUnread,
      pesanDesc: "Dari obrolan tim & notifikasi sistem",
    });
    setLoadingCards(false);

    // Update Lamaran Panel
    if (aplikasiRes.status === "fulfilled") {
      const myProjectsMap = new Map();
      myProjects.forEach((p) => myProjectsMap.set(p.proyek_id, p.kategori));

      const enrichedApps = myApps.map((a) => ({
        ...a,
        kategori: a.kategori || myProjectsMap.get(a.proyek_id) || null,
      }));

      setLamaranList(enrichedApps);
      setLoadingLamaran(false);
    } else {
      setErrorLamaran("Gagal memuat aktivitas lamaran");
      setLoadingLamaran(false);
    }

    // 5. Pelamar Menunggu Persetujuan
    if (proyekRes.status === "fulfilled") {
      try {
        const applicantPromises = myProjects.map((p) =>
          getPelamarProyek(p.proyek_id, "pending")
            .then((apps) =>
              (Array.isArray(apps) ? apps : []).map((app) => ({
                ...app,
                judul_proyek: p.judul,
                proyek_id: p.proyek_id,
              }))
            )
            .catch(() => [])
        );

        const allApplicantsArrays = await Promise.all(applicantPromises);
        const combinedApplicants = allApplicantsArrays.flat();

        combinedApplicants.sort(
          (a, b) => new Date(b.applied_at) - new Date(a.applied_at)
        );

        setPelamarList(combinedApplicants);
        setPelamarCount(combinedApplicants.length);
      } catch {
        setErrorPelamar("Gagal memuat pelamar proyek");
      } finally {
        setLoadingPelamar(false);
      }
    } else {
      setErrorPelamar("Gagal memuat proyek untuk memeriksa pelamar");
      setLoadingPelamar(false);
    }
  }, []);

  const handleRetry = useCallback(() => {
    setLoadingCards(true);
    setLoadingLamaran(true);
    setLoadingPelamar(true);
    setErrorLamaran(null);
    setErrorPelamar(null);
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    let ignore = false;
    // Panggil asynchronous data fetcher
    getProyekSaya()
      .catch(() => null)
      .then(() => {
        if (!ignore) {
          fetchDashboardData();
        }
      });

    return () => {
      ignore = true;
    };
  }, [fetchDashboardData]);

  return (
    <div className="flex flex-col w-full">
      {/* Baris 1: Judul Halaman & Subtitle */}
      <div className="flex flex-col gap-space-xs mb-space-lg">
        <h1 className="text-headline-xl text-on-surface font-extrabold tracking-tight">
          Dashboard
        </h1>
        <p className="text-body-lg text-on-surface-variant font-normal">
          Selamat datang kembali! Pantau progres proyek, status lamaran, dan kolaborasi tim kampusmu.
        </p>
      </div>

      {/* Baris 2: Empat Kartu Ringkasan Sejajar */}
      <div className="grid grid-cols-4 gap-gutter mb-space-xl">
        <SummaryCard
          value={stats.proyekCount}
          title="Proyek Saya"
          description={stats.proyekDesc}
          icon="folder"
          iconBgClass="bg-primary-fixed"
          iconColorClass="text-primary"
          loading={loadingCards}
        />
        <SummaryCard
          value={stats.skillCount}
          title="Skill & Minat Terisi"
          description={stats.skillDesc}
          icon="auto_awesome"
          iconBgClass="bg-surface-container-high"
          iconColorClass="text-primary-container"
          loading={loadingCards}
        />
        <SummaryCard
          value={stats.lamaranCount}
          title="Lamaran Pending"
          description={stats.lamaranDesc}
          icon="schedule"
          iconBgClass="bg-secondary-fixed"
          iconColorClass="text-secondary"
          loading={loadingCards}
        />
        <SummaryCard
          value={stats.pesanCount}
          title="Pesan Belum Dibaca"
          description={stats.pesanDesc}
          icon="chat"
          iconBgClass="bg-secondary-fixed-dim/40"
          iconColorClass="text-secondary-container"
          loading={loadingCards}
        />
      </div>

      {/* Baris 3: Dua Panel Besar Sejajar Berdampingan */}
      <div className="grid grid-cols-2 gap-gutter">
        <LamaranPanel
          items={lamaranList}
          loading={loadingLamaran}
          error={errorLamaran}
          onRetry={handleRetry}
        />
        <PelamarPanel
          items={pelamarList}
          totalCount={pelamarCount}
          loading={loadingPelamar}
          error={errorPelamar}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
}
