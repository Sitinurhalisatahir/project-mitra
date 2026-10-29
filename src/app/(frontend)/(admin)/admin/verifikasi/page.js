"use client";

import { useEffect, useState, useMemo } from "react";
import VerifikasiHeader from "@/components/admin/verifikasi/VerifikasiHeader";
import VerifikasiStatCards from "@/components/admin/verifikasi/VerifikasiStatCards";
import VerifikasiTable from "@/components/admin/verifikasi/VerifikasiTable";
import ValidationNotice from "@/components/admin/verifikasi/ValidationNotice";
import { getSemuaPengguna, verifikasiPengguna } from "@/lib/frontend/api/admin";

export default function AdminVerifikasiPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // "all", "menunggu", "verified"
  const [processingId, setProcessingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastFetched, setLastFetched] = useState(null);
  const [relativeTime, setRelativeTime] = useState("baru saja");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      await Promise.resolve();
      if (!isMounted) return;

      try {
        const res = await getSemuaPengguna({ limit: 100 });
        if (!isMounted) return;
        const items = Array.isArray(res) ? res : res?.items || [];
        const studentOnly = items.filter((u) => u.role === "mahasiswa");
        setUsers(studentOnly);
        setLastFetched(new Date());
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg(err.message || "Gagal memuat daftar pengguna");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Hitung waktu relatif setelah mount
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

  // Penghitungan agregasi data
  const allCount = users.length;
  const menungguCount = useMemo(
    () => users.filter((u) => !u.is_verified).length,
    [users]
  );
  const verifiedCount = useMemo(
    () => users.filter((u) => Boolean(u.is_verified)).length,
    [users]
  );

  // Filter daftar pengguna berdasarkan tab aktif
  const filteredUsers = useMemo(() => {
    if (filter === "menunggu") {
      return users.filter((u) => !u.is_verified);
    }
    if (filter === "verified") {
      return users.filter((u) => Boolean(u.is_verified));
    }
    return users;
  }, [users, filter]);

  function handleFilterChange(newFilter) {
    setFilter(newFilter);
    setCurrentPage(1);
    setErrorMsg("");
  }

  async function handleVerify(id) {
    if (processingId) return;
    setProcessingId(id);
    setErrorMsg("");

    try {
      await verifikasiPengguna(id);
      // Perbarui status pengguna langsung di state tanpa reload
      setUsers((prev) =>
        prev.map((u) =>
          u.pengguna_id === id ? { ...u, is_verified: true } : u
        )
      );
      setLastFetched(new Date());
      setRelativeTime("baru saja");
    } catch (err) {
      setErrorMsg(err.message || "Gagal memverifikasi akun");
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <main className="w-full px-8 pb-12 max-w-[1500px] flex flex-col justify-start">
      <div className="flex flex-col w-full">
        {/* Headline and Badge */}
        <VerifikasiHeader menungguCount={menungguCount} />

        {/* 3 Metric Stat Cards */}
        <VerifikasiStatCards
          totalCount={allCount}
          menungguCount={menungguCount}
          verifiedCount={verifiedCount}
        />

        {/* Table Card Container */}
        <VerifikasiTable
          users={filteredUsers}
          allCount={allCount}
          menungguCount={menungguCount}
          verifiedCount={verifiedCount}
          currentFilter={filter}
          onFilterChange={handleFilterChange}
          relativeTime={relativeTime}
          loading={loading}
          processingId={processingId}
          onVerify={handleVerify}
          errorMsg={errorMsg}
          currentPage={currentPage}
          pageSize={10}
          onPageChange={setCurrentPage}
        />

        {/* Ketentuan Validasi Akun Mahasiswa */}
        <ValidationNotice />
      </div>
    </main>
  );
}

