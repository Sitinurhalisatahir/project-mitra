"use client";

import { useEffect, useState, useCallback } from "react";
import StatCard from "@/components/admin/StatCard";
import VerificationCard from "@/components/admin/VerificationCard";
import CategoryCard from "@/components/admin/CategoryCard";
import {
  IconUsers,
  IconFolder,
  IconCheckCircle,
} from "@/components/admin/icons";
import {
  getStatistik,
  getPenggunaMenunggu,
  getTags,
} from "@/lib/frontend/api/admin";
import {
  formatDateIndonesian,
  formatNumber,
  formatPercent,
} from "@/lib/frontend/utils/format";

export default function AdminDashboardPage() {
  const [currentDate, setCurrentDate] = useState("");
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [totalWaiting, setTotalWaiting] = useState(0);
  const [pendingLoading, setPendingLoading] = useState(true);

  const [tags, setTags] = useState([]);
  const [totalTagsCount, setTotalTagsCount] = useState(0);
  const [tagsLoading, setTagsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function initDashboard() {
      // Async tick agar tidak memicu cascading renders di effect mount
      await Promise.resolve();
      if (!isMounted) return;

      setCurrentDate(formatDateIndonesian(new Date()));

      try {
        const statsData = await getStatistik();
        if (isMounted) {
          setStats(statsData) ;
          setStatsLoading(false);
        }
      } catch {
        if (isMounted) setStatsLoading(false);
      }

      try {
        const res = await getPenggunaMenunggu(5);
        if (isMounted) {
          const items = Array.isArray(res) ? res : res?.items || [];
          const studentOnly = items.filter(
            (u) => !u.is_verified && (u.role === "mahasiswa" || !u.role)
          );
          setPendingUsers(studentOnly.slice(0, 5));
          if (res?.meta?.total !== undefined) {
            setTotalWaiting(res.meta.total);
          }
          setPendingLoading(false);
        }
      } catch {
        if (isMounted) setPendingLoading(false);
      }

      try {
        const data = await getTags();
        if (isMounted) {
          const list = Array.isArray(data) ? data : [];
          setTotalTagsCount(list.length);
          const sorted = [...list].sort((a, b) => (b.tag_id || 0) - (a.tag_id || 0));
          setTags(sorted.slice(0, 12));
          setTagsLoading(false);
        }
      } catch {
        if (isMounted) setTagsLoading(false);
      }
    }

    initDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleVerificationDone = useCallback((verifiedId) => {
    setPendingUsers((prev) => prev.filter((u) => u.pengguna_id !== verifiedId));
    setTotalWaiting((prev) => Math.max(0, prev - 1));
    getStatistik().then((freshStats) => {
      if (freshStats) setStats(freshStats);
    }).catch(() => {});
  }, []);

  // Kalkulasi data statistik
  const totalMahasiswa = stats?.total_mahasiswa ?? 0;

  const totalProyek = Object.values(stats?.proyek_per_status || {}).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );

  const lamaranValues = Object.values(stats?.lamaran_per_status || {});
  const totalLamaran = lamaranValues.reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  );
  const lamaranDiterima = Number(stats?.lamaran_per_status?.diterima || 0);
  const matchSuccessRate =
    totalLamaran > 0 ? (lamaranDiterima / totalLamaran) * 100 : 0;

  const badgeWaiting =
    stats?.menunggu_verifikasi !== undefined && stats?.menunggu_verifikasi !== null
      ? stats.menunggu_verifikasi
      : totalWaiting;

  return (
    <div className="px-8 pb-12 space-y-6">
      {/* Page Title & Date Subtitle */}
      <div data-purpose="page-headline">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Dashboard Admin
        </h1>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {currentDate}
          {currentDate && <span className="mx-1">•</span>}
          Ringkasan aktivitas dan operasional sistem SkillMatch
        </p>
      </div>

      {/* BEGIN: StatCardsSection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" data-purpose="metrics-summary">
        {/* Stat Card 1: Pengguna Aktif */}
        <StatCard
          title="JUMLAH PENGGUNA AKTIF"
          value={formatNumber(totalMahasiswa)}
          subtitle="Pengguna terverifikasi"
          icon={IconUsers}
          iconBg="bg-indigo-50 text-brand-600"
          valueColor="text-slate-900"
          loading={statsLoading}
        />

        {/* Stat Card 2: Jumlah Proyek */}
        <StatCard
          title="JUMLAH PROYEK"
          value={formatNumber(totalProyek)}
          subtitle="Proyek terdaftar"
          icon={IconFolder}
          iconBg="bg-amber-50 text-amber-500"
          valueColor="text-slate-900"
          loading={statsLoading}
        />

        {/* Stat Card 3: Keberhasilan Pencocokan */}
        <StatCard
          title="TINGKAT KEBERHASILAN PENCOCOKAN"
          value={formatPercent(matchSuccessRate)}
          subtitle="Dihitung dari lamaran diterima"
          icon={IconCheckCircle}
          iconBg="bg-indigo-50 text-brand-600"
          valueColor="text-brand-600"
          loading={statsLoading}
        />
      </div>
      {/* END: StatCardsSection */}

      {/* BEGIN: DetailTablesAndTagsGrid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" data-purpose="operational-cards-container">
        {/* LEFT CARD: Akun Menunggu Verifikasi */}
        <VerificationCard
          users={pendingUsers}
          totalWaiting={badgeWaiting}
          loading={pendingLoading}
          onVerificationDone={handleVerificationDone}
        />

        {/* RIGHT CARD: Kategori Skill/Minat Terbaru */}
        <CategoryCard
          tags={tags}
          totalCount={totalTagsCount}
          loading={tagsLoading}
        />
      </div>
      {/* END: DetailTablesAndTagsGrid */}
    </div>
  );
}
